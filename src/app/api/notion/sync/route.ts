import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '239b3298c3ce80c2a7aedfb19e757682';

interface NotionPerson {
  id: string;
  name?: string;
  email?: string;
}

interface NotionProperty {
  id: string;
  type: string;
  title?: Array<{ text: { content: string } }>;
  rich_text?: Array<{ text: { content: string } }>;
  number?: number;
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  date?: { start: string };
  checkbox?: boolean;
  url?: string;
  email?: string;
  phone_number?: string;
  relation?: Array<{ id: string }>;
  people?: NotionPerson[];
  files?: Array<{ name: string; external?: { url: string }; file?: { url: string } }>;
  formula?: {
    type: string;
    string?: string;
    number?: number;
    date?: { start: string };
  };
}

function extractPropertyValue(property: NotionProperty | undefined, type: string): any {
  if (!property) return null;

  switch (type) {
    case 'title':
      return property.title?.[0]?.text?.content || null;
    case 'rich_text':
      return property.rich_text?.[0]?.text?.content || null;
    case 'number':
      return property.number ?? null;
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      return property.multi_select?.map(item => item.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox ?? false;
    case 'url':
      return property.url || null;
    case 'email':
      return property.email || null;
    case 'phone_number':
      return property.phone_number || null;
    case 'relation':
      return property.relation?.map(item => item.id) || [];
    case 'people':
      return property.people?.map(person => ({
        id: person.id,
        name: person.name,
        email: person.email,
      })) || [];
    case 'files':
      return property.files?.map(file => ({
        name: file.name,
        url: file.external?.url || file.file?.url,
      })) || [];
    case 'formula':
      if (property.formula?.type === 'string') {
        return property.formula.string;
      } else if (property.formula?.type === 'number') {
        return property.formula.number;
      } else if (property.formula?.type === 'date') {
        return property.formula.date?.start || null;
      }
      return null;
    default:
      return null;
  }
}

async function fetchNotionDatabase() {
  if (!NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN environment variable is not set');
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 100,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function POST() {
  try {
    console.log('🚀 Starting Notion database sync...');
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      throw new Error('Database connection failed');
    }
    
    // Fetch data from Notion
    console.log('🔍 Fetching data from Notion...');
    const notionData = await fetchNotionDatabase();
    console.log(`📊 Fetched ${notionData.results.length} employees from Notion`);
    
    let synced = 0;
    let errors: string[] = [];
    
    // Process each employee in a transaction
    await prisma.$transaction(async (tx) => {
      for (const employee of notionData.results) {
        try {
          const properties = employee.properties;
          
          // Check if employee already exists to preserve salary data
          const existingEmployee = await tx.notionEmployee.findUnique({
            where: { notionId: employee.id },
            select: { baseSalary: true }
          });
          
          const baseData = {
            notionId: employee.id,
            name: extractPropertyValue(properties['Name'], 'title'),
            position: extractPropertyValue(properties['Position'], 'rich_text'),
            email: extractPropertyValue(properties['Email'], 'email'),
            phone: extractPropertyValue(properties['Phone'], 'phone_number'),
            level: extractPropertyValue(properties['Level'], 'number'),
            step: extractPropertyValue(properties['Step'], 'number'),
            team: extractPropertyValue(properties['Team'], 'multi_select'),
            skills: extractPropertyValue(properties['Skills'], 'multi_select'),
            tags: extractPropertyValue(properties['Tags'], 'multi_select'),
            group: extractPropertyValue(properties['Group'], 'multi_select'),
            // Preserve existing salary, don't overwrite from Notion
            // baseSalary: extractPropertyValue(properties['Base Salary'], 'number'), // REMOVED
            billableRate: extractPropertyValue(properties['Billable Rate'], 'number'),
            startDate: extractPropertyValue(properties['Start Date'], 'date') ? new Date(extractPropertyValue(properties['Start Date'], 'date')) : null,
            timezone: extractPropertyValue(properties['Timezone'], 'select'),
            reportsTo: extractPropertyValue(properties['Reports to'], 'relation'),
            manages: extractPropertyValue(properties['Manages'], 'relation'),
            profile: extractPropertyValue(properties['Profile'], 'files'),
            notionAccount: extractPropertyValue(properties['Notion Account'], 'people'),
            tenure: extractPropertyValue(properties['Tenure'], 'formula')?.toString() || null,
            locationFactor: extractPropertyValue(properties['Location Factor'], 'formula')?.toString() || null,
            stepFactor: extractPropertyValue(properties['Step Factor'], 'formula')?.toString() || null,
            levelFactor: extractPropertyValue(properties['Level Factor'], 'formula')?.toString() || null,
            totalSalary: extractPropertyValue(properties['Total Salary'], 'formula')?.toString() || null,
            syncedAt: new Date(),
          };
          
          if (existingEmployee) {
            // For existing employees, preserve baseSalary
            console.log(`Updating employee: ${baseData.name}`);
            await tx.notionEmployee.update({
              where: { notionId: employee.id },
              data: baseData,
            });
          } else {
            // For new employees, set baseSalary to null (will be set manually by super admin)
            console.log(`Creating new employee: ${baseData.name}`);
            await tx.notionEmployee.create({
              data: {
                ...baseData,
                baseSalary: null,
              },
            });
          }
          
          synced++;
          console.log(`✅ Synced ${synced}/${notionData.results.length}: ${baseData.name}`);
        } catch (error) {
          // Failed to sync employee
          errors.push(`Employee ${employee.id}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    });
    
    console.log(`✅ Transaction completed. Synced ${synced} employees.`);
    
    // Verify the sync by counting records
    const dbCount = await prisma.notionEmployee.count();
    console.log(`📊 Database now contains ${dbCount} employees`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${synced} employees from Notion`,
      synced,
      total: notionData.results.length,
      dbEmployeeCount: dbCount,
      errors: errors.length > 0 ? errors : undefined,
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [error instanceof Error ? error.stack : String(error)],
      },
      { status: 500 }
    );
  }
}
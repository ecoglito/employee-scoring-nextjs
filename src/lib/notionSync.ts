import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

interface NotionEmployeeData {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
}

export class NotionSyncService {
  static extractPropertyValue(property: any, type: string): any {
    if (!property) return null;

    switch (type) {
      case 'title':
        return property.title?.[0]?.plain_text || null;
      case 'rich_text':
        return property.rich_text?.[0]?.plain_text || null;
      case 'number':
        return property.number;
      case 'select':
        return property.select?.name || null;
      case 'multi_select':
        return property.multi_select?.map((item: any) => item.name) || [];
      case 'date':
        return property.date?.start ? new Date(property.date.start) : null;
      case 'checkbox':
        return property.checkbox;
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'relation':
        return property.relation?.map((item: any) => item.id) || [];
      case 'people':
        return property.people?.map((person: any) => ({
          id: person.id,
          name: person.name,
          email: person.person?.email,
        })) || [];
      case 'files':
        return property.files?.map((file: any) => ({
          name: file.name,
          url: file.external?.url || file.file?.url,
        })) || [];
      case 'formula':
        // For formula fields, extract the computed value
        if (property.formula?.type === 'string') {
          return property.formula.string;
        } else if (property.formula?.type === 'number') {
          return property.formula.number;
        } else if (property.formula?.type === 'date') {
          return property.formula.date?.start ? new Date(property.formula.date.start) : null;
        }
        return null;
      case 'created_time':
        return property.created_time ? new Date(property.created_time) : null;
      case 'last_edited_time':
        return property.last_edited_time ? new Date(property.last_edited_time) : null;
      default:
        return null;
    }
  }

  static async syncFromNotionData(): Promise<{
    success: boolean;
    synced: number;
    deleted: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let synced = 0;
    let deleted = 0;

    try {
      // Read the notion data file
      const dataPath = path.join(process.cwd(), 'notion-data.json');
      const schemaPath = path.join(process.cwd(), 'notion-schema.json');
      
      if (!fs.existsSync(dataPath) || !fs.existsSync(schemaPath)) {
        throw new Error('Notion data files not found. Run the notion-sync.js script first.');
      }

      const notionData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const notionSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

      const employees = notionData.results as NotionEmployeeData[];
      const properties = notionSchema.properties;

      // Get all current Notion IDs from the fetched data
      const currentNotionIds = new Set(employees.map(emp => emp.id));

      // Find employees in the database that are no longer in Notion
      const existingEmployees = await prisma.notionEmployee.findMany({
        select: { notionId: true, name: true }
      });

      for (const existingEmployee of existingEmployees) {
        if (!currentNotionIds.has(existingEmployee.notionId)) {
          try {
            await prisma.notionEmployee.delete({
              where: { notionId: existingEmployee.notionId }
            });
            deleted++;
            console.log(`🗑️  Deleted: ${existingEmployee.name || existingEmployee.notionId} (no longer in Notion)`);
          } catch (deleteError) {
            const errorMsg = `Failed to delete employee ${existingEmployee.notionId}: ${deleteError}`;
            errors.push(errorMsg);
            console.error(`❌ ${errorMsg}`);
          }
        }
      }

      for (const employee of employees) {
        try {
          // Extract all properties
          const extractedData: any = {
            notionId: employee.id,
          };

          // Process each property based on its type
          Object.entries(properties).forEach(([propName, propConfig]: [string, any]) => {
            const propValue = employee.properties[propName];
            const extractedValue = this.extractPropertyValue(propValue, propConfig.type);
            
            // Map property names to database fields
            switch (propName) {
              case 'Name':
                extractedData.name = extractedValue;
                break;
              case 'Position':
                extractedData.position = extractedValue;
                break;
              case 'Email':
                extractedData.email = extractedValue;
                break;
              case 'Phone':
                extractedData.phone = extractedValue;
                break;
              case 'Level':
                extractedData.level = extractedValue;
                break;
              case 'Step':
                extractedData.step = extractedValue;
                break;
              case 'Team':
                extractedData.team = extractedValue;
                break;
              case 'Skills':
                extractedData.skills = extractedValue;
                break;
              case 'Tags':
                extractedData.tags = extractedValue;
                break;
              case 'Group':
                extractedData.group = extractedValue;
                break;
              case 'Base Salary':
                extractedData.baseSalary = extractedValue;
                break;
              case 'Billable Rate':
                extractedData.billableRate = extractedValue;
                break;
              case 'Start Date':
                extractedData.startDate = extractedValue;
                break;
              case 'Timezone':
                extractedData.timezone = extractedValue;
                break;
              case 'Reports to':
                extractedData.reportsTo = extractedValue;
                break;
              case 'Manages':
                extractedData.manages = extractedValue;
                break;
              case 'Profile':
                extractedData.profile = extractedValue;
                break;
              case 'Notion Account':
                extractedData.notionAccount = extractedValue;
                break;
              case 'Tenure':
                extractedData.tenure = extractedValue;
                break;
              case 'Location Factor':
                extractedData.locationFactor = extractedValue;
                break;
              case 'Step Factor':
                extractedData.stepFactor = extractedValue;
                break;
              case 'Level Factor':
                extractedData.levelFactor = extractedValue;
                break;
              case 'Total Salary':
                extractedData.totalSalary = extractedValue;
                break;
            }
          });

          // Upsert the employee record
          await prisma.notionEmployee.upsert({
            where: { notionId: employee.id },
            update: {
              ...extractedData,
              syncedAt: new Date(),
            },
            create: {
              ...extractedData,
              syncedAt: new Date(),
            },
          });

          synced++;
          console.log(`✅ Synced: ${extractedData.name || employee.id}`);

        } catch (employeeError) {
          const errorMsg = `Failed to sync employee ${employee.id}: ${employeeError}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      return {
        success: errors.length === 0,
        synced,
        deleted,
        errors,
      };

    } catch (error) {
      return {
        success: false,
        synced,
        deleted,
        errors: [`Sync failed: ${error}`],
      };
    }
  }

  static async getAllNotionEmployees() {
    return await prisma.notionEmployee.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getNotionEmployee(notionId: string) {
    return await prisma.notionEmployee.findUnique({
      where: { notionId },
    });
  }

  static async cleanup() {
    await prisma.$disconnect();
  }
}

export default NotionSyncService;
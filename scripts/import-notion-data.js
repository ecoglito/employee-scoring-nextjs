#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the Notion data
const dataPath = path.join(__dirname, '../notion-data.json');
const notionData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('📊 Processing Notion employee data...\n');

function extractPropertyValue(property, type) {
  if (!property) return null;

  switch (type) {
    case 'title':
      return property.title?.[0]?.text?.content || null;
    case 'rich_text':
      return property.rich_text?.[0]?.text?.content || null;
    case 'number':
      return property.number;
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      return property.multi_select?.map(item => item.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox;
    case 'url':
      return property.url;
    case 'email':
      return property.email;
    case 'phone_number':
      return property.phone_number;
    case 'relation':
      return property.relation?.map(item => item.id) || [];
    case 'people':
      return property.people?.map(person => ({
        id: person.id,
        name: person.name,
        email: person.person?.email,
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

// Process each employee
const employees = notionData.results.map((employee, index) => {
  const data = {
    notion_id: employee.id,
    name: extractPropertyValue(employee.properties['Name'], 'title'),
    position: extractPropertyValue(employee.properties['Position'], 'rich_text'),
    email: extractPropertyValue(employee.properties['Email'], 'email'),
    phone: extractPropertyValue(employee.properties['Phone'], 'phone_number'),
    level: extractPropertyValue(employee.properties['Level'], 'number'),
    step: extractPropertyValue(employee.properties['Step'], 'number'),
    team: extractPropertyValue(employee.properties['Team'], 'multi_select'),
    skills: extractPropertyValue(employee.properties['Skills'], 'multi_select'),
    tags: extractPropertyValue(employee.properties['Tags'], 'multi_select'),
    group: extractPropertyValue(employee.properties['Group'], 'multi_select'),
    base_salary: extractPropertyValue(employee.properties['Base Salary'], 'number'),
    billable_rate: extractPropertyValue(employee.properties['Billable Rate'], 'number'),
    start_date: extractPropertyValue(employee.properties['Start Date'], 'date'),
    timezone: extractPropertyValue(employee.properties['Timezone'], 'select'),
    reports_to: extractPropertyValue(employee.properties['Reports to'], 'relation'),
    manages: extractPropertyValue(employee.properties['Manages'], 'relation'),
    profile: extractPropertyValue(employee.properties['Profile'], 'files'),
    notion_account: extractPropertyValue(employee.properties['Notion Account'], 'people'),
    tenure: extractPropertyValue(employee.properties['Tenure'], 'formula'),
    location_factor: extractPropertyValue(employee.properties['Location Factor'], 'formula'),
    step_factor: extractPropertyValue(employee.properties['Step Factor'], 'formula'),
    level_factor: extractPropertyValue(employee.properties['Level Factor'], 'formula'),
    total_salary: extractPropertyValue(employee.properties['Total Salary'], 'formula'),
  };

  console.log(`${index + 1}. ${data.name || 'Unnamed'}`);
  console.log(`   📧 ${data.email || 'No email'}`);
  console.log(`   💼 ${data.position || 'No position'}`);
  console.log(`   👥 Team: ${Array.isArray(data.team) ? data.team.join(', ') : 'None'}`);
  console.log(`   🏷️  Tags: ${Array.isArray(data.tags) ? data.tags.join(', ') : 'None'}`);
  console.log(`   💰 Salary: $${data.base_salary || 'Not set'}`);
  console.log(`   📅 Start: ${data.start_date || 'Not set'}`);
  console.log(`   🌍 Timezone: ${data.timezone || 'Not set'}`);
  console.log('');

  return data;
});

// Generate SQL INSERT statements
console.log('🔄 Generating SQL INSERT statements...\n');

const sqlStatements = employees.map(emp => {
  const values = [
    `'${emp.notion_id}'`,
    emp.name ? `'${emp.name.replace(/'/g, "''")}'` : 'NULL',
    emp.position ? `'${emp.position.replace(/'/g, "''")}'` : 'NULL',
    emp.email ? `'${emp.email}'` : 'NULL',
    emp.phone ? `'${emp.phone}'` : 'NULL',
    emp.level || 'NULL',
    emp.step || 'NULL',
    emp.team ? `'${JSON.stringify(emp.team).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.skills ? `'${JSON.stringify(emp.skills).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.tags ? `'${JSON.stringify(emp.tags).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.group ? `'${JSON.stringify(emp.group).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.base_salary || 'NULL',
    emp.billable_rate || 'NULL',
    emp.start_date ? `'${emp.start_date}'::timestamp` : 'NULL',
    emp.timezone ? `'${emp.timezone}'` : 'NULL',
    emp.reports_to ? `'${JSON.stringify(emp.reports_to).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.manages ? `'${JSON.stringify(emp.manages).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.profile ? `'${JSON.stringify(emp.profile).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.notion_account ? `'${JSON.stringify(emp.notion_account).replace(/'/g, "''")}'::jsonb` : 'NULL',
    emp.tenure ? `'${String(emp.tenure || '').replace(/'/g, "''")}'` : 'NULL',
    emp.location_factor ? `'${String(emp.location_factor || '').replace(/'/g, "''")}'` : 'NULL',
    emp.step_factor ? `'${String(emp.step_factor || '').replace(/'/g, "''")}'` : 'NULL',
    emp.level_factor ? `'${String(emp.level_factor || '').replace(/'/g, "''")}'` : 'NULL',
    emp.total_salary ? `'${String(emp.total_salary || '').replace(/'/g, "''")}'` : 'NULL',
  ];

  return `INSERT INTO notion_employees (
  notion_id, name, position, email, phone, level, step, team, skills, tags, "group", 
  base_salary, billable_rate, start_date, timezone, reports_to, manages, profile, 
  notion_account, tenure, location_factor, step_factor, level_factor, total_salary, 
  synced_at, created_at, updated_at
) VALUES (
  ${values.join(', ')},
  NOW(), NOW(), NOW()
) ON CONFLICT (notion_id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  level = EXCLUDED.level,
  step = EXCLUDED.step,
  team = EXCLUDED.team,
  skills = EXCLUDED.skills,
  tags = EXCLUDED.tags,
  "group" = EXCLUDED."group",
  base_salary = EXCLUDED.base_salary,
  billable_rate = EXCLUDED.billable_rate,
  start_date = EXCLUDED.start_date,
  timezone = EXCLUDED.timezone,
  reports_to = EXCLUDED.reports_to,
  manages = EXCLUDED.manages,
  profile = EXCLUDED.profile,
  notion_account = EXCLUDED.notion_account,
  tenure = EXCLUDED.tenure,
  location_factor = EXCLUDED.location_factor,
  step_factor = EXCLUDED.step_factor,
  level_factor = EXCLUDED.level_factor,
  total_salary = EXCLUDED.total_salary,
  synced_at = NOW(),
  updated_at = NOW();`;
});

// Save SQL to file
const sqlContent = `-- Notion Employee Data Import
-- Generated: ${new Date().toISOString()}
-- Records: ${employees.length}

${sqlStatements.join('\n\n')}`;

const sqlPath = path.join(__dirname, '../notion-import.sql');
fs.writeFileSync(sqlPath, sqlContent);

console.log(`✅ Generated SQL import file: ${sqlPath}`);
console.log(`📊 Found ${employees.length} employees ready to import`);
console.log('\nNext steps:');
console.log('1. Review the generated SQL file');
console.log('2. Run: npx prisma db execute --file notion-import.sql');
console.log('3. Or manually execute the SQL in your database');

// Also create a summary
const summary = {
  total_employees: employees.length,
  employees_with_email: employees.filter(e => e.email).length,
  employees_with_salary: employees.filter(e => e.base_salary).length,
  teams: [...new Set(employees.flatMap(e => e.team || []))],
  timezones: [...new Set(employees.map(e => e.timezone).filter(Boolean))],
  positions: [...new Set(employees.map(e => e.position).filter(Boolean))],
};

console.log('\n📋 Summary:');
console.log(`   Total employees: ${summary.total_employees}`);
console.log(`   With email: ${summary.employees_with_email}`);
console.log(`   With salary: ${summary.employees_with_salary}`);
console.log(`   Teams: ${summary.teams.join(', ')}`);
console.log(`   Timezones: ${summary.timezones.join(', ')}`);
console.log(`   Positions: ${summary.positions.slice(0, 5).join(', ')}${summary.positions.length > 5 ? '...' : ''}`);

const summaryPath = path.join(__dirname, '../notion-summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`\n💾 Summary saved to: ${summaryPath}`);

// Also create a JSON file for the React app to consume
const employeesForReact = employees.map(emp => ({
  id: Math.floor(Math.random() * 1000000), // Generate a random ID
  notionId: emp.notion_id,
  name: emp.name,
  position: emp.position,
  email: emp.email,
  phone: emp.phone,
  level: emp.level,
  step: emp.step,
  team: emp.team || [],
  skills: emp.skills || [],
  tags: emp.tags || [],
  group: emp.group || [],
  baseSalary: emp.base_salary,
  billableRate: emp.billable_rate,
  startDate: emp.start_date,
  timezone: emp.timezone,
  reportsTo: emp.reports_to || [],
  manages: emp.manages || [],
  profile: emp.profile || [],
  notionAccount: emp.notion_account || [],
  tenure: emp.tenure,
  locationFactor: emp.location_factor,
  stepFactor: emp.step_factor,
  levelFactor: emp.level_factor,
  totalSalary: emp.total_salary,
  syncedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const reactDataPath = path.join(__dirname, '../public/notion-employees.json');
fs.writeFileSync(reactDataPath, JSON.stringify(employeesForReact, null, 2));
console.log(`📱 React data saved to: ${reactDataPath}`);
#!/usr/bin/env node

// Simple Node.js script to fetch Notion database without external dependencies
const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '239b3298c3ce80c2a7aedfb19e757682';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      method: options.method || 'GET',
    };

    const req = https.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data}`));
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function getDatabaseSchema() {
  console.log('🔍 Fetching Notion database schema...');
  try {
    const schema = await makeRequest(`https://api.notion.com/v1/databases/${DATABASE_ID}`);
    
    console.log('✅ Database schema fetched successfully!');
    console.log(`📋 Database: ${schema.title?.[0]?.plain_text || 'Untitled'}`);
    console.log(`🏗️  Properties found: ${Object.keys(schema.properties).length}`);
    
    // Log properties
    console.log('\n📝 Properties:');
    Object.entries(schema.properties).forEach(([name, prop]) => {
      console.log(`  • ${name}: ${prop.type}`);
    });
    
    // Save to file
    const outputPath = path.join(__dirname, '../notion-schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    console.log(`\n💾 Schema saved to: ${outputPath}`);
    
    return schema;
  } catch (error) {
    console.error('❌ Failed to fetch schema:', error.message);
    throw error;
  }
}

async function getDatabaseData() {
  console.log('📊 Fetching database records...');
  try {
    const response = await makeRequest(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      body: { page_size: 100 }
    });
    
    console.log(`✅ Found ${response.results.length} records`);
    
    // Save to file
    const outputPath = path.join(__dirname, '../notion-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(response, null, 2));
    console.log(`💾 Data saved to: ${outputPath}`);
    
    return response.results;
  } catch (error) {
    console.error('❌ Failed to fetch data:', error.message);
    throw error;
  }
}

function generatePostgreSQLSchema(schema) {
  console.log('\n🏗️  Generating PostgreSQL schema...');
  
  const properties = Object.entries(schema.properties);
  const sqlFields = properties.map(([propName, propConfig]) => {
    const fieldName = propName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    switch (propConfig.type) {
      case 'title':
      case 'rich_text':
      case 'select':
      case 'url':
      case 'email':
      case 'phone_number':
        return `  ${fieldName} VARCHAR(255)`;
      case 'number':
        return `  ${fieldName} FLOAT`;
      case 'checkbox':
        return `  ${fieldName} BOOLEAN`;
      case 'date':
      case 'created_time':
      case 'last_edited_time':
        return `  ${fieldName} TIMESTAMP`;
      case 'multi_select':
      case 'relation':
      case 'people':
      case 'files':
        return `  ${fieldName} JSONB`;
      default:
        return `  ${fieldName} TEXT`;
    }
  });

  const sqlSchema = `-- Notion Database Schema for PostgreSQL
-- Generated from: ${schema.title?.[0]?.plain_text || 'Untitled'}

CREATE TABLE notion_employees (
  id SERIAL PRIMARY KEY,
  notion_id VARCHAR(255) UNIQUE NOT NULL,
${sqlFields.join(',\n')},
  synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_notion_employees_notion_id ON notion_employees(notion_id);
CREATE INDEX idx_notion_employees_synced_at ON notion_employees(synced_at);`;

  const outputPath = path.join(__dirname, '../notion-schema.sql');
  fs.writeFileSync(outputPath, sqlSchema);
  console.log(`💾 PostgreSQL schema saved to: ${outputPath}`);
  
  console.log('\n📋 Generated SQL Schema:');
  console.log(sqlSchema);
  
  return sqlSchema;
}

async function main() {
  console.log('🚀 Starting Notion database sync...\n');
  
  // Validate environment variables
  if (!NOTION_TOKEN) {
    console.error('❌ Error: NOTION_TOKEN environment variable is required');
    console.log('\n💡 To set it, run:');
    console.log('   export NOTION_TOKEN="your_notion_api_token_here"');
    console.log('\n   Or create a .env file with: NOTION_TOKEN=your_notion_api_token_here');
    process.exit(1);
  }
  
  try {
    // Fetch schema
    const schema = await getDatabaseSchema();
    
    // Generate PostgreSQL schema
    generatePostgreSQLSchema(schema);
    
    // Fetch data
    await getDatabaseData();
    
    console.log('\n✅ Sync completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the generated files: notion-schema.json, notion-data.json, notion-schema.sql');
    console.log('2. Update your PostgreSQL database with the new schema');
    console.log('3. Import the data into your database');
    
  } catch (error) {
    console.error('\n💥 Sync failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
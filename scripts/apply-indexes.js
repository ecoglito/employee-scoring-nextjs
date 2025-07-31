const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Use a local instance for the script
const prisma = new PrismaClient();

async function applyIndexes() {
  console.log('Applying performance indexes...');
  
  try {
    const sqlPath = path.join(__dirname, '..', 'prisma', 'migrations', 'add_performance_indexes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
        await prisma.$executeRawUnsafe(statement);
      }
    }
    
    console.log('✅ All indexes applied successfully!');
    
    // Analyze tables for better query planning
    console.log('\nAnalyzing tables...');
    await prisma.$executeRaw`ANALYZE notion_employees`;
    await prisma.$executeRaw`ANALYZE manager_assignments`;
    await prisma.$executeRaw`ANALYZE user_permissions`;
    await prisma.$executeRaw`ANALYZE employee_scorecards`;
    
    console.log('✅ Table analysis complete!');
    
  } catch (error) {
    console.error('❌ Error applying indexes:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyIndexes();
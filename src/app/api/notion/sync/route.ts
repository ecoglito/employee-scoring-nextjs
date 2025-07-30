import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log('🚀 Starting Notion database sync...');
    
    // Get the project root directory
    const projectRoot = process.cwd();
    
    // Step 1: Run notion-sync.js
    console.log('🔍 Fetching fresh data from Notion...');
    const syncResult = await execAsync('node scripts/notion-sync.js', {
      cwd: projectRoot,
      timeout: 30000 // 30 second timeout
    });
    
    if (syncResult.stderr) {
      console.warn('Sync warnings:', syncResult.stderr);
    }
    
    // Step 2: Run import-notion-data.js
    console.log('📊 Processing and preparing data for import...');
    const importResult = await execAsync('node scripts/import-notion-data.js', {
      cwd: projectRoot,
      timeout: 30000
    });
    
    if (importResult.stderr) {
      console.warn('Import warnings:', importResult.stderr);
    }
    
    // Step 3: Execute the SQL import
    console.log('💾 Importing data to PostgreSQL...');
    const dbResult = await execAsync('npx prisma db execute --file notion-import.sql --schema prisma/schema.prisma', {
      cwd: projectRoot,
      timeout: 30000
    });
    
    if (dbResult.stderr) {
      console.warn('Database warnings:', dbResult.stderr);
    }
    
    console.log('✅ Notion sync completed successfully!');
    
    // Parse the import output to get employee count
    const employeeCountMatch = importResult.stdout.match(/Found (\d+) employees/);
    const employeeCount = employeeCountMatch ? parseInt(employeeCountMatch[1]) : 0;
    
    return NextResponse.json({
      success: true,
      message: 'Notion database synced successfully',
      synced: employeeCount,
      timestamp: new Date().toISOString(),
      details: {
        syncOutput: syncResult.stdout,
        importOutput: importResult.stdout,
        dbOutput: dbResult.stdout
      }
    });
    
  } catch (error: any) {
    console.error('❌ Notion sync failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to sync Notion database',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
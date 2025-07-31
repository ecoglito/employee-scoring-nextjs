import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '239b3298c3ce80c2a7aedfb19e757682';

export async function GET() {
  try {
    const envCheck = {
      hasNotionToken: !!NOTION_TOKEN,
      tokenPrefix: NOTION_TOKEN ? NOTION_TOKEN.substring(0, 10) + '...' : 'NOT SET',
      databaseId: DATABASE_ID,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    };

    if (!NOTION_TOKEN) {
      return NextResponse.json({
        success: false,
        message: 'NOTION_TOKEN environment variable is not set',
        envCheck
      }, { status: 500 });
    }

    // Test Notion API connection
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Notion API',
        status: response.status,
        error,
        envCheck
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Notion connection successful',
      databaseInfo: {
        id: data.id,
        title: data.title?.[0]?.text?.content || 'Untitled',
        created: data.created_time,
        lastEdited: data.last_edited_time
      },
      envCheck
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error testing Notion connection',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
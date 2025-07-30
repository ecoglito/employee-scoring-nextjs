import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, RefreshCw, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { notionService, NotionService } from '@/lib/notion';

interface NotionSyncProps {
  onClose?: () => void;
}

export default function NotionSync({ onClose }: NotionSyncProps) {
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<any>(null);
  // const [pages, setPages] = useState<any[]>([]);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: any;
  } | null>(null);

  const handleExamineSchema = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const databaseSchema = await notionService.getDatabaseSchema();
      setSchema(databaseSchema);
      
      // Log the properties for analysis
      console.log('Notion Database Schema:', databaseSchema);
      
      const properties = Object.entries(databaseSchema.properties).map(([key, prop]: [string, any]) => ({
        name: key,
        type: prop.type,
        id: prop.id,
      }));
      
      setResult({
        type: 'success',
        message: `Found ${properties.length} properties in Notion database`,
        details: {
          title: databaseSchema.title?.[0]?.plain_text || 'Untitled',
          properties,
        },
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Failed to fetch Notion schema',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const allPages = await notionService.getAllPages();
      // setPages(allPages);
      
      // Process and display the data
      const processedData = allPages.map(page => {
        const processed: any = { id: page.id };
        
        if (schema) {
          Object.entries(schema.properties).forEach(([propName, propConfig]: [string, any]) => {
            const propValue = page.properties[propName];
            processed[propName] = NotionService.extractPropertyValue(propValue, propConfig.type);
          });
        }
        
        return processed;
      });
      
      console.log('Processed Notion Data:', processedData);
      
      setResult({
        type: 'success',
        message: `Fetched ${allPages.length} records from Notion`,
        details: {
          count: allPages.length,
          sample: processedData.slice(0, 3),
        },
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Failed to fetch Notion data',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePostgreSQLSchema = () => {
    if (!schema) return null;

    const properties = Object.entries(schema.properties);
    const sqlFields = properties.map(([propName, propConfig]: [string, any]) => {
      const fieldName = propName.toLowerCase().replace(/\s+/g, '_');
      
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

    return `-- Notion Database Schema for PostgreSQL
CREATE TABLE notion_employees (
  id VARCHAR(255) PRIMARY KEY,
  notion_id VARCHAR(255) UNIQUE NOT NULL,
${sqlFields.join(',\n')},
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Notion Database Integration
        </CardTitle>
        <CardDescription>
          Examine and sync your Notion employee database with PostgreSQL
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Schema Examination */}
        <div className="space-y-2">
          <h3 className="font-semibold">1. Examine Database Schema</h3>
          <Button 
            onClick={handleExamineSchema} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {loading ? 'Examining...' : 'Examine Notion Schema'}
          </Button>
        </div>

        {/* Data Fetching */}
        {schema && (
          <div className="space-y-2">
            <h3 className="font-semibold">2. Fetch Employee Data</h3>
            <Button 
              onClick={handleFetchData} 
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {loading ? 'Fetching...' : 'Fetch All Records'}
            </Button>
          </div>
        )}

        {/* PostgreSQL Schema Generation */}
        {schema && (
          <div className="space-y-2">
            <h3 className="font-semibold">3. Generated PostgreSQL Schema</h3>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {generatePostgreSQLSchema()}
              </pre>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <Alert className={result.type === 'error' ? 'border-red-800 bg-red-900/20' : 'border-green-800 bg-green-900/20'}>
            <div className="flex items-start gap-2">
              {result.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
              )}
              <AlertDescription className={result.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                <div className="font-medium">{result.message}</div>
                {result.details && (
                  <div className="mt-2 text-sm">
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {onClose && (
          <div className="pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
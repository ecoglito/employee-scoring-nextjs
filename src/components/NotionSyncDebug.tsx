'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function NotionSyncDebug() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/notion/test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notion Sync Diagnostics</CardTitle>
        <CardDescription>
          Test your Notion API connection and environment setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Test Notion Connection
            </>
          )}
        </Button>

        {result && (
          <Alert className={result.success ? 'border-green-600' : 'border-red-600'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">{result.message}</p>
                
                {result.envCheck && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <p><strong>Environment Check:</strong></p>
                    <ul className="mt-1 space-y-1">
                      <li>Token Set: {result.envCheck.hasNotionToken ? '✅' : '❌'}</li>
                      <li>Token Prefix: {result.envCheck.tokenPrefix}</li>
                      <li>Database ID: {result.envCheck.databaseId}</li>
                      <li>Environment: {result.envCheck.nodeEnv} / {result.envCheck.vercelEnv || 'local'}</li>
                    </ul>
                  </div>
                )}

                {result.databaseInfo && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <p><strong>Database Info:</strong></p>
                    <ul className="mt-1 space-y-1">
                      <li>Title: {result.databaseInfo.title}</li>
                      <li>ID: {result.databaseInfo.id}</li>
                      <li>Last Edited: {new Date(result.databaseInfo.lastEdited).toLocaleString()}</li>
                    </ul>
                  </div>
                )}

                {result.error && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-xs">
                    <p><strong>Error Details:</strong></p>
                    <pre className="mt-1 whitespace-pre-wrap">{
                      typeof result.error === 'string' ? result.error : JSON.stringify(result.error, null, 2)
                    }</pre>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Deployment Checklist:</strong></p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Add NOTION_TOKEN to Vercel environment variables</li>
            <li>Token should start with "secret_" or "ntn_"</li>
            <li>Database ID: 239b3298c3ce80c2a7aedfb19e757682</li>
            <li>Redeploy after adding environment variables</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
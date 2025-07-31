'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AdminPanel from './AdminPanel';
import NotionEmployeeService from '@/lib/notionEmployeeService';
import { usePermissions } from '@/hooks/usePermissions';
import { useEmployees } from '@/hooks/useEmployees';
import { useSession } from 'next-auth/react';
import { SkeletonAdminPage } from '@/components/skeletons/SkeletonAdmin';
import NotionSyncDebug from './NotionSyncDebug';

export default function AdminPage() {
  const { permissions, isExec, loading: permissionsLoading, refreshPermissions } = usePermissions();
  const { data: session } = useSession();
  const { employees, isLoading: loadingEmployees, mutate } = useEmployees();
  const [syncing, setSyncing] = useState(false);

  const loading = permissionsLoading || loadingEmployees;

  const handleUpdate = () => {
    mutate();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await NotionEmployeeService.refreshFromNotion();
      if (result.success) {
        const dbInfo = result.dbEmployeeCount ? ` (DB total: ${result.dbEmployeeCount})` : '';
        alert(`✅ Sync successful! Updated ${result.synced || 0} employees from Notion${dbInfo}.`);
        await mutate();
        await refreshPermissions();
      } else {
        alert(`❌ Sync failed: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Sync failed: Network or server error');
    } finally {
      setSyncing(false);
    }
  };


  // Check permissions
  if (permissionsLoading || loading) {
    return <SkeletonAdminPage />;
  }

  if (!isExec) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only executives can view the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Executive administration and permission management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sync Button */}
          <Button 
            onClick={handleSync} 
            disabled={syncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync from Notion'}
          </Button>
        </div>
      </div>


      {/* Admin Panel */}
      <AdminPanel allEmployees={employees} onUpdate={handleUpdate} />

      {/* Notion Sync Debug - Only show in development or for super admin */}
      {(process.env.NODE_ENV === 'development' || session?.user?.email === 'enzo@liquidlabs.inc') && (
        <div className="mt-6">
          <NotionSyncDebug />
        </div>
      )}
    </div>
  );
}
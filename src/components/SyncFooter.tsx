'use client';

import React from 'react';
import { Clock, Database } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useEmployees } from '@/hooks/useEmployees';

export default function SyncFooter() {
  const { permissions } = usePermissions();
  const { employees } = useEmployees();
  
  // Only show for executives
  if (permissions?.role !== 'exec') {
    return null;
  }
  
  // Find the most recent sync time
  const mostRecentSync = employees.reduce((latest, emp) => {
    const empSync = new Date(emp.syncedAt).getTime();
    return empSync > latest ? empSync : latest;
  }, 0);
  
  if (!mostRecentSync) return null;
  
  const syncDate = new Date(mostRecentSync);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>{employees.length} employees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Last sync: {syncDate.toLocaleDateString()} at {syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="text-xs">
          Executive View
        </div>
      </div>
    </div>
  );
}
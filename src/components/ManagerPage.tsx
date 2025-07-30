'use client';

import React, { useState, useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';
import { useEffectivePermissions } from '@/contexts/ViewModeContext';
import { useSession } from 'next-auth/react';
import NotionEmployeeCard from './NotionEmployeeCard';
import { SkeletonManagerPage } from '@/components/skeletons/SkeletonManager';

export default function ManagerPage() {
  const { permissions, isExec, isManager, loading: permissionsLoading, viewingAs } = useEffectivePermissions();
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<NotionEmployee[]>([]);
  const [managedEmployees, setManagedEmployees] = useState<NotionEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await NotionEmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!permissions || employees.length === 0) return;
    
    // Use the managedEmployeeIds from effective permissions
    // This will work correctly when viewing as another manager
    const managed = employees.filter(emp => 
      permissions.managedEmployeeIds.includes(emp.notionId)
    );
    
    console.log('ManagerPage - Debug:', {
      permissionsEmail: permissions.email,
      managedEmployeeIds: permissions.managedEmployeeIds,
      totalEmployees: employees.length,
      managedCount: managed.length,
      managedNames: managed.map(e => e.name)
    });
    
    setManagedEmployees(managed);
  }, [employees, permissions]);

  // Check permissions
  if (permissionsLoading || loading) {
    return <SkeletonManagerPage />;
  }

  if (!isExec && !isManager) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only managers and executives can view the manager panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Manager Dashboard
        </h1>
        <p className="text-muted-foreground">
          View and manage KPIs for your team members
        </p>
      </div>

      {/* Manager Instructions */}
      <Alert className="border-blue-800">
        <AlertDescription>
          As a manager, you can view employee details and manage KPIs for your assigned team members. Click on any employee card to see their details and KPI information.
        </AlertDescription>
      </Alert>

      {/* Team Members */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managedEmployees.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No team members assigned to you yet.</p>
              <p className="text-sm mt-2">Contact an administrator to get team members assigned.</p>
            </div>
          ) : (
            managedEmployees.map((employee) => (
              <NotionEmployeeCard 
                key={employee.notionId} 
                employee={employee}
                showSalary={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
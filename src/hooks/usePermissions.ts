'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PermissionService, { UserPermissions } from '@/lib/permissionService';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';

export function usePermissions() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePermissions = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Get user's Notion employee data to determine role
        const allEmployees = await NotionEmployeeService.getAllEmployees();
        const notionEmployee = allEmployees.find(emp => emp.email === session.user.email);
        
        // Initialize or get existing permissions
        let userPermissions = PermissionService.initializeUser(session.user.email, notionEmployee);
        
        // Load manager assignments from API to ensure we have the latest data
        try {
          const response = await fetch('/api/manager-assignments');
          if (response.ok) {
            const assignments = await response.json();
            
            // Clear existing assignments
            PermissionService.clearAssignments();
            
            // First, clear all managed employee IDs
            for (const emp of allEmployees) {
              const empPermissions = PermissionService.getUserPermissions(emp.email);
              if (empPermissions) {
                empPermissions.managedEmployeeIds = [];
              }
            }
            
            // Then rebuild from API assignments
            assignments.forEach((assignment: any) => {
              // Find manager by their Notion ID
              const manager = allEmployees.find(emp => emp.notionId === assignment.managerId);
              if (manager) {
                PermissionService.assignEmployeeToManager(
                  manager.email,
                  assignment.employeeId,
                  assignment.assignedBy
                );
              }
            });
            
            // Save the rebuilt permissions
            PermissionService.savePermissions();
            
            // Get updated permissions after applying assignments
            userPermissions = PermissionService.getUserPermissions(session.user.email);
          }
        } catch (error) {
          console.error('Failed to load manager assignments:', error);
        }
        
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Failed to initialize permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePermissions();
  }, [session]);

  const refreshPermissions = async () => {
    if (!session?.user?.email) return;
    
    try {
      // Get all employees first
      const allEmployees = await NotionEmployeeService.getAllEmployees();
      
      // Re-load assignments from API
      const response = await fetch('/api/manager-assignments');
      if (response.ok) {
        const assignments = await response.json();
        
        // Clear existing assignments
        PermissionService.clearAssignments();
        
        // First, clear all managed employee IDs
        for (const emp of allEmployees) {
          const empPermissions = PermissionService.getUserPermissions(emp.email);
          if (empPermissions) {
            empPermissions.managedEmployeeIds = [];
          }
        }
        
        // Then rebuild from API assignments
        assignments.forEach((assignment: any) => {
          // Find manager by their Notion ID
          const manager = allEmployees.find(emp => emp.notionId === assignment.managerId);
          if (manager) {
            PermissionService.assignEmployeeToManager(
              manager.email,
              assignment.employeeId,
              assignment.assignedBy
            );
          }
        });
      }
    } catch (error) {
      console.error('Failed to refresh manager assignments:', error);
    }
    
    const userPermissions = PermissionService.getUserPermissions(session.user.email);
    setPermissions(userPermissions);
  };

  return {
    permissions,
    loading,
    refreshPermissions,
    isExec: permissions?.role === 'exec',
    isManager: permissions?.role === 'manager',
    canViewAll: permissions?.canViewAll || false,
    canManageAll: permissions?.canManageAll || false,
    canAssignManagers: permissions?.canAssignManagers || false,
    managedEmployeeIds: permissions?.managedEmployeeIds || []
  };
}
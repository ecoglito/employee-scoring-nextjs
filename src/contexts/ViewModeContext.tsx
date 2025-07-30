'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import PermissionService from '@/lib/permissionService';

interface ViewModeContextType {
  viewingAsEmployee: NotionEmployee | null;
  setViewingAsEmployee: (employee: NotionEmployee | null) => void;
  isViewingAs: boolean;
  canChangeViewMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const { isExec } = usePermissions();
  const [viewingAsEmployee, setViewingAsEmployee] = useState<NotionEmployee | null>(null);

  // Only executives can change view mode
  const canChangeViewMode = isExec;
  const isViewingAs = viewingAsEmployee !== null && canChangeViewMode;

  // Reset view if user loses exec permissions
  useEffect(() => {
    if (!isExec && viewingAsEmployee !== null) {
      setViewingAsEmployee(null);
    }
  }, [isExec, viewingAsEmployee]);

  return (
    <ViewModeContext.Provider 
      value={{
        viewingAsEmployee,
        setViewingAsEmployee: canChangeViewMode ? setViewingAsEmployee : () => {},
        isViewingAs,
        canChangeViewMode
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

// Hook to get effective permissions based on who we're viewing as
export function useEffectivePermissions() {
  const actualPermissions = usePermissions();
  const { viewingAsEmployee, isViewingAs } = useViewMode();

  return useMemo(() => {
    if (!isViewingAs || !viewingAsEmployee) {
      // Return actual permissions when not viewing as someone else
      return {
        permissions: actualPermissions.permissions,
        isExec: actualPermissions.isExec,
        isManager: actualPermissions.isManager,
        loading: actualPermissions.loading,
        refreshPermissions: actualPermissions.refreshPermissions,
        canViewAll: actualPermissions.permissions?.canViewAll || false,
        canManageAll: actualPermissions.permissions?.canManageAll || false,
        canAssignManagers: actualPermissions.permissions?.canAssignManagers || false,
        managedEmployeeIds: actualPermissions.permissions?.managedEmployeeIds || [],
        viewingAs: null
      };
    }

    // Get the permissions for the employee we're viewing as
    let viewedPermissions = PermissionService.getUserPermissions(viewingAsEmployee.email);
    
    // If no permissions found, initialize them for this employee
    if (!viewedPermissions) {
      viewedPermissions = PermissionService.initializeUser(viewingAsEmployee.email, viewingAsEmployee);
    }
    
    if (!viewedPermissions) {
      // Fallback: If still no permissions, simulate basic employee permissions
      return {
        permissions: {
          userId: viewingAsEmployee.notionId,
          email: viewingAsEmployee.email,
          name: viewingAsEmployee.name,
          role: 'employee' as const,
          canViewAll: false,
          canManageAll: false,
          managedEmployeeIds: [],
          canAssignManagers: false
        },
        isExec: false,
        isManager: false,
        loading: false,
        refreshPermissions: actualPermissions.refreshPermissions,
        viewingAs: viewingAsEmployee.name
      };
    }

    return {
      permissions: viewedPermissions,
      isExec: viewedPermissions.role === 'exec',
      isManager: viewedPermissions.role === 'manager',
      loading: false,
      refreshPermissions: actualPermissions.refreshPermissions,
      canViewAll: viewedPermissions.canViewAll,
      canManageAll: viewedPermissions.canManageAll,
      canAssignManagers: viewedPermissions.canAssignManagers,
      managedEmployeeIds: viewedPermissions.managedEmployeeIds,
      viewingAs: viewingAsEmployee.name
    };
  }, [actualPermissions, viewingAsEmployee, isViewingAs]);
}
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Shield, 
  UserPlus, 
  UserMinus, 
  Crown,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import PermissionService from '@/lib/permissionService';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SkeletonAdminPanel } from '@/components/skeletons/SkeletonAdmin';

interface AdminPanelProps {
  allEmployees: NotionEmployee[];
  onUpdate: () => void;
}

export default function AdminPanel({ allEmployees, onUpdate }: AdminPanelProps) {
  const { data: session } = useSession();
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [managerHierarchy, setManagerHierarchy] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(true);

  // Get potential managers (those with manager tag or role)
  const potentialManagers = allEmployees.filter(emp => {
    // Check for manager-related tags
    const managerTags = ['manager', 'lead', 'head', 'director', 'vp'];
    const hasManagerTag = emp.tags?.some(tag => 
      managerTags.some(mTag => tag.toLowerCase().includes(mTag))
    );
    
    // Check for Exec team
    const isExecTeam = emp.team?.includes('Exec');
    
    // Check for exec tag
    const hasExecTag = emp.tags?.some(tag => 
      tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive'
    );
    
    return hasManagerTag || isExecTeam || hasExecTag;
  });

  // Get employees who can be assigned (exclude execs)
  const assignableEmployees = allEmployees.filter(emp => {
    const isExecTeam = emp.team?.includes('Exec');
    const hasExecTag = emp.tags?.some(tag => 
      tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive'
    );
    return !isExecTeam && !hasExecTag;
  });

  useEffect(() => {
    loadManagerHierarchy();
  }, [allEmployees]);

  const loadManagerHierarchy = async () => {
    try {
      setLoadingHierarchy(true);
      const response = await fetch('/api/manager-assignments');
      if (response.ok) {
        const assignments = await response.json();
        
        // Group assignments by manager
        const managerMap = new Map<string, any[]>();
        
        assignments.forEach((assignment: any) => {
          if (!managerMap.has(assignment.managerId)) {
            managerMap.set(assignment.managerId, []);
          }
          managerMap.get(assignment.managerId)?.push(assignment);
        });
        
        // Build hierarchy
        const hierarchy: any[] = [];
        managerMap.forEach((assignments, managerId) => {
          const manager = allEmployees.find(emp => emp.notionId === managerId);
          if (manager) {
            const managedEmployeeIds = assignments.map(a => a.employeeId);
            const managedEmployees = allEmployees.filter(emp => 
              managedEmployeeIds.includes(emp.notionId)
            );
            hierarchy.push({ manager, managedEmployees });
          }
        });
        
        setManagerHierarchy(hierarchy);
      }
    } catch (error) {
      console.error('Failed to load manager hierarchy:', error);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedManager || !selectedEmployee || !session?.user?.email) return;

    const managerEmployee = allEmployees.find(emp => emp.notionId === selectedManager);
    if (!managerEmployee?.email) {
      setMessage({ type: 'error', text: 'Manager email not found. Make sure the manager has an email in Notion.' });
      return;
    }

    try {
      // Create assignment in database
      const response = await fetch('/api/manager-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          managerId: selectedManager,
          employeeId: selectedEmployee
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Also update local permissions for immediate UI update
        PermissionService.initializeUser(managerEmployee.email, managerEmployee);
        PermissionService.promoteToManager(managerEmployee.email);
        PermissionService.assignEmployeeToManager(
          managerEmployee.email,
          selectedEmployee,
          session.user.email
        );

        setMessage({ type: 'success', text: 'Employee assigned successfully' });
        setSelectedEmployee('');
        loadManagerHierarchy();
        onUpdate();
      } else {
        console.error('Assignment failed:', result);
        const errorDetails = result.details ? ` (${result.details})` : '';
        setMessage({ type: 'error', text: (result.error || 'Failed to assign employee') + errorDetails });
      }
    } catch (error) {
      console.error('Assignment error:', error);
      setMessage({ type: 'error', text: 'Network error: Could not connect to the server.' });
    }
  };

  const handleRemoveEmployee = async (managerId: string, employeeId: string) => {
    try {
      const response = await fetch(`/api/manager-assignments?managerId=${managerId}&employeeId=${employeeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Also update local permissions
        const manager = allEmployees.find(emp => emp.notionId === managerId);
        if (manager?.email) {
          PermissionService.removeEmployeeFromManager(manager.email, employeeId);
        }

        setMessage({ type: 'success', text: 'Employee removed successfully' });
        loadManagerHierarchy();
        onUpdate();
      } else {
        setMessage({ type: 'error', text: 'Failed to remove employee' });
      }
    } catch (error) {
      console.error('Failed to remove employee:', error);
      setMessage({ type: 'error', text: 'An error occurred while removing the employee' });
    }
  };

  const handlePromoteToManager = (email: string) => {
    const success = PermissionService.promoteToManager(email);
    if (success) {
      setMessage({ type: 'success', text: 'User promoted to manager' });
      loadManagerHierarchy();
      onUpdate();
    }
  };

  const handleDemoteManager = (email: string) => {
    const success = PermissionService.demoteToEmployee(email);
    if (success) {
      setMessage({ type: 'success', text: 'Manager demoted to employee' });
      loadManagerHierarchy();
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Admin Panel - Manager Assignments</CardTitle>
          </div>
          <Badge variant="secondary">Executive Access</Badge>
        </div>
        <CardDescription>
          Assign employees to managers and control access permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert className={message.type === 'success' ? 'border-green-800' : 'border-red-800'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}


        {/* Assign Employee to Manager */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Assign Employee to Manager</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Manager</Label>
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a manager" />
                </SelectTrigger>
                <SelectContent>
                  {potentialManagers.map((manager) => (
                    <SelectItem key={manager.notionId} value={manager.notionId}>
                      <div className="flex items-center gap-2">
                        <span>{manager.name}</span>
                        {manager.team?.includes('Exec') && (
                          <Badge variant="secondary" className="text-xs">Exec</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {assignableEmployees.map((employee) => (
                    <SelectItem key={employee.notionId} value={employee.notionId}>
                      <div className="flex items-center gap-2">
                        <span>{employee.name}</span>
                        <span className="text-xs text-muted-foreground">{employee.position}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAssignEmployee}
                disabled={!selectedManager || !selectedEmployee}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </div>
          </div>
        </div>

        {/* Current Manager Hierarchy */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Manager Assignments</h3>
          {loadingHierarchy ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1">
                        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-24 rounded bg-muted animate-pulse mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2].map((j) => (
                        <div key={j} className="p-2 bg-muted rounded animate-pulse h-16" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : managerHierarchy.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No manager assignments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managerHierarchy.map(({ manager, managedEmployees }) => (
                <Card key={manager.notionId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-semibold">{manager.name}</h4>
                        <Badge variant="outline">{managedEmployees.length} reports</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDemoteManager(manager.email)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {managedEmployees.map((employee) => (
                        <div key={employee.notionId} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveEmployee(manager.notionId, employee.notionId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
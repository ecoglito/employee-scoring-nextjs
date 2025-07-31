'use client';

import React, { useState, useEffect } from 'react';
import { User, Users, Mail, Clock, DollarSign } from 'lucide-react';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffectivePermissions } from '@/contexts/ViewModeContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useSession } from 'next-auth/react';
import NotionEmployeeService from '@/lib/notionEmployeeService';
import EmployeeScorecard from './EmployeeScorecard';

interface NotionEmployeeDetailProps {
  employee: NotionEmployee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const teamColors: Record<string, string> = {
  'Exec': 'bg-purple-900/20 text-purple-400 border-purple-800',
  'Frontend': 'bg-blue-900/20 text-blue-400 border-blue-800',
  'Backend': 'bg-green-900/20 text-green-400 border-green-800',
  'Smart Contract': 'bg-blue-900/20 text-blue-400 border-blue-800',
  'Product': 'bg-pink-900/20 text-pink-400 border-pink-800',
  'Growth': 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
  'Science': 'bg-indigo-900/20 text-indigo-400 border-indigo-800',
  'Infrastructure & DevOps': 'bg-gray-900/20 text-gray-400 border-gray-800',
};

export default function NotionEmployeeDetail({ employee, open, onOpenChange }: NotionEmployeeDetailProps) {
  const { permissions: effectivePermissions, isExec: effectiveIsExec, isManager: effectiveIsManager, viewingAs } = useEffectivePermissions();
  const { permissions: actualPermissions, isExec: actualIsExec, isManager: actualIsManager } = usePermissions();
  const { data: session } = useSession();
  const [allEmployees, setAllEmployees] = useState<NotionEmployee[]>([]);
  const [managerInfo, setManagerInfo] = useState<NotionEmployee | null>(null);
  const [canEditScorecard, setCanEditScorecard] = useState(false);
  const [canViewSensitiveInfo, setCanViewSensitiveInfo] = useState(false);
  
  useEffect(() => {
    // Check if user can edit this employee's scorecard based on ACTUAL permissions
    if (!actualPermissions?.email) {
      setCanEditScorecard(false);
      return;
    }
    
    // Executives can edit all scorecards
    if (actualIsExec) {
      setCanEditScorecard(true);
      return;
    }
    
    // Managers can edit scorecards of their managed employees
    if (actualIsManager && actualPermissions.managedEmployeeIds.includes(employee.notionId)) {
      setCanEditScorecard(true);
      return;
    }
    
    setCanEditScorecard(false);
  }, [actualPermissions, actualIsExec, actualIsManager, employee]);

  useEffect(() => {
    // Check who can view sensitive info (salary, KPIs, etc.)
    // When in "view as" mode, use effective permissions to determine what the simulated user can see
    if (!effectivePermissions?.email) {
      setCanViewSensitiveInfo(false);
      return;
    }
    
    // The person viewing their own info can see it
    if (effectivePermissions.email === employee.email) {
      setCanViewSensitiveInfo(true);
      return;
    }
    
    // Executives can see all info
    if (effectiveIsExec) {
      setCanViewSensitiveInfo(true);
      return;
    }
    
    // Managers can see info of their managed employees
    if (effectiveIsManager && effectivePermissions.managedEmployeeIds.includes(employee.notionId)) {
      setCanViewSensitiveInfo(true);
      return;
    }
    
    setCanViewSensitiveInfo(false);
  }, [effectivePermissions, effectiveIsExec, effectiveIsManager, employee]);

  // Load all employees and find manager info - do this for ALL employees
  useEffect(() => {
    const loadManagerInfo = async () => {
      try {
        const employees = await NotionEmployeeService.getAllEmployees();
        setAllEmployees(employees);
        
        // Try to find manager - check multiple possible data sources
        let manager = null;
        let managerSearchData = null;

        // Check if reportsTo data exists (array format)
        if (employee.reportsTo && employee.reportsTo.length > 0) {
          managerSearchData = employee.reportsTo;
        }
        // Check if there's a managerId field (from the console logs we can see this exists)
        else if (employee.managerId) {
          managerSearchData = [employee.managerId];
        }

        if (managerSearchData && managerSearchData.length > 0) {
          manager = employees.find(emp => {
            // Try matching by notion ID first (most reliable)
            if (managerSearchData.includes(emp.notionId)) {
              return true;
            }
            // Try matching by name (case insensitive)
            if (emp.name && managerSearchData.some((managerId: string) => 
              managerId.toLowerCase() === emp.name?.toLowerCase()
            )) {
              return true;
            }
            // Try matching by email
            if (emp.email && managerSearchData.includes(emp.email)) {
              return true;
            }
            return false;
          });
        }
          
        setManagerInfo(manager || null);
      } catch (error) {
        // Failed to load manager info
      }
    };

    if (open) {
      loadManagerInfo();
    }
  }, [employee, open]);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarGradient = (employee: NotionEmployee) => {
    const primaryTeam = employee.team?.[0];
    const isExec = employee.team?.includes('Exec') || 
      employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    
    if (isExec) {
      return 'bg-gradient-to-br from-purple-500 to-indigo-600';
    }
    
    switch (primaryTeam) {
      case 'Backend':
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'Frontend':
        return 'bg-gradient-to-br from-blue-500 to-sky-600';
      case 'Smart Contract':
        return 'bg-gradient-to-br from-blue-600 to-indigo-700';
      case 'Product':
        return 'bg-gradient-to-br from-pink-500 to-rose-600';
      case 'Growth':
        return 'bg-gradient-to-br from-yellow-500 to-orange-600';
      case 'Science':
        return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      case 'Infrastructure & DevOps':
        return 'bg-gradient-to-br from-gray-500 to-slate-600';
      default:
        return 'bg-gradient-to-br from-slate-500 to-gray-600';
    }
  };

  const getTeamColor = (team: string) => {
    return teamColors[team] || 'bg-gray-900/20 text-gray-400 border-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`${getAvatarGradient(employee)} text-white font-semibold`}>
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="flex items-center gap-2">
                {employee.name || 'Unknown Employee'}
              </DialogTitle>
              <DialogDescription>
                {employee.position || 'No position set'} • {employee.team?.join(', ') || 'No team'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-6">
            {/* Employee Information */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-medium">{employee.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p className="font-medium">{employee.position || 'No position set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{employee.email || 'No email'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                    <p className="font-medium">{employee.timezone || 'Not specified'}</p>
                  </div>
                  {employee.startDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                      <p className="font-medium">{new Date(employee.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {employee.baseSalary && canViewSensitiveInfo && !viewingAs && actualPermissions?.email === 'enzo@liquidlabs.inc' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Base Salary</label>
                      <p className="font-medium">${employee.baseSalary.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {/* Manager Info - Always show to managers and executives */}
                  {canViewSensitiveInfo && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reports To</label>
                      {managerInfo ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`${getAvatarGradient(managerInfo)} text-white text-xs font-semibold`}>
                              {getInitials(managerInfo.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{managerInfo.name}</p>
                            <p className="text-xs text-muted-foreground">{managerInfo.position}</p>
                          </div>
                        </div>
                      ) : employee.reportsTo && employee.reportsTo.length > 0 ? (
                        <p className="font-medium text-sm text-muted-foreground mt-1">Manager not found in system</p>
                      ) : (
                        <p className="font-medium text-sm text-muted-foreground mt-1">No manager assigned</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Teams */}
                {employee.team && employee.team.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teams</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {employee.team.map((team) => (
                        <Badge 
                          key={team} 
                          variant="outline" 
                          className={`${getTeamColor(team)}`}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills/Tags */}
                {employee.tags && employee.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skills</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {employee.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs bg-slate-900/20 text-slate-400 border-slate-800"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scorecard Section - Only show to those who can view sensitive info */}
            {canViewSensitiveInfo && (
              <EmployeeScorecard 
                employee={employee} 
                canEdit={canEditScorecard}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
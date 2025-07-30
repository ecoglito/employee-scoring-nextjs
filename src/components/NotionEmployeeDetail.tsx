'use client';

import React, { useState, useEffect } from 'react';
import { User, Target, Star, Calendar, Users, Mail, Clock, DollarSign, Plus, TrendingUp, Shield } from 'lucide-react';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import { useEffectivePermissions } from '@/contexts/ViewModeContext';
import { useSession } from 'next-auth/react';
import NotionEmployeeService from '@/lib/notionEmployeeService';
import EmployeeScorecard from './EmployeeScorecard';

interface NotionEmployeeDetailProps {
  employee: NotionEmployee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock KPI data structure - in real app this would come from database
interface KPI {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  type: 'quantity' | 'percentage' | 'boolean';
  status: 'on-track' | 'at-risk' | 'exceeded';
  lastUpdated: string;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'progress' | 'scorecard'>('overview');
  const { permissions: effectivePermissions, isExec: effectiveIsExec, isManager: effectiveIsManager, viewingAs } = useEffectivePermissions();
  const { data: session } = useSession();
  const [canViewKPIs, setCanViewKPIs] = useState(false);
  const [allEmployees, setAllEmployees] = useState<NotionEmployee[]>([]);
  const [managerInfo, setManagerInfo] = useState<NotionEmployee | null>(null);
  const [canViewScorecard, setCanViewScorecard] = useState(false);
  
  useEffect(() => {
    // Check if user can view this employee's KPIs based on EFFECTIVE permissions
    // This ensures view-as mode properly simulates what the viewed user would see
    if (!effectivePermissions?.email) {
      setCanViewKPIs(false);
      setCanViewScorecard(false);
      return;
    }
    
    // Use effective permissions to determine KPI visibility
    // Executives can view all KPIs
    if (effectiveIsExec) {
      setCanViewKPIs(true);
      setCanViewScorecard(true);
      return;
    }
    
    // Managers can view KPIs of their managed employees
    if (effectiveIsManager && effectivePermissions.managedEmployeeIds.includes(employee.notionId)) {
      setCanViewKPIs(true);
      setCanViewScorecard(true);
      return;
    }
    
    // Users can view their own KPIs
    if (employee.email === effectivePermissions.email) {
      setCanViewKPIs(true);
      setCanViewScorecard(true);
      return;
    }
    
    setCanViewKPIs(false);
    setCanViewScorecard(false);
  }, [effectivePermissions, effectiveIsExec, effectiveIsManager, employee]);

  // Load all employees and find manager info
  useEffect(() => {
    const loadManagerInfo = async () => {
      if (employee.reportsTo && employee.reportsTo.length > 0) {
        try {
          const employees = await NotionEmployeeService.getAllEmployees();
          setAllEmployees(employees);
          
          // Find manager by matching notion ID
          const manager = employees.find(emp => 
            employee.reportsTo?.includes(emp.notionId) || 
            employee.reportsTo?.includes(emp.name || '')
          );
          
          setManagerInfo(manager || null);
        } catch (error) {
          console.error('Failed to load manager info:', error);
        }
      }
    };

    if (open) {
      loadManagerInfo();
    }
  }, [employee, open]);
  
  // Mock KPI data - replace with actual data from your system
  const mockKPIs: KPI[] = [
    {
      id: '1',
      title: 'Ship 1 update per week',
      description: 'Deploy meaningful product updates weekly',
      target: 4,
      current: 3,
      frequency: 'monthly',
      type: 'quantity',
      status: 'at-risk',
      lastUpdated: '2025-01-29'
    },
    {
      id: '2', 
      title: 'Code review completion rate',
      description: 'Complete code reviews within 24 hours',
      target: 95,
      current: 88,
      frequency: 'monthly',
      type: 'percentage',
      status: 'at-risk',
      lastUpdated: '2025-01-28'
    },
    {
      id: '3',
      title: 'Team meeting attendance',
      description: 'Attend all scheduled team meetings',
      target: 100,
      current: 100,
      frequency: 'monthly',
      type: 'percentage',
      status: 'exceeded',
      lastUpdated: '2025-01-29'
    }
  ];

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarGradient = (employee: NotionEmployee) => {
    // Get the primary team/role for gradient theming
    const primaryTeam = employee.team?.[0];
    const isExec = employee.team?.includes('Exec') || 
      employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    
    if (isExec) {
      return 'bg-gradient-to-br from-purple-500 to-indigo-600'; // Executive purple
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
        return 'bg-gradient-to-br from-slate-500 to-gray-600'; // Default neutral
    }
  };

  const getTeamColor = (team: string) => {
    return teamColors[team] || 'bg-gray-900/20 text-gray-400 border-gray-800';
  };

  const getKPIProgress = (kpi: KPI) => {
    return kpi.type === 'percentage' ? kpi.current : (kpi.current / kpi.target) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'on-track': return 'text-blue-400 bg-blue-900/20 border-blue-800';
      case 'at-risk': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    ...(canViewKPIs ? [
      { id: 'kpis', label: 'KPIs', icon: Target, count: mockKPIs.length },
      { id: 'progress', label: 'Progress', icon: TrendingUp },
    ] : []),
    ...(canViewScorecard ? [
      { id: 'scorecard', label: 'Scorecard', icon: Shield },
    ] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Tabs */}
        <div className="shrink-0 border-b">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-background text-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-1">
          {activeTab === 'overview' && (
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
                    {employee.baseSalary && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Base Salary</label>
                        <p className="font-medium">${employee.baseSalary.toLocaleString()}</p>
                      </div>
                    )}
                    
                    {/* Manager Info - Only show to executives and managers */}
                    {(effectiveIsExec || effectiveIsManager) && managerInfo && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reports To</label>
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
                      </div>
                    )}
                    
                    {/* No Manager Info - Only show to executives and managers */}
                    {(effectiveIsExec || effectiveIsManager) && employee.reportsTo && employee.reportsTo.length > 0 && !managerInfo && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reports To</label>
                        <p className="font-medium text-sm text-muted-foreground">Manager not found in system</p>
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

              {/* KPI Summary - Only show if user has permission */}
              {canViewKPIs && (
                <Card>
                  <CardHeader>
                    <CardTitle>KPI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {mockKPIs.filter(k => k.status === 'exceeded').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Exceeded</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {mockKPIs.filter(k => k.status === 'on-track').length}
                        </div>
                        <div className="text-sm text-muted-foreground">On Track</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {mockKPIs.filter(k => k.status === 'at-risk').length}
                        </div>
                        <div className="text-sm text-muted-foreground">At Risk</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {mockKPIs.slice(0, 3).map((kpi) => (
                        <div key={kpi.id} className="flex items-center justify-between p-3 bg-muted rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{kpi.title}</div>
                            <div className="text-xs text-muted-foreground">{kpi.description}</div>
                          </div>
                          <div className="text-right ml-4">
                            <Badge className={`text-xs ${getStatusColor(kpi.status)}`}>
                              {kpi.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          )}

          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add KPI
                </Button>
              </div>

              <div className="space-y-4">
                {mockKPIs.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{kpi.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{kpi.description}</p>
                        </div>
                        <Badge className={`${getStatusColor(kpi.status)}`}>
                          {kpi.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {kpi.type === 'percentage' 
                              ? `${kpi.current}%` 
                              : `${kpi.current} / ${kpi.target}`
                            }
                          </span>
                        </div>
                        <Progress value={getKPIProgress(kpi)} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Frequency: {kpi.frequency}</span>
                          <span>Last updated: {new Date(kpi.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Performance tracking charts would appear here</p>
                    <p className="text-sm">Connect to your performance tracking system to see trends</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Team meeting attendance KPI updated</div>
                        <div className="text-xs text-muted-foreground">January 29, 2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Code review completion rate needs attention</div>
                        <div className="text-xs text-muted-foreground">January 28, 2025</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Weekly update KPI in progress</div>
                        <div className="text-xs text-muted-foreground">January 27, 2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'scorecard' && (
            <div className="p-1">
              <EmployeeScorecard 
                employee={employee} 
                canEdit={effectiveIsManager || effectiveIsExec}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Crown, 
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useManagerAssignments } from '@/hooks/useManagerAssignments';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';
import { Skeleton } from '@/components/ui/skeleton';

interface EmployeeNode {
  employee: NotionEmployee;
  directReports: EmployeeNode[];
  isExpanded: boolean;
}

export default function OrganizationChart() {
  const { assignments, isLoading: loadingAssignments } = useManagerAssignments();
  const [employees, setEmployees] = useState<NotionEmployee[]>([]);
  const [orgTree, setOrgTree] = useState<EmployeeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<NotionEmployee | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await NotionEmployeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!loading && !loadingAssignments && employees.length > 0) {
      buildOrgTree();
    }
  }, [employees, assignments, loading, loadingAssignments]);

  const buildOrgTree = () => {
    // Create a map of employee ID to their direct reports
    const managerToReports = new Map<string, string[]>();
    
    assignments.forEach((assignment: any) => {
      if (!managerToReports.has(assignment.managerId)) {
        managerToReports.set(assignment.managerId, []);
      }
      managerToReports.get(assignment.managerId)?.push(assignment.employeeId);
    });

    // Find all employees who are not managed by anyone (top level)
    const managedEmployeeIds = new Set(assignments.map((a: any) => a.employeeId));
    
    // Get executives (they should be at the top)
    const executives = employees.filter(emp => 
      emp.team?.includes('Exec') || 
      emp.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive')
    );

    // Build tree recursively
    const buildNode = (employee: NotionEmployee): EmployeeNode => {
      const reportIds = managerToReports.get(employee.notionId) || [];
      const directReports = reportIds
        .map(id => employees.find(emp => emp.notionId === id))
        .filter(Boolean)
        .map(emp => buildNode(emp!))
        .sort((a, b) => {
          // Sort by role importance, then by name
          const aIsManager = isManager(a.employee);
          const bIsManager = isManager(b.employee);
          if (aIsManager && !bIsManager) return -1;
          if (!aIsManager && bIsManager) return 1;
          return (a.employee.name || '').localeCompare(b.employee.name || '');
        });

      return {
        employee,
        directReports,
        isExpanded: expandedNodes.has(employee.notionId)
      };
    };

    // Build the tree starting from executives
    const tree = executives
      .map(exec => buildNode(exec))
      .sort((a, b) => (a.employee.name || '').localeCompare(b.employee.name || ''));

    // Add any managers who aren't under executives but have reports
    const topLevelManagers = employees.filter(emp => {
      const hasReports = managerToReports.has(emp.notionId);
      const isNotManaged = !managedEmployeeIds.has(emp.notionId);
      const isNotExec = !executives.some(exec => exec.notionId === emp.notionId);
      return hasReports && isNotManaged && isNotExec;
    });

    topLevelManagers.forEach(manager => {
      tree.push(buildNode(manager));
    });

    setOrgTree(tree);
  };

  const isManager = (employee: NotionEmployee) => {
    const managerTags = ['manager', 'lead', 'head', 'director', 'vp'];
    return employee.tags?.some(tag => 
      managerTags.some(mTag => tag.toLowerCase().includes(mTag))
    );
  };

  const toggleExpand = (employeeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedNodes(newExpanded);
  };

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

  const EmployeeNodeComponent = ({ node, level = 0 }: { node: EmployeeNode; level?: number }) => {
    const { employee, directReports } = node;
    const isExpanded = expandedNodes.has(employee.notionId);
    const hasReports = directReports.length > 0;
    const isExec = employee.team?.includes('Exec') || 
      employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    const isManagerRole = isManager(employee);

    return (
      <div className={`${level > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
        <div className="flex items-start gap-2">
          {hasReports && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(employee.notionId)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasReports && <div className="w-6" />}
          
          <Card 
            className={`flex-1 cursor-pointer transition-all hover:shadow-md ${
              selectedEmployee?.notionId === employee.notionId ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedEmployee(employee)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${getAvatarGradient(employee)} text-white font-semibold`}>
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{employee.name}</h3>
                    {isExec && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    {isManagerRole && !isExec && (
                      <UserCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {employee.team?.map((team: string) => (
                      <Badge key={team} variant="secondary" className="text-xs">
                        {team}
                      </Badge>
                    ))}
                    {hasReports && (
                      <Badge variant="outline" className="text-xs">
                        {directReports.length} direct reports
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isExpanded && hasReports && (
          <div className="border-l-2 border-muted ml-3">
            {directReports.map((reportNode) => (
              <EmployeeNodeComponent 
                key={reportNode.employee.notionId} 
                node={reportNode} 
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading || loadingAssignments) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Organization Chart</CardTitle>
            </div>
            <CardDescription>
              Company hierarchy and reporting structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orgTree.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No organization structure defined yet</p>
                <p className="text-sm">Start by assigning employees to managers in the Admin panel</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orgTree.map((node) => (
                  <EmployeeNodeComponent key={node.employee.notionId} node={node} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employee Details Panel */}
      <div className="lg:col-span-1">
        {selectedEmployee ? (
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={`${getAvatarGradient(selectedEmployee)} text-white font-semibold text-xl`}>
                    {getInitials(selectedEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedEmployee.name}</h3>
                  <p className="text-muted-foreground">{selectedEmployee.position}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedEmployee.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedEmployee.email}`} className="hover:underline">
                      {selectedEmployee.email}
                    </a>
                  </div>
                )}

                {selectedEmployee.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                )}

                {selectedEmployee.timezone && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployee.timezone}</span>
                  </div>
                )}

                {selectedEmployee.startDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started {new Date(selectedEmployee.startDate).toLocaleDateString()}</span>
                  </div>
                )}

                {selectedEmployee.baseSalary && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${selectedEmployee.baseSalary.toLocaleString()}/year</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Teams</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedEmployee.team?.map((team: string) => (
                    <Badge key={team} variant="secondary">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedEmployee.tags && selectedEmployee.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedEmployee.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Skills</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedEmployee.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Click on an employee to view their details
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
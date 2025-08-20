'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Network,
  Layers,
  Crown,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useManagerAssignments } from '@/hooks/useManagerAssignments';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';
import { Skeleton } from '@/components/ui/skeleton';

interface OrgNode {
  employee: NotionEmployee;
  children: OrgNode[];
  x?: number;
  y?: number;
  width?: number;
}

interface VisualOrgChartProps {
  employees: NotionEmployee[];
}

export default function VisualOrgChart({ employees }: VisualOrgChartProps) {
  const { assignments, isLoading: loadingAssignments } = useManagerAssignments();
  const [viewMode, setViewMode] = useState<'tree' | 'venn'>('tree');
  const [orgTree, setOrgTree] = useState<OrgNode[]>([]);
  const [expandedLevels, setExpandedLevels] = useState(3); // Show 3 levels by default to see HDF and Majin
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingAssignments && employees.length > 0) {
      buildOrgTree();
    }
  }, [employees, assignments, loadingAssignments]);

  const buildOrgTree = () => {
    const managerToReports = new Map<string, string[]>();
    
    // Debug logging
    console.log('Building org tree with assignments:', assignments);
    console.log('Total employees:', employees.length);
    
    assignments.forEach((assignment: any) => {
      if (!managerToReports.has(assignment.managerId)) {
        managerToReports.set(assignment.managerId, []);
      }
      managerToReports.get(assignment.managerId)?.push(assignment.employeeId);
    });

    // Log all manager relationships
    console.log('Manager to Reports Map:');
    managerToReports.forEach((reports, managerId) => {
      const manager = employees.find(e => e.notionId === managerId);
      const reportNames = reports.map(id => {
        const emp = employees.find(e => e.notionId === id);
        return emp?.name || id;
      });
      console.log(`${manager?.name || managerId} manages:`, reportNames);
    });
    
    // Check specifically for HDF and Majin
    const hdf = employees.find(e => e.name?.includes('HDF') || e.email === 'hdf@liquidlabs.inc');
    const majin = employees.find(e => e.name === 'Majin' || e.email === 'majin@liquidlabs.inc');
    console.log('HDF found:', hdf);
    console.log('Majin found:', majin);

    const managedEmployeeIds = new Set(assignments.map((a: any) => a.employeeId));
    
    const executives = employees.filter(emp => 
      emp.team?.includes('Exec') || 
      emp.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive')
    );

    const buildNode = (employee: NotionEmployee): OrgNode => {
      const reportIds = managerToReports.get(employee.notionId) || [];
      const children = reportIds
        .map(id => employees.find(emp => emp.notionId === id))
        .filter(Boolean)
        .map(emp => buildNode(emp!))
        .sort((a, b) => {
          const aIsManager = isManager(a.employee);
          const bIsManager = isManager(b.employee);
          if (aIsManager && !bIsManager) return -1;
          if (!aIsManager && bIsManager) return 1;
          return (a.employee.name || '').localeCompare(b.employee.name || '');
        });

      return { employee, children };
    };

    const tree = executives
      .map(exec => buildNode(exec))
      .sort((a, b) => (a.employee.name || '').localeCompare(b.employee.name || ''));

    const topLevelManagers = employees.filter(emp => {
      const hasReports = managerToReports.has(emp.notionId);
      const isNotManaged = !managedEmployeeIds.has(emp.notionId);
      const isNotExec = !executives.some(exec => exec.notionId === emp.notionId);
      return hasReports && isNotManaged && isNotExec;
    });

    topLevelManagers.forEach(manager => {
      tree.push(buildNode(manager));
    });

    // Calculate positions for tree layout
    const nodeWidth = 200;
    const nodeHeight = 80;
    const horizontalSpacing = 40;
    const verticalSpacing = 120;

    const calculatePositions = (node: OrgNode, x: number, y: number, level: number): number => {
      node.x = x;
      node.y = y;
      node.width = nodeWidth;

      if (node.children.length === 0 || level >= expandedLevels) {
        return nodeWidth;
      }

      let totalWidth = 0;
      let currentX = x;

      node.children.forEach((child, index) => {
        if (index > 0) currentX += horizontalSpacing;
        const childWidth = calculatePositions(child, currentX, y + verticalSpacing, level + 1);
        currentX += childWidth;
        totalWidth += childWidth + (index > 0 ? horizontalSpacing : 0);
      });

      // Center parent over children
      node.x = x + (totalWidth - nodeWidth) / 2;
      return totalWidth;
    };

    let currentX = 0;
    tree.forEach((root, index) => {
      if (index > 0) currentX += 100;
      const treeWidth = calculatePositions(root, currentX, 50, 0);
      currentX += treeWidth;
    });

    setOrgTree(tree);
  };

  const isManager = (employee: NotionEmployee) => {
    const managerTags = ['manager', 'lead', 'head', 'director', 'vp'];
    return employee.tags?.some(tag => 
      managerTags.some(mTag => tag.toLowerCase().includes(mTag))
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (employee: NotionEmployee) => {
    const isExec = employee.team?.includes('Exec') || 
      employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    
    if (isExec) return '#8b5cf6'; // Purple for execs
    if (isManager(employee)) return '#3b82f6'; // Blue for managers
    
    const team = employee.team?.[0];
    switch (team) {
      case 'Backend': return '#10b981';
      case 'Frontend': return '#06b6d4';
      case 'Smart Contract': return '#6366f1';
      case 'Product': return '#ec4899';
      case 'Growth': return '#f59e0b';
      case 'Science': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const renderTreeNode = (node: OrgNode, level: number = 0) => {
    if (!node.x || !node.y) return null;
    
    const isExec = node.employee.team?.includes('Exec') || 
      node.employee.tags?.some(tag => tag.toLowerCase() === 'exec' || tag.toLowerCase() === 'executive');
    const isManagerRole = isManager(node.employee);
    const showChildren = level < expandedLevels && node.children.length > 0;

    return (
      <g key={node.employee.notionId}>
        {/* Draw lines to children */}
        {showChildren && node.children.map(child => {
          if (!child.x || !child.y) return null;
          const startX = node.x! + (node.width! / 2);
          const startY = node.y! + 80;
          const endX = child.x! + (child.width! / 2);
          const endY = child.y!;
          const midY = startY + (endY - startY) / 2;

          return (
            <path
              key={`${node.employee.notionId}-${child.employee.notionId}`}
              d={`M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
          );
        })}

        {/* Employee card */}
        <foreignObject
          x={node.x}
          y={node.y}
          width={node.width}
          height="80"
          className="overflow-visible"
        >
          <div className="h-full">
            <Card className="h-full border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback 
                      className="text-white font-semibold text-sm"
                      style={{ backgroundColor: getAvatarColor(node.employee) }}
                    >
                      {getInitials(node.employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-sm truncate">{node.employee.name}</h4>
                      {isExec && <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                      {isManagerRole && !isExec && <UserCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{node.employee.position}</p>
                    {node.children.length > 0 && level >= expandedLevels - 1 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {node.children.length} report{node.children.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </foreignObject>

        {/* Render children */}
        {showChildren && node.children.map(child => renderTreeNode(child, level + 1))}
      </g>
    );
  };

  const renderVennDiagram = () => {
    // Group employees by team
    const teamGroups = new Map<string, NotionEmployee[]>();
    
    employees.forEach(emp => {
      if (emp.team) {
        emp.team.forEach(team => {
          if (!teamGroups.has(team)) {
            teamGroups.set(team, []);
          }
          teamGroups.get(team)!.push(emp);
        });
      }
    });

    // Convert to array and sort by size
    const teams = Array.from(teamGroups.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6); // Show top 6 teams

    const centerX = 400;
    const centerY = 300;
    const baseRadius = 120;

    return (
      <svg width="800" height="600" viewBox="0 0 800 600" className="mx-auto">
        {teams.map((team, index) => {
          const angle = (index / teams.length) * 2 * Math.PI;
          const x = centerX + Math.cos(angle) * 150;
          const y = centerY + Math.sin(angle) * 150;
          const radius = baseRadius * (0.7 + (team[1].length / 20));
          
          return (
            <g key={team[0]}>
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={getTeamColor(team[0])}
                fillOpacity="0.3"
                stroke={getTeamColor(team[0])}
                strokeWidth="2"
                className="transition-all hover:fill-opacity-50"
              />
              <text
                x={x}
                y={y - radius - 10}
                textAnchor="middle"
                className="text-sm font-semibold fill-foreground"
              >
                {team[0]}
              </text>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                className="text-xl font-bold fill-foreground"
              >
                {team[1].length}
              </text>
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                members
              </text>
            </g>
          );
        })}
        
        {/* Show overlapping members */}
        {employees.filter(emp => emp.team && emp.team.length > 1).map((emp, index) => {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * 50 + 30;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          return (
            <circle
              key={emp.notionId}
              cx={x}
              cy={y}
              r="3"
              fill="#6366f1"
              className="opacity-60"
              title={emp.name}
            />
          );
        }).slice(0, 20)}
      </svg>
    );
  };

  const getTeamColor = (team: string) => {
    const colors: Record<string, string> = {
      'Exec': '#8b5cf6',
      'Frontend': '#3b82f6',
      'Backend': '#10b981',
      'Smart Contract': '#6366f1',
      'Product': '#ec4899',
      'Growth': '#f59e0b',
      'Science': '#8b5cf6',
      'Infrastructure & DevOps': '#6b7280',
    };
    return colors[team] || '#6b7280';
  };

  // Mouse event handlers for pan and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode === 'tree') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewMode === 'tree') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode === 'tree') {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prevZoom => Math.max(0.1, Math.min(3, prevZoom * delta)));
    }
  };

  if (loadingAssignments) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Organization Visualization
            </CardTitle>
            <CardDescription>
              Interactive view of company structure and teams
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tree')}
              >
                <Network className="h-4 w-4 mr-1" />
                Org Chart
              </Button>
              <Button
                variant={viewMode === 'venn' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('venn')}
              >
                <Layers className="h-4 w-4 mr-1" />
                Team View
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="overflow-auto" style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '600px' }}>
          {viewMode === 'tree' ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Show levels:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <Button
                      key={level}
                      variant={expandedLevels === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setExpandedLevels(level);
                        buildOrgTree();
                      }}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              
              {orgTree.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No organization structure defined yet</p>
                  <p className="text-sm">Start by assigning employees to managers in the Admin panel</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setZoom(zoom * 1.2)}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setZoom(zoom * 0.8)}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  <svg 
                    ref={svgRef}
                    width="100%" 
                    height="600"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  >
                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {orgTree.map(node => renderTreeNode(node))}
                    </g>
                  </svg>
                </div>
              )}
            </>
          ) : (
            renderVennDiagram()
          )}
        </div>
        
        {viewMode === 'tree' && (
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>Executive</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <span>Manager</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400" />
              <span>Employee</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
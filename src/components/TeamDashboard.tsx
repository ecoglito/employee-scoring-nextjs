import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Tag, Clock, Grid, Table } from 'lucide-react';
import NotionEmployeeCard from '@/components/NotionEmployeeCard';
import EmployeeTableView from '@/components/EmployeeTableView';
import DetailedTeamWorldMap from '@/components/DetailedTeamWorldMap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NotionEmployeeService, { NotionEmployee } from '@/lib/notionEmployeeService';
import PermissionService from '@/lib/permissionService';
import { useEffectivePermissions } from '@/contexts/ViewModeContext';
import { useSession } from 'next-auth/react';
import { SkeletonStats, SkeletonFilters, SkeletonEmployeeGrid, SkeletonMap, SkeletonTeamBreakdown } from '@/components/skeletons/SkeletonStats';

const teamColors: Record<string, string> = {
  'Exec': 'bg-purple-500',
  'Frontend': 'bg-blue-500',
  'Backend': 'bg-green-500',
  'Smart Contract': 'bg-blue-600',
  'Product': 'bg-pink-500',
  'Growth': 'bg-yellow-500',
  'Science': 'bg-indigo-500',
  'Infrastructure & DevOps': 'bg-gray-500',
  'Full Stack': 'bg-cyan-500',
};

export default function TeamDashboard() {
  const { data: session } = useSession();
  const { permissions, isExec, viewingAs } = useEffectivePermissions();
  const [allEmployees, setAllEmployees] = useState<NotionEmployee[]>([]);
  const [viewableEmployees, setViewableEmployees] = useState<NotionEmployee[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, statsData] = await Promise.all([
        NotionEmployeeService.getAllEmployees(),
        NotionEmployeeService.getTeamStats()
      ]);
      setAllEmployees(employeesData);
      setStats(statsData);
      
      // Initial filtering based on session (will be updated by the effect when permissions change)
      if (session?.user?.email) {
        const filtered = PermissionService.getViewableEmployees(session.user.email, employeesData);
        setViewableEmployees(filtered);
      } else {
        setViewableEmployees([]);
      }
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []); // Only load on mount
  
  // Separate effect for permission changes
  useEffect(() => {
    if (allEmployees.length > 0 && permissions && permissions.email) {
      const filtered = PermissionService.getViewableEmployees(permissions.email, allEmployees);
      setViewableEmployees(filtered);
    }
  }, [permissions, allEmployees, viewingAs]); // Update viewable employees when permissions change

  const filteredEmployees = viewableEmployees.filter(emp => {
    const teamMatch = selectedTeam === 'all' || emp.team?.includes(selectedTeam);
    const tagMatch = selectedTag === 'all' || emp.tags?.includes(selectedTag);
    return teamMatch && tagMatch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Team Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time team information synced from Notion
          </p>
        </div>

        {/* Stats Cards Skeleton */}
        <SkeletonStats />

        {/* Filters Skeleton */}
        <SkeletonFilters />

        {/* Map Skeleton */}
        <SkeletonMap />

        {/* Employee Grid Skeleton */}
        <SkeletonEmployeeGrid />

        {/* Team Breakdown Skeleton */}
        <SkeletonTeamBreakdown />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team Dashboard</h1>
        <p className="text-muted-foreground">
          {isExec ? 'Executive view - All employees' : 
           permissions?.role === 'manager' ? 'Manager view - Your team' : 
           'Real-time team information synced from Notion'}
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teams.length}</div>
              <p className="text-xs text-muted-foreground">Active teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tags.length}</div>
              <p className="text-xs text-muted-foreground">Unique skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timezones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timezones.length}</div>
              <p className="text-xs text-muted-foreground">Global presence</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and View Toggle */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Team:</span>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  value="all"
                  className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                >
                  All Teams
                </SelectItem>
                {stats?.teams.map((team: any) => (
                  <SelectItem 
                    key={team.name} 
                    value={team.name}
                    className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${teamColors[team.name] || 'bg-gray-400'}`}
                      />
                      <span>{team.name} ({team.count})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Skill:</span>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  value="all"
                  className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                >
                  All Skills
                </SelectItem>  
                {stats?.tags.slice(0, 15).map((tag: any) => (
                  <SelectItem 
                    key={tag.name} 
                    value={tag.name}
                    className="focus:bg-muted focus:text-foreground hover:bg-muted hover:text-foreground"
                  >
                    {tag.name} ({tag.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedTeam !== 'all' || selectedTag !== 'all') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedTeam('all');
                setSelectedTag('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-muted text-foreground shadow-md hover:bg-muted hover:text-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-muted text-foreground shadow-md hover:bg-muted hover:text-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Table className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Employee Display - Cards or Table */}
      {viewMode === 'cards' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <NotionEmployeeCard 
                key={employee.notionId} 
                employee={employee}
                showSalary={false} // Keep KPIs/salary private as requested
              />
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching the current filters.
            </div>
          )}
        </>
      ) : (
        <EmployeeTableView 
          employees={filteredEmployees} 
          showSalary={false} // Keep KPIs/salary private as requested
        />
      )}

      {/* Global Team Map */}
      <DetailedTeamWorldMap employees={viewableEmployees} />

      {/* Team Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Team Breakdown</CardTitle>
            <CardDescription>Distribution across teams and skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Teams</h4>
                <div className="space-y-2">
                  {stats.teams.map((team: any) => (
                    <div key={team.name} className="flex items-center justify-between">
                      <span className="text-sm">{team.name}</span>
                      <Badge variant="secondary">{team.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Top Skills</h4>
                <div className="space-y-2">
                  {stats.tags.slice(0, 10).map((tag: any) => (
                    <div key={tag.name} className="flex items-center justify-between">
                      <span className="text-sm">{tag.name}</span>
                      <Badge variant="secondary">{tag.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
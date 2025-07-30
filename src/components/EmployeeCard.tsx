import React, { useState } from 'react';
import { MoreHorizontal, Edit, Archive, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Employee } from '@/types';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditEmployeeDialog from './EditEmployeeDialog';
import EmployeeDetail from './EmployeeDetail';

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { archiveEmployee, deleteEmployee, allEmployees } = useEmployees();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Calculate current score and trend
  const latestScore = employee.scores.length > 0 
    ? employee.scores[employee.scores.length - 1] 
    : null;
  
  const previousScore = employee.scores.length > 1 
    ? employee.scores[employee.scores.length - 2] 
    : null;

  const getTrend = () => {
    if (!latestScore || !previousScore) return 'stable';
    if (latestScore.overall > previousScore.overall) return 'up';
    if (latestScore.overall < previousScore.overall) return 'down';
    return 'stable';
  };

  const trend = getTrend();
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';

  // Find manager name
  const manager = employee.managerId 
    ? allEmployees.find(emp => emp.id === employee.managerId)
    : null;

  const handleArchive = () => {
    if (window.confirm(`Are you sure you want to archive ${employee.name}? This will hide them from the active employee list but preserve their data.`)) {
      archiveEmployee(employee.id);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${employee.name}? This action cannot be undone and will remove all their data including scores and KPIs.`)) {
      deleteEmployee(employee.id);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDetailDialog(true)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{employee.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
              {manager && (
                <p className="text-xs text-muted-foreground">
                  Reports to: {manager.name}
                </p>
              )}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowEditDialog(true); }}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchive(); }}>
                    <Archive className="h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {latestScore ? latestScore.overall : 'N/A'}
              </span>
              {latestScore && (
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              )}
            </div>
          </div>

          {/* KPI Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">KPIs</span>
            <span className="text-sm font-medium">{employee.kpis.length}</span>
          </div>

          {/* Department */}
          {employee.department && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium">{employee.department}</span>
            </div>
          )}

          {/* Last Scored */}
          {latestScore && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Scored</span>
              <span className="text-sm font-medium">
                {new Date(latestScore.date).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Responsibility Preview */}
          {employee.responsibility && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {employee.responsibility}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditEmployeeDialog
        employee={employee}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Detail Dialog */}
      <EmployeeDetail
        employee={employee}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />
    </>
  );
}
'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { NotionEmployee } from '@/lib/notionEmployeeService';
import { Users, Mail, Calendar, DollarSign, Clock } from 'lucide-react';
import NotionEmployeeDetail from './NotionEmployeeDetail';

interface EmployeeTableViewProps {
  employees: NotionEmployee[];
  showSalary?: boolean;
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

const timezoneEmojis: Record<string, string> = {
  'EST': '🇺🇸',
  'PST': '🇺🇸', 
  'MST': '🇺🇸',
  'CEST': '🇪🇺',
  'GMT': '🇬🇧',
  'JST': '🇯🇵',
  'IST': '🇮🇳',
  'AEST': '🇦🇺',
};

export default function EmployeeTableView({ employees, showSalary = false }: EmployeeTableViewProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<NotionEmployee | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTeamColor = (team: string) => {
    return teamColors[team] || 'bg-gray-900/20 text-gray-400 border-gray-800';
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

  const handleRowClick = (employee: NotionEmployee) => {
    setSelectedEmployee(employee);
    setShowDetailDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members - Table View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Start Date</TableHead>
                  {showSalary && <TableHead>Salary</TableHead>}
                  <TableHead>Skills</TableHead>
                  <TableHead className="w-[120px]">Last Synced</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow 
                    key={employee.notionId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(employee)}
                  >
                    {/* Employee Name & Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${getAvatarGradient(employee)} text-white font-semibold text-xs`}>
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">ID: {employee.notionId.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Position */}
                    <TableCell>
                      <div className="font-medium text-sm">
                        {employee.position || 'No position set'}
                      </div>
                    </TableCell>

                    {/* Teams */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.team?.slice(0, 2).map((team) => (
                          <Badge 
                            key={team} 
                            variant="outline" 
                            className={`text-xs ${getTeamColor(team)}`}
                          >
                            {team}
                          </Badge>
                        ))}
                        {employee.team && employee.team.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{employee.team.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {employee.timezone && (
                          <>
                            <span className="text-sm">
                              {timezoneEmojis[employee.timezone] || '🌍'}
                            </span>
                            <span className="text-sm font-medium">
                              {employee.timezone}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      {employee.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                            {employee.email}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Start Date */}
                    <TableCell>
                      {employee.startDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(employee.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Salary */}
                    {showSalary && (
                      <TableCell>
                        {employee.baseSalary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              ${employee.baseSalary.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    )}

                    {/* Skills */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.tags?.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {employee.tags && employee.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{employee.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Last Synced */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(employee.syncedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {employees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedEmployee && (
        <NotionEmployeeDetail
          employee={selectedEmployee}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </>
  );
}
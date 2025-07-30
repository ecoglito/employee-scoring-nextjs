import React, { useState } from 'react';
import { Crown, FileBarChart, Download, Upload } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TeamOverviewChart from './TeamOverviewChart';
import { exportData, importData, saveData } from '@/lib/storage';
import { generateSampleData } from '@/lib/sampleData';

export default function ManagerDashboard() {
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  
  let employees, allEmployees, refreshData;
  
  try {
    const context = useEmployees();
    employees = context.employees;
    allEmployees = context.allEmployees;
    refreshData = context.refreshData;
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Database Mode Active</h3>
            <p className="text-muted-foreground mb-4">
              The Manager Dashboard works with Local Storage mode. Switch to "Team" tab to see your Notion team data, 
              or toggle Database mode OFF to use the employee scoring system.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Team tab:</strong> Your real team from Notion
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Manager Dashboard:</strong> Performance analytics (Local Storage mode)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all managers (employees who have direct reports)
  const managers = allEmployees.filter(emp => 
    !emp.archived && allEmployees.some(other => other.managerId === emp.id && !other.archived)
  );

  // Get selected manager and their team
  const selectedManager = selectedManagerId 
    ? allEmployees.find(emp => emp.id === selectedManagerId)
    : managers[0]; // Default to first manager

  const teamMembers = selectedManager
    ? allEmployees.filter(emp => emp.managerId === selectedManager.id && !emp.archived)
    : [];

  // Calculate dashboard stats
  const dashboardStats = {
    totalEmployees: employees.length,
    totalManagers: managers.length,
    employeesWithScores: employees.filter(emp => emp.scores.length > 0).length,
    employeesWithKPIs: employees.filter(emp => emp.kpis.length > 0).length,
    averageScore: employees.length > 0 
      ? employees.reduce((sum, emp) => {
          const latestScore = emp.scores.length > 0 ? emp.scores[emp.scores.length - 1].overall : 0;
          return sum + latestScore;
        }, 0) / employees.length
      : 0,
  };

  const handleExport = () => {
    try {
      exportData();
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importData(file)
      .then(() => {
        refreshData();
        alert('Data imported successfully!');
      })
      .catch((error) => {
        alert(`Failed to import data: ${error.message}`);
      });

    // Reset the input
    event.target.value = '';
  };

  const handleLoadSampleData = () => {
    if (employees.length > 0) {
      if (!window.confirm('This will replace all existing data with sample data. Are you sure?')) {
        return;
      }
    }

    try {
      const sampleData = generateSampleData();
      saveData(sampleData);
      refreshData();
      alert('Sample data loaded successfully!');
    } catch (error) {
      alert('Failed to load sample data. Please try again.');
    }
  };

  if (managers.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLoadSampleData} variant="outline" size="sm">
              Load Sample Data
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Crown className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No managers found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add employees and set up manager relationships to see team performance data.
            </p>
            <Button onClick={handleLoadSampleData} variant="outline">
              Load Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Import Data
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalManagers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Have Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.employeesWithScores}</div>
            <div className="text-xs text-muted-foreground">
              {((dashboardStats.employeesWithScores / dashboardStats.totalEmployees) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Have KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.employeesWithKPIs}</div>
            <div className="text-xs text-muted-foreground">
              {((dashboardStats.employeesWithKPIs / dashboardStats.totalEmployees) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.averageScore > 0 ? dashboardStats.averageScore.toFixed(1) : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">Company-wide</div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Selection */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          <span className="font-medium">Team Analysis:</span>
        </div>
        <Select 
          value={selectedManager?.id || ''} 
          onValueChange={setSelectedManagerId}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a manager" />
          </SelectTrigger>
          <SelectContent>
            {managers.map((manager) => {
              const teamSize = allEmployees.filter(emp => emp.managerId === manager.id && !emp.archived).length;
              return (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name} - {manager.role} ({teamSize} reports)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Team Overview */}
      {selectedManager && (
        <TeamOverviewChart 
          teamMembers={teamMembers}
          manager={selectedManager}
        />
      )}

      {/* Manager Performance */}
      {selectedManager && selectedManager.scores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Manager Performance: {selectedManager.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {selectedManager.scores.length > 0 
                    ? selectedManager.scores[selectedManager.scores.length - 1].overall 
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Latest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {selectedManager.scores.length > 0 
                    ? (selectedManager.scores.reduce((sum, score) => sum + score.overall, 0) / selectedManager.scores.length).toFixed(1)
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Team Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{selectedManager.kpis.length}</div>
                <div className="text-sm text-muted-foreground">KPIs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Managers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Managers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managers.map((manager) => {
              const directReports = allEmployees.filter(emp => emp.managerId === manager.id && !emp.archived);
              const latestScore = manager.scores.length > 0 ? manager.scores[manager.scores.length - 1] : null;
              const teamAverageScore = directReports.length > 0
                ? directReports.reduce((sum, emp) => {
                    const empLatestScore = emp.scores.length > 0 ? emp.scores[emp.scores.length - 1].overall : 0;
                    return sum + empLatestScore;
                  }, 0) / directReports.length
                : 0;

              return (
                <div key={manager.id} className="flex items-center justify-between py-3 px-4 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{manager.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {manager.role} • {directReports.length} direct reports
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{latestScore ? latestScore.overall : 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">Manager Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        {teamAverageScore > 0 ? teamAverageScore.toFixed(1) : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">Team Average</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{manager.kpis.length}</div>
                      <div className="text-xs text-muted-foreground">KPIs</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
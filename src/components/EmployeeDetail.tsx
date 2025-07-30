import React, { useState } from 'react';
import { Star, Target, User, Calendar } from 'lucide-react';
import { Employee } from '@/types';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import KPIManager from './KPIManager';
import ScoreInput from './ScoreInput';
import ScoreHistory from './ScoreHistory';
import ScoreTrendsChart from './ScoreTrendsChart';

interface EmployeeDetailProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmployeeDetail({ employee, open, onOpenChange }: EmployeeDetailProps) {
  const { allEmployees } = useEmployees();
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'scores' | 'history'>('overview');
  const [showScoreInput, setShowScoreInput] = useState(false);

  // Find manager and direct reports
  const manager = employee.managerId 
    ? allEmployees.find(emp => emp.id === employee.managerId)
    : null;
  
  const directReports = allEmployees.filter(emp => emp.managerId === employee.id && !emp.archived);

  // Calculate stats
  const latestScore = employee.scores.length > 0 
    ? employee.scores[employee.scores.length - 1] 
    : null;
  
  const averageScore = employee.scores.length > 0
    ? employee.scores.reduce((sum, score) => sum + score.overall, 0) / employee.scores.length
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'kpis', label: 'KPIs', icon: Target, count: employee.kpis.length },
    { id: 'scores', label: 'Add Score', icon: Star },
    { id: 'history', label: 'History', icon: Calendar, count: employee.scores.length },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {employee.name}
            </DialogTitle>
            <DialogDescription>
              {employee.role} • {employee.department || 'No department'}
            </DialogDescription>
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
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-primary-foreground text-primary' 
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
                {/* Employee Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="font-medium">{employee.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <p className="font-medium">{employee.role}</p>
                      </div>
                      {employee.department && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                          <p className="font-medium">{employee.department}</p>
                        </div>
                      )}
                      {manager && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Manager</label>
                          <p className="font-medium">{manager.name}</p>
                        </div>
                      )}
                    </div>
                    
                    {employee.responsibility && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Primary Responsibility</label>
                        <p className="mt-1">{employee.responsibility}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {latestScore ? latestScore.overall : 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">Latest Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {averageScore > 0 ? averageScore.toFixed(1) : 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{employee.kpis.length}</div>
                        <div className="text-sm text-muted-foreground">KPIs Defined</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Trends Chart */}
                {employee.scores.length > 0 && (
                  <ScoreTrendsChart employee={employee} height={250} />
                )}

                {/* Direct Reports */}
                {directReports.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Direct Reports ({directReports.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {directReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between py-2 px-3 bg-muted rounded">
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.role}</div>
                            </div>
                            <div className="text-sm">
                              {report.scores.length > 0 
                                ? `Last score: ${report.scores[report.scores.length - 1].overall}/10`
                                : 'No scores'
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => setActiveTab('kpis')} variant="outline">
                    <Target className="h-4 w-4" />
                    Manage KPIs
                  </Button>
                  <Button onClick={() => setShowScoreInput(true)}>
                    <Star className="h-4 w-4" />
                    Add Score
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'kpis' && (
              <KPIManager employee={employee} />
            )}

            {activeTab === 'scores' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to add a score?</h3>
                  <p className="text-muted-foreground mb-4">
                    Record {employee.name}'s performance for this period.
                  </p>
                  <Button onClick={() => setShowScoreInput(true)} size="lg">
                    <Star className="h-4 w-4" />
                    Add New Score
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Chart with KPIs */}
                {employee.scores.length > 0 && (
                  <ScoreTrendsChart employee={employee} showKPIs={true} height={400} />
                )}
                
                {/* Score History */}
                <ScoreHistory employee={employee} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Score Input Dialog */}
      <ScoreInput
        employee={employee}
        open={showScoreInput}
        onOpenChange={setShowScoreInput}
      />
    </>
  );
}
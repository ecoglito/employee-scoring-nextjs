import React, { useState } from 'react';
import { Calendar, Trash2, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Employee, Score } from '@/types';
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
import { format } from 'date-fns';

interface ScoreHistoryProps {
  employee: Employee;
}

export default function ScoreHistory({ employee }: ScoreHistoryProps) {
  const { updateEmployee } = useEmployees();
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter scores based on selected period
  const getFilteredScores = () => {
    let filtered = [...employee.scores];
    
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filterPeriod) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(score => new Date(score.date) >= cutoffDate);
    }
    
    // Sort scores
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };

  const handleDeleteScore = (scoreId: string) => {
    if (window.confirm('Are you sure you want to delete this score? This action cannot be undone.')) {
      const updatedEmployee: Employee = {
        ...employee,
        scores: employee.scores.filter(score => score.id !== scoreId),
        updatedAt: new Date().toISOString(),
      };
      
      updateEmployee(updatedEmployee);
    }
  };

  const getScoreTrend = (currentScore: Score, previousScore?: Score) => {
    if (!previousScore) return 'stable';
    if (currentScore.overall > previousScore.overall) return 'up';
    if (currentScore.overall < previousScore.overall) return 'down';
    return 'stable';
  };

  const getKPIValue = (score: Score, kpiId: string) => {
    const value = score.kpiScores[kpiId];
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  const filteredScores = getFilteredScores();
  const averageScore = filteredScores.length > 0 
    ? filteredScores.reduce((sum, score) => sum + score.overall, 0) / filteredScores.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Score History</h3>
          <span className="text-muted-foreground">({filteredScores.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="1month">Last month</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      {filteredScores.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredScores.length}</div>
                <div className="text-sm text-muted-foreground">Total Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredScores[0]?.overall || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Latest Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score List */}
      {filteredScores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">No scores recorded</h4>
            <p className="text-muted-foreground text-center">
              {filterPeriod === 'all' 
                ? 'No scores have been recorded for this employee yet.'
                : 'No scores found for the selected time period.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredScores.map((score, index) => {
            const previousScore = sortOrder === 'desc' 
              ? filteredScores[index + 1] 
              : filteredScores[index - 1];
            const trend = getScoreTrend(score, previousScore);
            const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
            const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

            return (
              <Card key={score.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {format(new Date(score.date), 'MMM dd, yyyy')}
                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Overall Score: <span className="font-semibold text-foreground">{score.overall}/10</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(score.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteScore(score.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* KPI Scores */}
                  {Object.keys(score.kpiScores).length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">KPI Scores:</h5>
                      <div className="grid gap-2">
                        {employee.kpis.map(kpi => {
                          const kpiScore = getKPIValue(score, kpi.id);
                          if (kpiScore === 'N/A') return null;
                          
                          return (
                            <div key={kpi.id} className="flex justify-between items-center py-1 px-2 bg-muted rounded text-sm">
                              <span>{kpi.name}</span>
                              <span className="font-medium">
                                {kpiScore}
                                {kpi.type === 'percentage' && typeof score.kpiScores[kpi.id] === 'number' ? '%' : ''}
                                {kpi.target && typeof score.kpiScores[kpi.id] === 'number' && (
                                  <span className="text-muted-foreground ml-1">
                                    / {kpi.target}{kpi.type === 'percentage' ? '%' : ''}
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {score.notes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">Notes:</span>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {score.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
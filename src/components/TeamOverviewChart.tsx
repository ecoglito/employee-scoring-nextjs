import React from 'react';
import { Employee } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface TeamOverviewChartProps {
  teamMembers: Employee[];
  manager: Employee;
}

export default function TeamOverviewChart({ teamMembers, manager }: TeamOverviewChartProps) {
  // Prepare data for the chart
  const chartData = teamMembers.map(employee => {
    const latestScore = employee.scores.length > 0 
      ? employee.scores[employee.scores.length - 1] 
      : null;
    
    const averageScore = employee.scores.length > 0
      ? employee.scores.reduce((sum, score) => sum + score.overall, 0) / employee.scores.length
      : 0;

    const previousScore = employee.scores.length > 1 
      ? employee.scores[employee.scores.length - 2] 
      : null;

    const trend = latestScore && previousScore 
      ? latestScore.overall > previousScore.overall ? 'up' 
      : latestScore.overall < previousScore.overall ? 'down' : 'stable'
      : 'stable';

    return {
      name: employee.name.split(' ')[0], // First name only for space
      fullName: employee.name,
      role: employee.role,
      current: latestScore?.overall || 0,
      average: averageScore,
      scoreCount: employee.scores.length,
      kpiCount: employee.kpis.length,
      trend,
    };
  }).sort((a, b) => b.current - a.current); // Sort by current score descending

  const teamStats = {
    totalMembers: teamMembers.length,
    averageScore: teamMembers.reduce((sum, emp) => {
      const latestScore = emp.scores.length > 0 ? emp.scores[emp.scores.length - 1].overall : 0;
      return sum + latestScore;
    }, 0) / teamMembers.length,
    scoredMembers: teamMembers.filter(emp => emp.scores.length > 0).length,
  };

  // Chart configuration
  const chartConfig = {
    current: {
      label: "Current Score",
      color: "hsl(var(--chart-1))",
    },
    average: {
      label: "Average Score",
      color: "hsl(var(--chart-2))",
    },
  };

  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No team members found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Performance Overview
        </CardTitle>
        <CardDescription>
          Current and average scores for {manager.name}'s team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {teamStats.averageScore > 0 ? teamStats.averageScore.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Team Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{teamStats.scoredMembers}</div>
            <div className="text-sm text-muted-foreground">Have Scores</div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 10]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name) => [
                  `${value}/10`,
                  String(name) === 'current' ? 'Latest Score' : 'Average Score'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return `${data.fullName} (${data.role})`;
                  }
                  return label;
                }}
              />}
            />
            
            <Bar
              dataKey="current"
              fill="var(--color-current)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="average"
              fill="var(--color-average)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Team Member Details */}
        <div className="space-y-2">
          <h4 className="font-medium">Team Member Details</h4>
          <div className="space-y-2">
            {chartData.map((member) => {
              const TrendIcon = member.trend === 'up' ? TrendingUp : member.trend === 'down' ? TrendingDown : null;
              const trendColor = member.trend === 'up' ? 'text-green-500' : member.trend === 'down' ? 'text-red-500' : 'text-gray-500';

              return (
                <div key={member.fullName} className="flex items-center justify-between py-2 px-3 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{member.fullName}</div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{member.current || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">Latest</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{member.average > 0 ? member.average.toFixed(1) : 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{member.scoreCount}</div>
                      <div className="text-xs text-muted-foreground">Scores</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{member.kpiCount}</div>
                      <div className="text-xs text-muted-foreground">KPIs</div>
                    </div>
                    {TrendIcon && (
                      <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Employee } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface ScoreTrendsChartProps {
  employee: Employee;
  showKPIs?: boolean;
  height?: number;
}

export default function ScoreTrendsChart({ employee, showKPIs = false, height = 300 }: ScoreTrendsChartProps) {
  // Prepare data for the chart
  const chartData = employee.scores.map(score => {
    const dataPoint: any = {
      date: format(new Date(score.date), 'MMM dd'),
      fullDate: score.date,
      overall: score.overall,
    };

    // Add KPI scores if requested
    if (showKPIs) {
      employee.kpis.forEach(kpi => {
        const kpiScore = score.kpiScores[kpi.id];
        if (typeof kpiScore === 'number') {
          // Normalize KPI scores to 1-10 scale for visualization
          let normalizedScore = kpiScore;
          if (kpi.type === 'percentage') {
            normalizedScore = (kpiScore / 100) * 10;
          } else if (kpi.type === 'boolean') {
            normalizedScore = kpiScore ? 10 : 0;
          }
          dataPoint[`kpi_${kpi.id}`] = normalizedScore;
        }
      });
    }

    return dataPoint;
  }).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center" style={{ height }}>
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No score data to display</p>
        </CardContent>
      </Card>
    );
  }

  // Chart configuration
  const chartConfig = {
    overall: {
      label: "Overall Score",
      color: "hsl(var(--chart-1))",
    },
    ...Object.fromEntries(
      employee.kpis.slice(0, 5).map((kpi, index) => [
        `kpi_${kpi.id}`,
        {
          label: kpi.name,
          color: `hsl(var(--chart-${index + 2}))`,
        }
      ])
    ),
  };

  const formatTooltipValue = (value: any, name: any) => {
    const nameStr = String(name);
    if (nameStr === 'overall') {
      return [`${value}/10`, 'Overall Score'];
    }
    
    // Find the KPI for this line
    const kpiId = nameStr.replace('kpi_', '');
    const kpi = employee.kpis.find(k => k.id === kpiId);
    if (kpi) {
      let displayValue = value;
      if (kpi.type === 'percentage') {
        displayValue = `${((value / 10) * 100).toFixed(1)}%`;
      } else if (kpi.type === 'boolean') {
        displayValue = value > 5 ? 'Yes' : 'No';
      } else {
        displayValue = value.toFixed(1);
      }
      return [displayValue, kpi.name];
    }
    
    return [value, nameStr];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Score Trends
        </CardTitle>
        <CardDescription>
          Performance trends over time
          {showKPIs && employee.kpis.length > 0 && " (including KPIs)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
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
                formatter={formatTooltipValue}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return format(new Date(payload[0].payload.fullDate), 'MMM dd, yyyy');
                  }
                  return label;
                }}
              />}
            />
            
            {/* Overall score line */}
            <Line
              dataKey="overall"
              type="monotone"
              stroke="var(--color-overall)"
              strokeWidth={3}
              dot={{ fill: "var(--color-overall)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--color-overall)", strokeWidth: 2 }}
            />
            
            {/* KPI lines */}
            {showKPIs && employee.kpis.slice(0, 5).map((kpi) => (
              <Line
                key={kpi.id}
                dataKey={`kpi_${kpi.id}`}
                type="monotone"
                stroke={`var(--color-kpi_${kpi.id})`}
                strokeWidth={2}
                dot={{ fill: `var(--color-kpi_${kpi.id})`, strokeWidth: 1, r: 3 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
        
        {showKPIs && employee.kpis.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground border-t pt-4">
            <p className="font-medium mb-1">Chart Notes:</p>
            <ul className="space-y-1">
              <li>• KPI scores are normalized to 1-10 scale for visualization</li>
              <li>• Percentage KPIs: 0-100% mapped to 0-10</li>
              <li>• Boolean KPIs: No=0, Yes=10</li>
              {employee.kpis.length > 5 && (
                <li>• Only first 5 KPIs shown to maintain readability</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
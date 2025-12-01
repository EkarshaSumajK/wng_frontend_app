import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricChartProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  xKey?: string;
  yKey?: string;
  height?: number;
  colors?: string[];
  bare?: boolean;
}

const DEFAULT_COLORS = [
  'var(--primary)',
  'var(--secondary)',
  'var(--accent)',
  'var(--success)',
  'var(--warning)',
  'var(--destructive)'
];

export const MetricChart = React.memo(function MetricChart({
  title,
  data,
  type,
  xKey = 'name',
  yKey = 'value',
  height = 300,
  colors = DEFAULT_COLORS,
  bare = false
}: MetricChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar
                dataKey={yKey}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yKey}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    // @ts-expect-error - total is a custom prop for tooltip percentage calculation
                    total={data.reduce((acc, curr) => acc + curr[yKey], 0)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: data.payload.fill || data.color }}
                          />
                          <span className="font-semibold text-foreground">{data.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {data.value}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {((data.value as number / (data.payload.total || 1)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (bare) {
    return renderChart();
  }

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
});
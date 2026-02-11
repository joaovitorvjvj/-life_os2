import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

interface LineChartProps {
  data: Array<Record<string, number | string>>;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  xAxisKey: string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  data,
  lines,
  xAxisKey,
  className,
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          )}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="currentColor" 
            opacity={0.5}
            fontSize={12}
          />
          <YAxis 
            stroke="currentColor" 
            opacity={0.5}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  className?: string;
}

export function ProgressCard({
  title,
  current,
  target,
  unit = '',
  color = '#3b82f6',
  className,
}: ProgressCardProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lg', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div className="text-2xl font-bold">
            {current.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            meta: {target.toLocaleString()} {unit}
          </div>
        </div>
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-2"
            style={{ 
              '--progress-background': `${color}20`,
              '--progress-foreground': color,
            } as React.CSSProperties}
          />
          <span 
            className="absolute right-0 -top-5 text-xs font-medium"
            style={{ color }}
          >
            {percentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

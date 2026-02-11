import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TrendType = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: TrendType;
  trendValue?: string;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  description,
  className,
  iconClassName,
}: StatCardProps) {
  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendBgColors = {
    up: 'bg-emerald-500/10',
    down: 'bg-red-500/10',
    neutral: 'bg-gray-500/10',
  };

  const TrendIcon = trendIcons[trend];

  return (
    <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg', trendBgColors[trend], iconClassName)}>
          <Icon className={cn('h-4 w-4', trendColors[trend])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trendValue || description) && (
          <div className="flex items-center gap-1 mt-1">
            {trendValue && (
              <>
                <TrendIcon className={cn('h-3 w-3', trendColors[trend])} />
                <span className={cn('text-xs', trendColors[trend])}>
                  {trendValue}
                </span>
              </>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

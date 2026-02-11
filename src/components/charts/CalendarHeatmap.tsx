import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeatmapData {
  date: string;
  value: number;
}

interface CalendarHeatmapProps {
  data: HeatmapData[];
  className?: string;
  months?: number;
  colorScale?: string[];
}

const defaultColorScale = [
  'bg-slate-100 dark:bg-slate-800',
  'bg-emerald-200 dark:bg-emerald-900',
  'bg-emerald-300 dark:bg-emerald-800',
  'bg-emerald-400 dark:bg-emerald-700',
  'bg-emerald-500 dark:bg-emerald-600',
];

export function CalendarHeatmap({
  data,
  className,
  months = 6,
  colorScale = defaultColorScale,
}: CalendarHeatmapProps) {
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => {
      map.set(d.date, (map.get(d.date) || 0) + d.value);
    });
    return map;
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const getColorLevel = (value: number) => {
    if (value === 0) return 0;
    const ratio = value / maxValue;
    if (ratio <= 0.2) return 1;
    if (ratio <= 0.4) return 2;
    if (ratio <= 0.7) return 3;
    return 4;
  };

  const monthData = useMemo(() => {
    const result = [];
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      result.push({
        month: format(monthStart, 'MMM', { locale: ptBR }),
        days: days.map((day) => ({
          date: day,
          dateStr: format(day, 'yyyy-MM-dd'),
          dayOfWeek: getDay(day),
        })),
      });
    }
    return result;
  }, [months]);

  return (
    <TooltipProvider>
      <div className={cn('space-y-4', className)}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {monthData.map((month) => (
            <div key={month.month} className="flex-shrink-0">
              <div className="text-xs text-muted-foreground mb-1 capitalize">
                {month.month}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day) => {
                  const value = dataMap.get(day.dateStr) || 0;
                  const level = getColorLevel(value);
                  
                  return (
                    <Tooltip key={day.dateStr}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125',
                            colorScale[level]
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {format(day.date, 'dd/MM/yyyy')}
                        </p>
                        <p className="text-xs font-medium">
                          {value > 0 ? `${value} horas` : 'Sem estudos'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-1">
            {colorScale.map((color, i) => (
              <div key={i} className={cn('w-3 h-3 rounded-sm', color)} />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </div>
    </TooltipProvider>
  );
}

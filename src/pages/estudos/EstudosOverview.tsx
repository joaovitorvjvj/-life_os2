import { BookOpen, Clock, TrendingUp, Target, GraduationCap, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/charts/LineChart';
import { CalendarHeatmap } from '@/components/charts/CalendarHeatmap';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EstudosOverview() {
  const { currentUser } = useUserStore();
  const { getStudySessionsByUser, getSubjectsByUser } = useDataStore();

  const sessions = getStudySessionsByUser(currentUser);
  const subjects = getSubjectsByUser(currentUser);

  // Calculate stats
  const totalHours = sessions.reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60;
  
  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  const weekEnd = endOfWeek(new Date(), { locale: ptBR });
  const weeklyHours = sessions
    .filter((s: { date: Date }) => isWithinInterval(s.date, { start: weekStart, end: weekEnd }))
    .reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60;

  const monthlyHours = sessions
    .filter((s: { date: Date }) => s.date > subDays(new Date(), 30))
    .reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60;

  // Top subject
  const subjectHours = sessions.reduce((acc: Record<string, number>, s: { subjectId: string; duration: number }) => {
    acc[s.subjectId] = (acc[s.subjectId] || 0) + s.duration;
    return acc;
  }, {} as Record<string, number>);

  const topSubjectId = Object.entries(subjectHours)
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const topSubject = subjects.find((s) => s.id === topSubjectId);

  // Chart data - last 30 days
  const days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const lineChartData = days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const daySessions = sessions.filter(
      (s) => format(s.date, 'yyyy-MM-dd') === dayStr
    );
    return {
      date: format(day, 'dd/MM'),
      horas: daySessions.reduce((sum, s) => sum + s.duration, 0) / 60,
    };
  });

  // Heatmap data
  const heatmapData = sessions.map((s) => ({
    date: format(s.date, 'yyyy-MM-dd'),
    value: s.duration / 60,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudos</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seu progresso de aprendizado
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Horas"
          value={`${totalHours.toFixed(1)}h`}
          icon={Clock}
          trend="up"
        />
        <StatCard
          title="Esta Semana"
          value={`${weeklyHours.toFixed(1)}h`}
          icon={TrendingUp}
          trend={weeklyHours > 10 ? 'up' : 'neutral'}
        />
        <StatCard
          title="Este Mês"
          value={`${monthlyHours.toFixed(1)}h`}
          icon={Target}
          trend="up"
        />
        <StatCard
          title="Matéria Top"
          value={topSubject?.name || '-'}
          icon={GraduationCap}
          trend="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Horas de Estudo (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={lineChartData}
              lines={[{ key: 'horas', name: 'Horas', color: '#8b5cf6' }]}
              xAxisKey="date"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Mapa de Calor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={heatmapData} />
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Matérias
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const hours = (subjectHours[subject.id] || 0) / 60;
              const percentage = Math.min((hours / 100) * 100, 100);

              return (
                <div
                  key={subject.id}
                  className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <BookOpen 
                        className="h-5 w-5" 
                        style={{ color: subject.color }} 
                      />
                    </div>
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hours.toFixed(1)}h estudadas
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: subject.color,
                      }}
                    />
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

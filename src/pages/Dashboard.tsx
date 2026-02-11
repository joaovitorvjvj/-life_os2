import { useState } from 'react';
import { 
  CheckSquare, 
  Wallet, 
  Dumbbell, 
  BookOpen, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressCard } from '@/components/ui/ProgressCard';
import { PieChart } from '@/components/charts/PieChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { currentUser } = useUserStore();
  const { 
    getTasksByUser, 
    getTransactionsByUser, 
    getMealsByUser,
    getStudySessionsByUser,
    getAccountsByUser 
  } = useDataStore();
  
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  // Get user data
  const tasks = getTasksByUser(currentUser);
  const transactions = getTransactionsByUser(currentUser);
  const todaysMeals = getMealsByUser(currentUser).filter(
    (m: { date: Date }) => m.date.toDateString() === new Date().toDateString()
  );
  const studySessions = getStudySessionsByUser(currentUser);
  const accounts = getAccountsByUser(currentUser);

  // Calculate stats
  const pendingTasks = tasks.filter((t) => t.status !== 'concluida').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'alta' && t.status !== 'concluida').slice(0, 5);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter((t) => t.type === 'entrada' && t.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions
    .filter((t) => t.type === 'saida' && t.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((sum, t) => sum + t.amount, 0);

  const todaysCalories = todaysMeals.reduce((sum: number, m: { calories: number }) => sum + m.calories, 0);
  const todaysProtein = todaysMeals.reduce((sum: number, m: { protein: number }) => sum + m.protein, 0);

  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  const weekEnd = endOfWeek(new Date(), { locale: ptBR });
  const weeklyStudyHours = studySessions
    .filter((s: { date: Date }) => isWithinInterval(s.date, { start: weekStart, end: weekEnd }))
    .reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60;

  // Financial data for pie chart
  const expenseByCategory = transactions
    .filter((t: { type: string }) => t.type === 'saida')
    .reduce((acc: Record<string, number>, t: { category: string; amount: number }) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expenseByCategory)
    .slice(0, 5)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
        Object.keys(expenseByCategory).indexOf(name) % 5
      ],
    }));

  const aiInsights = [
    {
      category: 'Tarefas',
      message: `Você tem ${pendingTasks} tarefas pendentes. Priorize as ${tasks.filter(t => t.priority === 'alta' && t.status !== 'concluida').length} de alta prioridade.`,
      suggestion: 'Tente completar 2 tarefas hoje para reduzir o backlog.',
    },
    {
      category: 'Financeiro',
      message: `Seu saldo está ${monthlyIncome > monthlyExpense ? 'positivo' : 'negativo'} este mês.`,
      suggestion: monthlyExpense > monthlyIncome * 0.8 
        ? 'Considere reduzir gastos com lazer.' 
        : 'Continue assim! Você está economizando bem.',
    },
    {
      category: 'Fitness',
      message: `Você consumiu ${todaysCalories} calorias hoje.`,
      suggestion: todaysCalories < 2000 
        ? 'Aumente a ingestão de proteínas para atingir sua meta.' 
        : 'Mantenha o equilíbrio com exercícios.',
    },
    {
      category: 'Estudos',
      message: `Você estudou ${weeklyStudyHours.toFixed(1)} horas esta semana.`,
      suggestion: weeklyStudyHours < 10 
        ? 'Tente aumentar para 15 horas semanais.' 
        : 'Excelente dedicação!',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo de volta, {currentUser}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <Button 
          onClick={() => setShowAIAnalysis(true)}
          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Sparkles className="h-4 w-4" />
          Analisar com IA
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tarefas Pendentes"
          value={pendingTasks}
          icon={CheckSquare}
          trend={pendingTasks > 5 ? 'up' : 'down'}
          trendValue={`${tasks.filter(t => t.status === 'concluida').length} concluídas`}
        />
        <StatCard
          title="Saldo Total"
          value={`R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          trend={monthlyIncome > monthlyExpense ? 'up' : 'down'}
          trendValue={`${monthlyIncome > monthlyExpense ? '+' : ''}${((monthlyIncome - monthlyExpense) / monthlyExpense * 100).toFixed(1)}%`}
        />
        <StatCard
          title="Calorias Hoje"
          value={todaysCalories}
          icon={Dumbbell}
          trend="neutral"
          description="/ 2500 kcal"
        />
        <StatCard
          title="Horas de Estudo"
          value={`${weeklyStudyHours.toFixed(1)}h`}
          icon={BookOpen}
          trend={weeklyStudyHours > 10 ? 'up' : 'neutral'}
          description="esta semana"
        />
      </div>

      {/* Widgets Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Tarefas Prioritárias</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {highPriorityTasks.length > 0 ? (
              <div className="space-y-3">
                {highPriorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      task.priority === 'alta' && 'bg-red-500',
                      task.priority === 'media' && 'bg-orange-500',
                      task.priority === 'baixa' && 'bg-green-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(task.dueDate, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma tarefa prioritária</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Finance Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Detalhes <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Entradas</p>
                <p className="text-sm font-semibold text-emerald-500">
                  +R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saídas</p>
                <p className="text-sm font-semibold text-red-500">
                  -R$ {monthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className={cn(
                  'text-sm font-semibold',
                  monthlyIncome - monthlyExpense >= 0 ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {monthlyIncome - monthlyExpense >= 0 ? '+' : ''}
                  R$ {(monthlyIncome - monthlyExpense).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            {pieChartData.length > 0 ? (
              <PieChart data={pieChartData} showLegend={false} className="h-[180px]" />
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Sem dados suficientes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fitness Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Resumo Fitness</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Registrar <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressCard
                title="Calorias"
                current={todaysCalories}
                target={2500}
                unit="kcal"
                color="#f59e0b"
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                  <p className="text-xs text-muted-foreground">Proteína</p>
                  <p className="text-lg font-semibold text-blue-500">{todaysProtein}g</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <p className="text-xs text-muted-foreground">Carbo</p>
                  <p className="text-lg font-semibold text-green-500">
                    {todaysMeals.reduce((sum: number, m: { carbs: number }) => sum + m.carbs, 0)}g
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-500/10">
                  <p className="text-xs text-muted-foreground">Gordura</p>
                  <p className="text-lg font-semibold text-orange-500">
                    {todaysMeals.reduce((sum: number, m: { fat: number }) => sum + m.fat, 0)}g
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Studies Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Resumo de Estudos</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              Registrar <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{weeklyStudyHours.toFixed(1)}h</p>
                  <p className="text-sm text-muted-foreground">esta semana</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Matérias mais estudadas</p>
                {studySessions
                  .reduce((acc: Record<string, number>, s: { subjectId: string; duration: number }) => {
                    acc[s.subjectId] = (acc[s.subjectId] || 0) + s.duration;
                    return acc;
                  }, {} as Record<string, number>)
                  && Object.entries(
                    studySessions.reduce((acc: Record<string, number>, s: { subjectId: string; duration: number }) => {
                      acc[s.subjectId] = (acc[s.subjectId] || 0) + s.duration;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([subjectId, duration]: [string, number]) => {
                      const subjects = [
                        { id: '1', name: 'Programação', color: '#3b82f6' },
                        { id: '2', name: 'Inglês', color: '#10b981' },
                        { id: '3', name: 'Design', color: '#f59e0b' },
                        { id: '4', name: 'Data Science', color: '#8b5cf6' },
                        { id: '5', name: 'Espanhol', color: '#ef4444' },
                        { id: '6', name: 'Gestão', color: '#06b6d4' },
                      ];
                      const subject = subjects.find((s) => s.id === subjectId);
                      return (
                        <div key={subjectId} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject?.color || '#ccc' }}
                          />
                          <span className="text-sm flex-1">{subject?.name || 'Desconhecido'}</span>
                          <span className="text-sm text-muted-foreground">
                            {(duration / 60).toFixed(1)}h
                          </span>
                        </div>
                      );
                    })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Dialog */}
      <Dialog open={showAIAnalysis} onOpenChange={setShowAIAnalysis}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Análise Inteligente
            </DialogTitle>
            <DialogDescription>
              Insights personalizados baseados nos seus dados
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {insight.category}
                  </span>
                </div>
                <p className="text-sm mb-1">{insight.message}</p>
                <p className="text-sm text-muted-foreground">
                  💡 {insight.suggestion}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

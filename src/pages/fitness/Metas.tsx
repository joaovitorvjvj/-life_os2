import { Target, TrendingUp, Dumbbell, Flame, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { cn } from '@/lib/utils';

export default function MetasFitness() {
  const { currentUser } = useUserStore();
  const { getFitnessGoalsByUser, getMealsByUser, getWorkoutsByUser, getMeasurementsByUser } = useDataStore();

  const goals = getFitnessGoalsByUser(currentUser);
  const meals = getMealsByUser(currentUser);
  const workouts = getWorkoutsByUser(currentUser);
  const measurements = getMeasurementsByUser(currentUser);

  // Calculate current values
  const todaysCalories = meals
    .filter((m) => m.date.toDateString() === new Date().toDateString())
    .reduce((sum, m) => sum + m.calories, 0);

  const weeklyWorkouts = workouts.filter(
    (w) => w.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const latestWeight = measurements[measurements.length - 1]?.weight || 0;

  const goalData = [
    {
      id: 'calories',
      title: 'Calorias Diárias',
      icon: Flame,
      current: todaysCalories,
      target: 2500,
      unit: 'kcal',
      color: '#f59e0b',
      description: 'Meta de ingestão calórica diária',
    },
    {
      id: 'weight',
      title: 'Peso Alvo',
      icon: Scale,
      current: latestWeight,
      target: goals.find((g) => g.type === 'weight')?.target || 75,
      unit: 'kg',
      color: '#3b82f6',
      description: 'Meta de peso corporal',
    },
    {
      id: 'workouts',
      title: 'Treinos Semanais',
      icon: Dumbbell,
      current: weeklyWorkouts,
      target: 4,
      unit: 'treinos',
      color: '#10b981',
      description: 'Meta de frequência semanal',
    },
    {
      id: 'protein',
      title: 'Proteína Diária',
      icon: TrendingUp,
      current: meals
        .filter((m) => m.date.toDateString() === new Date().toDateString())
        .reduce((sum, m) => sum + m.protein, 0),
      target: 150,
      unit: 'g',
      color: '#8b5cf6',
      description: 'Meta de proteína diária',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Metas Fitness</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seu progresso em direção aos objetivos
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {goalData.map((goal) => {
          const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          const isComplete = percentage >= 100;
          const Icon = goal.icon;

          return (
            <Card key={goal.id} className={cn(
              'transition-all duration-300',
              isComplete && 'border-emerald-500/50 shadow-emerald-500/10'
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: goal.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: goal.color }}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{goal.current}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {goal.unit}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      meta: {goal.target} {goal.unit}
                    </div>
                  </div>

                  <div className="relative">
                    <Progress
                      value={percentage}
                      className="h-3"
                      style={{
                        '--progress-background': `${goal.color}20`,
                        '--progress-foreground': goal.color,
                      } as React.CSSProperties}
                    />
                    {isComplete && (
                      <div className="absolute -right-1 -top-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {isComplete
                      ? '🎉 Meta alcançada!'
                      : `Faltam ${(goal.target - goal.current).toFixed(0)} ${goal.unit}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Dicas para Alcançar suas Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">🍎 Nutrição</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Coma a cada 3-4 horas</li>
                <li>• Priorize proteínas em cada refeição</li>
                <li>• Beba pelo menos 2L de água</li>
                <li>• Evite açúcares refinados</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">💪 Treino</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Treine pelo menos 4x por semana</li>
                <li>• Combine cardio e musculação</li>
                <li>• Durma 7-8 horas por noite</li>
                <li>• Faça alongamentos</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">📊 Acompanhamento</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pese-se semanalmente</li>
                <li>• Tire fotos de progresso</li>
                <li>• Meça-se a cada 15 dias</li>
                <li>• Anote seus treinos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

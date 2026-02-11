import { Dumbbell, Utensils, Calendar, Ruler, Target, TrendingUp, Flame, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressCard } from '@/components/ui/ProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FitnessOverview() {
  const { currentUser } = useUserStore();
  const { 
    getMealsByUser, 
    getWorkoutsByUser, 
    getMeasurementsByUser,
    getFitnessGoalsByUser 
  } = useDataStore();

  const meals = getMealsByUser(currentUser);
  const workouts = getWorkoutsByUser(currentUser);
  const measurements = getMeasurementsByUser(currentUser);
  const goals = getFitnessGoalsByUser(currentUser);

  // Today's stats
  const todaysMeals = meals.filter(
    (m) => m.date.toDateString() === new Date().toDateString()
  );
  const todaysCalories = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const todaysProtein = todaysMeals.reduce((sum, m) => sum + m.protein, 0);
  const todaysCarbs = todaysMeals.reduce((sum, m) => sum + m.carbs, 0);
  const todaysFat = todaysMeals.reduce((sum, m) => sum + m.fat, 0);

  // Latest measurement
  const latestMeasurement = measurements[measurements.length - 1];
  const previousMeasurement = measurements[measurements.length - 2];
  const weightChange = latestMeasurement && previousMeasurement
    ? latestMeasurement.weight - previousMeasurement.weight
    : 0;

  // Weekly workouts
  const weeklyWorkouts = workouts.filter(
    (w) => w.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Goals
  const calorieGoal = goals.find((g) => g.type === 'calories');
  const weightGoal = goals.find((g) => g.type === 'weight');
  const workoutGoal = goals.find((g) => g.type === 'workouts');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fitness</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe sua saúde e bem-estar
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Calorias Hoje"
          value={todaysCalories}
          icon={Flame}
          trend={todaysCalories > 2000 ? 'up' : 'neutral'}
          description="/ 2500 kcal"
        />
        <StatCard
          title="Peso Atual"
          value={`${latestMeasurement?.weight.toFixed(1) || '--'} kg`}
          icon={TrendingUp}
          trend={weightChange < 0 ? 'down' : weightChange > 0 ? 'up' : 'neutral'}
          trendValue={weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : undefined}
        />
        <StatCard
          title="Treinos na Semana"
          value={weeklyWorkouts}
          icon={Dumbbell}
          trend={weeklyWorkouts >= 3 ? 'up' : 'neutral'}
          description="/ 4 meta"
        />
        <StatCard
          title="Proteína Hoje"
          value={`${todaysProtein}g`}
          icon={Target}
          trend="neutral"
          description="meta: 150g"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Nutrition */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Nutrição de Hoje
            </CardTitle>
            <Button variant="outline" size="sm">
              + Adicionar Refeição
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-orange-500/10">
                <p className="text-xs text-muted-foreground mb-1">Calorias</p>
                <p className="text-2xl font-bold text-orange-500">{todaysCalories}</p>
                <p className="text-xs text-muted-foreground">/ 2500</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-500/10">
                <p className="text-xs text-muted-foreground mb-1">Proteína</p>
                <p className="text-2xl font-bold text-blue-500">{todaysProtein}g</p>
                <p className="text-xs text-muted-foreground">/ 150g</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10">
                <p className="text-xs text-muted-foreground mb-1">Carboidratos</p>
                <p className="text-2xl font-bold text-green-500">{todaysCarbs}g</p>
                <p className="text-xs text-muted-foreground">/ 300g</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                <p className="text-xs text-muted-foreground mb-1">Gordura</p>
                <p className="text-2xl font-bold text-yellow-500">{todaysFat}g</p>
                <p className="text-xs text-muted-foreground">/ 80g</p>
              </div>
            </div>

            {todaysMeals.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Refeições de hoje</p>
                {todaysMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{meal.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {meal.mealType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Utensils className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma refeição registrada hoje</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calorieGoal && (
              <ProgressCard
                title="Calorias Diárias"
                current={todaysCalories}
                target={calorieGoal.target}
                unit="kcal"
                color="#f59e0b"
              />
            )}
            {weightGoal && (
              <ProgressCard
                title="Peso Alvo"
                current={latestMeasurement?.weight || weightGoal.current}
                target={weightGoal.target}
                unit="kg"
                color="#3b82f6"
              />
            )}
            {workoutGoal && (
              <ProgressCard
                title="Treinos Semanais"
                current={weeklyWorkouts}
                target={workoutGoal.target}
                unit="semana"
                color="#10b981"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Treinos Recentes
          </CardTitle>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          {workouts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workouts.slice(0, 6).map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(workout.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {workout.duration}min
                    </div>
                  </div>
                  <div className="space-y-1">
                    {workout.exercises.slice(0, 3).map((exercise) => (
                      <p key={exercise.id} className="text-sm text-muted-foreground">
                        {exercise.sets}x {exercise.name} ({exercise.reps} reps)
                      </p>
                    ))}
                    {workout.exercises.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{workout.exercises.length - 3} exercícios
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum treino registrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Calendar, Clock, Dumbbell, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Treinos() {
  const { currentUser } = useUserStore();
  const { getWorkoutsByUser, addWorkout, deleteWorkout } = useDataStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const workouts = getWorkoutsByUser(currentUser);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateWorkouts = workouts.filter(
    (w) => isSameDay(w.date, selectedDate)
  );

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
  });

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', weight: '' }],
    });
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout({
      name: formData.name,
      duration: parseInt(formData.duration) || 0,
      date: selectedDate,
      user: currentUser,
      exercises: formData.exercises
        .filter((e) => e.name)
        .map((e) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: e.name,
          sets: parseInt(e.sets) || 0,
          reps: parseInt(e.reps) || 0,
          weight: e.weight ? parseFloat(e.weight) : undefined,
        })),
    });
    setFormData({
      name: '',
      duration: '',
      exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    });
    setIsDialogOpen(false);
  };

  const hasWorkoutOnDay = (day: Date) => {
    return workouts.some((w) => isSameDay(w.date, day));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
          <p className="text-muted-foreground mt-1">
            Planeje e acompanhe seus treinos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Treino</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome do Treino</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Treino A - Peito"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="60"
                  required
                />
              </div>
              <div>
                <Label>Exercícios</Label>
                <div className="space-y-3 mt-2">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Exercício {index + 1}</span>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Nome do exercício"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Séries"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                        />
                        <Input
                          placeholder="Reps"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        />
                        <Input
                          placeholder="Peso (kg)"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={addExercise}
                >
                  + Adicionar Exercício
                </Button>
              </div>
              <Button type="submit" className="w-full">Salvar Treino</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendário
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[100px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day, i) => {
                const hasWorkout = hasWorkoutOnDay(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative',
                      !isCurrentMonth && 'text-muted-foreground/50',
                      isSelected && 'bg-primary text-primary-foreground',
                      !isSelected && isCurrentMonth && 'hover:bg-muted',
                      hasWorkout && !isSelected && 'font-semibold'
                    )}
                  >
                    {format(day, 'd')}
                    {hasWorkout && (
                      <div className={cn(
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Treinos de {format(selectedDate, 'dd/MM/yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateWorkouts.length > 0 ? (
              <div className="space-y-4">
                {selectedDateWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {workout.duration} minutos
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => deleteWorkout(workout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {workout.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {exercise.name}
                          </span>
                          <span>
                            {exercise.sets}x{exercise.reps}
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum treino nesta data</p>
                <p className="text-sm">Selecione outra data ou adicione um treino</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

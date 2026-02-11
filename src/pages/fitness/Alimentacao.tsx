import { useState } from 'react';
import { Plus, Trash2, Utensils, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Alimentacao() {
  const { currentUser } = useUserStore();
  const { getMealsByUser, addMeal, deleteMeal } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const meals = getMealsByUser(currentUser);
  const todaysMeals = meals.filter(
    (m) => m.date.toDateString() === selectedDate.toDateString()
  );

  const todaysCalories = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const todaysProtein = todaysMeals.reduce((sum, m) => sum + m.protein, 0);
  const todaysCarbs = todaysMeals.reduce((sum, m) => sum + m.carbs, 0);
  const todaysFat = todaysMeals.reduce((sum, m) => sum + m.fat, 0);

  const calorieGoal = 2500;
  const isOverGoal = todaysCalories > calorieGoal;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'cafe' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeal({
      name: formData.name,
      calories: parseInt(formData.calories) || 0,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fat: parseInt(formData.fat) || 0,
      date: selectedDate,
      mealType: formData.mealType,
      user: currentUser,
    });
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      mealType: 'cafe',
    });
    setIsDialogOpen(false);
  };

  const mealTypeLabels = {
    cafe: 'Café da Manhã',
    almoco: 'Almoço',
    jantar: 'Jantar',
    lanche: 'Lanche',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alimentação</h1>
          <p className="text-muted-foreground mt-1">
            Registre suas refeições e acompanhe seus macros
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Refeição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Refeição</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome do Alimento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Frango grelhado"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mealType">Tipo de Refeição</Label>
                <Select
                  value={formData.mealType}
                  onValueChange={(v) => setFormData({ ...formData, mealType: v as typeof formData.mealType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(mealTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Proteína (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carboidratos (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Gordura (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={cn(
          'transition-colors',
          isOverGoal && 'border-red-500/50 bg-red-500/5'
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Calorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysCalories}</div>
            <p className="text-xs text-muted-foreground">/ {calorieGoal} kcal</p>
            {isOverGoal && (
              <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                Excedeu a meta
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Proteína
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysProtein}g</div>
            <p className="text-xs text-muted-foreground">/ 150g</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Carboidratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysCarbs}g</div>
            <p className="text-xs text-muted-foreground">/ 300g</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gordura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysFat}g</div>
            <p className="text-xs text-muted-foreground">/ 80g</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Calórico</span>
            <span className={cn(
              'text-sm font-medium',
              isOverGoal ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {Math.round((todaysCalories / calorieGoal) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                isOverGoal ? 'bg-red-500' : 'bg-orange-500'
              )}
              style={{ width: `${Math.min((todaysCalories / calorieGoal) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Refeições de {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(mealTypeLabels).map(([type, label]) => {
                const typeMeals = todaysMeals.filter((m) => m.mealType === type);
                if (typeMeals.length === 0) return null;
                
                return (
                  <div key={type}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {label}
                    </h3>
                    <div className="space-y-2">
                      {typeMeals.map((meal) => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div>
                            <p className="font-medium">{meal.name}</p>
                            <p className="text-xs text-muted-foreground">
                              P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fat}g
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                              {meal.calories} kcal
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deleteMeal(meal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Utensils className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma refeição registrada</p>
              <p className="text-sm">Clique em "Nova Refeição" para adicionar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

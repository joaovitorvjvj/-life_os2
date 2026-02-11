import { useState } from 'react';
import { Plus, Target, PiggyBank, TrendingUp, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function MetasFinanceiras() {
  const { currentUser } = useUserStore();
  const { getFinancialGoalsByUser } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const goals = getFinancialGoalsByUser(currentUser);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    color: '#3b82f6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add goal logic would go here
    setIsDialogOpen(false);
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      color: '#3b82f6',
    });
  };

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas Financeiras</h1>
          <p className="text-muted-foreground mt-1">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viagem para Europa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="15000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        formData.color === color && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Criar Meta</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
            100
          );
          const daysLeft = differenceInDays(goal.deadline, new Date());
          const monthlyNeeded = daysLeft > 0
            ? ((goal.targetAmount - goal.currentAmount) / (daysLeft / 30))
            : 0;

          return (
            <Card key={goal.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="h-2"
                  style={{ backgroundColor: goal.color }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <Target 
                          className="h-6 w-6" 
                          style={{ color: goal.color }} 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(goal.deadline, 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-3xl font-bold">
                          R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          / R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: goal.color }}
                      >
                        {percentage}%
                      </span>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Faltam</p>
                        <p className="font-semibold">
                          R$ {(goal.targetAmount - goal.currentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Por mês</p>
                        <p className="font-semibold">
                          R$ {monthlyNeeded.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {daysLeft > 0 ? (
                        <span>{daysLeft} dias restantes</span>
                      ) : (
                        <span>Prazo encerrado</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Goal Card */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed hover:border-solid hover:border-primary cursor-pointer transition-all min-h-[300px] flex items-center justify-center">
              <CardContent className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="h-8 w-8" />
                </div>
                <p className="font-medium text-muted-foreground">Criar Nova Meta</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viagem para Europa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="15000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        formData.color === color && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Criar Meta</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Dicas para Alcançar suas Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">🎯 Seja Específico</h4>
              <p className="text-sm text-muted-foreground">
                Defina metas claras e mensuráveis. "Economizar R$ 10.000" é melhor que "economizar mais".
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">📅 Prazo Realista</h4>
              <p className="text-sm text-muted-foreground">
                Estabeleça prazos alcançáveis. Metas muito ambiciosas podem ser frustrantes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">📊 Acompanhe</h4>
              <p className="text-sm text-muted-foreground">
                Revise seu progresso semanalmente e ajuste suas estratégias se necessário.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

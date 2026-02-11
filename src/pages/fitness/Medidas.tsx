import { useState } from 'react';
import { Plus, Ruler, TrendingDown, TrendingUp, Minus, Trash2, Scale } from 'lucide-react';
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
import { LineChart } from '@/components/charts/LineChart';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Medidas() {
  const { currentUser } = useUserStore();
  const { getMeasurementsByUser, addMeasurement, deleteMeasurement } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const measurements = getMeasurementsByUser(currentUser).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const latestMeasurement = measurements[measurements.length - 1];
  const previousMeasurement = measurements[measurements.length - 2];
  const monthAgoMeasurement = measurements[measurements.length - 10];

  // Calculate changes
  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    return current - previous;
  };

  const weightChange = calculateChange(latestMeasurement?.weight, previousMeasurement?.weight);
  const monthWeightChange = calculateChange(latestMeasurement?.weight, monthAgoMeasurement?.weight);

  // Chart data
  const chartData = measurements.slice(-30).map((m) => ({
    date: format(m.date, 'dd/MM'),
    peso: m.weight,
    gordura: m.bodyFat || 0,
  }));

  // Form state
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    arms: '',
    legs: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeasurement({
      weight: parseFloat(formData.weight),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      arms: formData.arms ? parseFloat(formData.arms) : undefined,
      legs: formData.legs ? parseFloat(formData.legs) : undefined,
      date: new Date(),
      user: currentUser,
    });
    setFormData({
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      arms: '',
      legs: '',
    });
    setIsDialogOpen(false);
  };

  const ChangeIndicator = ({ value, label }: { value: number | null; label: string }) => {
    if (value === null) return <span className="text-muted-foreground">-</span>;
    
    const isPositive = value > 0;
    const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
    
    return (
      <div className="flex items-center gap-1">
        <Icon className={cn(
          'h-4 w-4',
          isPositive ? 'text-red-500' : 'text-emerald-500'
        )} />
        <span className={cn(
          'text-sm font-medium',
          isPositive ? 'text-red-500' : 'text-emerald-500'
        )}>
          {value > 0 ? '+' : ''}{value.toFixed(1)} {label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medidas</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe sua evolução física
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Medição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Medição</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="75.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">% Gordura Corporal</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                  placeholder="18.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chest">Peito (cm)</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.5"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.5"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="arms">Braço (cm)</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.5"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label htmlFor="legs">Perna (cm)</Label>
                  <Input
                    id="legs"
                    type="number"
                    step="0.5"
                    value={formData.legs}
                    onChange={(e) => setFormData({ ...formData, legs: e.target.value })}
                    placeholder="55"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Salvar Medição</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Stats */}
      {latestMeasurement && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Peso Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMeasurement.weight.toFixed(1)} kg</div>
              <div className="mt-2 space-y-1">
                <ChangeIndicator value={weightChange} label="vs última" />
                <ChangeIndicator value={monthWeightChange} label="vs mês" />
              </div>
            </CardContent>
          </Card>
          
          {latestMeasurement.bodyFat && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  % Gordura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestMeasurement.bodyFat.toFixed(1)}%</div>
                <ChangeIndicator 
                  value={calculateChange(latestMeasurement.bodyFat, previousMeasurement?.bodyFat)} 
                  label="vs última" 
                />
              </CardContent>
            </Card>
          )}
          
          {latestMeasurement.waist && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cintura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestMeasurement.waist.toFixed(1)} cm</div>
              </CardContent>
            </Card>
          )}
          
          {latestMeasurement.arms && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Braço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestMeasurement.arms.toFixed(1)} cm</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 1 ? (
            <LineChart
              data={chartData}
              lines={[{ key: 'peso', name: 'Peso (kg)', color: '#3b82f6' }]}
              xAxisKey="date"
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Registre medições para ver o gráfico</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Histórico de Medições
          </CardTitle>
        </CardHeader>
        <CardContent>
          {measurements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Peso</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Gordura</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Cintura</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {[...measurements].reverse().map((m) => (
                    <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm">
                        {format(m.date, 'dd/MM/yyyy')}
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-medium">
                        {m.weight.toFixed(1)} kg
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        {m.bodyFat ? `${m.bodyFat.toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        {m.waist ? `${m.waist.toFixed(1)} cm` : '-'}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => deleteMeasurement(m.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Ruler className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma medição registrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

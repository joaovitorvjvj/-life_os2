import { useState } from 'react';
import { Plus, Clock, Calendar, BookOpen, Trash2, TrendingUp } from 'lucide-react';
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
import { CalendarHeatmap } from '@/components/charts/CalendarHeatmap';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Sessoes() {
  const { currentUser } = useUserStore();
  const { getStudySessionsByUser, getSubjectsByUser, addStudySession, deleteStudySession } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const sessions = getStudySessionsByUser(currentUser);
  const subjects = getSubjectsByUser(currentUser);

  // Calculate stats
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  
  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  const weekEnd = endOfWeek(new Date(), { locale: ptBR });
  const weeklyHours = sessions
    .filter((s) => isWithinInterval(s.date, { start: weekStart, end: weekEnd }))
    .reduce((sum, s) => sum + s.duration, 0) / 60;

  const monthlyHours = sessions
    .filter((s) => s.date > subDays(new Date(), 30))
    .reduce((sum, s) => sum + s.duration, 0) / 60;

  // Heatmap data
  const heatmapData = sessions.map((s) => ({
    date: format(s.date, 'yyyy-MM-dd'),
    value: s.duration / 60,
  }));

  // Form state
  const [formData, setFormData] = useState({
    subjectId: '',
    duration: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudySession({
      subjectId: formData.subjectId,
      duration: parseInt(formData.duration) * 60, // Convert to minutes
      date: new Date(formData.date),
      description: formData.description,
      user: currentUser,
    });
    setFormData({
      subjectId: '',
      duration: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    });
    setIsDialogOpen(false);
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessões de Estudo</h1>
          <p className="text-muted-foreground mt-1">
            Registre e acompanhe suas sessões de estudo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Sessão de Estudo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="subject">Matéria</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="O que você estudou?"
                />
              </div>
              <Button type="submit" className="w-full">Registrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">{weeklyHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">{monthlyHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mapa de Calor de Estudos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap data={heatmapData} months={6} />
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sessões Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[...sessions].reverse().length > 0 ? (
            <div className="space-y-3">
              {[...sessions].reverse().slice(0, 10).map((session) => {
                const subject = getSubjectById(session.subjectId);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${subject?.color}20` || '#ccc' }}
                      >
                        <BookOpen 
                          className="h-5 w-5" 
                          style={{ color: subject?.color || '#666' }} 
                        />
                      </div>
                      <div>
                        <p className="font-medium">{subject?.name || 'Desconhecido'}</p>
                        {session.description && (
                          <p className="text-sm text-muted-foreground">
                            {session.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(session.date, 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {(session.duration / 60).toFixed(1)}h
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => deleteStudySession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma sessão registrada</p>
              <p className="text-sm">Clique em "Nova Sessão" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

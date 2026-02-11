import { useState } from 'react';
import { Plus, BookOpen, Clock, TrendingUp, Edit2, Trash2, GraduationCap } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const colorOptions = [
  { bg: 'bg-blue-500', text: 'text-blue-500', hex: '#3b82f6' },
  { bg: 'bg-green-500', text: 'text-green-500', hex: '#10b981' },
  { bg: 'bg-orange-500', text: 'text-orange-500', hex: '#f59e0b' },
  { bg: 'bg-red-500', text: 'text-red-500', hex: '#ef4444' },
  { bg: 'bg-purple-500', text: 'text-purple-500', hex: '#8b5cf6' },
  { bg: 'bg-cyan-500', text: 'text-cyan-500', hex: '#06b6d4' },
  { bg: 'bg-pink-500', text: 'text-pink-500', hex: '#ec4899' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', hex: '#6366f1' },
];

export default function Materias() {
  const { currentUser } = useUserStore();
  const { getSubjectsByUser, getStudySessionsByUser } = useDataStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const subjects = getSubjectsByUser(currentUser);
  const sessions = getStudySessionsByUser(currentUser);

  // Calculate hours per subject
  const subjectHours = sessions.reduce((acc, s) => {
    acc[s.subjectId] = (acc[s.subjectId] || 0) + s.duration;
    return acc;
  }, {} as Record<string, number>);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: colorOptions[0].hex,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subject logic would go here
    setIsDialogOpen(false);
    setFormData({ name: '', color: colorOptions[0].hex });
  };

  const getColorClass = (hex: string) => {
    return colorOptions.find((c) => c.hex === hex) || colorOptions[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matérias</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas áreas de estudo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Matéria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Matéria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Matéria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Programação"
                  required
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.hex })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        formData.color === color.hex && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const hours = (subjectHours[subject.id] || 0) / 60;
          const color = getColorClass(subject.color);

          return (
            <Card 
              key={subject.id} 
              className="group hover:shadow-lg transition-all overflow-hidden"
            >
              <div 
                className="h-2"
                style={{ backgroundColor: subject.color }}
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <GraduationCap 
                        className="h-6 w-6" 
                        style={{ color: subject.color }} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {hours.toFixed(1)} horas
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Total</span>
                    </div>
                    <p className="font-semibold">{hours.toFixed(1)}h</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Sessões</span>
                    </div>
                    <p className="font-semibold">
                      {sessions.filter((s) => s.subjectId === subject.id).length}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{Math.min(Math.round((hours / 100) * 100), 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min((hours / 100) * 100, 100)}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Subject Card */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed hover:border-solid hover:border-primary cursor-pointer transition-all min-h-[250px] flex items-center justify-center">
              <CardContent className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="h-8 w-8" />
                </div>
                <p className="font-medium text-muted-foreground">Adicionar Matéria</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Matéria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome da Matéria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Programação"
                  required
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.hex })}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        formData.color === color.hex && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Dicas de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">⏱️ Técnica Pomodoro</h4>
              <p className="text-sm text-muted-foreground">
                Estude em blocos de 25 minutos com pausas de 5 minutos. A cada 4 ciclos, faça uma pausa maior.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">📝 Anotações Ativas</h4>
              <p className="text-sm text-muted-foreground">
                Faça resumos e mapas mentais para fixar o conteúdo. Revise suas anotações regularmente.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">🎯 Metas Diárias</h4>
              <p className="text-sm text-muted-foreground">
                Defina objetivos claros para cada sessão de estudo. Comece pelas tarefas mais difíceis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

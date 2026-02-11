import { useState } from 'react';
import { Plus, List, Columns3, Calendar, Flag, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserStore } from '@/stores/userStore';
import { useDataStore } from '@/stores/dataStore';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const priorityColors: Record<TaskPriority, string> = {
  alta: 'bg-red-500',
  media: 'bg-orange-500',
  baixa: 'bg-green-500',
};

const priorityLabels: Record<TaskPriority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const statusLabels: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
};

export default function Tarefas() {
  const { currentUser } = useUserStore();
  const { getTasksByUser, addTask, updateTask, deleteTask } = useDataStore();
  
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  const tasks = getTasksByUser(currentUser);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'media' as TaskPriority,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate),
      });
      setEditingTask(null);
    } else {
      addTask({
        title: formData.title,
        description: formData.description,
        status: 'pendente',
        priority: formData.priority,
        dueDate: new Date(formData.dueDate),
        user: currentUser,
      });
    }
    
    setFormData({
      title: '',
      description: '',
      priority: 'media',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: format(task.dueDate, 'yyyy-MM-dd'),
    });
    setIsDialogOpen(true);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t: Task) => t.status === status);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(task)}
      className={cn(
        'p-4 rounded-lg border bg-card cursor-move hover:shadow-md transition-all',
        'hover:border-primary/50 group'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={cn(
          'w-2 h-2 rounded-full mt-1.5',
          priorityColors[task.priority]
        )} />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleEdit(task)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <h4 className="font-medium mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {format(task.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
      </div>
    </div>
  );

  const KanbanColumn = ({ 
    status, 
    title, 
    tasks 
  }: { 
    status: TaskStatus; 
    title: string; 
    tasks: Task[];
  }) => (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
      className={cn(
        'flex-1 min-w-[280px] rounded-lg p-4',
        'bg-muted/30 border-2 border-dashed border-transparent',
        'transition-colors',
        draggedTask && 'border-muted'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          {title}
          <Badge variant="secondary">{tasks.length}</Badge>
        </h3>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas tarefas e acompanhe seu progresso
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              onClick={() => setViewMode('kanban')}
            >
              <Columns3 className="h-4 w-4" />
              Kanban
            </Button>
          </div>
          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingTask(null);
                setFormData({
                  title: '',
                  description: '',
                  priority: 'media',
                  dueDate: format(new Date(), 'yyyy-MM-dd'),
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nome da tarefa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalhes opcionais"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) => setFormData({ ...formData, priority: v as TaskPriority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className={cn('w-2 h-2 rounded-full', priorityColors[key as TaskPriority])} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Data de Vencimento</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-sm text-muted-foreground">Total de Tarefas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getTasksByStatus('pendente').length}</div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getTasksByStatus('em_andamento').length}</div>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{getTasksByStatus('concluida').length}</div>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn
            status="pendente"
            title="Pendente"
            tasks={getTasksByStatus('pendente')}
          />
          <KanbanColumn
            status="em_andamento"
            title="Em Andamento"
            tasks={getTasksByStatus('em_andamento')}
          />
          <KanbanColumn
            status="concluida"
            title="Concluída"
            tasks={getTasksByStatus('concluida')}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {tasks.length > 0 ? (
              <div className="divide-y">
                {tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        priorityColors[task.priority]
                      )} />
                      <div>
                        <p className={cn(
                          'font-medium',
                          task.status === 'concluida' && 'line-through text-muted-foreground'
                        )}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(task.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                          <Badge variant="outline" className="text-xs">
                            {statusLabels[task.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Flag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma tarefa encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

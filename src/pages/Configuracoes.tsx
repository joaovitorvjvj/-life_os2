import { useState } from 'react';
import { Settings, User, Moon, Bell, Shield, Database, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/stores/userStore';
// Configuracoes page

export default function Configuracoes() {
  const { theme, toggleTheme, currentUser } = useUserStore();
  
  const [notifications, setNotifications] = useState({
    tasks: true,
    goals: true,
    reminders: false,
  });

  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Personalize sua experiência no Life OS 2.0
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alterne entre tema claro e escuro
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tarefas</Label>
              <p className="text-sm text-muted-foreground">
                Receba lembretes de tarefas pendentes
              </p>
            </div>
            <Switch
              checked={notifications.tasks}
              onCheckedChange={(v) => setNotifications({ ...notifications, tasks: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Metas</Label>
              <p className="text-sm text-muted-foreground">
                Notificações sobre progresso de metas
              </p>
            </div>
            <Switch
              checked={notifications.goals}
              onCheckedChange={(v) => setNotifications({ ...notifications, goals: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lembretes Diários</Label>
              <p className="text-sm text-muted-foreground">
                Receba um resumo diário das suas atividades
              </p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={(v) => setNotifications({ ...notifications, reminders: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidade
          </CardTitle>
          <CardDescription>
            Controle suas configurações de privacidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compartilhar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Permitir compartilhamento de dados anônimos para melhorias
              </p>
            </div>
            <Switch
              checked={privacy.shareData}
              onCheckedChange={(v) => setPrivacy({ ...privacy, shareData: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Análises</Label>
              <p className="text-sm text-muted-foreground">
                Permitir coleta de dados para análises de uso
              </p>
            </div>
            <Switch
              checked={privacy.analytics}
              onCheckedChange={(v) => setPrivacy({ ...privacy, analytics: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dados
          </CardTitle>
          <CardDescription>
            Gerencie seus dados do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exportar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia dos seus dados
              </p>
            </div>
            <Button variant="outline">Exportar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-red-500">Limpar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Remova todos os dados do aplicativo
              </p>
            </div>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sobre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Versão</span>
              <span className="text-sm font-medium">2.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Usuário Atual</span>
              <span className="text-sm font-medium">{currentUser}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

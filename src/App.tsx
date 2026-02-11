import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Dumbbell, 
  CheckSquare, 
  Wallet, 
  BookOpen, 
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Page = 'dashboard' | 'fitness' | 'tarefas' | 'financeiro' | 'estudos' | 'configuracoes';

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fitness' as Page, label: 'Fitness', icon: Dumbbell },
  { id: 'tarefas' as Page, label: 'Tarefas', icon: CheckSquare },
  { id: 'financeiro' as Page, label: 'Financeiro', icon: Wallet },
  { id: 'estudos' as Page, label: 'Estudos', icon: BookOpen },
  { id: 'configuracoes' as Page, label: 'Configurações', icon: Settings },
];

const usersData = [
  { name: 'João', color: '#3b82f6' },
  { name: 'Myrrena', color: '#ec4899' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState('João');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Bem-vindo de volta, {currentUser}!</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">R$ 12.450,00</div>
                  <p className="text-sm text-muted-foreground">Saldo Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">2.100</div>
                  <p className="text-sm text-muted-foreground">Calorias Hoje</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">12.5h</div>
                  <p className="text-sm text-muted-foreground">Horas de Estudo</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'fitness':
        return <h1 className="text-3xl font-bold">Fitness</h1>;
      case 'tarefas':
        return <h1 className="text-3xl font-bold">Tarefas</h1>;
      case 'financeiro':
        return <h1 className="text-3xl font-bold">Financeiro</h1>;
      case 'estudos':
        return <h1 className="text-3xl font-bold">Estudos</h1>;
      case 'configuracoes':
        return <h1 className="text-3xl font-bold">Configurações</h1>;
      default:
        return <h1 className="text-3xl font-bold">Dashboard</h1>;
    }
  };

  return (
    <div className={cn('min-h-screen bg-background', isDark && 'dark')}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="hidden sm:inline font-semibold text-lg">Life OS 2.0</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="h-6 w-px bg-border mx-1" />
            
            {/* User Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: usersData.find(u => u.name === currentUser)?.color || '#3b82f6' }}
                >
                  {currentUser[0]}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{currentUser}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50">
                  {usersData.map((user) => (
                    <button
                      key={user.name}
                      onClick={() => { setCurrentUser(user.name); setShowUserMenu(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted text-left"
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name[0]}
                      </div>
                      <span className="flex-1 text-sm">{user.name}</span>
                      {currentUser === user.name && <Check className="h-4 w-4" style={{ color: user.color }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    currentPage === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
          <div className="flex justify-around p-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg',
                    currentPage === item.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="lg:ml-64 flex-1 pt-4 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

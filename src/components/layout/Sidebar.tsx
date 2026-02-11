import { useState } from 'react';
import { NavLink, useLocation } from '@/lib/react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Calendar,
  Ruler,
  Target,
  CheckSquare,
  Wallet,
  Receipt,
  PiggyBank,
  Landmark,
  BookOpen,
  GraduationCap,
  Clock,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Fitness',
    href: '/fitness',
    icon: Dumbbell,
    children: [
      { label: 'Visão Geral', href: '/fitness', icon: Dumbbell },
      { label: 'Alimentação', href: '/fitness/alimentacao', icon: Utensils },
      { label: 'Treinos', href: '/fitness/treinos', icon: Calendar },
      { label: 'Medidas', href: '/fitness/medidas', icon: Ruler },
      { label: 'Metas', href: '/fitness/metas', icon: Target },
    ],
  },
  {
    label: 'Tarefas',
    href: '/tarefas',
    icon: CheckSquare,
  },
  {
    label: 'Financeiro',
    href: '/financeiro',
    icon: Wallet,
    children: [
      { label: 'Visão Geral', href: '/financeiro', icon: Wallet },
      { label: 'Transações', href: '/financeiro/transacoes', icon: Receipt },
      { label: 'Contas', href: '/financeiro/contas', icon: Landmark },
      { label: 'Metas', href: '/financeiro/metas', icon: PiggyBank },
    ],
  },
  {
    label: 'Estudos',
    href: '/estudos',
    icon: BookOpen,
    children: [
      { label: 'Visão Geral', href: '/estudos', icon: BookOpen },
      { label: 'Matérias', href: '/estudos/materias', icon: GraduationCap },
      { label: 'Sessões', href: '/estudos/sessoes', icon: Clock },
    ],
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(() => {
    if (!item.children) return false;
    return item.children.some((child) => location.pathname === child.href);
  });

  const isActive = location.pathname === item.href;
  const hasActiveChild = item.children?.some(
    (child) => location.pathname === child.href
  );

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            hasActiveChild
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="space-y-1">
            {item.children.map((child) => (
              <NavLink
                key={child.href}
                to={child.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
                style={{ paddingLeft: `${24 + depth * 12}px` }}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )
      }
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background',
          className
        )}
      >
        <ScrollArea className="h-full py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold">Life OS 2.0</span>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)] py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

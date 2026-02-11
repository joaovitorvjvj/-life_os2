import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { UserSelector } from './UserSelector';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const { toggleTheme } = useUserStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="hidden sm:inline font-semibold text-lg">
              Life OS 2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <UserSelector />
        </div>
      </div>
    </header>
  );
}

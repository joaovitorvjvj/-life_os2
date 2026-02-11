import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/stores/userStore';
import type { UserProfile } from '@/types';

export function UserSelector() {
  const { currentUser, users, setUser } = useUserStore();
  const currentProfile = users.find((u: UserProfile) => u.name === currentUser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentProfile?.avatar} alt={currentUser} />
            <AvatarFallback 
              style={{ backgroundColor: currentProfile?.color }}
              className="text-white text-xs"
            >
              {currentUser[0]}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium">{currentUser}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {users.map((user) => (
          <DropdownMenuItem
            key={user.name}
            onClick={() => setUser(user.name)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback 
                style={{ backgroundColor: user.color }}
                className="text-white text-xs"
              >
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1">{user.name}</span>
            {currentUser === user.name && (
              <Check className="h-4 w-4" style={{ color: user.color }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

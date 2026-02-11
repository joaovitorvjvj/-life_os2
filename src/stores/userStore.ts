import { create, persist } from '@/lib/zustand';
import type { User, UserProfile, Theme } from '@/types';

interface UserState {
  currentUser: User;
  theme: Theme;
  users: UserProfile[];
  setUser: (user: User) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  getCurrentUserProfile: () => UserProfile;
}

const usersData: UserProfile[] = [
  {
    name: 'João',
    email: 'joao@lifeos.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=João&backgroundColor=b6e3f4',
    color: '#3b82f6',
  },
  {
    name: 'Myrrena',
    email: 'myrrena@lifeos.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Myrrena&backgroundColor=ffd5dc',
    color: '#ec4899',
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: 'João',
      theme: 'light',
      users: usersData,
      
      setUser: (user) => set({ currentUser: user }),
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      getCurrentUserProfile: () => {
        return get().users.find((u) => u.name === get().currentUser) || usersData[0];
      },
    }),
    {
      name: 'lifeos-user-storage',
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('lifeos-user-storage');
  if (stored) {
    const data = JSON.parse(stored);
    if (data.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
}

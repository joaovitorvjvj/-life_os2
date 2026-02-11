// Stub implementation for react-router-dom
// This is a simplified version for demo purposes

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Location {
  pathname: string;
  search: string;
  hash: string;
}

interface NavigateFunction {
  (to: string, options?: { replace?: boolean; state?: unknown }): void;
}

const LocationContext = createContext<Location>({ pathname: '/', search: '', hash: '' });
const NavigateContext = createContext<NavigateFunction>(() => {});

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location>({
    pathname: window.location.pathname || '/',
    search: window.location.search,
    hash: window.location.hash,
  });

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const newPath = to.startsWith('/') ? to : '/' + to;
    if (options?.replace) {
      window.history.replaceState({}, '', newPath);
    } else {
      window.history.pushState({}, '', newPath);
    }
    setLocation({
      pathname: newPath,
      search: '',
      hash: '',
    });
  }, []);

  // Handle browser back/forward
  React.useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <LocationContext.Provider value={location}>
      <NavigateContext.Provider value={navigate}>
        {children}
      </NavigateContext.Provider>
    </LocationContext.Provider>
  );
}

export function Routes({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Route({ path, element }: { path?: string; element?: React.ReactNode }) {
  const location = useContext(LocationContext);
  const currentPath = location.pathname;
  
  // Simple path matching
  const match = path === currentPath || (path === '/' && currentPath === '') ||
    (path && currentPath.startsWith(path));
  
  if (match) {
    return <>{element}</>;
  }
  return null;
}

export function Navigate({ to }: { to: string }) {
  const navigate = useContext(NavigateContext);
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

export function Outlet() {
  return null;
}

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: React.ReactNode;
}

export function NavLink({ to, className, children, ...props }: NavLinkProps) {
  const location = useContext(LocationContext);
  const navigate = useContext(NavigateContext);
  const isActive = location.pathname === to;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  
  const resolvedClassName = typeof className === 'function' 
    ? className({ isActive }) 
    : className;
  
  return (
    <a 
      href={to} 
      className={resolvedClassName} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

export function useNavigate() {
  return useContext(NavigateContext);
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return {} as T;
}

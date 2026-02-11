// Declaration files for missing modules

declare module 'react-router-dom' {
  import * as React from 'react';

  export interface BrowserRouterProps {
    children?: React.ReactNode;
    basename?: string;
  }
  export class BrowserRouter extends React.Component<BrowserRouterProps> {}

  export interface RoutesProps {
    children?: React.ReactNode;
    location?: Partial<Location> | string;
  }
  export class Routes extends React.Component<RoutesProps> {}

  export interface RouteProps {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    index?: boolean;
    path?: string;
  }
  export class Route extends React.Component<RouteProps> {}

  export interface NavigateProps {
    to: string;
    replace?: boolean;
    state?: unknown;
  }
  export class Navigate extends React.Component<NavigateProps> {}

  export interface OutletProps {}
  export class Outlet extends React.Component<OutletProps> {}

  export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    end?: boolean;
    caseSensitive?: boolean;
    className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
    children?: React.ReactNode;
  }
  export class NavLink extends React.Component<NavLinkProps> {}

  export function useLocation(): Location;
  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: unknown }) => void;
  export function useParams<T extends Record<string, string> = Record<string, string>>(): T;
}

declare module 'zustand' {
  type SetStateInternal<T> = {
    _<
      K extends keyof T
    >(
      partial: T[K] | Partial<T[K]> | ((state: T[K]) => T[K] | Partial<T[K]>),
      replace?: false | undefined,
      actionType?: string | {
        type: unknown
      }
    ): void
  } & {
    _<
      K extends keyof T
    >(
      state: T[K] | ((state: T[K]) => T[K]),
      replace: true,
      actionType?: string | {
        type: unknown
      }
    ): void
  }

  export interface StoreApi<T> {
    setState: SetStateInternal<T>
    getState: () => T
    subscribe: (listener: (state: T, prevState: T) => void) => () => void
    destroy: () => void
  }

  export type StateCreator<T> = (
    setState: SetStateInternal<T>,
    getState: StoreApi<T>['getState'],
    store: StoreApi<T>
  ) => T

  export function create<T>(creator: StateCreator<T>): () => T & StoreApi<T>;
}

declare module 'zustand/middleware' {
  import { StateCreator, StoreApi } from 'zustand';

  export interface PersistOptions<T> {
    name: string;
    storage?: {
      getItem: (name: string) => string | null | Promise<string | null>
      setItem: (name: string, value: string) => void | Promise<void>
      removeItem: (name: string) => void | Promise<void>
    }
    partialize?: (state: T) => Partial<T>
  }

  export function persist<T>(
    config: StateCreator<T>,
    options: PersistOptions<T>
  ): StateCreator<T>;
}

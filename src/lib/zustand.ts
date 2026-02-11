// Simplified Zustand implementation
import { useState, useEffect, useCallback } from 'react';

export interface StoreApi<T> {
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  getState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  destroy: () => void;
}

export type StateCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T,
  api: StoreApi<T>
) => T;

// Simple hook-based store
export function create<T>(creator: StateCreator<T>): () => T {
  let state: T;
  const listeners = new Set<(state: T, prevState: T) => void>();
  
  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const prevState = state;
    const partialState = typeof partial === 'function' ? (partial as (state: T) => Partial<T>)(state) : partial;
    state = { ...state, ...partialState };
    listeners.forEach(listener => listener(state, prevState));
  };
  
  const getState = () => state;
  
  const subscribe = (listener: (state: T, prevState: T) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  const destroy = () => listeners.clear();
  
  const api: StoreApi<T> = { setState, getState, subscribe, destroy };
  
  // Initialize state
  state = creator(setState, getState, api);
  
  return function useStore() {
    const [, setTick] = useState(0);
    
    useEffect(() => {
      const unsubscribe = subscribe((newState, prevState) => {
        if (newState !== prevState) {
          setTick(t => t + 1);
        }
      });
      return unsubscribe;
    }, []);
    
    return state;
  };
}

// Persist middleware
export interface PersistOptions<T> {
  name: string;
  storage?: Storage;
}

export function persist<T>(
  config: StateCreator<T>,
  options: PersistOptions<T>
): StateCreator<T> {
  return (set, get, api) => {
    const storage = options.storage || localStorage;
    
    // Try to restore from storage
    const stored = storage.getItem(options.name);
    let initialState = config(set, get, api);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        initialState = { ...initialState, ...parsed };
      } catch (e) {
        console.error('Failed to parse stored state:', e);
      }
    }
    
    // Override setState to persist
    const originalSetState = api.setState;
    api.setState = (partial) => {
      originalSetState(partial);
      const state = api.getState();
      storage.setItem(options.name, JSON.stringify(state));
    };
    
    return initialState;
  };
}

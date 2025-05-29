"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Instance {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
  config?: any;
}

interface InstancesState {
  instances: Instance[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type InstancesAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INSTANCES'; payload: Instance[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_INSTANCE'; payload: Instance }
  | { type: 'UPDATE_INSTANCE'; payload: { id: string; updates: Partial<Instance> } }
  | { type: 'DELETE_INSTANCE'; payload: string }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: InstancesState = {
  instances: [],
  loading: false,
  error: null,
  initialized: false,
};

function instancesReducer(state: InstancesState, action: InstancesAction): InstancesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_INSTANCES':
      return { 
        ...state, 
        instances: action.payload, 
        loading: false, 
        error: null,
        initialized: true 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_INSTANCE':
      return { 
        ...state, 
        instances: [action.payload, ...state.instances] 
      };
    case 'UPDATE_INSTANCE':
      return {
        ...state,
        instances: state.instances.map(instance =>
          instance.id === action.payload.id
            ? { ...instance, ...action.payload.updates }
            : instance
        ),
      };
    case 'DELETE_INSTANCE':
      return {
        ...state,
        instances: state.instances.filter(instance => instance.id !== action.payload),
      };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    default:
      return state;
  }
}

interface InstancesContextValue extends InstancesState {
  loadInstances: () => Promise<void>;
  addInstance: (instance: Instance) => void;
  updateInstance: (id: string, updates: Partial<Instance>) => void;
  deleteInstance: (id: string) => void;
  refetch: () => Promise<void>;
}

const InstancesContext = createContext<InstancesContextValue | undefined>(undefined);

export function InstancesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(instancesReducer, initialState);
  const supabase = createClientComponentClient();

  const loadInstances = useCallback(async () => {
    if (state.initialized && !state.loading) {
      // Already loaded and not currently loading, skip
      console.log('🚀 Using cached instances data - no reload needed!');
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'No user found' });
        return;
      }

      console.log('📡 Fetching fresh instances from database for user:', user.id);
      
      const { data, error } = await supabase
        .from('instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('✅ Fresh data loaded from database:', data?.length || 0, 'instances');
      dispatch({ type: 'SET_INSTANCES', payload: data || [] });
    } catch (error) {
      console.error('❌ Error loading instances:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load instances' });
    }
  }, [supabase, state.initialized, state.loading]);

  const refetch = useCallback(async () => {
    // Force reload by resetting initialized state
    dispatch({ type: 'SET_INITIALIZED', payload: false });
    await loadInstances();
  }, [loadInstances]);

  const addInstance = useCallback((instance: Instance) => {
    dispatch({ type: 'ADD_INSTANCE', payload: instance });
  }, []);

  const updateInstance = useCallback((id: string, updates: Partial<Instance>) => {
    dispatch({ type: 'UPDATE_INSTANCE', payload: { id, updates } });
  }, []);

  const deleteInstance = useCallback((id: string) => {
    dispatch({ type: 'DELETE_INSTANCE', payload: id });
  }, []);

  // Load instances once when the provider mounts
  useEffect(() => {
    if (!state.initialized) {
      loadInstances();
    }
  }, [loadInstances, state.initialized]);

  const value: InstancesContextValue = {
    ...state,
    loadInstances,
    addInstance,
    updateInstance,
    deleteInstance,
    refetch,
  };

  return (
    <InstancesContext.Provider value={value}>
      {children}
    </InstancesContext.Provider>
  );
}

export function useInstances() {
  const context = useContext(InstancesContext);
  if (!context) {
    throw new Error('useInstances must be used within an InstancesProvider');
  }
  return context;
} 
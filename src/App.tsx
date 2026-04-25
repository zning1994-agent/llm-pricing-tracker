import React, { createContext, useContext, useReducer, useCallback, useState } from 'react';
import { Header } from './components/Header';
import { PricingTable } from './components/PricingTable';
import { BenchmarkChart } from './components/BenchmarkChart';
import { CapabilityMatrix } from './components/CapabilityMatrix';
import { LastUpdated } from './components/LastUpdated';
import { RefreshButton } from '../components/RefreshButton';
import { models } from './data/models';
import type { Model } from './types';

// App State types
interface AppState {
  models: Model[];
  lastUpdated: Date | null;
  isLoading: boolean;
  selectedModel: Model | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'SET_SELECTED_MODEL'; payload: Model | null }
  | { type: 'REFRESH_DATA' };

// Initial state
const initialState: AppState = {
  models: models,
  lastUpdated: new Date(),
  isLoading: false,
  selectedModel: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'SET_SELECTED_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'REFRESH_DATA':
      return { ...state, models: models, lastUpdated: new Date() };
    default:
      return state;
  }
}

// Context
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  handleRefresh: () => Promise<void>;
  handleSelectModel: (model: Model) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Hook to use context
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Provider component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleRefresh = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate data fetch
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch({ type: 'REFRESH_DATA' });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const handleSelectModel = useCallback((model: Model) => {
    dispatch({ type: 'SET_SELECTED_MODEL', payload: model });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, handleRefresh, handleSelectModel }}>
      {children}
    </AppContext.Provider>
  );
};

// Header component
const AppHeader: React.FC = () => {
  const { handleRefresh } = useAppContext();
  return <Header onRefresh={handleRefresh} />;
};

// Footer with LastUpdated and RefreshButton
const AppFooter: React.FC = () => {
  const { state, handleRefresh } = useAppContext();
  return (
    <div className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <LastUpdated lastUpdated={state.lastUpdated} />
          <RefreshButton onClick={handleRefresh} disabled={state.isLoading} />
        </div>
      </div>
    </div>
  );
};

// Main content components
const PricingSection: React.FC = () => {
  const { handleSelectModel } = useAppContext();
  return (
    <section className="mb-8">
      <PricingTable onSelectModel={handleSelectModel} />
    </section>
  );
};

const ChartsSection: React.FC = () => {
  const { handleSelectModel } = useAppContext();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <BenchmarkChart onSelectModel={handleSelectModel} />
      <CapabilityMatrix onSelectModel={handleSelectModel} />
    </div>
  );
};

// Main App component
const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <PricingSection />
        <ChartsSection />
      </main>

      <AppFooter />
    </div>
  );
};

// Root App with Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

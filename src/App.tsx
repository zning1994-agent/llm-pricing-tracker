import React, { useState, useCallback, useReducer, createContext, useContext } from 'react';
import Header from './components/Header';
import LastUpdated from './components/LastUpdated';
import RefreshButton from '../components/RefreshButton';
import PricingTable from './components/PricingTable';
import BenchmarkChart from './components/BenchmarkChart';
import CapabilityMatrix from './components/CapabilityMatrix';
import { modelsData } from './data/models';
import type { RefreshState } from '../types';

// State types
interface AppState {
  lastUpdated: Date | null;
  refreshState: RefreshState;
}

type AppAction =
  | { type: 'START_REFRESH' }
  | { type: 'FINISH_REFRESH' }
  | { type: 'ERROR_REFRESH' }
  | { type: 'RESET' };

// Initial state
const initialState: AppState = {
  lastUpdated: new Date(),
  refreshState: 'idle',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_REFRESH':
      return { ...state, refreshState: 'refreshing' };
    case 'FINISH_REFRESH':
      return { ...state, refreshState: 'success', lastUpdated: new Date() };
    case 'ERROR_REFRESH':
      return { ...state, refreshState: 'error' };
    case 'RESET':
      return { ...state, refreshState: 'idle' };
    default:
      return state;
  }
}

// Context
interface RefreshContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onRefresh: () => Promise<void>;
}

const RefreshContext = createContext<RefreshContextValue | null>(null);

// Provider component
const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const onRefresh = useCallback(async () => {
    dispatch({ type: 'START_REFRESH' });
    try {
      // Simulate data refresh - in production this would fetch new data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({ type: 'FINISH_REFRESH' });
    } catch {
      dispatch({ type: 'ERROR_REFRESH' });
    }
    // Reset to idle after showing status
    setTimeout(() => dispatch({ type: 'RESET' }), 2000);
  }, []);

  return (
    <RefreshContext.Provider value={{ state, dispatch, onRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// Hook to use refresh context
function useRefreshContext() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefreshContext must be used within RefreshProvider');
  }
  return context;
}

// App component
const AppContent: React.FC = () => {
  const { state, onRefresh } = useRefreshContext();
  const isLoading = state.refreshState === 'refreshing';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onDataRefresh={onRefresh} />

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Data Status:</span>
              <LastUpdated lastUpdated={state.lastUpdated} />
            </div>
            <RefreshButton onClick={onRefresh} isLoading={isLoading} disabled={isLoading} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-2">
          {/* Pricing Table - Full width */}
          <section className="xl:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Comparison</h2>
            <PricingTable models={modelsData} />
          </section>

          {/* Benchmark Chart */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Scores</h2>
            <BenchmarkChart models={modelsData} />
          </section>

          {/* Capability Matrix */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Capability Matrix</h2>
            <CapabilityMatrix models={modelsData} />
          </section>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RefreshProvider>
      <AppContent />
    </RefreshProvider>
  );
};

export default App;

import React, { useReducer, useCallback, useMemo, createContext, useContext } from 'react';
import { PricingTable, PricingPlan } from './components/PricingTable';
import { BenchmarkChart, BenchmarkScore } from './components/BenchmarkChart';
import { CapabilityMatrix, ModelCapability } from './components/CapabilityMatrix';
import './App.css';

// Types
export type ViewMode = 'all' | 'pricing' | 'benchmark' | 'capability';
export type RefreshState = 'idle' | 'refreshing' | 'success' | 'error';

interface AppState {
  viewMode: ViewMode;
  lastRefreshed: Date | null;
  refreshState: RefreshState;
  selectedModel: string | null;
  error: string | null;
}

type AppAction =
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_REFRESH_STATE'; payload: RefreshState }
  | { type: 'REFRESH_SUCCESS' }
  | { type: 'REFRESH_ERROR'; payload: string }
  | { type: 'SELECT_MODEL'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_TO_IDLE' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_REFRESH_STATE':
      return { ...state, refreshState: action.payload, error: null };
    case 'REFRESH_SUCCESS':
      return { ...state, refreshState: 'success', lastRefreshed: new Date() };
    case 'REFRESH_ERROR':
      return { ...state, refreshState: 'error', error: action.payload };
    case 'SELECT_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_TO_IDLE':
      return { ...state, refreshState: 'idle' };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  setViewMode: (mode: ViewMode) => void;
  refresh: () => Promise<void>;
  selectModel: (modelId: string | null) => void;
  clearError: () => void;
}

// Context
const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Provider Component
interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    viewMode: 'all',
    lastRefreshed: null,
    refreshState: 'idle',
    selectedModel: null,
    error: null,
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const selectModel = useCallback((modelId: string | null) => {
    dispatch({ type: 'SELECT_MODEL', payload: modelId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const refresh = useCallback(async () => {
    dispatch({ type: 'SET_REFRESH_STATE', payload: 'refreshing' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch({ type: 'REFRESH_SUCCESS' });

      setTimeout(() => {
        dispatch({ type: 'RESET_TO_IDLE' });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      dispatch({ type: 'REFRESH_ERROR', payload: errorMessage });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      setViewMode,
      refresh,
      selectModel,
      clearError,
    }),
    [state, setViewMode, refresh, selectModel, clearError]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Header Component
const Header: React.FC = () => {
  const { state, refresh } = useAppContext();

  const formatLastRefreshed = () => {
    if (!state.lastRefreshed) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - state.lastRefreshed.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return state.lastRefreshed.toLocaleTimeString();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1 className="header-title">LLM Pricing Tracker</h1>
          <p className="header-subtitle">Compare LLM pricing, benchmarks, and capabilities</p>
        </div>

        <div className="header-actions">
          <div className="refresh-status">
            <span className="refresh-label">Last updated:</span>
            <span className="refresh-time">{formatLastRefreshed()}</span>
          </div>

          <button
            className={`refresh-button ${state.refreshState}`}
            onClick={refresh}
            disabled={state.refreshState === 'refreshing'}
            aria-label="Refresh data"
          >
            <span className={`refresh-icon ${state.refreshState === 'refreshing' ? 'spinning' : ''}`}>
              {state.refreshState === 'success' ? '✓' : state.refreshState === 'error' ? '✕' : '↻'}
            </span>
            <span className="refresh-text">
              {state.refreshState === 'refreshing' ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
  const { state, setViewMode } = useAppContext();

  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'all', label: 'Overview', icon: '📊' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'benchmark', label: 'Benchmarks', icon: '📈' },
    { id: 'capability', label: 'Capabilities', icon: '🎯' },
  ];

  return (
    <nav className="app-nav">
      <div className="nav-content">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${state.viewMode === item.id ? 'active' : ''}`}
            onClick={() => setViewMode(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Selected Model Panel
const SelectedModelPanel: React.FC = () => {
  const { state, selectModel } = useAppContext();

  const pricingData: PricingPlan[] = [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', model: 'gpt-4-turbo-2024-04-09', inputPrice: 10, outputPrice: 30, contextWindow: 128000, isPopular: true },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', model: 'claude-3-opus-20240229', inputPrice: 15, outputPrice: 75, contextWindow: 200000, isPopular: true },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', model: 'gemini-1.5-pro-preview-0514', inputPrice: 3.5, outputPrice: 10.5, contextWindow: 1000000, isPopular: true },
  ];

  const benchmarkData: BenchmarkScore[] = [
    { modelId: 'gpt-4-turbo', modelName: 'GPT-4 Turbo', provider: 'OpenAI', mmlu: 86.4, humaneval: 90.2, math: 73.4, mgsm: 79.8 },
    { modelId: 'claude-3-opus', modelName: 'Claude 3 Opus', provider: 'Anthropic', mmlu: 88.7, humaneval: 84.0, math: 60.1, mgsm: 83.6 },
    { modelId: 'gemini-1.5-pro', modelName: 'Gemini 1.5 Pro', provider: 'Google', mmlu: 85.9, humaneval: 84.6, math: 58.5, mgsm: 79.4 },
  ];

  const capabilityData: ModelCapability[] = [
    { modelId: 'gpt-4-turbo', modelName: 'GPT-4 Turbo', provider: 'OpenAI', vision: 'full', functionCalling: 'full', jsonMode: 'full', streaming: 'full', multiModal: 'partial' },
    { modelId: 'claude-3-opus', modelName: 'Claude 3 Opus', provider: 'Anthropic', vision: 'full', functionCalling: 'full', jsonMode: 'full', streaming: 'full', multiModal: 'partial' },
    { modelId: 'gemini-1.5-pro', modelName: 'Gemini 1.5 Pro', provider: 'Google', vision: 'full', functionCalling: 'full', jsonMode: 'full', streaming: 'full', multiModal: 'full' },
  ];

  const selectedPricing = pricingData.find((p) => p.id === state.selectedModel);
  const selectedBenchmark = benchmarkData.find((b) => b.modelId === state.selectedModel);
  const selectedCapability = capabilityData.find((c) => c.modelId === state.selectedModel);

  if (!state.selectedModel) return null;

  return (
    <div className="selected-model-panel">
      <div className="panel-header">
        <h3>Selected: {selectedPricing?.name || selectedBenchmark?.modelName || 'Unknown'}</h3>
        <button className="close-button" onClick={() => selectModel(null)} aria-label="Close panel">
          ✕
        </button>
      </div>

      <div className="panel-content">
        {selectedPricing && (
          <div className="panel-section">
            <h4>Pricing</h4>
            <p>Input: ${selectedPricing.inputPrice}/1M tokens</p>
            <p>Output: ${selectedPricing.outputPrice}/1M tokens</p>
            <p>Context: {(selectedPricing.contextWindow / 1000).toLocaleString()}K tokens</p>
          </div>
        )}

        {selectedBenchmark && (
          <div className="panel-section">
            <h4>Benchmarks</h4>
            <p>MMLU: {selectedBenchmark.mmlu}%</p>
            <p>HumanEval: {selectedBenchmark.humaneval}%</p>
            <p>MATH: {selectedBenchmark.math}%</p>
            <p>MGSM: {selectedBenchmark.mgsm}%</p>
          </div>
        )}

        {selectedCapability && (
          <div className="panel-section">
            <h4>Key Capabilities</h4>
            <ul>
              {selectedCapability.vision === 'full' && <li>✓ Vision</li>}
              {selectedCapability.functionCalling === 'full' && <li>✓ Function Calling</li>}
              {selectedCapability.multiModal === 'full' && <li>✓ Multimodal</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Error Toast
const ErrorToast: React.FC = () => {
  const { state, clearError } = useAppContext();

  if (!state.error) return null;

  return (
    <div className="error-toast">
      <span className="error-message">{state.error}</span>
      <button className="error-dismiss" onClick={clearError} aria-label="Dismiss error">
        ✕
      </button>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { state, selectModel } = useAppContext();

  const pricingPlans: PricingPlan[] = [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', model: 'gpt-4-turbo-2024-04-09', inputPrice: 10, outputPrice: 30, contextWindow: 128000, features: ['Vision', 'JSON Mode', 'Function Calling'], isPopular: true },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', model: 'gpt-3.5-turbo-0125', inputPrice: 0.5, outputPrice: 1.5, contextWindow: 16385, features: ['Fast', 'Cost-effective'] },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', model: 'claude-3-opus-20240229', inputPrice: 15, outputPrice: 75, contextWindow: 200000, features: ['Vision', 'Extended Thinking', 'Tool Use'], isPopular: true },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', model: 'claude-3-sonnet-20240229', inputPrice: 3, outputPrice: 15, contextWindow: 200000, features: ['Vision', 'Tool Use'] },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', model: 'gemini-1.5-pro-preview-0514', inputPrice: 3.5, outputPrice: 10.5, contextWindow: 1000000, features: ['1M Context', 'Vision', 'Audio'], isPopular: true },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', model: 'gemini-1.5-flash-preview-0514', inputPrice: 0.35, outputPrice: 0.53, contextWindow: 1000000, features: ['1M Context', 'Fast'] },
    { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', model: 'mistral-large-2407', inputPrice: 4, outputPrice: 12, contextWindow: 128000, features: ['Multilingual', 'Function Calling'], isPopular: true },
    { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', model: 'llama-3-70b-instruct', inputPrice: 0.65, outputPrice: 2.75, contextWindow: 8192, features: ['Open Source', 'Large Context'] },
  ];

  const benchmarkScores: BenchmarkScore[] = [
    { modelId: 'gpt-4-turbo', modelName: 'GPT-4 Turbo', provider: 'OpenAI', mmlu: 86.4, humaneval: 90.2, math: 73.4, mgsm: 79.8 },
    { modelId: 'claude-3-opus', modelName: 'Claude 3 Opus', provider: 'Anthropic', mmlu: 88.7, humaneval: 84.0, math: 60.1, mgsm: 83.6 },
    { modelId: 'claude-3-sonnet', modelName: 'Claude 3 Sonnet', provider: 'Anthropic', mmlu: 79.0, humaneval: 73.0, math: 52.3, mgsm: 72.6 },
    { modelId: 'gemini-1.5-pro', modelName: 'Gemini 1.5 Pro', provider: 'Google', mmlu: 85.9, humaneval: 84.6, math: 58.5, mgsm: 79.4 },
    { modelId: 'gemini-1.5-flash', modelName: 'Gemini 1.5 Flash', provider: 'Google', mmlu: 85.0, humaneval: 79.5, math: 52.1, mgsm: 74.8 },
    { modelId: 'mistral-large', modelName: 'Mistral Large', provider: 'Mistral', mmlu: 81.2, humaneval: 81.0, math: 51.2, mgsm: 68.4 },
    { modelId: 'llama-3-70b', modelName: 'Llama 3 70B', provider: 'Meta', mmlu: 82.0, humaneval: 81.7, math: 51.8, mgsm: 69.5 },
  ];

  const modelCapabilities: ModelCapability[] = [
    { modelId: 'gpt-4-turbo', modelName: 'GPT-4 Turbo', provider: 'OpenAI', vision: 'full', audio: 'none', functionCalling: 'full', jsonMode: 'full', streaming: 'full', systemPrompt: 'full', multiModal: 'partial', codeExecution: 'limited', toolUse: 'full', retrieval: 'full', contextArchival: 'limited', guardrails: 'full', customWeights: 'none', fineTuning: 'none', embedding: 'partial' },
    { modelId: 'claude-3-opus', modelName: 'Claude 3 Opus', provider: 'Anthropic', vision: 'full', audio: 'none', functionCalling: 'full', jsonMode: 'full', streaming: 'full', systemPrompt: 'full', multiModal: 'partial', codeExecution: 'none', toolUse: 'full', retrieval: 'partial', contextArchival: 'full', guardrails: 'full', customWeights: 'none', fineTuning: 'none', embedding: 'none' },
    { modelId: 'gemini-1.5-pro', modelName: 'Gemini 1.5 Pro', provider: 'Google', vision: 'full', audio: 'full', functionCalling: 'full', jsonMode: 'full', streaming: 'full', systemPrompt: 'full', multiModal: 'full', codeExecution: 'limited', toolUse: 'full', retrieval: 'full', contextArchival: 'full', guardrails: 'partial', customWeights: 'none', fineTuning: 'limited', embedding: 'partial' },
    { modelId: 'mistral-large', modelName: 'Mistral Large', provider: 'Mistral', vision: 'none', audio: 'none', functionCalling: 'full', jsonMode: 'full', streaming: 'full', systemPrompt: 'full', multiModal: 'none', codeExecution: 'none', toolUse: 'full', retrieval: 'partial', contextArchival: 'partial', guardrails: 'partial', customWeights: 'full', fineTuning: 'full', embedding: 'full' },
    { modelId: 'llama-3-70b', modelName: 'Llama 3 70B', provider: 'Meta', vision: 'none', audio: 'none', functionCalling: 'full', jsonMode: 'full', streaming: 'full', systemPrompt: 'full', multiModal: 'none', codeExecution: 'limited', toolUse: 'partial', retrieval: 'partial', contextArchival: 'limited', guardrails: 'partial', customWeights: 'full', fineTuning: 'full', embedding: 'full' },
  ];

  const handlePricingSelect = useCallback((plan: PricingPlan) => {
    selectModel(plan.id);
  }, [selectModel]);

  const handleBenchmarkSelect = useCallback((model: BenchmarkScore) => {
    selectModel(model.modelId);
  }, [selectModel]);

  const handleCapabilitySelect = useCallback((model: ModelCapability) => {
    selectModel(model.modelId);
  }, [selectModel]);

  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className="app-main">
        {state.viewMode === 'all' && (
          <div className="all-views">
            <section className="app-section">
              <PricingTable
                plans={pricingPlans}
                onSelectPlan={handlePricingSelect}
                title="Token Pricing Comparison"
                highlightLowest="both"
              />
            </section>
            <section className="app-section">
              <BenchmarkChart
                data={benchmarkScores}
                title="LLM Benchmark Performance"
                highlightBest={true}
                highlightWorst={true}
                onModelClick={handleBenchmarkSelect}
              />
            </section>
            <section className="app-section">
              <CapabilityMatrix
                models={modelCapabilities}
                title="LLM Capability Comparison"
                onModelClick={handleCapabilitySelect}
              />
            </section>
          </div>
        )}
        {state.viewMode === 'pricing' && (
          <section className="app-section">
            <PricingTable
              plans={pricingPlans}
              onSelectPlan={handlePricingSelect}
              title="Token Pricing Comparison"
              highlightLowest="both"
            />
          </section>
        )}
        {state.viewMode === 'benchmark' && (
          <section className="app-section">
            <BenchmarkChart
              data={benchmarkScores}
              title="LLM Benchmark Performance"
              highlightBest={true}
              highlightWorst={true}
              onModelClick={handleBenchmarkSelect}
            />
          </section>
        )}
        {state.viewMode === 'capability' && (
          <section className="app-section">
            <CapabilityMatrix
              models={modelCapabilities}
              title="LLM Capability Comparison"
              onModelClick={handleCapabilitySelect}
            />
          </section>
        )}
      </main>
      <SelectedModelPanel />
      <ErrorToast />
      <footer className="app-footer">
        <p>LLM Pricing Tracker - Data sourced from official provider documentation</p>
      </footer>
    </div>
  );
};

// Root component with provider
const AppWithProvider: React.FC = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default AppWithProvider;
export { App, AppProvider, useAppContext };
export type { AppState, AppContextType, ViewMode, RefreshState };

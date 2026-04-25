// Re-export types from components
export type { PricingPlan, PricingTableProps } from '../components/PricingTable';
export type { BenchmarkScore, BenchmarkType, BenchmarkChartProps } from '../components/BenchmarkChart';
export type { ModelCapability, CapabilityCategory, CapabilityLevel, CapabilityMatrixProps } from '../components/CapabilityMatrix';

// App-level types
export type ViewMode = 'all' | 'pricing' | 'benchmark' | 'capability';
export type RefreshState = 'idle' | 'refreshing' | 'success' | 'error';

export interface AppState {
  viewMode: ViewMode;
  lastRefreshed: Date | null;
  refreshState: RefreshState;
  selectedModel: string | null;
  error: string | null;
}

export interface AppContextType {
  state: AppState;
  setViewMode: (mode: ViewMode) => void;
  refresh: () => Promise<void>;
  selectModel: (modelId: string | null) => void;
  clearError: () => void;
}

// Model data combining all sources
export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  // Pricing
  inputPrice?: number;
  outputPrice?: number;
  contextWindow?: number;
  // Benchmarks
  mmlu?: number;
  humaneval?: number;
  math?: number;
  mgsm?: number;
  // Capabilities
  vision?: 'full' | 'partial' | 'limited' | 'none';
  functionCalling?: 'full' | 'partial' | 'limited' | 'none';
  jsonMode?: 'full' | 'partial' | 'limited' | 'none';
  streaming?: 'full' | 'partial' | 'limited' | 'none';
  multiModal?: 'full' | 'partial' | 'limited' | 'none';
}

// Refresh context type for global state management
export interface RefreshContextType {
  lastUpdated: Date | null;
  isRefreshing: boolean;
  refreshState: RefreshState;
  onRefresh: () => Promise<void>;
}

export interface RefreshProviderProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

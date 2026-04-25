// TypeScript interfaces for LLM Pricing Tracker

// Pricing structure
export interface Pricing {
  inputPerMillion: number; // Cost per million input tokens
  outputPerMillion: number; // Cost per million output tokens
}

// Benchmark scores
export interface Benchmarks {
  mmlu: number; // Massive Multitask Language Understanding (%)
  humanEval: number; // HumanEval code completion (%)
  math: number; // MATH problem solving (%)
  mgsm: number; // Multilingual Grade School Math (%)
}

// Capability features
export interface Capabilities {
  contextLength: number; // Maximum context window in tokens
  multimodal: boolean; // Image/audio input support
  toolUse: boolean; // Tool calling / function execution
  vision: boolean; // Image understanding
  streaming: boolean; // Streaming response support
}

// Complete Model interface
export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  releaseDate: string; // ISO date string
  pricing: Pricing;
  benchmarks: Benchmarks;
  capabilities: Capabilities;
}

// App state types
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

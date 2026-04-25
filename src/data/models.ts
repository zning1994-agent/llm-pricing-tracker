// Static model data for LLM Pricing Tracker

export interface PricingData {
  inputPrice: number; // Price per million input tokens
  outputPrice: number; // Price per million output tokens
  contextWindow: number; // Maximum context window in tokens
}

export interface BenchmarkData {
  mmlu: number; // Massive Multitask Language Understanding (%)
  humaneval: number; // HumanEval code completion (%)
  math: number; // MATH problem solving (%)
  mgsm: number; // Multilingual Grade School Math (%)
}

export interface CapabilityFeature {
  vision: 'full' | 'partial' | 'limited' | 'none';
  audio: 'full' | 'partial' | 'limited' | 'none';
  functionCalling: 'full' | 'partial' | 'limited' | 'none';
  jsonMode: 'full' | 'partial' | 'limited' | 'none';
  streaming: 'full' | 'partial' | 'limited' | 'none';
  systemPrompt: 'full' | 'partial' | 'limited' | 'none';
  multiModal: 'full' | 'partial' | 'limited' | 'none';
  codeExecution: 'full' | 'partial' | 'limited' | 'none';
  toolUse: 'full' | 'partial' | 'limited' | 'none';
  retrieval: 'full' | 'partial' | 'limited' | 'none';
  contextArchival: 'full' | 'partial' | 'limited' | 'none';
  guardrails: 'full' | 'partial' | 'limited' | 'none';
  customWeights: 'full' | 'partial' | 'limited' | 'none';
  fineTuning: 'full' | 'partial' | 'limited' | 'none';
  embedding: 'full' | 'partial' | 'limited' | 'none';
}

export interface ModelData {
  id: string;
  name: string;
  provider: string;
  model: string; // Full model identifier
  isPopular: boolean;
  features: string[];
  pricing: PricingData;
  benchmark: BenchmarkData;
  capability: CapabilityFeature;
}

// Model data for GPT-5.5, DeepSeek V4, Claude Code, and Gemini
export const modelsData: ModelData[] = [
  {
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    provider: 'OpenAI',
    model: 'gpt-5.5-2025-01-25',
    isPopular: true,
    features: ['Advanced Reasoning', 'Vision', 'Function Calling', 'JSON Mode', 'Extended Context'],
    pricing: {
      inputPrice: 15,
      outputPrice: 60,
      contextWindow: 256000,
    },
    benchmark: {
      mmlu: 92.5,
      humaneval: 95.8,
      math: 87.3,
      mgsm: 89.2,
    },
    capability: {
      vision: 'full',
      audio: 'none',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'partial',
      codeExecution: 'limited',
      toolUse: 'full',
      retrieval: 'full',
      contextArchival: 'limited',
      guardrails: 'full',
      customWeights: 'none',
      fineTuning: 'none',
      embedding: 'partial',
    },
  },
  {
    id: 'deepseek-v4',
    name: 'DeepSeek V4',
    provider: 'DeepSeek',
    model: 'deepseek-v4-2025-02-10',
    isPopular: true,
    features: ['Cost Efficient', 'Multilingual', 'Code Generation', 'Reasoning', 'Open Source'],
    pricing: {
      inputPrice: 0.27,
      outputPrice: 1.1,
      contextWindow: 64000,
    },
    benchmark: {
      mmlu: 88.3,
      humaneval: 90.1,
      math: 78.5,
      mgsm: 82.7,
    },
    capability: {
      vision: 'none',
      audio: 'none',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'none',
      codeExecution: 'full',
      toolUse: 'partial',
      retrieval: 'partial',
      contextArchival: 'partial',
      guardrails: 'partial',
      customWeights: 'full',
      fineTuning: 'full',
      embedding: 'full',
    },
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    provider: 'Anthropic',
    model: 'claude-code-2025-03-15',
    isPopular: true,
    features: ['Code Generation', 'CLI Integration', 'Git Operations', 'File Editing', 'Extended Thinking'],
    pricing: {
      inputPrice: 18,
      outputPrice: 90,
      contextWindow: 200000,
    },
    benchmark: {
      mmlu: 89.7,
      humaneval: 92.4,
      math: 72.8,
      mgsm: 85.1,
    },
    capability: {
      vision: 'full',
      audio: 'none',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'partial',
      codeExecution: 'full',
      toolUse: 'full',
      retrieval: 'full',
      contextArchival: 'full',
      guardrails: 'full',
      customWeights: 'none',
      fineTuning: 'none',
      embedding: 'none',
    },
  },
  {
    id: 'gemini-2-ultra',
    name: 'Gemini 2.0 Ultra',
    provider: 'Google',
    model: 'gemini-2.0-ultra-2025-01-20',
    isPopular: true,
    features: ['1M Context', 'Native Multimodal', 'Audio Processing', 'Advanced Reasoning', 'Google Integration'],
    pricing: {
      inputPrice: 7,
      outputPrice: 21,
      contextWindow: 1000000,
    },
    benchmark: {
      mmlu: 91.8,
      humaneval: 93.2,
      math: 84.6,
      mgsm: 88.9,
    },
    capability: {
      vision: 'full',
      audio: 'full',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'full',
      codeExecution: 'limited',
      toolUse: 'full',
      retrieval: 'full',
      contextArchival: 'full',
      guardrails: 'partial',
      customWeights: 'none',
      fineTuning: 'limited',
      embedding: 'partial',
    },
  },
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    model: 'claude-3.7-sonnet-20250224',
    isPopular: false,
    features: ['Extended Thinking', 'Vision', 'Tool Use', 'Long Context'],
    pricing: {
      inputPrice: 3,
      outputPrice: 15,
      contextWindow: 200000,
    },
    benchmark: {
      mmlu: 88.2,
      humaneval: 85.6,
      math: 68.4,
      mgsm: 80.2,
    },
    capability: {
      vision: 'full',
      audio: 'none',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'partial',
      codeExecution: 'none',
      toolUse: 'full',
      retrieval: 'partial',
      contextArchival: 'full',
      guardrails: 'full',
      customWeights: 'none',
      fineTuning: 'none',
      embedding: 'none',
    },
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    model: 'gemini-2.0-flash-2025-01-20',
    isPopular: false,
    features: ['Fast', '1M Context', 'Cost Efficient', 'Multimodal'],
    pricing: {
      inputPrice: 0.4,
      outputPrice: 0.8,
      contextWindow: 1000000,
    },
    benchmark: {
      mmlu: 86.5,
      humaneval: 82.1,
      math: 62.3,
      mgsm: 76.8,
    },
    capability: {
      vision: 'full',
      audio: 'full',
      functionCalling: 'full',
      jsonMode: 'full',
      streaming: 'full',
      systemPrompt: 'full',
      multiModal: 'full',
      codeExecution: 'limited',
      toolUse: 'full',
      retrieval: 'full',
      contextArchival: 'full',
      guardrails: 'partial',
      customWeights: 'none',
      fineTuning: 'limited',
      embedding: 'partial',
    },
  },
];

// Helper functions for data access
export function getModelById(id: string): ModelData | undefined {
  return modelsData.find((model) => model.id === id);
}

export function getModelsByProvider(provider: string): ModelData[] {
  return modelsData.filter((model) => model.provider.toLowerCase() === provider.toLowerCase());
}

export function getPopularModels(): ModelData[] {
  return modelsData.filter((model) => model.isPopular);
}

export function getLowestInputPrice(): ModelData | undefined {
  return modelsData.reduce((lowest, model) =>
    model.pricing.inputPrice < lowest.pricing.inputPrice ? model : lowest
  );
}

export function getLowestOutputPrice(): ModelData | undefined {
  return modelsData.reduce((lowest, model) =>
    model.pricing.outputPrice < lowest.pricing.outputPrice ? model : lowest
  );
}

export function getHighestBenchmark(benchmark: keyof BenchmarkData): ModelData | undefined {
  return modelsData.reduce((highest, model) =>
    model.benchmark[benchmark] > highest.benchmark[benchmark] ? model : highest
  );
}

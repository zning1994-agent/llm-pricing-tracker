// LLM Model Data for Pricing Tracker
import type { Model } from '../types';

// Model data for GPT-5.5, DeepSeek V4, Claude Code, and Gemini
export const models: Model[] = [
  {
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    provider: 'OpenAI',
    description: 'Advanced reasoning model with vision and extended context support',
    releaseDate: '2025-01-25',
    pricing: {
      inputPerMillion: 15,
      outputPerMillion: 60,
    },
    benchmarks: {
      mmlu: 92.5,
      humanEval: 95.8,
      math: 87.3,
      mgsm: 89.2,
    },
    capabilities: {
      contextLength: 256000,
      multimodal: true,
      toolUse: true,
      vision: true,
      streaming: true,
    },
  },
  {
    id: 'deepseek-v4',
    name: 'DeepSeek V4',
    provider: 'DeepSeek',
    description: 'Cost-efficient multilingual model with strong code generation',
    releaseDate: '2025-02-10',
    pricing: {
      inputPerMillion: 0.27,
      outputPerMillion: 1.1,
    },
    benchmarks: {
      mmlu: 88.3,
      humanEval: 90.1,
      math: 78.5,
      mgsm: 82.7,
    },
    capabilities: {
      contextLength: 64000,
      multimodal: false,
      toolUse: true,
      vision: false,
      streaming: true,
    },
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    provider: 'Anthropic',
    description: 'Specialized for code generation with CLI and git operations',
    releaseDate: '2025-03-15',
    pricing: {
      inputPerMillion: 18,
      outputPerMillion: 90,
    },
    benchmarks: {
      mmlu: 89.7,
      humanEval: 92.4,
      math: 72.8,
      mgsm: 85.1,
    },
    capabilities: {
      contextLength: 200000,
      multimodal: true,
      toolUse: true,
      vision: true,
      streaming: true,
    },
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    provider: 'Google',
    description: '1M context window with native multimodal and audio processing',
    releaseDate: '2025-01-20',
    pricing: {
      inputPerMillion: 7,
      outputPerMillion: 21,
    },
    benchmarks: {
      mmlu: 91.8,
      humanEval: 93.2,
      math: 84.6,
      mgsm: 88.9,
    },
    capabilities: {
      contextLength: 1000000,
      multimodal: true,
      toolUse: true,
      vision: true,
      streaming: true,
    },
  },
];

// Timestamp for when data was last updated
export const lastUpdated: Date = new Date();

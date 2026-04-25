import React, { useState, useMemo } from 'react';
import './CapabilityMatrix.css';

export type CapabilityLevel = 'full' | 'partial' | 'limited' | 'none' | boolean;

export interface ModelCapability {
  modelId: string;
  modelName: string;
  provider: string;
  vision?: CapabilityLevel;
  audio?: CapabilityLevel;
  functionCalling?: CapabilityLevel;
  jsonMode?: CapabilityLevel;
  streaming?: CapabilityLevel;
  systemPrompt?: CapabilityLevel;
  multiModal?: CapabilityLevel;
  codeExecution?: CapabilityLevel;
  toolUse?: CapabilityLevel;
  retrieval?: CapabilityLevel;
  contextArchival?: CapabilityLevel;
  guardrails?: CapabilityLevel;
  customWeights?: CapabilityLevel;
  fineTuning?: CapabilityLevel;
  embedding?: CapabilityLevel;
}

export interface CapabilityCategory {
  id: string;
  name: string;
  capabilities: string[];
}

export interface CapabilityMatrixProps {
  models: ModelCapability[];
  categories?: CapabilityCategory[];
  title?: string;
  subtitle?: string;
  showProvider?: boolean;
  compactView?: boolean;
  onModelClick?: (model: ModelCapability) => void;
  highlightCounts?: boolean;
}

const DEFAULT_CATEGORIES: CapabilityCategory[] = [
  {
    id: 'multimodal',
    name: 'Multimodal',
    capabilities: ['vision', 'audio', 'multiModal'],
  },
  {
    id: 'advanced',
    name: 'Advanced Features',
    capabilities: ['functionCalling', 'jsonMode', 'codeExecution', 'toolUse'],
  },
  {
    id: 'context',
    name: 'Context & Memory',
    capabilities: ['streaming', 'systemPrompt', 'contextArchival', 'retrieval'],
  },
  {
    id: 'customization',
    name: 'Customization',
    capabilities: ['fineTuning', 'customWeights', 'embedding', 'guardrails'],
  },
];

const CAPABILITY_LABELS: Record<string, string> = {
  vision: 'Vision (Images)',
  audio: 'Audio Processing',
  functionCalling: 'Function Calling',
  jsonMode: 'JSON Mode',
  streaming: 'Streaming',
  systemPrompt: 'System Prompts',
  multiModal: 'Multimodal Input',
  codeExecution: 'Code Execution',
  toolUse: 'Tool Use',
  retrieval: 'Retrieval/RAG',
  contextArchival: 'Context Archival',
  guardrails: 'Content Guardrails',
  customWeights: 'Custom Weights',
  fineTuning: 'Fine-tuning',
  embedding: 'Embeddings',
};

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10a341',
  Anthropic: '#ef4444',
  Google: '#3b82f6',
  Mistral: '#8b5cf6',
  Meta: '#007bff',
  AWS: '#ff9900',
  Azure: '#0078d4',
};

export const CapabilityMatrix: React.FC<CapabilityMatrixProps> = ({
  models,
  categories = DEFAULT_CATEGORIES,
  title = 'LLM Capability Comparison',
  subtitle = 'Compare features and capabilities across different LLM providers',
  showProvider = true,
  compactView = false,
  onModelClick,
  highlightCounts = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const allCapabilities = useMemo(() => {
    if (selectedCategory === 'all') {
      return categories.flatMap((c) => c.capabilities);
    }
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.capabilities : [];
  }, [selectedCategory, categories]);

  const modelCapabilities = useMemo(() => {
    return models.map((model) => {
      const fullCount = allCapabilities.filter(
        (cap) => model[cap as keyof ModelCapability] === 'full' || model[cap as keyof ModelCapability] === true
      ).length;
      const partialCount = allCapabilities.filter(
        (cap) => model[cap as keyof ModelCapability] === 'partial'
      ).length;
      return {
        ...model,
        fullCount,
        partialCount,
        totalCount: allCapabilities.length,
      };
    });
  }, [models, allCapabilities]);

  const sortedModels = useMemo(() => {
    return [...modelCapabilities].sort((a, b) => b.fullCount - a.fullCount);
  }, [modelCapabilities]);

  const getCapabilityClass = (level: CapabilityLevel): string => {
    if (level === true || level === 'full') return 'capability-full';
    if (level === 'partial') return 'capability-partial';
    if (level === 'limited') return 'capability-limited';
    return 'capability-none';
  };

  const getCapabilityIcon = (level: CapabilityLevel): string => {
    if (level === true || level === 'full') return '✓';
    if (level === 'partial') return '◐';
    if (level === 'limited') return '◑';
    return '✕';
  };

  const getCapabilityLabel = (level: CapabilityLevel): string => {
    if (level === true || level === 'full') return 'Full Support';
    if (level === 'partial') return 'Partial Support';
    if (level === 'limited') return 'Limited Support';
    return 'Not Supported';
  };

  const CapabilityCell: React.FC<{ level: CapabilityLevel }> = ({ level }) => (
    <td className={`capability-cell ${getCapabilityClass(level)}`}>
      <span className="capability-icon" title={getCapabilityLabel(level)}>
        {getCapabilityIcon(level)}
      </span>
      {!compactView && <span className="capability-text">{getCapabilityLabel(level)}</span>}
    </td>
  );

  return (
    <div className="capability-matrix-container">
      <div className="capability-matrix-header">
        <div className="header-text">
          <h2 className="capability-matrix-title">{title}</h2>
          <p className="capability-matrix-subtitle">{subtitle}</p>
        </div>

        <div className="category-filters">
          <button
            className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Features
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="capability-matrix-wrapper">
        <table className="capability-matrix">
          <thead>
            <tr>
              <th className={`model-header ${compactView ? 'compact' : ''}`}>
                Model {showProvider && '/ Provider'}
              </th>
              {allCapabilities.map((cap) => (
                <th key={cap} className={`capability-header ${compactView ? 'compact' : ''}`}>
                  {CAPABILITY_LABELS[cap] || cap}
                </th>
              ))}
              {highlightCounts && (
                <th className="count-header">Score</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model) => (
              <tr
                key={model.modelId}
                className={`model-row ${hoveredModel === model.modelId ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredModel(model.modelId)}
                onMouseLeave={() => setHoveredModel(null)}
                onClick={() => onModelClick?.(model)}
                style={{ cursor: onModelClick ? 'pointer' : 'default' }}
              >
                <td className="model-cell">
                  <div className="model-info">
                    <span className="model-name">{model.modelName}</span>
                    {showProvider && (
                      <span
                        className="model-provider"
                        style={{ color: PROVIDER_COLORS[model.provider] }}
                      >
                        {model.provider}
                      </span>
                    )}
                  </div>
                </td>
                {allCapabilities.map((cap) => (
                  <CapabilityCell
                    key={cap}
                    level={model[cap as keyof ModelCapability] as CapabilityLevel}
                  />
                ))}
                {highlightCounts && (
                  <td className="score-cell">
                    <div className="score-bar-container">
                      <div className="score-bar">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${(model.fullCount / model.totalCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="score-text">
                        {model.fullCount}/{model.totalCount}
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="capability-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon capability-full">✓</span>
            <span className="legend-label">Full Support</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon capability-partial">◐</span>
            <span className="legend-label">Partial Support</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon capability-limited">◑</span>
            <span className="legend-label">Limited Support</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon capability-none">✕</span>
            <span className="legend-label">Not Supported</span>
          </div>
        </div>
      </div>

      {!compactView && (
        <div className="category-description">
          {selectedCategory !== 'all' && (
            <div className="category-info">
              <h4>{categories.find((c) => c.id === selectedCategory)?.name}</h4>
              <p>
                {selectedCategory === 'multimodal' &&
                  'Multimodal capabilities allow models to process and generate multiple types of data beyond text, including images, audio, and video.'}
                {selectedCategory === 'advanced' &&
                  'Advanced features enable sophisticated interactions including function calling, structured output, code execution, and tool integration.'}
                {selectedCategory === 'context' &&
                  'Context and memory features determine how models handle conversation history, streaming responses, and long-term context.'}
                {selectedCategory === 'customization' &&
                  'Customization options allow developers to fine-tune models for specific use cases or deploy custom model weights.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapabilityMatrix;

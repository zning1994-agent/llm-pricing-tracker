import React from 'react';
import { CapabilityMatrix, ModelCapability, CapabilityCategory } from '../CapabilityMatrix';

// Sample data
const sampleModels: ModelCapability[] = [
  {
    modelId: 'gpt-4-turbo',
    modelName: 'GPT-4 Turbo',
    provider: 'OpenAI',
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
  {
    modelId: 'claude-3-opus',
    modelName: 'Claude 3 Opus',
    provider: 'Anthropic',
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
  {
    modelId: 'gemini-1.5-pro',
    modelName: 'Gemini 1.5 Pro',
    provider: 'Google',
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
];

// Example 1: Full Featured
export const FullFeaturedExample: React.FC = () => {
  const handleModelClick = (model: ModelCapability) => {
    console.log('Clicked model:', model);
  };

  return (
    <CapabilityMatrix
      models={sampleModels}
      title="LLM Capability Comparison"
      subtitle="Compare features across different LLM providers"
      showProvider={true}
      compactView={false}
      highlightCounts={true}
      onModelClick={handleModelClick}
    />
  );
};

// Example 2: Compact View
export const CompactExample: React.FC = () => {
  return (
    <CapabilityMatrix
      models={sampleModels}
      title="Quick Capability Overview"
      subtitle="Compact feature comparison"
      showProvider={true}
      compactView={true}
      highlightCounts={true}
    />
  );
};

// Example 3: Without Provider
export const NoProviderExample: React.FC = () => {
  return (
    <CapabilityMatrix
      models={sampleModels}
      title="Model Capabilities"
      subtitle="Feature comparison without provider info"
      showProvider={false}
      highlightCounts={false}
    />
  );
};

// Example 4: Custom Categories
export const CustomCategoriesExample: React.FC = () => {
  const customCategories: CapabilityCategory[] = [
    {
      id: 'vision',
      name: 'Vision & Audio',
      capabilities: ['vision', 'audio', 'multiModal'],
    },
    {
      id: 'developer',
      name: 'Developer Features',
      capabilities: ['functionCalling', 'jsonMode', 'codeExecution', 'toolUse', 'retrieval'],
    },
  ];

  return (
    <CapabilityMatrix
      models={sampleModels}
      categories={customCategories}
      title="Developer-Focused Comparison"
      subtitle="Compare developer-relevant features"
      highlightCounts={true}
    />
  );
};

// Example App
const CapabilityMatrixExamples: React.FC = () => {
  const handleModelClick = (model: ModelCapability) => {
    const supportedFeatures = Object.entries(model)
      .filter(([key, value]) =>
        !['modelId', 'modelName', 'provider'].includes(key) &&
        (value === 'full' || value === true)
      )
      .map(([key]) => key);

    alert(`${model.modelName} (${model.provider})\n\nSupported Features:\n${supportedFeatures.join(', ')}`);
  };

  return (
    <div className="examples-container">
      <h1>CapabilityMatrix Component Examples</h1>

      <section className="example-section">
        <h2>Full Featured Matrix</h2>
        <FullFeaturedExample />
      </section>

      <section className="example-section">
        <h2>Compact View</h2>
        <CompactExample />
      </section>

      <section className="example-section">
        <h2>Without Provider</h2>
        <NoProviderExample />
      </section>

      <section className="example-section">
        <h2>Custom Categories</h2>
        <CustomCategoriesExample />
      </section>
    </div>
  );
};

export default CapabilityMatrixExamples;

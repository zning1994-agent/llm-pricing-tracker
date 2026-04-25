import React from 'react';
import { PricingTable, PricingPlan } from '../PricingTable';

// Example LLM pricing data
const examplePlans: PricingPlan[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    model: 'gpt-4-turbo-2024-04-09',
    inputPrice: 10,
    outputPrice: 30,
    contextWindow: 128000,
    features: ['Vision', 'JSON Mode', 'Function Calling'],
    isPopular: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    model: 'gpt-3.5-turbo-0125',
    inputPrice: 0.5,
    outputPrice: 1.5,
    contextWindow: 16385,
    features: ['Fast', 'Cost-effective'],
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    model: 'claude-3-opus-20240229',
    inputPrice: 15,
    outputPrice: 75,
    contextWindow: 200000,
    features: ['Vision', 'Extended Thinking', 'Tool Use'],
    isPopular: true,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    model: 'claude-3-sonnet-20240229',
    inputPrice: 3,
    outputPrice: 15,
    contextWindow: 200000,
    features: ['Vision', 'Tool Use'],
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    model: 'claude-3-haiku-20240307',
    inputPrice: 0.25,
    outputPrice: 1.25,
    contextWindow: 200000,
    features: ['Fast', 'Cost-effective'],
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    model: 'gemini-1.5-pro-preview-0514',
    inputPrice: 3.5,
    outputPrice: 10.5,
    contextWindow: 1000000,
    features: ['1M Context', 'Vision', 'Audio'],
    isPopular: true,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    model: 'gemini-1.5-flash-preview-0514',
    inputPrice: 0.35,
    outputPrice: 0.53,
    contextWindow: 1000000,
    features: ['1M Context', 'Fast'],
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    model: 'mistral-large-2407',
    inputPrice: 4,
    outputPrice: 12,
    contextWindow: 128000,
    features: ['Multilingual', 'Function Calling'],
    isPopular: true,
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral',
    model: 'mistral-small-2409',
    inputPrice: 0.2,
    outputPrice: 0.6,
    contextWindow: 128000,
    features: ['Fast', 'Cost-effective'],
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    model: 'llama-3-70b-instruct',
    inputPrice: 0.65,
    outputPrice: 2.75,
    contextWindow: 8192,
    features: ['Open Source', 'Large Context'],
  },
];

// Example App Component
export const ExampleApp: React.FC = () => {
  const handleSelectPlan = (plan: PricingPlan) => {
    console.log('Selected plan:', plan);
    // Navigate to plan details or show modal
  };

  return (
    <div className="example-container">
      <PricingTable
        plans={examplePlans}
        onSelectPlan={handleSelectPlan}
        showContextWindow={true}
        showFeatures={true}
        highlightLowest="both"
        title="LLM Token Pricing Comparison"
        subtitle="Compare pricing across different LLM providers"
      />
    </div>
  );
};

// Usage Examples

// Example 1: Basic Usage
export const BasicExample: React.FC = () => {
  return (
    <PricingTable
      plans={examplePlans}
      title="Basic Pricing Table"
    />
  );
};

// Example 2: With Custom Selection Handler
export const WithSelectionExample: React.FC = () => {
  const handleSelect = (plan: PricingPlan) => {
    alert(`Selected: ${plan.name} by ${plan.provider}`);
  };

  return (
    <PricingTable
      plans={examplePlans}
      onSelectPlan={handleSelect}
      highlightLowest="input"
      title="Select Your Model"
      subtitle="Click on a row to select"
    />
  );
};

// Example 3: Without Context Window
export const CompactExample: React.FC = () => {
  return (
    <PricingTable
      plans={examplePlans}
      showContextWindow={false}
      showFeatures={false}
      highlightLowest="output"
      title="Compact Pricing View"
      subtitle="Simple comparison without extra details"
    />
  );
};

// Example 4: Features Only
export const FeaturesExample: React.FC = () => {
  return (
    <PricingTable
      plans={examplePlans}
      showContextWindow={true}
      showFeatures={true}
      highlightLowest={null}
      title="Full Feature Comparison"
      subtitle="All details including features"
    />
  );
};

// Export all examples
export default ExampleApp;

import React from 'react';
import { BenchmarkChart, BenchmarkScore, BenchmarkType } from '../BenchmarkChart';

// Sample benchmark data
const sampleBenchmarks: BenchmarkScore[] = [
  {
    modelId: 'gpt-4-turbo',
    modelName: 'GPT-4 Turbo',
    provider: 'OpenAI',
    mmlu: 86.4,
    humaneval: 90.2,
    math: 73.4,
    mgsm: 79.8,
  },
  {
    modelId: 'claude-3-opus',
    modelName: 'Claude 3 Opus',
    provider: 'Anthropic',
    mmlu: 88.7,
    humaneval: 84.0,
    math: 60.1,
    mgsm: 83.6,
  },
  {
    modelId: 'claude-3-sonnet',
    modelName: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    mmlu: 79.0,
    humaneval: 73.0,
    math: 52.3,
    mgsm: 72.6,
  },
  {
    modelId: 'gemini-1.5-pro',
    modelName: 'Gemini 1.5 Pro',
    provider: 'Google',
    mmlu: 85.9,
    humaneval: 84.6,
    math: 58.5,
    mgsm: 79.4,
  },
  {
    modelId: 'gemini-1.5-flash',
    modelName: 'Gemini 1.5 Flash',
    provider: 'Google',
    mmlu: 85.0,
    humaneval: 79.5,
    math: 52.1,
    mgsm: 74.8,
  },
  {
    modelId: 'mistral-large',
    modelName: 'Mistral Large',
    provider: 'Mistral',
    mmlu: 81.2,
    humaneval: 81.0,
    math: 51.2,
    mgsm: 68.4,
  },
  {
    modelId: 'llama-3-70b',
    modelName: 'Llama 3 70B',
    provider: 'Meta',
    mmlu: 82.0,
    humaneval: 81.7,
    math: 51.8,
    mgsm: 69.5,
  },
];

// Example 1: Full Featured
export const FullFeaturedExample: React.FC = () => {
  const handleModelClick = (model: BenchmarkScore) => {
    console.log('Clicked model:', model);
    // Navigate to model details
  };

  return (
    <BenchmarkChart
      data={sampleBenchmarks}
      benchmarks={['MMLU', 'HumanEval', 'MATH', 'MGSM']}
      title="LLM Benchmark Performance"
      subtitle="Comprehensive comparison across major AI benchmarks"
      showLegend={true}
      showGrid={true}
      showReferenceLine={true}
      referenceValue={75}
      referenceLabel="75% Target"
      highlightBest={true}
      highlightWorst={true}
      onModelClick={handleModelClick}
      height={450}
    />
  );
};

// Example 2: MMLU Only
export const MMLUOnlyExample: React.FC = () => {
  return (
    <BenchmarkChart
      data={sampleBenchmarks}
      benchmarks={['MMLU']}
      title="MMLU Performance"
      subtitle="Massive Multitask Language Understanding scores"
      showLegend={false}
      highlightBest={true}
      height={350}
    />
  );
};

// Example 3: Coding Focus (HumanEval)
export const CodingFocusExample: React.FC = () => {
  return (
    <BenchmarkChart
      data={sampleBenchmarks}
      benchmarks={['HumanEval']}
      title="Code Generation Performance"
      subtitle="HumanEval benchmark - programming capabilities"
      highlightBest={true}
      highlightWorst={true}
      height={350}
    />
  );
};

// Example 4: Math Focus (MATH + MGSM)
export const MathFocusExample: React.FC = () => {
  return (
    <BenchmarkChart
      data={sampleBenchmarks}
      benchmarks={['MATH', 'MGSM']}
      title="Mathematical Reasoning"
      subtitle="MATH and MGSM benchmark comparison"
      showReferenceLine={true}
      referenceValue={70}
      referenceLabel="70%"
      highlightBest={true}
      height={400}
    />
  );
};

// Example 5: Compact View
export const CompactExample: React.FC = () => {
  return (
    <BenchmarkChart
      data={sampleBenchmarks}
      title="Benchmark Overview"
      subtitle="Quick comparison"
      showLegend={false}
      showGrid={false}
      highlightBest={true}
      highlightWorst={false}
      height={300}
    />
  );
};

// Example 6: Vertical Layout
export const VerticalLayoutExample: React.FC = () => {
  return (
    <BenchmarkChart
      data={sampleBenchmarks.slice(0, 5)}
      benchmarks={['MMLU', 'HumanEval']}
      title="Performance Comparison (Vertical)"
      subtitle="Side-by-side vertical bar chart"
      layout="vertical"
      showLegend={true}
      highlightBest={true}
      height={350}
    />
  );
};

// Example App Component
const BenchmarkChartExamples: React.FC = () => {
  const handleModelClick = (model: BenchmarkScore) => {
    alert(`Selected: ${model.modelName} by ${model.provider}\n\nScores:\n- MMLU: ${model.mmlu}%\n- HumanEval: ${model.humaneval}%\n- MATH: ${model.math}%\n- MGSM: ${model.mgsm}%`);
  };

  return (
    <div className="examples-container">
      <h1>BenchmarkChart Component Examples</h1>
      
      <section className="example-section">
        <h2>Full Featured Chart</h2>
        <FullFeaturedExample />
      </section>

      <section className="example-section">
        <h2>MMLU Focus</h2>
        <MMLUOnlyExample />
      </section>

      <section className="example-section">
        <h2>Coding Capabilities</h2>
        <CodingFocusExample />
      </section>

      <section className="example-section">
        <h2>Mathematical Reasoning</h2>
        <MathFocusExample />
      </section>
    </div>
  );
};

export default BenchmarkChartExamples;

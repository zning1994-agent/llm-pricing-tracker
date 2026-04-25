import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import './BenchmarkChart.css';

// Benchmark Types
export type BenchmarkType = 'MMLU' | 'HumanEval' | 'MATH' | 'MGSM';

export interface BenchmarkScore {
  modelId: string;
  modelName: string;
  provider: string;
  mmlu?: number; // Massive Multitask Language Understanding (0-100)
  humaneval?: number; // HumanEval coding benchmark (0-100)
  math?: number; // MATH problem solving (0-100)
  mgsm?: number; // Multilingual Grade School Math (0-100)
  overall?: number; // Computed overall score
}

export interface BenchmarkChartProps {
  data: BenchmarkScore[];
  benchmarks?: BenchmarkType[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showReferenceLine?: boolean;
  referenceValue?: number;
  referenceLabel?: string;
  highlightBest?: boolean;
  highlightWorst?: boolean;
  onModelClick?: (model: BenchmarkScore) => void;
  maxValue?: number;
  height?: number | string;
  layout?: 'horizontal' | 'vertical';
}

const BENCHMARK_COLORS: Record<BenchmarkType, string> = {
  MMLU: '#3b82f6', // Blue
  HumanEval: '#10b981', // Green
  MATH: '#f59e0b', // Amber
  MGSM: '#8b5cf6', // Purple
};

const BENCHMARK_LABELS: Record<BenchmarkType, string> = {
  MMLU: 'MMLU',
  HumanEval: 'HumanEval',
  MATH: 'MATH',
  MGSM: 'MGSM',
};

const DEFAULT_DATA: BenchmarkScore[] = [
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

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10a341',
  Anthropic: '#ef4444',
  Google: '#3b82f6',
  Mistral: '#8b5cf6',
  Meta: '#007bff',
};

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  data,
  benchmarks = ['MMLU', 'HumanEval', 'MATH', 'MGSM'],
  title = 'LLM Benchmark Performance',
  subtitle = 'Comparison across MMLU, HumanEval, MATH, and MGSM benchmarks',
  showLegend = true,
  showGrid = true,
  showReferenceLine = false,
  referenceValue = 75,
  referenceLabel = 'Reference',
  highlightBest = true,
  highlightWorst = false,
  onModelClick,
  maxValue = 100,
  height = 400,
  layout = 'horizontal',
}) => {
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<BenchmarkType[]>(benchmarks);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const processedData = useMemo(() => {
    return data.map((item) => {
      const benchmarkScores = selectedBenchmarks
        .map((b) => item[b.toLowerCase() as keyof BenchmarkScore] as number)
        .filter((s) => typeof s === 'number');
      
      const avg = benchmarkScores.length > 0
        ? benchmarkScores.reduce((a, b) => a + b, 0) / benchmarkScores.length
        : 0;

      return {
        ...item,
        overall: Math.round(avg * 10) / 10,
        displayName: `${item.modelName} (${item.provider})`,
      };
    });
  }, [data, selectedBenchmarks]);

  const sortedByOverall = useMemo(() => {
    return [...processedData].sort((a, b) => (b.overall || 0) - (a.overall || 0));
  }, [processedData]);

  const bestModel = sortedByOverall[0];
  const worstModel = sortedByOverall[sortedByOverall.length - 1];

  const toggleBenchmark = (benchmark: BenchmarkType) => {
    setSelectedBenchmarks((prev) =>
      prev.includes(benchmark)
        ? prev.filter((b) => b !== benchmark)
        : [...prev, benchmark]
    );
  };

  const handleBarClick = (data: BenchmarkScore) => {
    onModelClick?.(data);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const modelData = data.find((d) => d.modelName === label || d.modelId === label);
    
    return (
      <div className="benchmark-tooltip">
        <div className="tooltip-header">
          <span className="tooltip-model-name">{label}</span>
          {modelData?.provider && (
            <span
              className="tooltip-provider"
              style={{ color: PROVIDER_COLORS[modelData.provider] }}
            >
              {modelData.provider}
            </span>
          )}
        </div>
        <div className="tooltip-scores">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="tooltip-score">
              <span
                className="tooltip-dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="tooltip-label">{entry.name}:</span>
              <span className="tooltip-value">{entry.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        {modelData && selectedBenchmarks.length > 1 && (
          <div className="tooltip-overall">
            <span>Average:</span>
            <span className="overall-value">
              {processedData.find((p) => p.modelId === modelData.modelId)?.overall}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={typeof height === 'number' ? height : 400}>
      <BarChart
        data={processedData}
        layout={layout}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
        
        {layout === 'horizontal' ? (
          <>
            <XAxis
              dataKey="modelName"
              tick={{ fill: '#475569', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              domain={[0, maxValue]}
              tick={{ fill: '#475569', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              domain={[0, maxValue]}
              tick={{ fill: '#475569', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="modelName"
              tick={{ fill: '#475569', fontSize: 12 }}
              width={120}
            />
          </>
        )}

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />

        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <span style={{ color: '#475569', fontSize: 12 }}>{value}</span>
            )}
          />
        )}

        {showReferenceLine && (
          <ReferenceLine
            x={layout === 'horizontal' ? undefined : referenceValue}
            y={layout === 'horizontal' ? referenceValue : undefined}
            stroke="#94a3b8"
            strokeDasharray="5 5"
            label={{
              value: referenceLabel,
              position: 'insideTopRight',
              fill: '#94a3b8',
              fontSize: 12,
            }}
          />
        )}

        {selectedBenchmarks.map((benchmark) => (
          <Bar
            key={benchmark}
            dataKey={benchmark.toLowerCase()}
            name={BENCHMARK_LABELS[benchmark]}
            fill={BENCHMARK_COLORS[benchmark]}
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            style={{ cursor: onModelClick ? 'pointer' : 'default' }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="benchmark-chart-container">
      <div className="benchmark-chart-header">
        <div className="header-text">
          <h2 className="benchmark-chart-title">{title}</h2>
          <p className="benchmark-chart-subtitle">{subtitle}</p>
        </div>

        <div className="benchmark-filters">
          {(['MMLU', 'HumanEval', 'MATH', 'MGSM'] as BenchmarkType[]).map((benchmark) => (
            <button
              key={benchmark}
              className={`filter-chip ${selectedBenchmarks.includes(benchmark) ? 'active' : ''}`}
              onClick={() => toggleBenchmark(benchmark)}
              style={{
                '--chip-color': BENCHMARK_COLORS[benchmark],
              } as React.CSSProperties}
            >
              <span
                className="chip-dot"
                style={{ backgroundColor: BENCHMARK_COLORS[benchmark] }}
              />
              {benchmark}
            </button>
          ))}
        </div>
      </div>

      <div className="benchmark-chart-wrapper">
        {selectedBenchmarks.length > 0 ? (
          renderBarChart()
        ) : (
          <div className="no-benchmarks-selected">
            <p>Please select at least one benchmark to display.</p>
          </div>
        )}
      </div>

      {(highlightBest || highlightWorst) && (
        <div className="benchmark-summary">
          {highlightBest && bestModel && (
            <div className="summary-card best">
              <span className="summary-label">Best Overall</span>
              <span className="summary-model">{bestModel.modelName}</span>
              <span className="summary-score">{bestModel.overall}%</span>
              <span
                className="summary-provider"
                style={{ color: PROVIDER_COLORS[bestModel.provider] }}
              >
                {bestModel.provider}
              </span>
            </div>
          )}
          {highlightWorst && worstModel && (
            <div className="summary-card worst">
              <span className="summary-label">Needs Improvement</span>
              <span className="summary-model">{worstModel.modelName}</span>
              <span className="summary-score">{worstModel.overall}%</span>
              <span
                className="summary-provider"
                style={{ color: PROVIDER_COLORS[worstModel.provider] }}
              >
                {worstModel.provider}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="benchmark-table">
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              {selectedBenchmarks.map((b) => (
                <th key={b}>{b}</th>
              ))}
              {selectedBenchmarks.length > 1 && <th>Average</th>}
            </tr>
          </thead>
          <tbody>
            {sortedByOverall.map((model) => (
              <tr
                key={model.modelId}
                className={`${hoveredModel === model.modelId ? 'hovered' : ''} ${
                  highlightBest && model === bestModel ? 'best-row' : ''
                } ${highlightWorst && model === worstModel ? 'worst-row' : ''}`}
                onMouseEnter={() => setHoveredModel(model.modelId)}
                onMouseLeave={() => setHoveredModel(null)}
                onClick={() => onModelClick?.(model)}
              >
                <td className="model-name-cell">{model.modelName}</td>
                <td>
                  <span
                    className="provider-badge"
                    style={{
                      color: PROVIDER_COLORS[model.provider],
                      backgroundColor: `${PROVIDER_COLORS[model.provider]}15`,
                    }}
                  >
                    {model.provider}
                  </span>
                </td>
                {selectedBenchmarks.map((b) => (
                  <td key={b} className="score-cell">
                    <span
                      className={`score-value ${
                        model[b.toLowerCase() as keyof BenchmarkScore] as number >= 80
                          ? 'high'
                          : (model[b.toLowerCase() as keyof BenchmarkScore] as number) >= 60
                          ? 'medium'
                          : 'low'
                      }`}
                    >
                      {model[b.toLowerCase() as keyof BenchmarkScore] !== undefined
                        ? `${(model[b.toLowerCase() as keyof BenchmarkScore] as number).toFixed(1)}%`
                        : '-'}
                    </span>
                  </td>
                ))}
                {selectedBenchmarks.length > 1 && (
                  <td className="score-cell average">
                    <span className="average-value">{model.overall}%</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="benchmark-legend-grid">
        <h4>Benchmark Descriptions</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: BENCHMARK_COLORS.MMLU }} />
            <div className="legend-text">
              <strong>MMLU</strong> - Massive Multitask Language Understanding. Tests knowledge
              across 57 subjects at difficulty levels from elementary to professional.
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: BENCHMARK_COLORS.HumanEval }} />
            <div className="legend-text">
              <strong>HumanEval</strong> - Code generation benchmark with 164 Python programming
              problems testing reasoning and code completion.
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: BENCHMARK_COLORS.MATH }} />
            <div className="legend-text">
              <strong>MATH</strong> - Mathematical problem solving benchmark with 12,500 problems
              from competition math at multiple difficulty levels.
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: BENCHMARK_COLORS.MGSM }} />
            <div className="legend-text">
              <strong>MGSM</strong> - Multilingual Grade School Math. Tests mathematical reasoning
              across 10 languages including English, Chinese, and others.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkChart;

// Re-export types
export type { BenchmarkType, BenchmarkScore, BenchmarkChartProps } from './BenchmarkChart';

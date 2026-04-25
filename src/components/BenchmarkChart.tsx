import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { models } from '../data/models';
import type { Model } from '../../types';

// Props interface
export interface BenchmarkChartProps {
  data?: Model[];
  onSelectModel?: (model: Model) => void;
  title?: string;
}

// Benchmark colors using Tailwind palette
const BENCHMARK_COLORS = {
  mmlu: '#3b82f6',     // blue-500
  humanEval: '#10b981', // green-500
  math: '#f59e0b',      // amber-500
  mgsm: '#8b5cf6',      // purple-500
};

const BENCHMARK_LABELS = {
  mmlu: 'MMLU',
  humanEval: 'HumanEval',
  math: 'MATH',
  mgsm: 'MGSM',
};

// Transform data for Recharts
const transformData = (data: Model[]) => {
  return data.map((model) => ({
    name: model.name,
    fullName: `${model.name} (${model.provider})`,
    id: model.id,
    MMLU: model.benchmarks.mmlu,
    HumanEval: model.benchmarks.humanEval,
    MATH: model.benchmarks.math,
    MGSM: model.benchmarks.mgsm,
  }));
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  data = models,
  onSelectModel,
  title = 'Benchmark Comparison',
}) => {
  const chartData = transformData(data);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>

      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={(data) => {
              if (data && data.activePayload && onSelectModel) {
                const modelId = data.activePayload[0]?.payload?.id;
                const model = data.find((m) => m.id === modelId);
                if (model) onSelectModel(model);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            <Bar
              dataKey="MMLU"
              name={BENCHMARK_LABELS.mmlu}
              fill={BENCHMARK_COLORS.mmlu}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
            <Bar
              dataKey="HumanEval"
              name={BENCHMARK_LABELS.humanEval}
              fill={BENCHMARK_COLORS.humanEval}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
            <Bar
              dataKey="MATH"
              name={BENCHMARK_LABELS.math}
              fill={BENCHMARK_COLORS.math}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
            <Bar
              dataKey="MGSM"
              name={BENCHMARK_LABELS.mgsm}
              fill={BENCHMARK_COLORS.mgsm}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Benchmark descriptions */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BENCHMARK_COLORS.mmlu }} />
          <span>MMLU: Knowledge</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BENCHMARK_COLORS.humanEval }} />
          <span>HumanEval: Code</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BENCHMARK_COLORS.math }} />
          <span>MATH: Math</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BENCHMARK_COLORS.mgsm }} />
          <span>MGSM: Multilingual</span>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkChart;

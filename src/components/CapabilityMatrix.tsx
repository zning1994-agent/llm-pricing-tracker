import React from 'react';
import { models } from '../data/models';
import type { Model } from '../../types';

// Props interface
export interface CapabilityMatrixProps {
  data?: Model[];
  onSelectModel?: (model: Model) => void;
  title?: string;
}

// Feature definitions
interface FeatureRow {
  key: keyof Model['capabilities'];
  label: string;
  format?: 'boolean' | 'number';
}

const FEATURES: FeatureRow[] = [
  { key: 'contextLength', label: 'Context Length', format: 'number' },
  { key: 'multimodal', label: 'Multimodal', format: 'boolean' },
  { key: 'toolUse', label: 'Tool Use', format: 'boolean' },
  { key: 'vision', label: 'Vision', format: 'boolean' },
  { key: 'streaming', label: 'Streaming', format: 'boolean' },
];

export const CapabilityMatrix: React.FC<CapabilityMatrixProps> = ({
  data = models,
  onSelectModel,
  title = 'Capability Comparison',
}) => {
  const formatValue = (feature: FeatureRow, value: boolean | number) => {
    if (feature.format === 'number') {
      const num = value as number;
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}M`;
      }
      return `${(num / 1000).toFixed(0)}K`;
    }

    const bool = value as boolean;
    return bool ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-sm">
        ✓
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-400 font-bold text-sm">
        ✗
      </span>
    );
  };

  const getCellClass = (feature: FeatureRow, value: boolean | number) => {
    if (feature.format === 'number') {
      return 'font-mono font-semibold text-blue-600';
    }
    return 'text-center';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>

      {/* Mobile-first card layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.map((model) => (
          <div
            key={model.id}
            onClick={() => onSelectModel?.(model)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="mb-3 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{model.name}</h3>
              <p className="text-xs text-gray-500">{model.provider}</p>
            </div>

            <div className="space-y-2">
              {FEATURES.map((feature) => (
                <div key={feature.key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{feature.label}</span>
                  <span className={getCellClass(feature, model.capabilities[feature.key])}>
                    {formatValue(feature, model.capabilities[feature.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Feature</th>
              {data.map((model) => (
                <th key={model.id} className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  {model.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature) => (
              <tr key={feature.key} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-700">{feature.label}</td>
                {data.map((model) => (
                  <td key={model.id} className={`py-3 px-4 text-center ${getCellClass(feature, model.capabilities[feature.key])}`}>
                    {formatValue(feature, model.capabilities[feature.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-600 font-bold text-xs">✓</span>
          Supported
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-400 font-bold text-xs">✗</span>
          Not Supported
        </span>
      </div>
    </div>
  );
};

export default CapabilityMatrix;

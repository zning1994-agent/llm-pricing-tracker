import React, { useState, useMemo } from 'react';
import { models } from '../../data/models';
import type { Model } from '../types';

// Props interface for the component
export interface PricingTableProps {
  data?: Model[];
  onSelectModel?: (model: Model) => void;
  showContextWindow?: boolean;
  title?: string;
}

// Sort types
type SortKey = 'inputPrice' | 'outputPrice' | 'name';
type SortDirection = 'asc' | 'desc';

// Provider colors
const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: 'bg-green-100 text-green-800',
  Anthropic: 'bg-red-100 text-red-800',
  Google: 'bg-blue-100 text-blue-800',
  DeepSeek: 'bg-purple-100 text-purple-800',
};

export const PricingTable: React.FC<PricingTableProps> = ({
  data = models,
  onSelectModel,
  showContextWindow = true,
  title = 'LLM Pricing Comparison',
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('inputPrice');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case 'inputPrice':
          aVal = a.pricing.inputPerMillion;
          bVal = b.pricing.inputPerMillion;
          break;
        case 'outputPrice':
          aVal = a.pricing.outputPerMillion;
          bVal = b.pricing.outputPerMillion;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  const formatContextLength = (tokens: number): string => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(0)}M`;
    }
    return `${(tokens / 1000).toFixed(0)}K`;
  };

  const getLowestPrice = (key: 'inputPrice' | 'outputPrice') => {
    return Math.min(...data.map((m) => 
      key === 'inputPrice' ? m.pricing.inputPerMillion : m.pricing.outputPerMillion
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      
      {/* Table wrapper with horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full min-w-[600px] md:min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  Model
                  {sortKey === 'name' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700 hidden md:table-cell">
                Provider
              </th>
              <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('inputPrice')}
                  className="flex items-center gap-1 ml-auto hover:text-blue-600"
                >
                  Input $/1M
                  {sortKey === 'inputPrice' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('outputPrice')}
                  className="flex items-center gap-1 ml-auto hover:text-blue-600"
                >
                  Output $/1M
                  {sortKey === 'outputPrice' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              {showContextWindow && (
                <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700 hidden lg:table-cell">
                  Context
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((model) => {
              const isLowestInput = model.pricing.inputPerMillion === getLowestPrice('inputPrice');
              const isLowestOutput = model.pricing.outputPerMillion === getLowestPrice('outputPrice');

              return (
                <tr
                  key={model.id}
                  onClick={() => onSelectModel?.(model)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-2 md:px-4">
                    <div className="font-semibold text-gray-900">{model.name}</div>
                    <div className="text-xs text-gray-500 md:hidden">{model.provider}</div>
                  </td>
                  <td className="py-3 px-2 md:px-4 hidden md:table-cell">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      PROVIDER_COLORS[model.provider] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {model.provider}
                    </span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-right">
                    <span className={`font-mono font-medium ${
                      isLowestInput ? 'text-green-600 font-bold' : 'text-gray-900'
                    }`}>
                      {formatPrice(model.pricing.inputPerMillion)}
                      {isLowestInput && (
                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Lowest
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-right">
                    <span className={`font-mono font-medium ${
                      isLowestOutput ? 'text-green-600 font-bold' : 'text-gray-900'
                    }`}>
                      {formatPrice(model.pricing.outputPerMillion)}
                      {isLowestOutput && (
                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Lowest
                        </span>
                      )}
                    </span>
                  </td>
                  {showContextWindow && (
                    <td className="py-3 px-2 md:px-4 text-right text-gray-600 hidden lg:table-cell">
                      <span className="font-mono">{formatContextLength(model.capabilities.contextLength)}</span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4 px-2 md:px-0">
        * Prices per million tokens. Scroll horizontally on mobile to see all columns.
      </p>
    </div>
  );
};

export default PricingTable;

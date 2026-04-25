import React, { useState, useMemo } from 'react';
import './PricingTable.css';

export interface PricingPlan {
  id: string;
  name: string;
  provider: string;
  model: string;
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: number; // in tokens
  features?: string[];
  isPopular?: boolean;
  currency?: string;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  onSelectPlan?: (plan: PricingPlan) => void;
  showContextWindow?: boolean;
  showFeatures?: boolean;
  showTotalCost?: boolean;
  highlightLowest?: 'input' | 'output' | 'total' | 'both' | null;
  title?: string;
  subtitle?: string;
}

type SortKey = 'inputPrice' | 'outputPrice' | 'contextWindow' | 'name';
type SortDirection = 'asc' | 'desc';

const defaultPlans: PricingPlan[] = [
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
];

export const PricingTable: React.FC<PricingTableProps> = ({
  plans,
  onSelectPlan,
  showContextWindow = true,
  showFeatures = true,
  showTotalCost = true,
  highlightLowest = 'both',
  title = 'LLM Token Pricing Comparison',
  subtitle = 'Compare pricing across different LLM providers',
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('inputPrice');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  type SortKey = 'inputPrice' | 'outputPrice' | 'contextWindow' | 'name' | 'totalCost';

  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(plans.map((p) => p.provider))];
    return ['all', ...uniqueProviders];
  }, [plans]);

  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    // Filter by provider
    if (filterProvider !== 'all') {
      result = result.filter((p) => p.provider === filterProvider);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.provider.toLowerCase().includes(query) ||
          p.model.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case 'inputPrice':
          aVal = a.inputPrice;
          bVal = b.inputPrice;
          break;
        case 'outputPrice':
          aVal = a.outputPrice;
          bVal = b.outputPrice;
          break;
        case 'contextWindow':
          aVal = a.contextWindow;
          bVal = b.contextWindow;
          break;
        case 'totalCost':
          // Calculate total cost assuming 50% input, 50% output tokens
          aVal = (a.inputPrice + a.outputPrice) / 2;
          bVal = (b.inputPrice + b.outputPrice) / 2;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [plans, filterProvider, searchQuery, sortKey, sortDirection]);

  const lowestPrices = useMemo(() => {
    if (!highlightLowest) return { input: null, output: null };

    const inputMin = Math.min(...plans.map((p) => p.inputPrice));
    const outputMin = Math.min(...plans.map((p) => p.outputPrice));

    return { input: inputMin, output: outputMin };
  }, [plans, highlightLowest]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price / 1000000); // Price per 1M tokens
  };

  const formatContextWindow = (tokens: number): string => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toLocaleString()}M`;
    }
    return `${(tokens / 1000).toLocaleString()}K`;
  };

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`sort-icon ${active ? 'active' : ''}`}>
      {active && direction === 'desc' ? '↓' : '↑'}
    </span>
  );

  return (
    <div className="pricing-table-container">
      <div className="pricing-table-header">
        <div className="header-text">
          <h2 className="pricing-table-title">{title}</h2>
          <p className="pricing-table-subtitle">{subtitle}</p>
        </div>

        <div className="pricing-table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdown">
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="provider-select"
            >
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider === 'all' ? 'All Providers' : provider}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pricing-table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr>
              <th className="sticky-col">
                <button
                  className={`sort-button ${sortKey === 'name' ? 'active' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  Model <SortIcon active={sortKey === 'name'} direction={sortDirection} />
                </button>
              </th>
              <th>Provider</th>
              <th>
                <button
                  className={`sort-button ${sortKey === 'inputPrice' ? 'active' : ''}`}
                  onClick={() => handleSort('inputPrice')}
                >
                  Input / 1M tokens{' '}
                  <SortIcon active={sortKey === 'inputPrice'} direction={sortDirection} />
                </button>
              </th>
              <th>
                <button
                  className={`sort-button ${sortKey === 'outputPrice' ? 'active' : ''}`}
                  onClick={() => handleSort('outputPrice')}
                >
                  Output / 1M tokens{' '}
                  <SortIcon active={sortKey === 'outputPrice'} direction={sortDirection} />
                </button>
              </th>
              {showTotalCost && (
                <th>
                  <button
                    className={`sort-button ${sortKey === 'totalCost' ? 'active' : ''}`}
                    onClick={() => handleSort('totalCost')}
                  >
                    Total Cost / 1M{' '}
                    <SortIcon active={sortKey === 'totalCost'} direction={sortDirection} />
                  </button>
                </th>
              )}
              {showContextWindow && (
                <th>
                  <button
                    className={`sort-button ${sortKey === 'contextWindow' ? 'active' : ''}`}
                    onClick={() => handleSort('contextWindow')}
                  >
                    Context Window{' '}
                    <SortIcon active={sortKey === 'contextWindow'} direction={sortDirection} />
                  </button>
                </th>
              )}
              {showFeatures && <th>Features</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPlans.map((plan) => {
              const isInputLowest =
                highlightLowest &&
                (highlightLowest === 'input' || highlightLowest === 'both') &&
                plan.inputPrice === lowestPrices.input;

              const isOutputLowest =
                highlightLowest &&
                (highlightLowest === 'output' || highlightLowest === 'both') &&
                plan.outputPrice === lowestPrices.output;

              return (
                <tr
                  key={plan.id}
                  className={`${plan.isPopular ? 'popular' : ''} ${
                    isInputLowest || isOutputLowest ? 'lowest-price' : ''
                  }`}
                  onClick={() => onSelectPlan?.(plan)}
                >
                  <td className="sticky-col">
                    <div className="model-info">
                      <span className="model-name">{plan.name}</span>
                      <span className="model-id">{plan.model}</span>
                      {plan.isPopular && <span className="popular-badge">Popular</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`provider-badge provider-${plan.provider.toLowerCase()}`}>
                      {plan.provider}
                    </span>
                  </td>
                  <td>
                    <span className={`price-value ${isInputLowest ? 'lowest' : ''}`}>
                      {formatPrice(plan.inputPrice * 1000000, plan.currency)}
                    </span>
                  </td>
                  <td>
                    <span className={`price-value ${isOutputLowest ? 'lowest' : ''}`}>
                      {formatPrice(plan.outputPrice * 1000000, plan.currency)}
                    </span>
                  </td>
                  {showTotalCost && (
                    <td>
                      <span className="price-value total-cost">
                        {formatPrice(((plan.inputPrice + plan.outputPrice) / 2) * 1000000, plan.currency)}
                      </span>
                    </td>
                  )}
                  {showContextWindow && (
                    <td>
                      <span className="context-window">{formatContextWindow(plan.contextWindow)}</span>
                    </td>
                  )}
                  {showFeatures && (
                    <td>
                      <div className="features-list">
                        {plan.features?.map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedPlans.length === 0 && (
        <div className="no-results">
          <p>No pricing plans match your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterProvider('all');
            }}
            className="reset-button"
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className="pricing-table-footer">
        <p className="disclaimer">
          * Prices are indicative and may vary. Please check the official provider documentation
          for the most accurate and up-to-date pricing information.
        </p>
      </div>
    </div>
  );
};

export default PricingTable;

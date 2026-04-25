import React, { useState, useCallback } from 'react';

export interface HeaderProps {
  onDataRefresh?: () => Promise<void>;
  lastRefreshed?: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onDataRefresh, lastRefreshed }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const formatLastRefreshed = () => {
    if (!lastRefreshed) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefreshed.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastRefreshed.toLocaleTimeString();
  };

  const handleRefresh = useCallback(async () => {
    if (!onDataRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    setRefreshStatus('idle');
    
    try {
      await onDataRefresh();
      setRefreshStatus('success');
      setTimeout(() => setRefreshStatus('idle'), 2000);
    } catch {
      setRefreshStatus('error');
      setTimeout(() => setRefreshStatus('idle'), 2000);
    } finally {
      setIsRefreshing(false);
    }
  }, [onDataRefresh, isRefreshing]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                LLM Pricing Tracker
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Compare models, benchmarks & capabilities
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Last Updated Indicator */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatLastRefreshed()}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || !onDataRefresh}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 ease-in-out
                ${isRefreshing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : refreshStatus === 'success'
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : refreshStatus === 'error'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              `}
              aria-label="Refresh data"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {refreshStatus === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : refreshStatus === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                )}
              </svg>
              <span>
                {isRefreshing ? 'Refreshing...' : 
                 refreshStatus === 'success' ? 'Updated!' : 
                 refreshStatus === 'error' ? 'Failed' : 
                 'Refresh'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

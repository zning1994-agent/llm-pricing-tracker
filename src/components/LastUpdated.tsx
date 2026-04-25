import React, { useState, useEffect } from 'react';

export interface LastUpdatedProps {
  lastUpdated: Date | null;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  refreshInterval?: number; // Auto-refresh interval in seconds
  onRefresh?: () => void;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({
  lastUpdated,
  showIcon = true,
  size = 'md',
  refreshInterval,
  onRefresh,
}) => {
  const [relativeTime, setRelativeTime] = useState<string>('');

  const formatRelativeTime = (date: Date | null): string => {
    if (!date) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 5) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatAbsoluteTime = (date: Date | null): string => {
    if (!date) return 'No data';
    return date.toLocaleString();
  };

  useEffect(() => {
    setRelativeTime(formatRelativeTime(lastUpdated));
    
    if (!lastUpdated) return;

    // Update relative time every second
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(lastUpdated));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Auto-refresh timer
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0 || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, onRefresh]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getFreshnessColor = (): string => {
    if (!lastUpdated) return 'text-gray-400';
    
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / 1000 / 60;
    
    if (diffMinutes < 5) return 'text-green-600';
    if (diffMinutes < 30) return 'text-blue-600';
    if (diffMinutes < 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getFreshnessDot = (): string => {
    if (!lastUpdated) return 'bg-gray-400';
    
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / 1000 / 60;
    
    if (diffMinutes < 5) return 'bg-green-500';
    if (diffMinutes < 30) return 'bg-blue-500';
    if (diffMinutes < 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className={`
        inline-flex items-center gap-2 font-medium
        ${sizeClasses[size]} 
        ${getFreshnessColor()}
      `}
      title={formatAbsoluteTime(lastUpdated)}
    >
      {showIcon && (
        <>
          {/* Freshness dot indicator */}
          <span 
            className={`
              inline-block w-2 h-2 rounded-full
              ${getFreshnessDot()}
              ${lastUpdated ? 'animate-pulse' : ''}
            `}
          />
          
          {/* Clock icon */}
          <svg 
            className={iconSizes[size]} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </>
      )}

      <span>
        {relativeTime}
      </span>
    </div>
  );
};

export default LastUpdated;

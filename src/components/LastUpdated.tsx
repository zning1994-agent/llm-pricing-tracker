import React, { useState, useEffect } from 'react';

export interface LastUpdatedProps {
  lastUpdated: Date | null;
  showIcon?: boolean;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({
  lastUpdated,
  showIcon = true,
}) => {
  const [relativeTime, setRelativeTime] = useState<string>('');

  const formatRelativeTime = (date: Date | null): string => {
    if (!date) return 'Never updated';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  useEffect(() => {
    setRelativeTime(formatRelativeTime(lastUpdated));
    
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(lastUpdated));
    }, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const getFreshnessColor = (): string => {
    if (!lastUpdated) return 'text-gray-400';
    
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / 1000 / 60;
    
    if (diffMinutes < 5) return 'text-green-600';
    if (diffMinutes < 30) return 'text-blue-600';
    if (diffMinutes < 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 text-sm ${getFreshnessColor()}`}
      title={lastUpdated ? lastUpdated.toLocaleString() : 'No data'}
    >
      {showIcon && (
        <svg 
          className="w-4 h-4" 
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
      )}
      <span>{relativeTime}</span>
    </div>
  );
};

export { LastUpdated };
export default LastUpdated;

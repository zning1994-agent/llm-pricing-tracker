import React from 'react';

export interface RefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  label = 'Refresh',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled || isLoading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-500'
        }
      `}
      aria-label={label}
    >
      <svg
        className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>{isLoading ? 'Refreshing...' : label}</span>
    </button>
  );
};

export { RefreshButton };
export default RefreshButton;

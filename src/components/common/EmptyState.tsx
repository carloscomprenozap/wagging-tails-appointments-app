
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400"
        >
          <path
            d="M8.5 9C8.5 7.61929 9.61929 6.5 11 6.5H13C14.3807 6.5 15.5 7.61929 15.5 9C15.5 10.3807 14.3807 11.5 13 11.5H11C9.61929 11.5 8.5 10.3807 8.5 9Z"
            stroke="currentColor"
          />
          <path
            d="M8.5 15C8.5 13.6193 9.61929 12.5 11 12.5H13C14.3807 12.5 15.5 13.6193 15.5 15C15.5 16.3807 14.3807 17.5 13 17.5H11C9.61929 17.5 8.5 16.3807 8.5 15Z"
            stroke="currentColor"
          />
          <path d="M15.5 9H17C18.3807 9 19.5 10.1193 19.5 11.5V15C19.5 16.3807 18.3807 17.5 17 17.5H15.5" stroke="currentColor" />
          <path d="M8.5 9H7C5.61929 9 4.5 10.1193 4.5 11.5V15C4.5 16.3807 5.61929 17.5 7 17.5H8.5" stroke="currentColor" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;

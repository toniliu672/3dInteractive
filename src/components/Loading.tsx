import React from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-center text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
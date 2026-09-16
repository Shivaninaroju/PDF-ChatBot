import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin border-t-cyan-500"></div>
        
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-700 rounded-full animate-spin border-t-violet-500 animate-reverse-spin"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      
      <p className="text-gray-300 mt-4 text-center">{message}</p>
      
      {/* Progress dots */}
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
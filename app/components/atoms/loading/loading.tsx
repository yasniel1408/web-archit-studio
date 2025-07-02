"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <motion.svg
      className={clsx(sizeClasses[size as keyof typeof sizeClasses], colorClasses[color as keyof typeof colorClasses])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );
};

const LoadingDots: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white',
    gray: 'bg-gray-400',
  };

  const dotClass = clsx(
    sizeClasses[size as keyof typeof sizeClasses],
    colorClasses[color as keyof typeof colorClasses],
    'rounded-full'
  );

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={dotClass}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const LoadingPulse: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'bg-primary/20 ring-primary/30',
    secondary: 'bg-secondary/20 ring-secondary/30',
    white: 'bg-white/20 ring-white/30',
    gray: 'bg-gray-400/20 ring-gray-400/30',
  };

  return (
    <motion.div
      className={clsx(
        sizeClasses[size as keyof typeof sizeClasses],
        colorClasses[color as keyof typeof colorClasses],
        'rounded-full'
      )}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="w-full h-full rounded-full ring-2 ring-opacity-30"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [1, 0, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

const LoadingSkeleton: React.FC<{ size: string }> = ({ size }) => {
  const heights = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
    xl: 'h-40',
  };

  return (
    <div className="animate-pulse space-y-3">
      <div className={clsx('bg-gray-200 rounded-lg', heights[size as keyof typeof heights])} />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  className,
}) => {
  const renderLoadingComponent = () => {
    switch (variant) {
      case 'dots':
        return <LoadingDots size={size} color={color} />;
      case 'pulse':
        return <LoadingPulse size={size} color={color} />;
      case 'skeleton':
        return <LoadingSkeleton size={size} />;
      default:
        return <LoadingSpinner size={size} color={color} />;
    }
  };

  const content = (
    <div className={clsx('flex flex-col items-center justify-center space-y-3', className)}>
      {renderLoadingComponent()}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={clsx(
            'text-sm font-medium',
            color === 'white' ? 'text-white' : 'text-gray-600'
          )}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center',
          overlay ? 'bg-black/50 backdrop-blur-sm' : 'bg-background'
        )}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Hook para estado de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
}; 
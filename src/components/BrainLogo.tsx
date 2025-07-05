import React from 'react';
import { useApp } from '../contexts/AppContext';

interface BrainLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function BrainLogo({ size = 'md', animated = true }: BrainLogoProps) {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative ${animated ? 'animate-pulse' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          filter: isDark ? 'drop-shadow(0 0 8px #10b981)' : 'drop-shadow(0 0 4px #059669)'
        }}
      >
        {/* Brain outline */}
        <path
          d="M30 25 C20 25, 15 35, 20 45 C15 50, 18 60, 25 65 C20 70, 25 80, 35 80 L65 80 C75 80, 80 70, 75 65 C82 60, 85 50, 80 45 C85 35, 80 25, 70 25 C65 20, 55 20, 50 25 C45 20, 35 20, 30 25 Z"
          fill={isDark ? '#ffffff' : '#000000'}
          className="transition-all duration-300"
        />
        
        {/* Brain folds/details */}
        <path
          d="M35 35 Q45 30, 55 35 Q65 40, 70 50"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          className={animated ? 'animate-pulse' : ''}
        />
        <path
          d="M25 50 Q35 45, 45 50 Q55 55, 65 50"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDelay: '0.5s' }}
        />
        <path
          d="M30 65 Q40 60, 50 65 Q60 70, 70 65"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDelay: '1s' }}
        />
        
        {/* Neural connections */}
        <circle
          cx="40"
          cy="40"
          r="2"
          fill="#10b981"
          className={animated ? 'animate-ping' : ''}
        />
        <circle
          cx="60"
          cy="45"
          r="2"
          fill="#10b981"
          className={animated ? 'animate-ping' : ''}
          style={{ animationDelay: '0.3s' }}
        />
        <circle
          cx="45"
          cy="60"
          r="2"
          fill="#10b981"
          className={animated ? 'animate-ping' : ''}
          style={{ animationDelay: '0.6s' }}
        />
      </svg>
    </div>
  );
}
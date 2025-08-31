'use client';

import React, { forwardRef } from 'react';
import { LoadingSpinner } from '@/components/icons/LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  className = '',
  children,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'vyap-button-base';
  const variantClasses = `vyap-button-${variant}`;
  const sizeClasses = `vyap-button-${size}`;
  const stateClasses = loading || disabled ? 'vyap-button-disabled' : '';

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="vyap-button-content">
        {loading ? (
          <LoadingSpinner size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        ) : leftIcon ? (
          <span className="vyap-button-icon-left">{leftIcon}</span>
        ) : null}
        
        <span className="vyap-button-text">
          {loading && loadingText ? loadingText : children}
        </span>
        
        {!loading && rightIcon && (
          <span className="vyap-button-icon-right">{rightIcon}</span>
        )}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

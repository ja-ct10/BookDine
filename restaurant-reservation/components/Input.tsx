import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    // Base input styles - minimalist
    const baseStyles = 'block w-full px-4 py-2.5 border rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-0 bg-white';
    
    // Conditional styles based on error state
    const conditionalStyles = hasError
      ? 'border-terracotta-400 text-charcoal-800 placeholder-terracotta-300 focus:ring-terracotta-400 focus:border-terracotta-400'
      : 'border-stone-200 text-charcoal-800 placeholder-stone-400 focus:ring-clay-400 focus:border-clay-400 hover:border-stone-300';

    const combinedClassName = `${baseStyles} ${conditionalStyles} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-terracotta-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-stone-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

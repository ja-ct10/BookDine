import React from 'react';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'table';
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  count = 1,
  className = '',
}) => {
  const baseStyles = 'bg-stone-100 animate-pulse';

  const variantStyles = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-md',
    table: 'rounded-md',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${width} ${height} ${className}`;

  if (variant === 'table') {
    return (
      <div className="w-full space-y-3">
        {/* Table Header */}
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${baseStyles} rounded h-8 flex-1`}></div>
          ))}
        </div>
        {/* Table Rows */}
        {[...Array(count)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {[...Array(5)].map((_, colIndex) => (
              <div key={colIndex} className={`${baseStyles} rounded h-12 flex-1`}></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={combinedClassName}></div>
      ))}
    </>
  );
};

export default SkeletonLoader;

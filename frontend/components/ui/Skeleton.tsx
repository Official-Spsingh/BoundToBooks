
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseStyles = "bg-book-50 animate-pulse transition-all duration-700";
  
  const variants = {
    text: "h-3 w-full rounded-sm",
    rectangular: "h-full w-full rounded-xl",
    circular: "h-full w-full rounded-full"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;

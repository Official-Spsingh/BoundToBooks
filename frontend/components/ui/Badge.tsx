
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const baseStyles = "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all";
  
  const variants = {
    primary: "bg-book-50 text-book-600",
    secondary: "bg-orange-50 text-orange-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
    outline: "border border-book-100 text-book-400 bg-white"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

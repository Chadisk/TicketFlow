import React from 'react';

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', theme = 'light', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full border border-transparent font-medium tracking-tight transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';
    
    const variants = theme === 'dark'
      ? {
          default: 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/15 hover:-translate-y-0.5 hover:bg-amber-300',
          secondary: 'bg-stone-900 text-stone-200 ring-1 ring-stone-700 hover:-translate-y-0.5 hover:bg-stone-800',
          danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/15 hover:-translate-y-0.5 hover:bg-rose-400',
          ghost: 'text-stone-200 hover:bg-stone-800',
        }
      : {
          default: 'bg-stone-900 text-white shadow-lg shadow-stone-900/10 hover:-translate-y-0.5 hover:bg-stone-800',
          secondary: 'bg-white text-stone-700 ring-1 ring-stone-200 hover:-translate-y-0.5 hover:bg-stone-50',
          danger: 'bg-rose-600 text-white shadow-lg shadow-rose-600/10 hover:-translate-y-0.5 hover:bg-rose-500',
          ghost: 'text-stone-700 hover:bg-stone-100',
        };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

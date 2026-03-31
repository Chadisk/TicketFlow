import React from 'react';

export const Input = React.forwardRef(({ className = '', theme = 'light', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-[0_1px_1px_rgba(15,23,42,0.03)] outline-none transition-all placeholder:text-stone-400 disabled:cursor-not-allowed ${theme === 'dark' ? 'border-stone-700/80 bg-gradient-to-b from-stone-900/60 via-stone-900/55 to-stone-950/58 text-stone-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/10 disabled:bg-stone-800' : 'border-stone-200/60 bg-gradient-to-b from-white/96 via-white/92 to-stone-50/80 text-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/6 disabled:bg-stone-100'} ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ className = '', theme = 'light', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-[0_1px_1px_rgba(15,23,42,0.03)] outline-none transition-all placeholder:text-stone-400 disabled:cursor-not-allowed ${theme === 'dark' ? 'border-stone-700/80 bg-gradient-to-b from-stone-900/60 via-stone-900/55 to-stone-950/58 text-stone-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/10 disabled:bg-stone-800' : 'border-stone-200/60 bg-gradient-to-b from-white/96 via-white/92 to-stone-50/80 text-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/6 disabled:bg-stone-100'} ${className}`}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ className = '', theme = 'light', ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-none outline-none transition-all disabled:cursor-not-allowed ${theme === 'dark' ? 'border-stone-700/60 bg-gradient-to-b from-stone-900/52 via-stone-900/48 to-stone-950/52 text-stone-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/8 disabled:bg-stone-800' : 'border-stone-200/50 bg-gradient-to-b from-white/94 via-white/90 to-stone-50/76 text-stone-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/5 disabled:bg-stone-100'} ${className}`}
    {...props}
  />
));

Select.displayName = 'Select';

export const Label = ({ htmlFor, className = '', theme = 'light', ...props }) => (
  <label htmlFor={htmlFor} className={`mb-2 block text-sm font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-stone-700'} ${className}`} {...props} />
);

Label.displayName = 'Label';

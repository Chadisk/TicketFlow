import React from 'react';

export const Card = React.forwardRef(({ className = '', theme, ...props }, ref) => (
  <div
    ref={ref}
    className={`ticketflow-card rounded-3xl border border-white/70 bg-white/88 shadow-[0_10px_40px_rgba(92,64,51,0.07)] backdrop-blur-xl ${className}`}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`ticketflow-card-header border-b border-stone-200/70 px-6 py-4 ${className}`} {...props} />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h2 ref={ref} className={`ticketflow-card-title text-lg font-semibold tracking-tight text-stone-900 ${className}`} {...props} />
));

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`ticketflow-card-content px-6 py-5 ${className}`} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`ticketflow-card-footer border-t border-stone-200/70 px-6 py-4 flex justify-end gap-3 ${className}`} {...props} />
));

CardFooter.displayName = 'CardFooter';

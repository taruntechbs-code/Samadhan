import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'low' | 'hero';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'standard',
  className = '',
  children,
  ...props
}) => {
  let cardClass = 'card-surface';
  if (variant === 'low') cardClass = 'card-surface-low';
  if (variant === 'hero') cardClass = 'card-hero';

  return (
    <div className={`${cardClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'fab';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}) => {
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  );
};

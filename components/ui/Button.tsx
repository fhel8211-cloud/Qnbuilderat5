import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-custom-light';
      break;
    case 'secondary':
      variantStyles = 'bg-secondary text-white hover:bg-secondary/90';
      break;
    case 'accent':
      variantStyles = 'bg-accent text-white hover:bg-accent/90';
      break;
    case 'outline':
      variantStyles = 'border border-primary text-primary hover:bg-primary/10';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className || ''} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-surface p-6 rounded-xl shadow-custom-dark ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

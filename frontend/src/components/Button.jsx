import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled, className = '' }) => {
  const base = 'font-body font-medium px-6 py-2.5 rounded-full transition-all duration-200 inline-flex items-center gap-2';
  const variants = {
    primary: 'bg-blush-500 hover:bg-blush-600 text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-blush-400 text-blush-600 hover:bg-blush-50',
    danger:  'bg-red-400 hover:bg-red-500 text-white',
    soft:    'bg-blush-100 hover:bg-blush-200 text-blush-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
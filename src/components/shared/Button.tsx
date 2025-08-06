import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  to?: string;
};

const getButtonStyle = (label: string) => {
  const lower = label.toLowerCase();

  if (lower.includes('add') || lower.includes('create') || lower.includes('new')) {
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  if (lower.includes('edit') || lower.includes('update')) {
    return 'bg-yellow-500 hover:bg-yellow-600 text-white';
  }

  if (lower.includes('delete') || lower.includes('remove')) {
    return 'bg-red-600 hover:bg-red-700 text-white';
  }

  return 'bg-gray-600 hover:bg-gray-700 text-white'; 
};

const Button: React.FC<ButtonProps> = ({ children, onClick, to, className = '' }) => {
  const label = typeof children === 'string' ? children : '';
  const dynamicStyle = getButtonStyle(label);

  if (to) {
    return (
      <a href={to} className={`px-4 py-2 rounded-lg font-medium shadow transition duration-200 ${dynamicStyle} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium shadow transition duration-200 ${dynamicStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

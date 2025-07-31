import React from 'react';

export interface AddButtonPropsType {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
const AddButton: React.FC<AddButtonPropsType> = ({
  onClick,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <button
      id="add-to-cart"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children || 'Add to Cart'}
    </button>
  );
};

export default AddButton;

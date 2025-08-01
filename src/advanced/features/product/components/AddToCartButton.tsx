import React from 'react';

interface AddToCartButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function AddToCartButton({ disabled, onClick }: AddToCartButtonProps) {
  return (
    <button
      id="add-to-cart"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
    >
      Add to Cart
    </button>
  );
}

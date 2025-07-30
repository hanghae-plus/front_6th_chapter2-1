import type { ComponentPropsWithoutRef } from 'react';

interface AddToCartButtonProps extends ComponentPropsWithoutRef<'button'> {}

export const AddToCartButton = ({ ...props }: AddToCartButtonProps) => {
  return (
    <button
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      {...props}
    >
      Add To Cart
    </button>
  );
};

export default AddToCartButton;

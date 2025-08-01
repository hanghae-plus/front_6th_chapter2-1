type AddToCartButtonProps = {
  onAddToCart: React.MouseEventHandler<HTMLButtonElement>;
};

export const AddToCartButton = ({ onAddToCart }: AddToCartButtonProps) => (
  <button
    id='add-to-cart'
    onClick={onAddToCart}
    className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
  >
    Add to Cart
  </button>
);

interface AddToCartButtonProps {
  onClick: () => void;
}

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <button
      id="add-to-cart"
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      onClick={onClick}
    >
      Add to Cart
    </button>
  );
}
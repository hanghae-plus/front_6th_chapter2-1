import { useAddToCart } from '../hooks/cart';

interface Props {
  productId: string;
}

export function AddToCartButton({ productId }: Props) {
  const handleAddToCart = useAddToCart({ productId });

  return (
    <button
      onClick={handleAddToCart}
      type="button"
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  );
}

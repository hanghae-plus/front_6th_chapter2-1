import { ReactElement } from 'react';

import { useCartStore } from '@/advanced/store/useCartStore';
import { useProductStore } from '@/advanced/store/useProductStore';

export default function AddButton(): ReactElement {
  const { selectedProduct } = useProductStore();
  const { addCartItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addCartItem(selectedProduct);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  );
}

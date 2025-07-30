import { ReactElement } from 'react';

import { useCartStore, useProductStore } from '@/advanced/store';

export default function AddButton(): ReactElement {
  const { selectedProductId, decreaseStock, products } = useProductStore();
  const { addCartItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const selectedProduct = products.find(product => product.id === selectedProductId);

    if (!selectedProduct) return;

    const canAddToCart = selectedProduct.stock > 0;

    if (!canAddToCart) return;

    addCartItem(selectedProduct);
    decreaseStock(selectedProduct.id);
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

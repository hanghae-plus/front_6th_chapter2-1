// hooks/useCartWithProduct.ts
import { useCartContext } from '@/store/CartContext';
import { useProductContext } from '@/store/ProductContext';

export const useCartWithProduct = () => {
  const { items, ...cart } = useCartContext();
  const { products } = useProductContext();

  const enrichedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  });

  return {
    items: enrichedItems,
    ...cart,
  };
};

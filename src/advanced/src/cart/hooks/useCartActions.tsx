import { Product } from 'types';
import { canAddToCart } from 'product/utils';

interface UseCartActionsProps {
  products: Product[];
  getProduct: (productId: string) => Product | null;
  updateStock: (productId: string, change: number) => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
}

// 장바구니 액션들을 관리하는 Hook
export function useCartActions({
  getProduct,
  updateStock,
  addItem,
  removeItem,
  updateItemQuantity,
  getItemQuantity,
}: UseCartActionsProps) {
  const addToCart = (productId: string) => {
    const product = getProduct(productId);

    if (!product) {
      alert('상품을 찾을 수 없습니다.');
      return;
    }

    if (!canAddToCart(product)) {
      alert('재고가 부족합니다.');
      return;
    }

    updateStock(productId, -1);
    addItem(productId, 1);
  };

  const handleRemove = (productId: string) => {
    const currentQuantity = getItemQuantity(productId);

    if (currentQuantity > 0) {
      updateStock(productId, currentQuantity);
      removeItem(productId);
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = getItemQuantity(productId);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }

    if (change > 0) {
      const product = getProduct(productId);
      if (!product) {
        alert('상품을 찾을 수 없습니다.');
        return;
      }

      if (!canAddToCart(product, change)) {
        alert('재고가 부족합니다.');
        return;
      }
    }

    updateStock(productId, -change);
    updateItemQuantity(productId, newQuantity);
  };

  return {
    addToCart,
    handleRemove,
    handleQuantityChange,
  };
}

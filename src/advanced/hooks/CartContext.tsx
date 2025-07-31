import { createContext, ReactNode, useContext, useState } from 'react';

import { useCart } from './useCart';
import { useDiscountTimers } from './useDiscountTimers';
import { useProducts } from './useProducts';

interface CartContextType {
  cartItems: ReturnType<typeof useCart>['cartItems'];
  addToCart: ReturnType<typeof useCart>['addToCart'];
  updateQuantity: ReturnType<typeof useCart>['updateQuantity'];
  removeFromCart: ReturnType<typeof useCart>['removeFromCart'];
  products: ReturnType<typeof useProducts>['products'];
  lastSelectedProductId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart();
  const productsHook = useProducts();
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);

  // 상품과 장바구니 아이템 찾기
  const findProductAndCartItem = (productId: string) => {
    const product = productsHook.products.find((p) => p.productId === productId);
    const cartItem = cartHook.cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;
    return { product, cartItem, currentQuantity };
  };

  // 재고 증가
  const handleStockIncrease = (productId: string, amount: number) => {
    productsHook.increaseStock(productId, amount);
  };

  // 재고 감소
  const handleStockDecrease = (productId: string, amount: number) => {
    productsHook.decreaseStock(productId, amount);
  };

  // 장바구니 추가
  const addToCart = (productId: string) => {
    const { product, currentQuantity } = findProductAndCartItem(productId);

    if (product && product.stock > currentQuantity) {
      cartHook.addToCart(productId);
      handleStockDecrease(productId, 1);
      setLastSelectedProductId(productId);
    }
  };

  // 장바구니 수량 변경
  const updateQuantity = (productId: string, newQuantity: number) => {
    const { product, currentQuantity } = findProductAndCartItem(productId);
    const quantityDiff = newQuantity - currentQuantity;

    if (newQuantity <= 0) {
      handleStockIncrease(productId, currentQuantity);
      cartHook.updateQuantity(productId, newQuantity);
      return;
    }

    if (quantityDiff > 0) {
      if (product && product.stock >= quantityDiff) {
        handleStockDecrease(productId, quantityDiff);
        cartHook.updateQuantity(productId, newQuantity);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      handleStockIncrease(productId, Math.abs(quantityDiff));
      cartHook.updateQuantity(productId, newQuantity);
    }
  };

  // 장바구니 제거
  const removeFromCart = (productId: string) => {
    const { cartItem } = findProductAndCartItem(productId);
    if (cartItem) {
      handleStockIncrease(productId, cartItem.quantity);
    }
    cartHook.removeFromCart(productId);
  };

  // 타이머 시작
  useDiscountTimers({
    products: productsHook.products,
    updateProductSaleStatus: productsHook.updateProductSaleStatus,
    updateProductRecommendStatus: productsHook.updateProductRecommendStatus,
    lastSelectedProductId,
  });

  return (
    <CartContext.Provider
      value={{
        cartItems: cartHook.cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        ...productsHook,
        lastSelectedProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}

import { useState, useCallback } from 'react';
import { Product, CartItem, initialProducts } from '../lib/product';

interface UseCartReturn {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setSelectedProduct: (productId: string | null) => void;
  getCartItemCount: () => number;
  getTotalAmount: () => number;
}

export const useCart = (): UseCartReturn => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      console.log('addToCart called with productId:', productId); // 디버깅용
      const product = products.find((p: Product) => p.id === productId);
      console.log('found product:', product); // 디버깅용
      
      if (!product) {
        console.log('Product not found'); // 디버깅용
        return;
      }
      
      if (product.stock === 0) {
        console.log('Product out of stock'); // 디버깅용
        return;
      }

      setCartItems((prevItems: CartItem[]) => {
        const existingItem = prevItems.find((item: CartItem) => item.product.id === productId);

        if (existingItem) {
          // 이미 있는 상품이면 수량 증가
          if (existingItem.quantity < product.stock) {
            return prevItems.map((item: CartItem) =>
              item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }
          return prevItems; // 재고 부족
        } else {
          // 새 상품 추가
          const newItem = {
            product,
            quantity: 1,
            appliedDiscounts: [],
          };
          console.log('Adding new item to cart:', newItem); // 디버깅용
          return [...prevItems, newItem];
        }
      });

      // 재고 감소
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p)),
      );
    },
    [products],
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems: CartItem[]) => {
      const itemToRemove = prevItems.find((item: CartItem) => item.product.id === productId);
      if (!itemToRemove) return prevItems;

      // 재고 복구
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) =>
          p.id === productId ? { ...p, stock: p.stock + itemToRemove.quantity } : p,
        ),
      );

      return prevItems.filter((item: CartItem) => item.product.id !== productId);
    });
  }, []);

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p: Product) => p.id === productId);
      if (!product) return;

      const currentItem = cartItems.find((item: CartItem) => item.product.id === productId);
      if (!currentItem) return;

      const quantityDiff = newQuantity - currentItem.quantity;
      const availableStock = product.stock + currentItem.quantity;

      if (newQuantity > availableStock) return; // 재고 초과

      setCartItems((prevItems: CartItem[]) =>
        prevItems.map((item: CartItem) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      // 재고 조정
      setProducts((prevProducts: Product[]) =>
        prevProducts.map((p: Product) => (p.id === productId ? { ...p, stock: p.stock - quantityDiff } : p)),
      );
    },
    [products, cartItems, removeFromCart],
  );

  // 선택된 상품 설정
  const setSelectedProduct = useCallback((productId: string | null) => {
    setSelectedProductId(productId);
  }, []);

  // 장바구니 아이템 개수
  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  }, [cartItems]);

  // 총 금액 계산 (할인 적용 전)
  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((total: number, item: CartItem) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }, [cartItems]);

  return {
    products,
    cartItems,
    selectedProductId,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedProduct,
    getCartItemCount,
    getTotalAmount,
  };
};

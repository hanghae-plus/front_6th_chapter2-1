import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import {
  calculateFinalDiscount,
  calculateIndividualDiscount,
  calculateTotalBulkDiscount,
  calculateTuesdayDiscount,
  Discount,
} from '../lib/discount';
import { CartItem, initialProducts, Product } from '../lib/product';

interface CartContextType {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string | null;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setSelectedProduct: (productId: string | null) => void;
  getCartItemCount: () => number;
  getTotalAmount: () => number;
  getDiscountedAmount: () => number;
  getAppliedDiscounts: () => Discount[];
  getDiscountBreakdown: () => {
    subtotal: number;
    individualDiscount: number;
    totalBulkDiscount: number;
    tuesdayDiscount: number;
    finalAmount: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (productId: string) => {
      const product = products.find((p: Product) => p.id === productId);

      if (!product) {
        return;
      }

      if (product.stock === 0) {
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
        prevProducts.map((p: Product) =>
          p.id === productId ? { ...p, stock: p.stock - quantityDiff } : p,
        ),
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

  // 할인 적용된 최종 금액 계산
  const getDiscountedAmount = useCallback(() => {
    const subtotal = getTotalAmount();
    const totalQuantity = getCartItemCount();

    // 개별 상품 할인 계산
    const individualDiscounts = cartItems.map((item: CartItem) =>
      calculateIndividualDiscount(item.product.price, item.quantity, item.product.discount),
    );

    const discountResult = calculateFinalDiscount(subtotal, totalQuantity, individualDiscounts);
    return discountResult.finalAmount;
  }, [cartItems, getTotalAmount, getCartItemCount]);

  // 적용된 할인 목록 (현재는 빈 배열, 추후 확장)
  const getAppliedDiscounts = useCallback(() => {
    return [] as Discount[];
  }, []);

  // 할인 세부 정보 제공
  const getDiscountBreakdown = useCallback(() => {
    const subtotal = getTotalAmount();
    const totalQuantity = getCartItemCount();

    // 개별 상품 할인 계산
    const individualDiscounts = cartItems.map((item: CartItem) =>
      calculateIndividualDiscount(item.product.price, item.quantity, item.product.discount),
    );
    const individualDiscount = individualDiscounts.reduce(
      (sum: number, discount: number) => sum + discount,
      0,
    );

    // 개별 할인 적용 후 금액
    const afterIndividualDiscount = subtotal - individualDiscount;

    // 전체 수량 할인 계산
    const totalBulkDiscount = calculateTotalBulkDiscount(afterIndividualDiscount, totalQuantity);

    // 화요일 할인 계산
    const tuesdayDiscount = calculateTuesdayDiscount(afterIndividualDiscount - totalBulkDiscount);

    const finalAmount = afterIndividualDiscount - totalBulkDiscount - tuesdayDiscount;

    return {
      subtotal,
      individualDiscount,
      totalBulkDiscount,
      tuesdayDiscount,
      finalAmount,
    };
  }, [cartItems, getTotalAmount, getCartItemCount]);

  const value = {
    products,
    cartItems,
    selectedProductId,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedProduct,
    getCartItemCount,
    getTotalAmount,
    getDiscountedAmount,
    getAppliedDiscounts,
    getDiscountBreakdown,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

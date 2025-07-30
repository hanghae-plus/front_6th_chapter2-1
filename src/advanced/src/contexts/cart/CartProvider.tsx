import { useReducer, useEffect, useRef, type ReactNode } from 'react';
import { cartReducer, initialCartState } from './cartReducer';
import { CartContext } from './CartContext';
import { setProductUpdateCallback, decreaseProductStock, increaseProductStock, getProducts } from '../../services/saleService';
import type { CartItem, CartAction } from '../../types/cart';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartState, originalDispatch] = useReducer(cartReducer, initialCartState);
  const prevCartItemsRef = useRef<CartItem[]>([]);

  // 재고 확인을 포함한 dispatch 함수
  const dispatch = (action: CartAction) => {
    if (action.type === 'ADD_ITEM' || action.type === 'ADJUST_QUANTITY') {
      const { productId, quantity } = action.payload;
      const products = getProducts();
      const product = products.find(p => p.id === productId);
      
      if (!product) return;

      // 수량 증가하는 경우에만 재고 확인
      if (quantity > 0) {
        if (product.quantity === 0) {
          alert(`${product.name}: 품절된 상품입니다.`);
          return;
        } else if (product.quantity < quantity) {
          alert(`${product.name}: 재고가 부족합니다. (${product.quantity}개 남음)`);
          return;
        }
      }
    }
    
    originalDispatch(action);
  };
  
  useEffect(() => {
    setProductUpdateCallback(() => {
      originalDispatch({ type: 'UPDATE_PRICES' });
    });
  }, []);

  // 장바구니 변경 감지하여 재고 업데이트
  useEffect(() => {
    const prevItems = prevCartItemsRef.current;
    const currentItems = cartState.items;

    // 각 상품별 수량 변화 계산
    const prevQuantities = new Map<string, number>();
    const currentQuantities = new Map<string, number>();

    prevItems.forEach(item => {
      prevQuantities.set(item.id, item.quantity);
    });

    currentItems.forEach(item => {
      currentQuantities.set(item.id, item.quantity);
    });

    // 모든 상품에 대해 수량 변화 확인
    const allProductIds = new Set([
      ...Array.from(prevQuantities.keys()),
      ...Array.from(currentQuantities.keys())
    ]);

    allProductIds.forEach(productId => {
      const prevQty = prevQuantities.get(productId) || 0;
      const currentQty = currentQuantities.get(productId) || 0;
      const quantityChange = currentQty - prevQty;

      if (quantityChange > 0) {
        // 장바구니 수량 증가 → 재고 차감
        decreaseProductStock(productId, quantityChange);
      } else if (quantityChange < 0) {
        // 장바구니 수량 감소 → 재고 복원
        increaseProductStock(productId, Math.abs(quantityChange));
      }
    });

    // 현재 상태를 이전 상태로 저장
    prevCartItemsRef.current = [...currentItems];
  }, [cartState.items]);
  
  return (
    <CartContext.Provider value={{ state: cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

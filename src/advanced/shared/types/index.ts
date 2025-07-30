/**
 * 모든 타입 정의를 통합 export
 */

export * from './product';
export * from './cart';
export * from './promotion';
export * from './points';
export * from './business';

// React 관련 타입
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Context 관련 타입
export interface CartContextType {
  // 상품 관련
  products: import('./product').Product[];
  updateProducts: (products: import('./product').Product[]) => void;
  
  // 장바구니 관련
  cartItems: import('./cart').CartItem[];
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  
  // 계산된 값들
  itemCount: number;
  subtotal: number;
  totalAmount: number;
  discounts: import('./cart').Discount[];
  
  // 포인트
  bonusPoints: number;
  pointsDetails: import('./points').PointsDetail[];
}

export interface PromotionContextType {
  lightningProducts: string[];
  suggestedProducts: string[];
  lastSelectedProduct: string | null;
  setLastSelectedProduct: (productId: string | null) => void;
}

// Hook 반환 타입
export interface UseCartReturn extends CartContextType {}

export interface UsePromotionReturn extends PromotionContextType {}

export interface UsePricingReturn {
  subtotal: number;
  totalAmount: number;
  discounts: import('./cart').Discount[];
  totalDiscount: number;
}

export interface UsePointsReturn {
  bonusPoints: number;
  pointsDetails: import('./points').PointsDetail[];
  pointsCalculation: import('./points').PointsCalculation;
}
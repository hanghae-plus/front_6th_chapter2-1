/**
 * 레거시 타입 정의 (하위 호환성)
 * 기존 코드와의 호환성을 위해 유지
 * 새 코드에서는 사용을 지양하고 도메인별 타입 사용 권장
 */
import type { Product, CartItem, DiscountInfo } from './entities';

// @deprecated 새 구조에서는 RootState 사용
export interface AppState {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string;
  bonusPoints: number;
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  lastSelectedProductId: string | null;
  discountInfo: DiscountInfo[];
  isTuesdaySpecial: boolean;
  pointsDetails?: string[];
}

// @deprecated 새 구조에서는 도메인별 액션 사용
export type AppAction =
  | { type: 'SELECT_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'APPLY_LIGHTNING_SALE'; payload: string }
  | { type: 'APPLY_SUGGESTED_SALE'; payload: string }
  | { type: 'RESET_PROMOTIONS'; payload: string }
  | { type: 'CALCULATE_TOTALS' };

// @deprecated 현재 사용되지 않음
export interface PromotionService {
  startService: (
    getProducts: () => Product[],
    getLastSelectedProductId?: () => string | null,
    onUpdate?: () => void
  ) => void;
  stopService: () => void;
}

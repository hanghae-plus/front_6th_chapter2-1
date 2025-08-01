/**
 * Hook 관련 타입 정의
 * 커스텀 Hook의 반환 타입들
 */
import type { Product, CartItem, DiscountInfo } from './entities';

// 통합 쇼핑카트 상태 (useShoppingCart 반환)
export interface ShoppingCartState {
  // 상태 데이터
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string;
  lastSelectedProductId: string | null;

  // 계산된 데이터
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  bonusPoints: number;
  discountInfo: DiscountInfo[];
  isTuesdaySpecial: boolean;
  pointsDetails: string[];

  // 프로모션 상태
  lightningSaleProductId: string | null;
  suggestedSaleProductId: string | null;
  isLightningSaleActive: boolean;
  isSuggestedSaleActive: boolean;
}

// 통합 쇼핑카트 액션 (useShoppingCart 반환)
export interface ShoppingCartActions {
  // 상품 관련
  selectProduct: (productId: string) => void;
  getProductById: (id: string) => Product | undefined;

  // 장바구니 관련
  addToCart: (productId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // 프로모션 관련
  applyLightningSale: (productId: string) => void;
  applySuggestedSale: (productId: string) => void;
  resetPromotions: (productId: string) => void;
  resetAllPromotions: () => void;
}

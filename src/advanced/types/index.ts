// Product 카테고리 타입
export type ProductCategory =
  | 'keyboard'
  | 'mouse'
  | 'monitor'
  | 'accessory'
  | 'audio';

// 할인 타입
export type DiscountType =
  | 'flash_sale'
  | 'recommendation'
  | 'bulk'
  | 'tuesday'
  | 'super_sale';

// 상품
export interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  isFlashSale: boolean;
  isRecommended: boolean;
  category: ProductCategory;
}

// 장바구니 아이템
export interface CartItem {
  product: Product;
  quantity: number;
  itemTotal: number;
}

// 할인 정보
export interface ItemDiscount {
  productId: string;
  discountAmount: number;
  discountRate: number;
  discountType: DiscountType;
}

export interface DiscountData {
  totalAmount: number;
  itemDiscounts: ReadonlyArray<ItemDiscount>;
  discountRate: number;
}

// 포인트 상세
export interface PointsDetail {
  basePoints: number;
  bonusPoints: number;
  bulkBonus: number;
}

// 포인트 정보
export interface LoyaltyPoints {
  finalPoints: number;
  pointsDetail: PointsDetail;
}

// 장바구니 요약
export interface CartSummary {
  items: ReadonlyArray<CartItem>;
  subtotal: number;
  totalQuantity: number;
  discountData: DiscountData;
  loyaltyPoints: LoyaltyPoints;
}

// UI 상태
export interface UIState {
  selectedProductId: string | null;
  isManualMode: boolean;
  stockStatusDisplay: HTMLElement | null;
  productSelectElement: HTMLSelectElement | null;
  cartItemsContainer: HTMLElement | null;
  cartTotalDisplay: HTMLElement | null;
}

// 핸들러 타입
export type QuantityChangeHandler = (
  productId: string,
  changeAmount: number
) => void;
export type RemoveItemHandler = (productId: string) => void;
export type ProductSelectHandler = (productId: string) => void;

// 에러 처리 관련 타입
export type ErrorType = 'error' | 'warning' | 'info';

export type ErrorCode =
  | 'STOCK_INSUFFICIENT'
  | 'PRODUCT_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'TIMER_ERROR'
  | 'CART_ERROR'
  | 'DISCOUNT_ERROR'
  | 'LOYALTY_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  type: ErrorType;
  details?: unknown;
  timestamp?: number;
}

export interface ErrorHandler {
  handleError: (error: AppError) => void;
  showError: (message: string, type?: ErrorType, title?: string) => void;
  showStockError: (productName?: string) => void;
  showProductNotFoundError: (productId: string) => void;
  showNetworkError: (operation: string) => void;
}

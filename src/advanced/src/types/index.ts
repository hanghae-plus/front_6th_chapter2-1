// ================================================
// 상품 관련 타입
// ================================================
export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

// ================================================
// 장바구니 관련 타입
// ================================================
export interface CartItem {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

// ================================================
// 할인 관련 타입
// ================================================
export interface DiscountInfo {
  name: string;
  discount: number;
}

export interface AppliedDiscount {
  type: 'individual' | 'bulk' | 'tuesday' | 'lightning' | 'suggest';
  rate: number;
  description: string;
}

// ================================================
// 포인트 관련 타입
// ================================================
export interface PointsDetail {
  type: 'base' | 'tuesday' | 'set' | 'bulk';
  amount: number;
  description: string;
}

// ================================================
// 상태 관련 타입
// ================================================
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  originalTotal: number;
  discountRate: number;
}

export interface PointsState {
  totalPoints: number;
  basePoints: number;
  bonusPoints: number;
  pointsDetail: PointsDetail[];
}

export interface ProductState {
  selectedProduct: string | null;
  products: Product[];
}

export interface UiState {
  isManualOpen: boolean;
}

export interface AppState {
  cart: CartState;
  points: PointsState;
  product: ProductState;
  ui: UiState;
}

// ================================================
// 계산 결과 타입
// ================================================
export interface CartCalculationResult {
  totalAmt: number;
  itemCnt: number;
  originalTotal: number;
  discRate: number;
}

export interface PointsCalculationResult {
  bonusPoints: number;
  pointsDetail: PointsDetail[];
}

// ================================================
// 컴포넌트 Props 타입
// ================================================
export interface ProductOptionProps {
  item: Product;
}

export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

export interface HeaderProps {
  itemCount: number;
}

export interface GridContainerProps {
  total: number;
  bonusPoints: number;
  pointsDetail: PointsDetail[];
}

export interface RightColumnProps {
  total: number;
  bonusPoints: number;
  pointsDetail: PointsDetail[];
}

export interface LoyaltyPointsTagProps {
  bonusPoints: number;
  pointsDetail: PointsDetail[];
}

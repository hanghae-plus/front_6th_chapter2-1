// 상품 타입 정의
export interface Product {
  id: string;
  name: string;
  value: number;
  originalValue: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

// 장바구니 아이템 타입 정의
export interface CartItem {
  productId: string;
  quantity: number;
}

// 할인 정보 타입 정의
export interface DiscountInfo {
  name: string;
  discount: number;
}

// 장바구니 상태 타입 정의
export interface CartState {
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
  itemDiscounts: DiscountInfo[];
  totalAmount: number;
  discountRate: number;
  originalTotal: number;
  tuesdayDiscount: number;
  individualDiscount: boolean;
}

// 앱 상태 타입 정의
export interface AppState {
  products: Product[];
  cart: {
    totalAmount: number;
    itemCount: number;
  };
  lastSelected: string | null;
}

// 포인트 정보 타입 정의
export interface PointsInfo {
  basePoints: number;
  finalPoints: number;
  pointsDetail: string[];
}

// 재고 상태 타입 정의
export interface StockStatus {
  message: string;
  lowStockItems: string[];
}

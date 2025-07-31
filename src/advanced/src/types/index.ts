// 상품 관련 타입
export interface Product {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

// 장바구니 아이템 타입
export interface CartItem {
  id: string;
  name: string;
  val: number;
  quantity: number;
  discount: number;
}

// 장바구니 총계 타입
export interface CartTotals {
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  itemCount: number;
}

// 포인트 계산 결과 타입
export interface PointsCalculation {
  basePoints: number;
  tuesdayBonus: number;
  setBonus: number;
  bulkBonus: number;
  finalPoints: number;
  pointsDetail: string[];
}

// 할인 설정 타입
export interface DiscountConfig {
  INTERVAL: number;
  DISCOUNT_RATE: number;
  ALERT_MESSAGE: string;
  delay: number;
}

// 타이머 콜백 타입
export type ProductUpdateCallback = () => void;

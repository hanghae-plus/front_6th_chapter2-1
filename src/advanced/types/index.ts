export interface Product {
  id: string;
  name: string;
  val: number; // 현재 가격 (할인 적용될 수 있음)
  originalVal: number; // 원본 가격
  q: number; // 재고 수량 (quantity)
  onSale: boolean; // 번개 세일 적용 여부
  suggestSale: boolean; // 추천 할인 적용 여부
}

// 카트에 담긴 아이템 타입 (카트 아이템은 Product의 일부 정보 + 수량)
export interface CartItem {
  id: string;
  name: string;
  price: number; // 현재 가격
  originalPrice: number; // 원본 가격
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

// 할인 정보 타입
export interface ItemDiscount {
  name: string;
  discount: number; // 할인율 (e.g., 10 for 10%)
}

// 카트 총계 계산 결과 타입
export interface CartTotals {
  subtotal: number;
  finalTotal: number;
  savedAmount: number;
  overallDiscountRate: number; // 0.0 ~ 1.0 (예: 0.25 for 25%)
  itemDiscountsApplied: ItemDiscount[];
  isTuesdaySpecialApplied: boolean;
}

// 로열티 포인트 계산 결과 타입
export interface LoyaltyPointsResult {
  points: number;
  details: string[];
}

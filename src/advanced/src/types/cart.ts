export interface CartItem {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  quantity: number;
  saleIcon?: string;
  isLightningSale?: boolean;
  isSuggestSale?: boolean;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number; // 최종 결제 금액
  originalAmount: number; // 현재 가격 합계 (번개세일 포함)
  realOriginalAmount: number; // 실제 원가 합계 (할인율 계산용)
  discountAmount: number; // 할인 금액
  itemCount: number;
  appliedDiscounts: string[];
  loyaltyPoints: number; // 적립 포인트
  pointsBreakdown: string[]; // 포인트 적립 내역
}

export type CartAction = {
  type: 'ADD_ITEM' | 'ADJUST_QUANTITY' | 'REMOVE_ITEM';
  payload: {
    productId: string;
    quantity: number;
  };
} | {
  type: 'UPDATE_PRICES';
}

export interface CartContextType {
  state: Cart;
  dispatch: (action: CartAction) => void;
}

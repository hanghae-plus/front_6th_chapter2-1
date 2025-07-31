export interface Product {
  id: string;
  name: string;
  price: number; // 현재 가격
  originalPrice: number; // 원래 가격
  quantity: number; // 재고 수량
  onSale: boolean; // 번개세일 여부
  suggestSale: boolean; // 추천할인 여부
}

export interface Cart {
  cartItem: CartItem; // 상품 정보
  quantity: number; // 총 담은 수량

  price: number; // 개별 가격 (할인 적용된 가격)
  subtotalPrice: number; // 개별 가격 * 수량
  totalPrice: number; // 총 가격 (수량 * 가격)에 할인 적용된 가격
  points: number; // 적립 예정 포인트
}
export interface CartItem {
  id: string;
  name: string;
  originalPrice: number; // 원래 가격
  price: number;
  quantity: number; //장바구니 내 수량
  onSale: boolean; // 번개세일 여부
  suggestSale: boolean; // 추천할인 여부
}

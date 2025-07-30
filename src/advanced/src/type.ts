export interface Product {
  id: string;
  name: string;
  changedPrice: number;
  originalPrice: number;
  quantity: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface CartProduct {
  id: string;
  count: number;
}

export interface discountedProduct {
  name: string,
  discount: number,
}

// 수정 필요 ---
export interface appState {
  totalPoints: number, // 최종 적립 포인트
  pointsDetail: string[], // 포인트 상세 문자열

  totalProductCount: number, // 장바구니 내 총 상품 수
  totalBeforeDiscount: number, // 할인 전 장바구니 총 가격
  totalAfterDiscount: number, // 할인 후 장바구니 총 가격

  totalDiscountedRate: number, // 총 할인율
  discountedProductList: discountedProduct[], // 할인 적용된 상품 목록
  lastSelectedProductId: string | null, // 최근에 장바구니에 담긴 상품 id
};

// 상품 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discount: number;
}

// 장바구니 아이템 타입
export interface CartItem {
  product: Product;
  quantity: number;
}

// 할인 타입
export interface Discount {
  type: 'individual' | 'bulk' | 'tuesday' | 'flash' | 'recommendation';
  rate: number;
  description: string;
}

// 포인트 타입
export interface PointBonus {
  type: 'basic' | 'tuesday' | 'set' | 'fullset' | 'bulk';
  points: number;
  description: string;
}

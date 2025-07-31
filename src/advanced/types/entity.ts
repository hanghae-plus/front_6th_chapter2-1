// ============== 기본 엔터티 타입 ==============

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  isOnSale: boolean;
  isSuggestedSale: boolean;
}

export interface CartItem extends Product {
  quantity: number;
} 
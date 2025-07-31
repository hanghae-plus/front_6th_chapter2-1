// 상품 관련 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  lightningSale?: boolean;
  suggestSale?: boolean;
  originalPrice?: number;
  onSale?: boolean;
}

// 장바구니 아이템 타입
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

// 할인 정보 타입
export interface DiscountInfo {
  type: 'lightning' | 'recommendation' | 'tuesday' | 'points';
  amount: number;
  description: string;
}

// 주문 요약 타입
export interface OrderSummary {
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;
  itemCount: number;
  bonusPoints: number;
  discounts: DiscountInfo[];
}

// 컴포넌트 Props 타입들
export interface HeaderProps {
  itemCount: number;
}

export interface ProductSelectorProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
}

export interface CartProps {
  items: CartItem[];
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

export interface OrderSummaryProps {
  summary: OrderSummary;
  items: CartItem[];
  products: Product[];
  onOrder: () => void;
}

export interface ManualManagerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface ManualToggleProps {
  onToggle: () => void;
}

export interface ManualOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ManualColumnProps {
  isOpen: boolean;
  onClose: () => void;
}

// 이벤트 핸들러 타입들
export type QuantityChangeHandler = (productId: string, change: number) => void;
export type RemoveItemHandler = (productId: string) => void;
export type ProductSelectHandler = (productId: string) => void;
export type AddToCartHandler = () => void;

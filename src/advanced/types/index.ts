// 공통으로 사용되는 타입들을 한 곳에 모음
export interface Product {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  isOnSale: boolean;
  isRecommended: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DiscountInfo {
  name: string;
  discountRate: number;
  savedAmount: number;
}

export interface DiscountResult {
  originalTotal: number;
  discountedTotal: number;
  discountRate: number;
  savedAmount: number;
  discountDetails: Array<{
    name: string;
    discountRate: number;
  }>;
}

export interface PointsResult {
  totalPoints: number;
  pointsDetails: string[];
}

// 컴포넌트 Props 타입들
export interface CartItemProps {
  cartItem: CartItem;
  product: Product;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export interface ShoppingGuideProps {
  onClose: () => void;
}

// Hook Props 타입들
export interface UseDiscountTimersProps {
  products: Product[];
  updateProductSaleStatus: (productId: string, isOnSale: boolean, newPrice?: number) => void;
  updateProductRecommendStatus: (productId: string, isRecommended: boolean, newPrice?: number) => void;
  lastSelectedProductId: string | null;
}

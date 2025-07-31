import { Product } from './entity.js';
import { CartItem } from './entity.js';
import { CartState } from './cart.js';
import { SaleEvent } from './events.js';

// ============== 컴포넌트 Props 타입 ==============

export interface ProductSelectProps {
  products: Product[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
  activeSales: SaleEvent[];
}

export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export interface CartTotalProps {
  cartState: CartState;
  lowStockItems: Product[];
  outOfStockItems: Product[];
} 
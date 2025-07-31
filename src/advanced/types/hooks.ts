import { Product } from './entity.js';
import { CartState } from './cart.js';
import { SaleEvent } from './events.js';
import { DiscountInfo } from './discount.js';
import { PointsInfo } from './points.js';

// ============== 훅 반환 타입 ==============

export interface UseCartReturn {
  cartState: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateCartItemPrices: (updatedProducts: Product[]) => void;
}

export interface UseProductsReturn {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateStock: (productId: string, quantity: number) => void;
  getLowStockItems: () => Product[];
  getOutOfStockItems: () => Product[];
  startLightningSale: (productId: string) => void;
  startSuggestedSale: (productId: string) => void;
  resetSaleStatus: (productId: string) => void;
}

export interface UseDiscountReturn {
  calculateDiscount: (cartState: CartState) => DiscountInfo | null;
  applyLightningSale: (productId: string) => void;
  applySuggestedSale: (productId: string, lastSelectedProductId: string) => void;
  resetSaleStatus: (productId: string) => void;
}

export interface UsePointsReturn {
  calculatePoints: (cartState: CartState) => PointsInfo;
}

export interface UseAutoEventsReturn {
  activeSales: SaleEvent[];
  startAutoEvents: (lastSelectedProductId: string) => void;
  stopAutoEvents: () => void;
} 
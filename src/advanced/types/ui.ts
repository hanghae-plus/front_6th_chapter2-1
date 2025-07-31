import { Product } from './entity.js';
import { SaleEvent } from './events.js';

// ============== UI 상태 타입 ==============

export interface UIState {
  isManualOpen: boolean;
  selectedProductId: string;
  lowStockItems: Product[];
  outOfStockItems: Product[];
  activeSales: SaleEvent[];
}

export type UIAction =
  | { type: 'TOGGLE_MANUAL' }
  | { type: 'SELECT_PRODUCT'; payload: string }
  | { type: 'UPDATE_STOCK_STATUS'; payload: { lowStock: Product[]; outOfStock: Product[] } }
  | { type: 'ADD_SALE_EVENT'; payload: SaleEvent }
  | { type: 'REMOVE_SALE_EVENT'; payload: string }; 
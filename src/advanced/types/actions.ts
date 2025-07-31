import { Product } from './entity.js';

// ============== 액션 타입 ==============

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_LIGHTNING_SALE'; payload: { productId: string; discountRate: number } }
  | { type: 'APPLY_SUGGESTED_SALE'; payload: { productId: string; discountRate: number } }
  | { type: 'RESET_SALE_STATUS'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; quantity: number } }; 
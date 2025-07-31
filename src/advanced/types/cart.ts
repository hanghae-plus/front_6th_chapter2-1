import { CartItem } from './entity.js';
import { DiscountInfo } from './discount.js';
import { PointsInfo } from './points.js';

// ============== 장바구니 상태 타입 ==============

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItemCount: number;
  discountInfo: DiscountInfo | null;
  pointsInfo: PointsInfo;
} 
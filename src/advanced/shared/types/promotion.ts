/**
 * 프로모션 관련 타입 정의
 */

export interface PromotionTimer {
  type: 'lightning' | 'suggested';
  interval: number;
  delay?: number;
  isActive: boolean;
}

export interface PromotionState {
  lightningProducts: string[];
  suggestedProducts: string[];
  lastSelectedProduct: string | null;
}

export interface LightningDeal {
  productId: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  endTime: number;
}

export interface SuggestedDeal {
  productIds: string[];
  discountRate: number;
  excludeLastSelected: boolean;
}
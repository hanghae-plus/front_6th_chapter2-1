// ============== 자동 이벤트 관련 타입 ==============

export interface AutoEventConfig {
  LIGHTNING_SALE_INTERVAL: number;
  SUGGESTED_SALE_INTERVAL: number;
  LIGHTNING_SALE_DELAY: number;
  SUGGESTED_SALE_DELAY: number;
}

export interface SaleEvent {
  type: 'lightning' | 'suggested';
  productId: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  startTime: Date;
  endTime?: Date;
} 
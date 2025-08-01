export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  hasLightningDiscount: boolean; // onSale → hasLightningDiscount로 변경
  hasRecommendationDiscount: boolean; // suggestSale → hasRecommendationDiscount로 변경
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DiscountInfo {
  name: string;
  discount: number;
}

export interface LoyaltyPoints {
  basePoints: number;
  finalPoints: number;
  pointsDetail: string[];
} 
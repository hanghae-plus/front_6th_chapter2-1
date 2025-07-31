// ==========================================
// 타입 정의
// ==========================================

export interface Product {
  id: string;
  name: string;
  val: number;
  quantity: number;
  originalVal: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface AppState {
  products: Product[];
  lastSelected: string;
}

export interface UIElements {
  productSelect: HTMLSelectElement | null;
  addButton: HTMLButtonElement | null;
  cartDisplay: HTMLDivElement | null;
  stockInfo: HTMLParagraphElement | null;
  orderSummary: HTMLDivElement | null;
}

export interface DOMElements {
  loyaltyPoints: HTMLElement | null;
  summaryDetails: HTMLElement | null;
  tuesdaySpecial: HTMLElement | null;
  discountInfo: HTMLElement | null;
}

export interface DiscountDetail {
  type: 'bulk' | 'individual' | 'tuesday';
  name: string;
  rate: number;
}

export interface DiscountResult {
  finalDiscount: number;
  discountDetails: DiscountDetail[];
  finalAmount: number;
}

export interface PointsResult {
  basePoints: number;
  tuesdayBonus: number;
  setBonus: number;  
  quantityBonus: number;
  totalPoints: number;
  setDetails: string[];
}
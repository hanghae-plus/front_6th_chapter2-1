export interface IProduct {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  q: number;
  onSale: boolean;
  suggestSale: boolean;
}

export interface ICartItem {
  name: string;
  quantity: number;
  itemTotal: number;
}

export interface IItemDiscount {
  name: string;
  discount: number;
}

export interface IDiscountData {
  hasDiscount: boolean;
  savedAmount: number;
  discountPercentage: string;
  formattedSavedAmount: string;
}

export interface ICartCalculation {
  subtotal: number;
  itemCount: number;
  itemDiscounts: IItemDiscount[];
  totalAmount: number;
  discountRate: number;
  originalTotal: number;
  isSpecialDiscount: boolean;
}

export interface IBonusPointsResult {
  totalPoints: number;
  details: string[];
  breakdown: {
    base: number;
    specialDay: any;
    combo: any;
    quantity: any;
  };
}

export interface ICartItemData {
  itemIndex: number;
  priceHTML: string;
  nameText: string;
  priceClassName: string;
  isDiscounted: boolean;
}

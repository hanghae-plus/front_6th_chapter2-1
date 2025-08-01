import { IProduct } from "../../types";

export interface ICartItem extends IProduct {
  itemTotal: number;
}

export interface IItemDiscount {
  name: string;
  discount: number;
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

export interface ICartItemData {
  itemIndex: number;
  priceHTML: string;
  nameText: string;
  priceClassName: string;
  isDiscounted: boolean;
}

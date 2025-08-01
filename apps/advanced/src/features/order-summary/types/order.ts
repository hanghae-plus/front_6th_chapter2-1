import type { CartItem, ItemDiscount } from "../../../shared";
import type { Product } from "../../product-selection";

export type OrderCalculations = {
	totalAmount: number;
	itemCount: number;
	subtotal: number;
	itemDiscounts: ItemDiscount[];
	discountRate: number;
	originalTotal: number;
	isTuesday: boolean;
	bonusPoints: number;
	pointsDetail: string[];
};

export type OrderSummaryProps = {
	cartItems: CartItem[];
	products: Product[];
	calculations: OrderCalculations;
};

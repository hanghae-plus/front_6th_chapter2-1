export type CartItem = {
	id: string;
	name: string;
	price: number;
	originalPrice: number;
	stock: number;
	onSale: boolean;
	suggestSale: boolean;
	quantity: number;
};

export type ItemDiscount = {
	name: string;
	discount: number;
};

export type CartCalculationResult = {
	totalAmount: number;
	itemCount: number;
	subtotal: number;
	itemDiscounts: ItemDiscount[];
	discountRate: number;
	originalTotal: number;
	isTuesday: boolean;
};

export type PointCalculationResult = {
	bonusPoints: number;
	pointsDetail: string[];
};

export * from "./error";

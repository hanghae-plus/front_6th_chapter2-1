import type { Product } from "../../product-selection";

export type SalesPromotionConfig = {
	products: Product[];
	lastSelectedProductId: string | null;
	onProductsUpdate: (updateFn: (prev: Product[]) => Product[]) => void;
};

export type LightningSaleResult = {
	productId: string;
	productName: string;
	originalPrice: number;
	salePrice: number;
};

export type SuggestSaleResult = {
	productId: string;
	productName: string;
	originalPrice: number;
	salePrice: number;
};

import { INITIAL_PRODUCTS_DATA } from "../../../shared/constants";
import type { Product } from "../types";

export function createInitialProducts(): Product[] {
	if (!INITIAL_PRODUCTS_DATA || INITIAL_PRODUCTS_DATA.length < 1) {
		throw new Error("초기 제품 데이터가 올바르지 않습니다.");
	}
	return INITIAL_PRODUCTS_DATA.map((product) => ({ ...product }));
}

export function hasEnoughStock(product: Product, requestedQuantity: number): boolean {
	if (!product || requestedQuantity < 0 || !Number.isInteger(requestedQuantity)) {
		return false;
	}
	return product.stock >= requestedQuantity;
}

export function isValidProduct(selectedId: string, products: Product[]): boolean {
	if (!selectedId) return false;
	return products.some((product) => product.id === selectedId);
}

function getDiscountType(product: Product): "lightning" | "suggest" | "both" | "none" {
	if (product.onSale && product.suggestSale) return "both";
	if (product.onSale) return "lightning";
	if (product.suggestSale) return "suggest";
	return "none";
}

export function generateProductOptionText(product: Product): {
	text: string;
	className: string;
} {
	const discountType = getDiscountType(product);

	switch (discountType) {
		case "both":
			return {
				text: `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`,
				className: "text-purple-600 font-bold"
			};
		case "lightning":
			return {
				text: `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`,
				className: "text-red-500 font-bold"
			};
		case "suggest":
			return {
				text: `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`,
				className: "text-blue-500 font-bold"
			};
		case "none":
		default:
			return {
				text: `${product.name} - ${product.price}원`,
				className: ""
			};
	}
}

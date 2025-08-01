import type { SalesPromotionConfig } from "../types";
import { useLightningSale } from "./useLightningSale";
import { useSuggestSale } from "./useSuggestSale";

export function useSalesPromotions(config: SalesPromotionConfig) {
	// 번개세일 활성화
	useLightningSale({
		products: config.products,
		onProductsUpdate: config.onProductsUpdate
	});

	// 추천세일 활성화
	useSuggestSale(config);
}

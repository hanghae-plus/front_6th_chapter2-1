import { DISCOUNT_RATES } from "../../../shared/constants";
import type { Product } from "../../product-selection";
import type { LightningSaleResult, SuggestSaleResult } from "../types";

/**
 * 번개세일 대상 상품을 찾는 함수
 * 재고가 있고 현재 세일 중이 아닌 상품 중에서 랜덤 선택
 */
export const findLightningSaleCandidate = (products: Product[]): Product | null => {
	const eligibleProducts = products.filter((product) => product.stock > 0 && !product.onSale);

	if (eligibleProducts.length === 0) {
		return null;
	}

	const randomIndex = Math.floor(Math.random() * eligibleProducts.length);
	return eligibleProducts[randomIndex];
};

/**
 * 번개세일을 적용하는 함수
 */
export const applyLightningSale = (product: Product): LightningSaleResult => {
	const salePrice = Math.round(product.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING_SALE));

	return {
		productId: product.id,
		productName: product.name,
		originalPrice: product.originalPrice,
		salePrice
	};
};

/**
 * 추천세일 대상 상품을 찾는 함수
 * 마지막 선택 상품과 다르고, 재고가 있고, 아직 추천세일 중이 아닌 상품 중에서 첫 번째 선택
 */
export const findSuggestSaleCandidate = (
	products: Product[],
	lastSelectedProductId: string | null
): Product | null => {
	if (!lastSelectedProductId) {
		return null;
	}

	for (const product of products) {
		if (product.id !== lastSelectedProductId && product.stock > 0 && !product.suggestSale) {
			return product;
		}
	}

	return null;
};

/**
 * 추천세일을 적용하는 함수
 */
export const applySuggestSale = (product: Product): SuggestSaleResult => {
	const salePrice = Math.round(product.originalPrice * (1 - DISCOUNT_RATES.SUGGEST_SALE));

	return {
		productId: product.id,
		productName: product.name,
		originalPrice: product.originalPrice,
		salePrice
	};
};

/**
 * 번개세일 알림 메시지 생성
 */
export const createLightningSaleMessage = (productName: string): string => {
	return `⚡번개세일! ${productName}이(가) 20% 할인 중입니다!`;
};

/**
 * 추천세일 알림 메시지 생성
 */
export const createSuggestSaleMessage = (productName: string): string => {
	return `💝 ${productName}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`;
};

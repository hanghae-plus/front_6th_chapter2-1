import { QUANTITY_THRESHOLDS } from "../../../shared/constants";
import type { Product } from "../types";

// 재고 상태 메시지 생성
export const generateStockMessage = (products: Product[]): string => {
	let stockMsg = "";

	for (const item of products) {
		if (item.stock < QUANTITY_THRESHOLDS.LOW_STOCK) {
			if (item.stock > QUANTITY_THRESHOLDS.OUT_OF_STOCK) {
				stockMsg += `${item.name}: 재고 부족 (${item.stock}개 남음)\n`;
			} else {
				stockMsg += `${item.name}: 품절\n`;
			}
		}
	}

	return stockMsg;
};

// 전체 재고 합계 계산
export const calculateTotalStock = (products: Product[]): number => {
	return products.reduce((sum, item) => sum + item.stock, 0);
};

// 재고 부족 상품 확인
export const isLowStock = (quantity: number): boolean => {
	return quantity < QUANTITY_THRESHOLDS.LOW_STOCK && quantity > QUANTITY_THRESHOLDS.OUT_OF_STOCK;
};

// 품절 상품 확인
export const isOutOfStock = (quantity: number): boolean => {
	return quantity <= QUANTITY_THRESHOLDS.OUT_OF_STOCK;
};

// 재고 경고 표시 여부 확인
export const shouldShowStockWarning = (totalStock: number): boolean => {
	return totalStock < QUANTITY_THRESHOLDS.STOCK_WARNING;
};

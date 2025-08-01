import type { CartItem } from "../../../shared";
import { QUANTITY_THRESHOLDS } from "../../../shared/constants";
import type { Product } from "../../product-selection";

/**
 * 주문 아이템 총합 계산
 */
export const calculateOrderItemTotal = (cartItem: CartItem, product: Product): number => {
	return product.stock * cartItem.quantity;
};

/**
 * 화요일 여부 확인
 */
export const isTuesdayToday = (): boolean => {
	return new Date().getDay() === 2;
};

/**
 * 대량구매 할인 여부 확인
 */
export const isBulkDiscount = (itemCount: number): boolean => {
	return itemCount >= QUANTITY_THRESHOLDS.BULK_30_DISCOUNT;
};

/**
 * 할인율 표시 형식
 */
export const formatDiscountRate = (rate: number): string => {
	return (rate * 100).toFixed(1);
};

/**
 * 할인 금액 계산
 */
export const calculateDiscountAmount = (originalTotal: number, totalAmount: number): number => {
	return Math.round(originalTotal - totalAmount);
};

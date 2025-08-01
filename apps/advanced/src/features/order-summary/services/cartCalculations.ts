import {
	DISCOUNT_RATES,
	PRODUCT_IDS,
	QUANTITY_THRESHOLDS,
	WEEKDAYS
} from "../../../shared/constants";
import type { CartCalculationResult, CartItem, ItemDiscount } from "../../../shared/types";
import type { Product } from "../../product-selection";

// 개별 상품 할인율 계산
export const getItemDiscountRate = (productId: string, quantity: number): number => {
	if (quantity < QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
		return 0;
	}

	switch (productId) {
		case PRODUCT_IDS.KEYBOARD:
			return DISCOUNT_RATES.KEYBOARD;
		case PRODUCT_IDS.MOUSE:
			return DISCOUNT_RATES.MOUSE;
		case PRODUCT_IDS.MONITOR_ARM:
			return DISCOUNT_RATES.MONITOR_ARM;
		case PRODUCT_IDS.LAPTOP_POUCH:
			return DISCOUNT_RATES.LAPTOP_POUCH;
		case PRODUCT_IDS.SPEAKER:
			return DISCOUNT_RATES.SPEAKER;
		default:
			return 0;
	}
};

// 화요일 여부 확인
export const isTodayTuesday = (): boolean => {
	const today = new Date();
	return today.getDay() === WEEKDAYS.TUESDAY;
};

// 대량 구매 할인 적용 여부 확인
export const shouldApplyBulkDiscount = (totalQuantity: number): boolean => {
	return totalQuantity >= QUANTITY_THRESHOLDS.BULK_30_DISCOUNT;
};

// 화요일 할인 적용
export const applyTuesdayDiscount = (amount: number): number => {
	return amount * (1 - DISCOUNT_RATES.TUESDAY_SPECIAL);
};

// 장바구니 계산 메인 함수
export const calculateCartTotals = (
	cartItems: CartItem[],
	prodList: Product[]
): CartCalculationResult => {
	let totalAmount = 0;
	let itemCount = 0;
	let subtotal = 0;
	const itemDiscounts: ItemDiscount[] = [];

	// 개별 상품 계산
	for (const cartItem of cartItems) {
		const curItem = prodList.find((p) => p.id === cartItem.id);
		if (!curItem) continue;

		const quantity = cartItem.quantity;
		const itemTotal = curItem.price * quantity;
		const discountRate = getItemDiscountRate(cartItem.id, quantity);

		itemCount += quantity;
		subtotal += itemTotal;

		if (discountRate > 0) {
			itemDiscounts.push({
				name: curItem.name,
				discount: discountRate * 100
			});
		}

		totalAmount += itemTotal * (1 - discountRate);
	}

	const originalTotal = subtotal;
	let discountRate = 0;

	// 대량 구매 할인 (30개 이상)
	if (shouldApplyBulkDiscount(itemCount)) {
		totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK_30_ITEMS);
		discountRate = DISCOUNT_RATES.BULK_30_ITEMS;
	} else {
		discountRate = (subtotal - totalAmount) / subtotal;
	}

	// 화요일 할인
	const isTuesday = isTodayTuesday();
	if (isTuesday && totalAmount > 0) {
		totalAmount = applyTuesdayDiscount(totalAmount);
		discountRate = 1 - totalAmount / originalTotal;
	}

	return {
		totalAmount,
		itemCount,
		subtotal,
		itemDiscounts,
		discountRate,
		originalTotal,
		isTuesday
	};
};

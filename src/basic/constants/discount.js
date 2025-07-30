// Discount related constants - unified from features/product/constants
export const DISCOUNT_CONSTANTS = {
	BULK_DISCOUNT: {
		KEYBOARD: 10, // 10% discount
		MOUSE: 15, // 15% discount  
		MONITOR_ARM: 20, // 20% discount
		LAPTOP_POUCH: 5, // 5% discount
		SPEAKER: 25, // 25% discount
		MINIMUM_QUANTITY: 10
	},
	GLOBAL_DISCOUNT: {
		RATE: 25, // 25% discount (BULK_DISCOUNT_RATE from features)
		MINIMUM_QUANTITY: 30, // BULK_DISCOUNT_THRESHOLD from features
		FINAL_RATE: 75 // 75% of original price
	},
	TUESDAY_SPECIAL: {
		RATE: 10, // 10% additional discount (TUESDAY_DISCOUNT_RATE from features)
		FINAL_RATE: 90 // 90% of price
	},
	LIGHTNING_SALE: {
		RATE: 20, // 20% discount (LIGHTNING_SALE_DISCOUNT from features)
		FINAL_RATE: 80 // 80% of original price
	},
	SUGGEST_SALE: {
		RATE: 5, // 5% discount (SUGGEST_SALE_DISCOUNT from features)
		FINAL_RATE: 95 // 95% of original price
	},
	SUPER_SALE: {
		RATE: 25 // 25% discount (SUPER_SALE_DISCOUNT from features)
	}
};

export const STOCK_CONSTANTS = {
	LOW_STOCK_THRESHOLD: 5, // 재고 부족 기준 (from features)
	CRITICAL_STOCK_THRESHOLD: 50 // 전체 재고 경고 기준 (TOTAL_STOCK_WARNING from features)
};

export const UI_CONSTANTS = {
	LOYALTY_POINTS_RATIO: 1000, // 1 point per 1000 won
	DAYS: { TUESDAY: 2 }
};

// Point constants from features
export const POINT_CONSTANTS = {
	BASE_POINT_RATE: 0.001, // 기본 포인트 적립율 0.1%
	TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배율
	COMBO_BONUS_POINTS: 50, // 키보드+마우스 세트 보너스
	FULL_SET_BONUS_POINTS: 100, // 풀세트 보너스
	BULK_10_BONUS: 20, // 10개 이상 보너스
	BULK_20_BONUS: 50, // 20개 이상 보너스
	BULK_30_BONUS: 100 // 30개 이상 보너스
};
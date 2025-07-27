export const PRODUCT_KEY = Object.freeze({
	KEYBOARD: "KEYBOARD",
	MOUSE: "MOUSE",
	MONITOR_ARM: "MONITOR_ARM",
	LAPTOP_POUCH: "LAPTOP_POUCH",
	SPEAKER: "SPEAKER"
});

export const PRODUCT_IDS = Object.freeze({
	[PRODUCT_KEY.KEYBOARD]: "p1",
	[PRODUCT_KEY.MOUSE]: "p2",
	[PRODUCT_KEY.MONITOR_ARM]: "p3",
	[PRODUCT_KEY.LAPTOP_POUCH]: "p4",
	[PRODUCT_KEY.SPEAKER]: "p5"
});

export const DISCOUNT_RATES = Object.freeze({
	[PRODUCT_KEY.KEYBOARD]: 0.1, // 10%
	[PRODUCT_KEY.MOUSE]: 0.15, // 15%
	[PRODUCT_KEY.MONITOR_ARM]: 0.2, // 20%
	[PRODUCT_KEY.LAPTOP_POUCH]: 0.05, // 5%
	[PRODUCT_KEY.SPEAKER]: 0.25 // 25%
});

export const SYSTEM_CONSTANTS = Object.freeze({
	BULK_DISCOUNT_THRESHOLD: 30, // 대량 할인 기준 수량
	BULK_DISCOUNT_RATE: 0.25, // 대량 할인율 25%
	INDIVIDUAL_DISCOUNT_THRESHOLD: 10, // 개별 할인 기준 수량
	TUESDAY_DISCOUNT_RATE: 0.1, // 화요일 할인율 10%
	LIGHTNING_SALE_DISCOUNT: 0.2, // 번개세일 할인율 20%
	SUGGEST_SALE_DISCOUNT: 0.05, // 추천할인 할인율 5%
	SUPER_SALE_DISCOUNT: 0.25 // 슈퍼세일 할인율 25%
});

export const POINT_CONSTANTS = Object.freeze({
	BASE_POINT_RATE: 0.001, // 기본 포인트 적립율 0.1%
	TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배율
	COMBO_BONUS_POINTS: 50, // 키보드+마우스 세트 보너스
	FULL_SET_BONUS_POINTS: 100, // 풀세트 보너스
	BULK_10_BONUS: 20, // 10개 이상 보너스
	BULK_20_BONUS: 50, // 20개 이상 보너스
	BULK_30_BONUS: 100 // 30개 이상 보너스
});

export const STOCK_CONSTANTS = Object.freeze({
	LOW_STOCK_THRESHOLD: 5, // 재고 부족 기준
	TOTAL_STOCK_WARNING: 50 // 전체 재고 경고 기준
});

export const PRODUCT_IDS = {
	KEYBOARD: "p1",
	MOUSE: "p2",
	MONITOR_ARM: "p3",
	LAPTOP_POUCH: "p4",
	SPEAKER: "p5"
} as const;

export const DISCOUNT_RATES = {
	KEYBOARD: 0.1,
	MOUSE: 0.15,
	MONITOR_ARM: 0.2,
	LAPTOP_POUCH: 0.05,
	SPEAKER: 0.25,
	BULK_30_ITEMS: 0.25,
	TUESDAY_SPECIAL: 0.1,
	LIGHTNING_SALE: 0.2,
	SUGGEST_SALE: 0.05
} as const;

export const QUANTITY_THRESHOLDS = {
	BULK_DISCOUNT: 10,
	BULK_30_DISCOUNT: 30,
	BULK_30_BONUS: 30,
	BULK_20_BONUS: 20,
	BULK_10_BONUS: 10,
	LOW_STOCK: 5,
	OUT_OF_STOCK: 0,
	STOCK_WARNING: 50
} as const;

export const POINT_BONUSES = {
	BASE_RATE: 1000,
	TUESDAY_MULTIPLIER: 2,
	KEYBOARD_MOUSE_SET: 50,
	FULL_SET: 100,
	BULK_10_ITEMS: 20,
	BULK_20_ITEMS: 50,
	BULK_30_ITEMS: 100
} as const;

export const TIMER_INTERVALS = {
	LIGHTNING_SALE: 30000,
	SUGGEST_SALE: 60000,
	LIGHTNING_DELAY_MAX: 10000,
	SUGGEST_DELAY_MAX: 20000
} as const;

export const WEEKDAYS = {
	TUESDAY: 2
} as const;

export const INITIAL_PRODUCTS_DATA = [
	{
		id: PRODUCT_IDS.KEYBOARD,
		name: "버그 없애는 키보드",
		price: 10000,
		originalPrice: 10000,
		stock: 50,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.MOUSE,
		name: "생산성 폭발 마우스",
		price: 20000,
		originalPrice: 20000,
		stock: 30,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.MONITOR_ARM,
		name: "거북목 탈출 모니터암",
		price: 30000,
		originalPrice: 30000,
		stock: 20,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.LAPTOP_POUCH,
		name: "에러 방지 노트북 파우치",
		price: 15000,
		originalPrice: 15000,
		stock: 0,
		onSale: false,
		suggestSale: false
	},
	{
		id: PRODUCT_IDS.SPEAKER,
		name: "코딩할 때 듣는 Lo-Fi 스피커",
		price: 25000,
		originalPrice: 25000,
		stock: 10,
		onSale: false,
		suggestSale: false
	}
] as const;

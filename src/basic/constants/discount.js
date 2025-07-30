// Discount related constants
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
		RATE: 25, // 25% discount
		MINIMUM_QUANTITY: 30,
		FINAL_RATE: 75 // 75% of original price
	},
	TUESDAY_SPECIAL: {
		RATE: 10, // 10% additional discount
		FINAL_RATE: 90 // 90% of price
	}
};

export const STOCK_CONSTANTS = {
	LOW_STOCK_THRESHOLD: 5,
	CRITICAL_STOCK_THRESHOLD: 50
};

export const UI_CONSTANTS = {
	LOYALTY_POINTS_RATIO: 1000,
	DAYS: { TUESDAY: 2 }
};
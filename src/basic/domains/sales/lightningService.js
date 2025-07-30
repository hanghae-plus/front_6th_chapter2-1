import { findRandomProductForSale } from "../../utils/productUtils";
import { onUpdateSelectOptions } from "../product/productService";
import { doUpdatePricesInCart } from "../cart/cartService";
import { DISCOUNT_CONSTANTS, UI_CONSTANTS } from "../../constants/discount";

/**
 * Apply lightning sale discount to a product
 * @param {Object} product - Product to apply sale to
 */
function applyLightningSaleDiscount(product) {
	product.val = Math.round((product.originalVal * DISCOUNT_CONSTANTS.LIGHTNING_SALE.FINAL_RATE) / 100);
	product.onSale = true;
}

/**
 * Start lightning sale for a random product
 * @param {Object} appState - Application state
 */
function triggerLightningSale(appState) {
	const luckyItem = findRandomProductForSale();
	
	if (luckyItem) {
		applyLightningSaleDiscount(luckyItem);
		alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
		onUpdateSelectOptions(appState);
		doUpdatePricesInCart(appState);
	}
}

/**
 * Initialize lightning sale timer
 * @param {Object} appState - Application state
 */
export function initializeLightningSale(appState) {
	const lightningDelay = Math.random() * UI_CONSTANTS.TIMERS.LIGHTNING_SALE_MAX_DELAY;
	
	setTimeout(() => {
		setInterval(() => {
			triggerLightningSale(appState);
		}, UI_CONSTANTS.TIMERS.LIGHTNING_SALE_INTERVAL);
	}, lightningDelay);
}
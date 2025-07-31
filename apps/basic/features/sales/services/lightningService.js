import { LIGHTNING_SALE_DISCOUNT, LIGHTNING_SALE_TIMER } from "../constants";
import { findRandomProductForSale } from "../../product";
import { doUpdatePricesInCart } from "../../cart";
import { onUpdateSelectOptions } from "../../product";

/**
 * Apply lightning sale discount to a product
 * @param {Object} product - Product to apply sale to
 */
function applyLightningSaleDiscount(product) {
	product.val = Math.round((product.originalVal * LIGHTNING_SALE_DISCOUNT.FINAL_RATE) / 100);
	product.onSale = true;
}

/**
 * Start lightning sale for a random product
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 */
function triggerLightningSale(appState, uiElements) {
	const luckyItem = findRandomProductForSale();

	if (luckyItem) {
		applyLightningSaleDiscount(luckyItem);
		alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
		onUpdateSelectOptions(appState, uiElements);
		doUpdatePricesInCart(appState, uiElements);
	}
}

/**
 * Initialize lightning sale timer
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 */
export function initializeLightningSale(appState, uiElements) {
	const lightningDelay = Math.random() * LIGHTNING_SALE_TIMER.MAX_DELAY;

	setTimeout(() => {
		setInterval(() => {
			triggerLightningSale(appState, uiElements);
		}, LIGHTNING_SALE_TIMER.INTERVAL);
	}, lightningDelay);
}

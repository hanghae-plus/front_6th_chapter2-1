import { DISCOUNT_CONSTANTS, UI_CONSTANTS } from "../../shared/constants/discount";
import { findRandomProductForSale } from "../../shared/utils/productUtils";
import { doUpdatePricesInCart } from "../cart/cartService";
import { onUpdateSelectOptions } from "../product/productService";

/**
 * Apply lightning sale discount to a product
 * @param {Object} product - Product to apply sale to
 */
function applyLightningSaleDiscount(product) {
	product.val = Math.round(
		(product.originalVal * DISCOUNT_CONSTANTS.LIGHTNING_SALE.FINAL_RATE) / 100
	);
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
	const lightningDelay = Math.random() * UI_CONSTANTS.TIMERS.LIGHTNING_SALE_MAX_DELAY;

	setTimeout(() => {
		setInterval(() => {
			triggerLightningSale(appState, uiElements);
		}, UI_CONSTANTS.TIMERS.LIGHTNING_SALE_INTERVAL);
	}, lightningDelay);
}

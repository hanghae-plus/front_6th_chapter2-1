import { DISCOUNT_CONSTANTS, UI_CONSTANTS } from "../../shared/constants/discount";
import { findSuggestableProduct } from "../../shared/utils/productUtils";
import { doUpdatePricesInCart } from "../cart/cartService";
import { onUpdateSelectOptions } from "../product/productService";

/**
 * Apply suggest sale discount to a product
 * @param {Object} product - Product to apply sale to
 */
function applySuggestSaleDiscount(product) {
	product.val = Math.round((product.val * DISCOUNT_CONSTANTS.SUGGEST_SALE.FINAL_RATE) / 100);
	product.suggestSale = true;
}

/**
 * Suggest a product with discount
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 */
function triggerSuggestSale(appState, uiElements) {
	if (!appState.lastSel) return;

	const suggestedProduct = findSuggestableProduct(appState.lastSel);

	if (suggestedProduct) {
		alert(`💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
		applySuggestSaleDiscount(suggestedProduct);
		onUpdateSelectOptions(appState, uiElements);
		doUpdatePricesInCart(appState, uiElements);
	}
}

/**
 * Initialize suggest sale timer
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 */
export function initializeSuggestSale(appState, uiElements) {
	const suggestDelay = Math.random() * UI_CONSTANTS.TIMERS.SUGGEST_SALE_MAX_DELAY;

	setTimeout(() => {
		setInterval(() => {
			triggerSuggestSale(appState, uiElements);
		}, UI_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
	}, suggestDelay);
}

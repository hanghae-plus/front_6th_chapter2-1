import { SUGGEST_SALE_DISCOUNT, SUGGEST_SALE_TIMER } from "../constants";
import { findSuggestableProduct } from "../../product";
import { doUpdatePricesInCart } from "../../cart";
import { onUpdateSelectOptions } from "../../product";

/**
 * Apply suggest sale discount to a product
 * @param {Object} product - Product to apply sale to
 */
function applySuggestSaleDiscount(product) {
	product.val = Math.round((product.val * SUGGEST_SALE_DISCOUNT.FINAL_RATE) / 100);
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
	const suggestDelay = Math.random() * SUGGEST_SALE_TIMER.MAX_DELAY;

	setTimeout(() => {
		setInterval(() => {
			triggerSuggestSale(appState, uiElements);
		}, SUGGEST_SALE_TIMER.INTERVAL);
	}, suggestDelay);
}

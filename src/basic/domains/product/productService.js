import { STOCK_CONSTANTS } from "../../shared/constants/discount";
import { products } from "./data";

export function onUpdateSelectOptions(state, uiElements) {
	// Clear existing options and calculate total stock
	uiElements.sel.innerHTML = "";
	const totalStock = products.reduce((total, product) => total + product.q, 0);

	// Create options for each product
	const optionsHTML = products.map(product => createProductOption(product)).join('');
	uiElements.sel.innerHTML = optionsHTML;

	// Update border color based on stock level
	if (totalStock < STOCK_CONSTANTS.CRITICAL_STOCK_THRESHOLD) {
		uiElements.sel.style.borderColor = "orange";
	} else {
		uiElements.sel.style.borderColor = "";
	}
}

/**
 * Create option HTML string for product
 * @param {Object} product - Product data
 * @returns {string} - Created option HTML string
 */
function createProductOption(product) {
	// Handle out of stock items
	if (product.q === 0) {
		return `<option value="${product.id}" disabled class="text-gray-400">${product.name} - ${product.val}원 (품절)</option>`;
	}

	// Handle different sale combinations
	if (product.onSale && product.suggestSale) {
		return `<option value="${product.id}" class="text-purple-600 font-bold">⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)</option>`;
	} else if (product.onSale) {
		return `<option value="${product.id}" class="text-red-500 font-bold">⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)</option>`;
	} else if (product.suggestSale) {
		return `<option value="${product.id}" class="text-blue-500 font-bold">💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)</option>`;
	} else {
		return `<option value="${product.id}">${product.name} - ${product.val}원</option>`;
	}
}

export const handleStockInfoUpdate = function (state, uiElements) {
	// Generate stock warning messages using more functional approach
	const stockWarnings = products
		.filter((item) => item.q < STOCK_CONSTANTS.LOW_STOCK_THRESHOLD)
		.map((item) => {
			if (item.q > 0) {
				return `${item.name}: 재고 부족 (${item.q}개 남음)`;
			} else {
				return `${item.name}: 품절`;
			}
		})
		.join("\n");

	// Update stock info display
	uiElements.stockInfo.textContent = stockWarnings;
};

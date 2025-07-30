import { STOCK_CONSTANTS } from "../../constants/discount";
import { products } from "./data";

export function onUpdateSelectOptions(state) {
	// Clear existing options and calculate total stock
	state.sel.innerHTML = "";
	const totalStock = products.reduce((total, product) => total + product.q, 0);

	// Create options for each product
	products.forEach((product) => {
		const option = createProductOption(product);
		state.sel.appendChild(option);
	});

	// Update border color based on stock level
	if (totalStock < STOCK_CONSTANTS.CRITICAL_STOCK_THRESHOLD) {
		state.sel.style.borderColor = "orange";
	} else {
		state.sel.style.borderColor = "";
	}
}

/**
 * Create option element for product
 * @param {Object} product - Product data
 * @returns {HTMLOptionElement} - Created option element
 */
function createProductOption(product) {
	const option = document.createElement("option");
	option.value = product.id;

	// Handle out of stock items
	if (product.q === 0) {
		option.textContent = `${product.name} - ${product.val}원 (품절)`;
		option.disabled = true;
		option.className = "text-gray-400";
		return option;
	}

	// Handle different sale combinations
	if (product.onSale && product.suggestSale) {
		option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
		option.className = "text-purple-600 font-bold";
	} else if (product.onSale) {
		option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
		option.className = "text-red-500 font-bold";
	} else if (product.suggestSale) {
		option.textContent = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
		option.className = "text-blue-500 font-bold";
	} else {
		option.textContent = `${product.name} - ${product.val}원`;
	}

	return option;
}

export const handleStockInfoUpdate = function (state) {
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
	state.stockInfo.textContent = stockWarnings;
};

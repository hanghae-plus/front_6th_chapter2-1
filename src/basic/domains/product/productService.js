import { products } from "./data";
import { STOCK_CONSTANTS } from "../../constants/discount";

export function onUpdateSelectOptions(state) {
	let totalStock;
	let opt;
	let discountText;

	// Clear existing options
	state.sel.innerHTML = "";
	totalStock = 0;

	// Calculate total stock
	for (let idx = 0; idx < products.length; idx++) {
		const _p = products[idx];
		totalStock = totalStock + _p.q;
	}

	// Create options for each product
	for (let i = 0; i < products.length; i++) {
		(function () {
			const item = products[i];

			opt = document.createElement("option");
			opt.value = item.id;
			discountText = "";

			// Add sale indicators
			if (item.onSale) discountText += " ⚡SALE";
			if (item.suggestSale) discountText += " 💝추천";

			// Handle out of stock items
			if (item.q === 0) {
				opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
				opt.disabled = true;
				opt.className = "text-gray-400";
			} else {
				// Handle different sale combinations
				if (item.onSale && item.suggestSale) {
					opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
					opt.className = "text-purple-600 font-bold";
				} else if (item.onSale) {
					opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
					opt.className = "text-red-500 font-bold";
				} else if (item.suggestSale) {
					opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
					opt.className = "text-blue-500 font-bold";
				} else {
					opt.textContent = `${item.name} - ${item.val}원${discountText}`;
				}
			}
			state.sel.appendChild(opt);
		})();
	}

	// Update border color based on stock level
	if (totalStock < STOCK_CONSTANTS.CRITICAL_STOCK_THRESHOLD) {
		state.sel.style.borderColor = "orange";
	} else {
		state.sel.style.borderColor = "";
	}
}

export const handleStockInfoUpdate = function (state) {
	let infoMsg = "";

	// Generate stock warning messages
	products.forEach(function (item) {
		if (item.q < STOCK_CONSTANTS.LOW_STOCK_THRESHOLD) {
			if (item.q > 0) {
				infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
			} else {
				infoMsg = `${infoMsg + item.name}: 품절\n`;
			}
		}
	});

	// Update stock info display
	state.stockInfo.textContent = infoMsg;
};
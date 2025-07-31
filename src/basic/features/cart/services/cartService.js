import { BULK_DISCOUNT, GLOBAL_DISCOUNT, TUESDAY_SPECIAL, STOCK_THRESHOLDS } from "../constants";
import { WEEKDAYS } from "../../../shared/constants";
import { BASE_POINT_POLICY } from "../../loyalty";
import { doRenderBonusPoints } from "../../loyalty";
import { PRODUCT_IDS, products } from "../../product";
import { handleStockInfoUpdate } from "../../product";

export function handleCalculateCartStuff(state, uiElements) {
	// Reset state values
	state.totalAmt = 0;
	state.itemCnt = 0;

	// Get cart items and initialize calculation variables
	const cartItems = uiElements.cartDisp.children;
	const itemDiscounts = [];
	let subTot = 0;

	// Calculate totals and discounts for each cart item
	for (let i = 0; i < cartItems.length; i++) {
		(function () {
			let curItem;

			// Find matching product
			for (let j = 0; j < products.length; j++) {
				if (products[j].id === cartItems[i].id) {
					curItem = products[j];
					break;
				}
			}

			const qtyElem = cartItems[i].querySelector(".quantity-number");
			const q = parseInt(qtyElem.textContent);
			const itemTot = curItem.val * q;
			let disc;

			// Initialize discount and add to totals
			disc = 0;
			state.itemCnt += q;
			subTot += itemTot;

			const itemDiv = cartItems[i];
			const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");

			// Update visual styling for bulk items
			priceElems.forEach(function (elem) {
				if (elem.classList.contains("text-lg")) {
					elem.style.fontWeight =
						q >= BULK_DISCOUNT.MINIMUM_QUANTITY ? "bold" : "normal";
				}
			});

			// Apply bulk discounts for 10+ items
			if (q >= BULK_DISCOUNT.MINIMUM_QUANTITY) {
				switch (curItem.id) {
					case PRODUCT_IDS.KEYBOARD:
						disc = BULK_DISCOUNT.KEYBOARD / 100;
						break;
					case PRODUCT_IDS.MOUSE:
						disc = BULK_DISCOUNT.MOUSE / 100;
						break;
					case PRODUCT_IDS.MONITOR_ARM:
						disc = BULK_DISCOUNT.MONITOR_ARM / 100;
						break;
					case PRODUCT_IDS.LAPTOP_POUCH:
						disc = BULK_DISCOUNT.LAPTOP_POUCH / 100;
						break;
					case PRODUCT_IDS.SPEAKER:
						disc = BULK_DISCOUNT.SPEAKER / 100;
						break;
				}

				if (disc > 0) {
					itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
				}
			}

			// Apply discount to total
			state.totalAmt += itemTot * (1 - disc);
		})();
	}

	// Apply global discounts
	let discRate = 0;
	const originalTotal = subTot;

	// Apply bulk discount for 30+ items (overrides individual discounts)
	if (state.itemCnt >= GLOBAL_DISCOUNT.MINIMUM_QUANTITY) {
		state.totalAmt = (subTot * GLOBAL_DISCOUNT.FINAL_RATE) / 100;
		discRate = GLOBAL_DISCOUNT.RATE / 100;
	} else {
		discRate = (subTot - state.totalAmt) / subTot;
	}

	// Apply Tuesday special discount
	const isTuesday = new Date().getDay() === WEEKDAYS.TUESDAY;
	const tuesdaySpecial = document.getElementById("tuesday-special");

	if (isTuesday) {
		if (state.totalAmt > 0) {
			state.totalAmt = (state.totalAmt * TUESDAY_SPECIAL.FINAL_RATE) / 100;
			discRate = 1 - state.totalAmt / originalTotal;
			tuesdaySpecial.classList.remove("hidden");
		} else {
			tuesdaySpecial.classList.add("hidden");
		}
	} else {
		tuesdaySpecial.classList.add("hidden");
	}

	// Update UI elements
	const summaryDetails = document.getElementById("summary-details");
	document.getElementById("item-count").textContent = `🛍️ ${state.itemCnt} items in cart`;
	summaryDetails.innerHTML = "";

	// Generate order summary details
	if (subTot > 0) {
		// Add each cart item to summary
		for (let i = 0; i < cartItems.length; i++) {
			let curItem;

			// Find matching product
			for (let j = 0; j < products.length; j++) {
				if (products[j].id === cartItems[i].id) {
					curItem = products[j];
					break;
				}
			}

			const qtyElem = cartItems[i].querySelector(".quantity-number");
			const q = parseInt(qtyElem.textContent);
			const itemTotal = curItem.val * q;

			summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
		}

		// Add subtotal section
		summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

		// Add discount information
		if (state.itemCnt >= 30) {
			summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
		} else if (itemDiscounts.length > 0) {
			itemDiscounts.forEach(function (item) {
				summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
			});
		}

		// Add Tuesday special discount info
		if (isTuesday) {
			if (state.totalAmt > 0) {
				summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
			}
		}

		// Add shipping info
		summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
	}

	// Update total amount display
	const totalDiv = uiElements.sum.querySelector(".text-2xl");
	if (totalDiv) {
		totalDiv.textContent = `₩${Math.round(state.totalAmt).toLocaleString()}`;
	}

	// Update loyalty points display
	const loyaltyPointsDiv = document.getElementById("loyalty-points");
	if (loyaltyPointsDiv) {
		const points = Math.floor(state.totalAmt / BASE_POINT_POLICY.RATIO);
		if (points > 0) {
			loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
			loyaltyPointsDiv.style.display = "block";
		} else {
			loyaltyPointsDiv.textContent = "적립 포인트: 0p";
			loyaltyPointsDiv.style.display = "block";
		}
	}

	// Update discount information display
	const discountInfoDiv = document.getElementById("discount-info");
	discountInfoDiv.innerHTML = "";
	if (discRate > 0 && state.totalAmt > 0) {
		const savedAmount = originalTotal - state.totalAmt;
		discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
	}

	// Update item count with animation trigger
	const itemCountElement = document.getElementById("item-count");
	if (itemCountElement) {
		const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
		itemCountElement.textContent = `🛍️ ${state.itemCnt} items in cart`;
		if (previousCount !== state.itemCnt) {
			itemCountElement.setAttribute("data-changed", "true");
		}
	}

	// Generate and update stock warning messages
	let stockMsg = "";
	for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
		const item = products[stockIdx];
		if (item.q < STOCK_THRESHOLDS.LOW_STOCK) {
			if (item.q > 0) {
				stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
			} else {
				stockMsg = `${stockMsg + item.name}: 품절\n`;
			}
		}
	}
	uiElements.stockInfo.textContent = stockMsg;
	handleStockInfoUpdate(state, uiElements);
	doRenderBonusPoints(state, uiElements);
}

export function doUpdatePricesInCart(state, uiElements) {
	const cartItems = uiElements.cartDisp.children;

	// Update prices for all cart items
	for (let i = 0; i < cartItems.length; i++) {
		const itemId = cartItems[i].id;
		let product = null;

		// Find matching product
		for (let productIdx = 0; productIdx < products.length; productIdx++) {
			if (products[productIdx].id === itemId) {
				product = products[productIdx];
				break;
			}
		}

		if (product) {
			const priceDiv = cartItems[i].querySelector(".text-lg");
			const nameDiv = cartItems[i].querySelector("h3");

			// Update display based on sale status
			if (product.onSale && product.suggestSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `⚡💝${product.name}`;
			} else if (product.onSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `⚡${product.name}`;
			} else if (product.suggestSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `💝${product.name}`;
			} else {
				priceDiv.textContent = `₩${product.val.toLocaleString()}`;
				nameDiv.textContent = product.name;
			}
		}
	}

	// Recalculate totals after price updates
	handleCalculateCartStuff(state, uiElements);
}

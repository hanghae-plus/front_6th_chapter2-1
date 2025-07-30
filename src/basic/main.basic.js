import { PRODUCT_IDS, products } from "./features/product";
import { Header } from "./shared/components";
import { createAppState } from "./state/appState";
import { onUpdateSelectOptions } from "./domains/product/productService";
import { handleCalculateCartStuff, doUpdatePricesInCart } from "./domains/cart/cartService";
import {
	ProductDropdownSelect,
	CartAddButton,
	StockWarningMessage,
	ProductSelectionPanel,
	CartItemsContainer,
	ShoppingAreaColumn,
	OrderSummaryColumn,
	HelpModalToggleButton,
	HelpModalBackdrop,
	HelpContentPanel,
	MainLayoutGrid,
	ShoppingCartItemElement
} from "./components/ui";

function main() {
	// Initialize application state and get root element
	const appState = createAppState();
	const root = document.getElementById("app");

	// Create UI components using component functions
	appState.sel = ProductDropdownSelect();
	appState.addBtn = CartAddButton();
	appState.stockInfo = StockWarningMessage();
	
	const selectorContainer = ProductSelectionPanel(appState.sel, appState.addBtn, appState.stockInfo);
	appState.cartDisp = CartItemsContainer();
	const leftColumn = ShoppingAreaColumn(selectorContainer, appState.cartDisp);

	const rightColumn = OrderSummaryColumn();
	appState.sum = rightColumn.querySelector("#cart-total");

	// Create manual components
	const manualColumn = HelpContentPanel();
	const manualOverlay = HelpModalBackdrop(manualColumn);
	const manualToggle = HelpModalToggleButton(manualOverlay, manualColumn);
	
	manualOverlay.appendChild(manualColumn);

	const gridContainer = MainLayoutGrid(leftColumn, rightColumn);

	appState.totalAmt = 0;
	appState.itemCnt = 0;
	appState.lastSel = null;

	root.innerHTML = Header();
	root.appendChild(gridContainer);
	root.appendChild(manualToggle);
	root.appendChild(manualOverlay);

	onUpdateSelectOptions(appState);
	handleCalculateCartStuff(appState);

	const lightningDelay = Math.random() * 10000;
	setTimeout(() => {
		setInterval(function () {
			const luckyIdx = Math.floor(Math.random() * products.length);
			const luckyItem = products[luckyIdx];
			if (luckyItem.q > 0 && !luckyItem.onSale) {
				luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
				luckyItem.onSale = true;
				alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
				onUpdateSelectOptions(appState);
				doUpdatePricesInCart(appState);
			}
		}, 30000);
	}, lightningDelay);

	setTimeout(function () {
		setInterval(function () {
			if (appState.lastSel) {
				let suggest = null;
				for (let k = 0; k < products.length; k++) {
					if (products[k].id !== appState.lastSel) {
						if (products[k].q > 0) {
							if (!products[k].suggestSale) {
								suggest = products[k];
								break;
							}
						}
					}
				}
				if (suggest) {
					alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
					suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
					suggest.suggestSale = true;
					onUpdateSelectOptions(appState);
					doUpdatePricesInCart(appState);
				}
			}
		}, 60000);
	}, Math.random() * 20000);

	// Event listeners moved inside main function
	appState.addBtn.addEventListener("click", function () {
		const selItem = appState.sel.value;
		let hasItem = false;

		for (let idx = 0; idx < products.length; idx++) {
			if (products[idx].id === selItem) {
				hasItem = true;
				break;
			}
		}

		if (!selItem || !hasItem) {
			return;
		}

		let itemToAdd = null;

		for (let j = 0; j < products.length; j++) {
			if (products[j].id === selItem) {
				itemToAdd = products[j];
				break;
			}
		}

		if (itemToAdd && itemToAdd.q > 0) {
			const item = document.getElementById(itemToAdd["id"]);
			if (item) {
				const qtyElem = item.querySelector(".quantity-number");
				const newQty = parseInt(qtyElem["textContent"]) + 1;
				if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
					qtyElem.textContent = newQty;
					itemToAdd["q"]--;
				} else {
					alert("재고가 부족합니다.");
				}
			} else {
				const newItem = ShoppingCartItemElement(itemToAdd);
				appState.cartDisp.appendChild(newItem);
				itemToAdd.q--;
			}

			handleCalculateCartStuff(appState);
			appState.lastSel = selItem;
		}
	});

	appState.cartDisp.addEventListener("click", function (event) {
		const tgt = event.target;

		if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
			const prodId = tgt.dataset.productId;
			const itemElem = document.getElementById(prodId);
			let prod = null;

			for (let prdIdx = 0; prdIdx < products.length; prdIdx++) {
				if (products[prdIdx].id === prodId) {
					prod = products[prdIdx];
					break;
				}
			}

			if (tgt.classList.contains("quantity-change")) {
				const qtyChange = parseInt(tgt.dataset.change);
				const qtyElem = itemElem.querySelector(".quantity-number");
				const currentQty = parseInt(qtyElem.textContent);
				const newQty = currentQty + qtyChange;

				if (newQty > 0 && newQty <= prod.q + currentQty) {
					qtyElem.textContent = newQty;
					prod.q -= qtyChange;
				} else if (newQty <= 0) {
					prod.q += currentQty;
					itemElem.remove();
				} else {
					alert("재고가 부족합니다.");
				}
			} else if (tgt.classList.contains("remove-item")) {
				const qtyElem = itemElem.querySelector(".quantity-number");
				const remQty = parseInt(qtyElem.textContent);
				prod.q += remQty;
				itemElem.remove();
			}

			handleCalculateCartStuff(appState);
			onUpdateSelectOptions(appState);
		}
	});
}

main();
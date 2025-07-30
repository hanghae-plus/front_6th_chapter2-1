import {
	addProductToCart,
	changeCartItemQuantity,
	removeCartItem
} from "./domains/cart/cartOperations";
import { handleCalculateCartStuff } from "./domains/cart/cartService";
import { onUpdateSelectOptions } from "./domains/product/productService";
import { initializeLightningSale } from "./domains/sales/lightningService";
import { initializeSuggestSale } from "./domains/sales/suggestService";
import {
	CartAddButton,
	CartItemsContainer,
	HelpContentPanel,
	HelpModalBackdrop,
	HelpModalToggleButton,
	MainLayoutGrid,
	OrderSummaryColumn,
	ProductDropdownSelect,
	ProductSelectionPanel,
	ShoppingAreaColumn,
	StockWarningMessage
} from "./domains/ui";
import { Header } from "./shared/components";
import { createAppState } from "./shared/state/appState";
import { findProductById } from "./shared/utils/productUtils";

function main() {
	// Initialize pure business state and get root element
	const appState = createAppState();
	const root = document.getElementById("app");

	// Create UI elements separately from business state
	const uiElements = {
		sel: ProductDropdownSelect(),
		addBtn: CartAddButton(),
		stockInfo: StockWarningMessage(),
		cartDisp: CartItemsContainer(),
		sum: null // Will be set after creating rightColumn
	};

	const selectorContainer = ProductSelectionPanel(
		uiElements.sel,
		uiElements.addBtn,
		uiElements.stockInfo
	);
	const leftColumn = ShoppingAreaColumn(selectorContainer, uiElements.cartDisp);

	const rightColumn = OrderSummaryColumn();
	uiElements.sum = rightColumn.querySelector("#cart-total");

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

	onUpdateSelectOptions(appState, uiElements);
	handleCalculateCartStuff(appState, uiElements);

	// Initialize timer-based sales
	initializeLightningSale(appState, uiElements);
	initializeSuggestSale(appState, uiElements);

	// Event listeners with improved separation of concerns
	uiElements.addBtn.addEventListener("click", handleAddToCartClick(appState, uiElements));

	uiElements.cartDisp.addEventListener("click", handleCartClick(appState, uiElements));
}

/**
 * Handle add to cart button click
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 * @returns {Function} Event handler function
 */
function handleAddToCartClick(appState, uiElements) {
	return function () {
		const selectedProductId = uiElements.sel.value;

		if (addProductToCart(selectedProductId, appState, uiElements)) {
			handleCalculateCartStuff(appState, uiElements);
			appState.lastSel = selectedProductId;
		}
	};
}

/**
 * Handle cart item clicks (quantity change or remove)
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 * @returns {Function} Event handler function
 */
function handleCartClick(appState, uiElements) {
	return function (event) {
		const target = event.target;

		if (
			!target.classList.contains("quantity-change") &&
			!target.classList.contains("remove-item")
		) {
			return;
		}

		const productId = target.dataset.productId;
		const itemElement = document.getElementById(productId);
		const product = findProductById(productId);

		if (!product || !itemElement) return;

		if (target.classList.contains("quantity-change")) {
			const quantityChange = parseInt(target.dataset.change);
			changeCartItemQuantity(itemElement, product, quantityChange);
		} else if (target.classList.contains("remove-item")) {
			removeCartItem(itemElement, product);
		}

		handleCalculateCartStuff(appState, uiElements);
		onUpdateSelectOptions(appState, uiElements);
	};
}

main();

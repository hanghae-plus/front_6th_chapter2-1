import {
	addProductToCart,
	CartAddButton,
	CartItemsContainer,
	changeCartItemQuantity,
	handleCalculateCartStuff,
	OrderSummaryColumn,
	removeCartItem
} from "./features/cart";
import { HelpContentPanel, HelpModalBackdrop, HelpModalToggleButton } from "./features/help";
import {
	findProductById,
	onUpdateSelectOptions,
	ProductDropdownSelect,
	ProductSelectionPanel,
	StockWarningMessage
} from "./features/product";
import { initializeLightningSale, initializeSuggestSale } from "./features/sales";
import { Header, MainLayoutGrid, ShoppingAreaColumn } from "./shared/components";
import { createAppState } from "./shared/state";

function main() {
	// Initialize pure business state and get root element
	const appState = createAppState();
	const root = document.getElementById("app");

	// Create HTML strings for UI elements
	const selectorHTML = ProductDropdownSelect();
	const addButtonHTML = CartAddButton();
	const stockInfoHTML = StockWarningMessage();
	const cartDisplayHTML = CartItemsContainer();

	const selectorContainerHTML = ProductSelectionPanel(selectorHTML, addButtonHTML, stockInfoHTML);
	const leftColumnHTML = ShoppingAreaColumn(selectorContainerHTML, cartDisplayHTML);

	const rightColumnHTML = OrderSummaryColumn();

	// Create manual component HTML strings
	const manualColumnHTML = HelpContentPanel();
	const manualOverlayHTML = HelpModalBackdrop();
	const manualToggleHTML = HelpModalToggleButton();

	const gridContainerHTML = MainLayoutGrid(leftColumnHTML, rightColumnHTML);

	appState.totalAmt = 0;
	appState.itemCnt = 0;
	appState.lastSel = null;

	// Combine all HTML and set innerHTML
	root.innerHTML = `
		${Header()}
		${gridContainerHTML}
		${manualToggleHTML}
		${manualOverlayHTML}
		${manualColumnHTML}
	`;

	// Get UI elements after innerHTML
	const uiElements = {
		sel: document.getElementById("product-select"),
		addBtn: document.getElementById("add-to-cart"),
		stockInfo: document.getElementById("stock-status"),
		cartDisp: document.getElementById("cart-items"),
		sum: document.getElementById("cart-total")
	};

	onUpdateSelectOptions(appState, uiElements);
	handleCalculateCartStuff(appState, uiElements);

	// Initialize timer-based sales
	initializeLightningSale(appState, uiElements);
	initializeSuggestSale(appState, uiElements);

	// Event listeners with improved separation of concerns
	uiElements.addBtn.addEventListener("click", handleAddToCartClick(appState, uiElements));
	uiElements.cartDisp.addEventListener("click", handleCartClick(appState, uiElements));

	// Add event listeners for help modal
	const helpToggle = document.getElementById("help-modal-toggle");
	const helpBackdrop = document.getElementById("help-modal-backdrop");
	const helpPanel = document.getElementById("help-content-panel");

	helpToggle.addEventListener("click", function () {
		helpBackdrop.classList.toggle("hidden");
		helpPanel.classList.toggle("translate-x-full");
	});

	helpBackdrop.addEventListener("click", function (e) {
		if (e.target === helpBackdrop) {
			helpBackdrop.classList.add("hidden");
			helpPanel.classList.add("translate-x-full");
		}
	});
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

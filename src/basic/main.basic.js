import { PRODUCT_IDS, products } from "./domains/product";
import { Header } from "./shared/components";
import { createAppState } from "./state/appState";
import { onUpdateSelectOptions } from "./domains/product/productService";
import { handleCalculateCartStuff } from "./domains/cart/cartService";
import { addProductToCart, changeCartItemQuantity, removeCartItem } from "./domains/cart/cartOperations";
import { initializeLightningSale } from "./domains/sales/lightningService";
import { initializeSuggestSale } from "./domains/sales/suggestService";
import { findProductById } from "./utils/productUtils";
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
	MainLayoutGrid
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

	// Initialize timer-based sales
	initializeLightningSale(appState);
	initializeSuggestSale(appState);

	// Event listeners with improved separation of concerns
	appState.addBtn.addEventListener("click", handleAddToCartClick(appState));

	appState.cartDisp.addEventListener("click", handleCartClick(appState));
}

/**
 * Handle add to cart button click
 * @param {Object} appState - Application state
 * @returns {Function} Event handler function
 */
function handleAddToCartClick(appState) {
	return function () {
		const selectedProductId = appState.sel.value;
		
		if (addProductToCart(selectedProductId, appState)) {
			handleCalculateCartStuff(appState);
			appState.lastSel = selectedProductId;
		}
	};
}

/**
 * Handle cart item clicks (quantity change or remove)
 * @param {Object} appState - Application state
 * @returns {Function} Event handler function
 */
function handleCartClick(appState) {
	return function (event) {
		const target = event.target;
		
		if (!target.classList.contains("quantity-change") && !target.classList.contains("remove-item")) {
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
		
		handleCalculateCartStuff(appState);
		onUpdateSelectOptions(appState);
	};
}

main();
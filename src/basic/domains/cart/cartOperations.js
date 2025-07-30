import { findProductById, productExists } from "../../shared/utils/productUtils";
import { ShoppingCartItem } from "./components/ShoppingCartItem";

/**
 * Add product to cart or increase quantity if already exists
 * @param {string} productId - ID of product to add
 * @param {Object} appState - Application business state
 * @param {Object} uiElements - UI elements
 * @returns {boolean} - Success status
 */
export function addProductToCart(productId, appState, uiElements) {
	if (!productId || !productExists(productId)) {
		return false;
	}

	const productToAdd = findProductById(productId);
	if (!productToAdd || productToAdd.q <= 0) {
		return false;
	}

	const existingCartItem = document.getElementById(productToAdd.id);

	if (existingCartItem) {
		return increaseExistingItemQuantity(existingCartItem, productToAdd);
	} else {
		return addNewItemToCart(productToAdd, uiElements);
	}
}

/**
 * Increase quantity of existing cart item
 * @param {HTMLElement} cartItem - Existing cart item element
 * @param {Object} product - Product data
 * @returns {boolean} - Success status
 */
function increaseExistingItemQuantity(cartItem, product) {
	const qtyElem = cartItem.querySelector(".quantity-number");
	const currentQty = parseInt(qtyElem.textContent);
	const newQty = currentQty + 1;

	if (newQty <= product.q + currentQty) {
		qtyElem.textContent = newQty;
		product.q--;
		return true;
	} else {
		alert("재고가 부족합니다.");
		return false;
	}
}

/**
 * Add new item to cart
 * @param {Object} product - Product to add
 * @param {Object} uiElements - UI elements
 * @returns {boolean} - Success status
 */
function addNewItemToCart(product, uiElements) {
	const newItemHTML = ShoppingCartItem(product);
	uiElements.cartDisp.insertAdjacentHTML('beforeend', newItemHTML);
	product.q--;
	return true;
}

/**
 * Change quantity of cart item
 * @param {HTMLElement} itemElement - Cart item element
 * @param {Object} product - Product data
 * @param {number} quantityChange - Change in quantity (+1 or -1)
 * @returns {boolean} - Success status
 */
export function changeCartItemQuantity(itemElement, product, quantityChange) {
	const qtyElem = itemElement.querySelector(".quantity-number");
	const currentQty = parseInt(qtyElem.textContent);
	const newQty = currentQty + quantityChange;

	if (newQty > 0 && newQty <= product.q + currentQty) {
		qtyElem.textContent = newQty;
		product.q -= quantityChange;
		return true;
	} else if (newQty <= 0) {
		product.q += currentQty;
		itemElement.remove();
		return true;
	} else {
		alert("재고가 부족합니다.");
		return false;
	}
}

/**
 * Remove item from cart completely
 * @param {HTMLElement} itemElement - Cart item element to remove
 * @param {Object} product - Product data
 */
export function removeCartItem(itemElement, product) {
	const qtyElem = itemElement.querySelector(".quantity-number");
	const quantityToRestore = parseInt(qtyElem.textContent);
	product.q += quantityToRestore;
	itemElement.remove();
}

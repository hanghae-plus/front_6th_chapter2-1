import { products } from "../../domains/product";

/**
 * Find a product by its ID
 * @param {string} productId - The product ID to search for
 * @returns {Object|null} - The found product or null if not found
 */
export function findProductById(productId) {
	return products.find((product) => product.id === productId) || null;
}

/**
 * Check if a product exists in the products array
 * @param {string} productId - The product ID to check
 * @returns {boolean} - True if product exists, false otherwise
 */
export function productExists(productId) {
	return products.some((product) => product.id === productId);
}

/**
 * Find an available product for suggestion (not last selected and in stock)
 * @param {string} lastSelectedId - The ID of the last selected product
 * @returns {Object|null} - Available product for suggestion or null
 */
export function findSuggestableProduct(lastSelectedId) {
	return (
		products.find(
			(product) => product.id !== lastSelectedId && product.q > 0 && !product.suggestSale
		) || null
	);
}

/**
 * Find a random product with stock for lightning sale
 * @returns {Object|null} - Random product with stock or null
 */
export function findRandomProductForSale() {
	const availableProducts = products.filter((product) => product.q > 0 && !product.onSale);
	if (availableProducts.length === 0) return null;

	const randomIndex = Math.floor(Math.random() * availableProducts.length);
	return availableProducts[randomIndex];
}

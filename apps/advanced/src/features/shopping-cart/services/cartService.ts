import type { CartItem } from "../../../shared";
import type { Product } from "../../product-selection";

export function findCartItemById(productId: string, cartItems: CartItem[]): CartItem | undefined {
	if (!productId || !Array.isArray(cartItems)) {
		return undefined;
	}
	return cartItems.find((item) => item.id === productId);
}

export function findProductById(products: Product[], productId: string): Product | undefined {
	if (!productId || typeof productId !== "string") {
		return undefined;
	}
	return products.find((product) => product.id === productId);
}

export function isValidQuantityUpdate(
	product: Product,
	currentCartQuantity: number,
	newQuantity: number
): boolean {
	if (!product || typeof currentCartQuantity !== "number" || typeof newQuantity !== "number") {
		return false;
	}
	if (newQuantity < 0 || !Number.isInteger(newQuantity) || !Number.isInteger(currentCartQuantity)) {
		return false;
	}
	const totalAvailable = product.stock + currentCartQuantity;
	return newQuantity > 0 && newQuantity <= totalAvailable;
}

export const processQuantityChange = (
	productId: string,
	change: number,
	cartItems: CartItem[],
	products: Product[]
): {
	success: boolean;
	action: "remove" | "update" | "error";
	cartItem?: CartItem;
	product?: Product;
	newQuantity?: number;
	currentQuantity?: number;
} => {
	const cartItem = findCartItemById(productId, cartItems);
	const product = findProductById(products, productId);

	if (!cartItem || !product) {
		return { success: false, action: "error" };
	}

	const currentQuantity = cartItem.quantity;
	const newQuantity = currentQuantity + change;

	// 수량이 0 이하가 되면 아이템 제거
	if (newQuantity <= 0) {
		return {
			success: true,
			action: "remove",
			cartItem,
			product,
			currentQuantity
		};
	}

	// 수량 업데이트 가능 여부 확인
	if (isValidQuantityUpdate(product, currentQuantity, newQuantity)) {
		return {
			success: true,
			action: "update",
			cartItem,
			product,
			newQuantity,
			currentQuantity
		};
	}

	return { success: false, action: "error" };
};

export const processItemRemoval = (
	productId: string,
	cartItems: CartItem[]
): {
	success: boolean;
	cartItem?: CartItem;
} => {
	const cartItem = findCartItemById(productId, cartItems);

	if (!cartItem) {
		return { success: false };
	}

	return { success: true, cartItem };
};

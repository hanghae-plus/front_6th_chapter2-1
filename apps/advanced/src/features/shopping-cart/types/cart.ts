import type { CartItem } from "../../../shared";
import type { Product } from "../../product-selection";

export type CartOperations = {
	handleQuantityChange: (productId: string, change: number) => void;
	handleRemoveItem: (productId: string) => void;
};

export type ShoppingCartProps = {
	cartItems: CartItem[];
	products: Product[];
	onQuantityChange: (productId: string, change: number) => void;
	onRemove: (productId: string) => void;
};

export type UseShoppingCartProps = {
	cartItems: CartItem[];
	products: Product[];
	onCartUpdate: (updateFn: (prev: CartItem[]) => CartItem[]) => void;
	onProductsUpdate: (updateFn: (prev: Product[]) => Product[]) => void;
};

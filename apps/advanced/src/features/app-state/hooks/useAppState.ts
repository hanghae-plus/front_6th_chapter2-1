import { useState } from "react";

import type { CartItem, Product } from "../../../shared";
import { createInitialProducts } from "../../product-selection/services";

export function useAppState() {
	const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>(createInitialProducts);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	return {
		lastSelectedProductId,
		products,
		cartItems,
		setLastSelectedProductId,
		setProducts,
		setCartItems
	};
}

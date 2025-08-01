import { useMemo } from "react";

import type { CartItem } from "../../../shared";
import { calculateCartTotals, calculatePoints } from "../../order-summary";
import { calculateTotalStock, generateStockMessage, type Product } from "../../product-selection";

export function useAppCalculations(cartItems: CartItem[], products: Product[]) {
	return useMemo(() => {
		const cartResult = calculateCartTotals(cartItems, products);
		const pointResult = calculatePoints(cartResult.totalAmount, cartItems, cartResult.itemCount);
		const stockMessage = generateStockMessage(products);
		const totalStock = calculateTotalStock(products);

		return {
			...cartResult,
			bonusPoints: pointResult.bonusPoints,
			pointsDetail: pointResult.pointsDetail,
			stockMessage,
			totalStock
		};
	}, [cartItems, products]);
}

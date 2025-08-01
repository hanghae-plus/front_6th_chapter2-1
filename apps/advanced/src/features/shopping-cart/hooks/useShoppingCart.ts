import { useCallback } from "react";

import { processItemRemoval, processQuantityChange } from "../services";
import type { CartOperations, UseShoppingCartProps } from "../types";

export function useShoppingCart({
	cartItems,
	products,
	onCartUpdate,
	onProductsUpdate
}: UseShoppingCartProps): CartOperations {
	const handleQuantityChange = useCallback(
		(productId: string, change: number) => {
			const result = processQuantityChange(productId, change, cartItems, products);

			if (!result.success) {
				if (result.action === "error") {
					alert("재고가 부족합니다.");
				}
				return;
			}

			if (result.action === "remove" && result.cartItem && result.currentQuantity) {
				// 아이템 제거 - 재고 복구
				onProductsUpdate((prev) =>
					prev.map((item) =>
						item.id === productId ? { ...item, stock: item.stock + result.currentQuantity! } : item
					)
				);
				onCartUpdate((prev) => prev.filter((item) => item.id !== productId));
			} else if (result.action === "update" && result.newQuantity) {
				// 수량 업데이트
				onCartUpdate((prev) =>
					prev.map((item) =>
						item.id === productId ? { ...item, quantity: result.newQuantity! } : item
					)
				);
				onProductsUpdate((prev) =>
					prev.map((item) =>
						item.id === productId ? { ...item, stock: item.stock - change } : item
					)
				);
			}
		},
		[cartItems, products, onCartUpdate, onProductsUpdate]
	);

	const handleRemoveItem = useCallback(
		(productId: string) => {
			const result = processItemRemoval(productId, cartItems);

			if (!result.success || !result.cartItem) return;

			// 재고 복구 및 장바구니에서 제거
			onProductsUpdate((prev) =>
				prev.map((item) =>
					item.id === productId ? { ...item, stock: item.stock + result.cartItem!.quantity } : item
				)
			);
			onCartUpdate((prev) => prev.filter((item) => item.id !== productId));
		},
		[cartItems, onCartUpdate, onProductsUpdate]
	);

	return {
		handleQuantityChange,
		handleRemoveItem
	};
}

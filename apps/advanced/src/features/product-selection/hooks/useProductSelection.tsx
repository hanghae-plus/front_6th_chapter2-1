import { useCallback, useState } from "react";

import type { CartItem } from "../../../shared";
import { findCartItemById, isValidQuantityUpdate } from "../../shopping-cart/services";
import { hasEnoughStock, isValidProduct } from "../services";
import type { Product } from "../types";

type UseProductSelectionProps = {
	products: Product[];
	cartItems: CartItem[];
	onProductAdded: (productId: string) => void;
	onCartUpdate: (updateFn: (prev: CartItem[]) => CartItem[]) => void;
	onProductsUpdate: (updateFn: (prev: Product[]) => Product[]) => void;
};

export function useProductSelection({
	products,
	cartItems,
	onProductAdded,
	onCartUpdate,
	onProductsUpdate
}: UseProductSelectionProps) {
	const [selectedProductId, setSelectedProductId] = useState<string>("");

	const handleProductSelect = useCallback((productId: string) => {
		setSelectedProductId(productId);
	}, []);

	const handleAddToCart = useCallback(() => {
		// 상품 유효성 검사
		if (!isValidProduct(selectedProductId, products)) {
			return;
		}

		// 선택된 상품 찾기
		const itemToAdd = products.find((p) => p.id === selectedProductId);
		if (!itemToAdd || !hasEnoughStock(itemToAdd, 1)) {
			return;
		}

		// 장바구니에 이미 있는 상품인지 확인
		const existingItem = findCartItemById(itemToAdd.id, cartItems);

		if (existingItem) {
			// 기존 상품 수량 증가
			const newQuantity = existingItem.quantity + 1;
			if (isValidQuantityUpdate(itemToAdd, existingItem.quantity, newQuantity)) {
				onCartUpdate((prev) =>
					prev.map((item) => (item.id === itemToAdd.id ? { ...item, quantity: newQuantity } : item))
				);
				onProductsUpdate((prev) =>
					prev.map((item) => (item.id === itemToAdd.id ? { ...item, stock: item.stock - 1 } : item))
				);
			} else {
				alert("재고가 부족합니다.");
			}
		} else {
			// 새 상품 추가
			onCartUpdate((prev) => [...prev, { ...itemToAdd, quantity: 1 }]);
			onProductsUpdate((prev) =>
				prev.map((item) => (item.id === itemToAdd.id ? { ...item, stock: item.stock - 1 } : item))
			);
		}

		// 마지막 선택 상품 업데이트
		onProductAdded(selectedProductId);
	}, [selectedProductId, products, cartItems, onProductAdded, onCartUpdate, onProductsUpdate]);

	return {
		selectedProductId,
		handleProductSelect,
		handleAddToCart
	};
}

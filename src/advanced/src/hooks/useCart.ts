import { useState, useCallback } from "react";
import type { CartItem, Product } from "../types";
import { showStockAlert } from "../services/alertService";

export const useCart = (
  products: Product[],
  updateProductQuantity: (productId: string, quantityChange: number) => void,
  restoreProductQuantity: (productId: string, quantity: number) => void
) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stockError, setStockError] = useState("");

  const addToCart = useCallback(
    (productId: string) => {
      // 상품 선택 확인
      if (!productId) {
        showStockAlert("상품을 선택해주세요.");
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) {
        showStockAlert("잘못된 상품입니다.");
        return;
      }

      // 품절 상품 확인
      if (product.quantity === 0) {
        const errorMessage = `재고 부족: ${product.name}은(는) 품절입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      const existingItem = cart.find((item) => item.id === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + 1;

      // 재고 확인 (장바구니에 있는 수량을 고려한 검증)
      if (newQuantity > product.quantity + currentQuantity) {
        const errorMessage = `재고 부족: ${product.name}의 재고는 ${product.quantity}개입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      // 재고 감소
      updateProductQuantity(productId, -1);

      if (existingItem) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        return;
      }

      const newItem: CartItem = {
        id: productId,
        name: product.name,
        val: product.val,
        quantity: 1,
        discount: 0,
      };
      setCart((prev) => [...prev, newItem]);
    },
    [products, cart]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      const existingItem = cart.find((item) => item.id === id);
      if (!existingItem) return;

      const currentQuantity = existingItem.quantity;
      const quantityChange = quantity - currentQuantity;

      if (quantity === 0) {
        // 장바구니에서 제거하고 재고 복원
        restoreProductQuantity(id, currentQuantity);
        setCart((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      // 재고 확인 (실제 재고와 비교)
      const product = products.find((p) => p.id === id);
      if (product && quantity > product.quantity + currentQuantity) {
        const errorMessage = `재고 부족: ${product.name}의 재고는 ${product.quantity}개입니다.`;
        setStockError(errorMessage);
        showStockAlert(errorMessage);
        return;
      }

      // 재고 에러 초기화
      setStockError("");

      // 재고 업데이트
      updateProductQuantity(id, -quantityChange);

      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [products, cart, updateProductQuantity, restoreProductQuantity]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        // 재고 복원
        restoreProductQuantity(id, existingItem.quantity);
      }
      setCart((prev) => prev.filter((item) => item.id !== id));
    },
    [cart, restoreProductQuantity]
  );

  return {
    cart,
    stockError,
    addToCart,
    updateQuantity,
    removeFromCart,
    setStockError,
  };
};

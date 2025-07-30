import productStore from "../store/product";
import cartStore from "../store/cart";
import { renderQuantity } from "../ui/render/renderQuantity";
import { renderNewCartItem } from "../ui/render/renderNewCartItem";
import { handleCalculateCartStuff } from "./cartCalculationService";

/**
 * 장바구니 상품 수량 추가/감소/삭제 및 UI 처리까지 담당하는 서비스
 */
export const updateCartItem = (
  prodId,
  qtyChange,

  cartContainer
) => {
  const product = productStore.getState().products.find((p) => p.id === prodId);
  if (!product) return;

  const itemElem = document.getElementById(prodId);
  const existsInDOM = Boolean(itemElem);
  const currentQty = existsInDOM
    ? parseInt(itemElem.querySelector(".quantity-number")?.textContent || "0")
    : 0;

  const newQty = currentQty + qtyChange;

  if (newQty <= 0) {
    itemElem?.remove();
    productStore.updateStock(prodId, product.q + currentQty);

    // cartStore에서도 해당 아이템 제거
    const currentState = cartStore.getState();
    const updatedItems = currentState.items.filter(
      (item) => item.id !== prodId
    );
    cartStore.updateItems(updatedItems);

    handleCalculateCartStuff();
    return;
  }

  if (newQty > product.q + currentQty) {
    alert("재고가 부족합니다.");
    return;
  }

  productStore.updateStock(prodId, product.q - qtyChange);

  if (existsInDOM) {
    renderQuantity(prodId, newQty);
  } else {
    const newItemHTML = renderNewCartItem(product);
    cartContainer.insertAdjacentHTML("beforeend", newItemHTML);
  }

  // 수량이 증가하는 경우에만 addCartItem 호출
  if (qtyChange > 0) {
    cartStore.addCartItem(product);
  } else {
    // 수량이 감소하는 경우 cartStore에서 직접 수량 업데이트
    const currentState = cartStore.getState();
    const updatedItems = currentState.items
      .map((item) =>
        item.id === prodId
          ? { ...item, quantity: Math.max(0, item.quantity + qtyChange) }
          : item
      )
      .filter((item) => item.quantity > 0); // 수량이 0 이하인 아이템 제거

    cartStore.updateItems(updatedItems);
  }

  handleCalculateCartStuff();
};

import productStore from "../store/product";
import cartStore from "../store/cart";
import { renderQuantity } from "../ui/render/renderQuantity";
import { renderNewCartItem } from "../ui/render/renderNewCartItem";

/**
 * 장바구니 상품 수량 추가/감소/삭제 및 UI 처리까지 담당하는 서비스
 */
export const updateCartItem = (
  prodId,
  qtyChange,
  onCartUpdated,
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

  cartStore.addCartItem(product);

  onCartUpdated();
};

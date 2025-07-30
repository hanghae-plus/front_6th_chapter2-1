import productStore from "../store/product";
import cartStore from "../store/cart";
import { updateCartItem } from "../services/cartService";

/**
 * "추가" 버튼 이벤트 초기화
 */
export const initAddButtonEvent = (
  addBtn,
  sel,
  cartDisp,
  handleCalculateCartStuff
) => {
  addBtn.addEventListener("click", () => {
    const selectedItemId = sel.value;
    if (!selectedItemId) return;

    const prodList = productStore.getState().products;
    const itemToAdd = prodList.find((p) => p.id === selectedItemId);
    if (!itemToAdd || itemToAdd.q <= 0) {
      alert("재고가 부족하거나 잘못된 상품입니다.");
      return;
    }

    updateCartItem(selectedItemId, +1, handleCalculateCartStuff, cartDisp);
  });
};

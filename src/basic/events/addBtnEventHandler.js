import productStore from "../store/product";
import { updateCartItem } from "../services/cartService";
import {
  getAddToCartButton,
  getProductSelect,
  getCartContainer,
} from "../ui/dom/getDOMElements";

/**
 * "추가" 버튼 이벤트 초기화
 */
export const initAddButtonEvent = () => {
  const addBtn = getAddToCartButton();
  const productSelect = getProductSelect();
  const cartContainer = getCartContainer();

  addBtn.addEventListener("click", () => {
    const selectedItemId = productSelect.value;
    if (!selectedItemId) return;

    const productList = productStore.getState().products;
    const selectedProduct = productList.find((p) => p.id === selectedItemId);
    if (!selectedProduct || selectedProduct.quantity <= 0) {
      alert("재고가 부족하거나 잘못된 상품입니다.");
      return;
    }

    updateCartItem(selectedItemId, +1, cartContainer);
  });
};

import productStore from "../store/product";
import cartStore from "../store/cart";
import { renderAllCartItems } from "../ui/render/renderAllCartItems";
import { handleCalculateCartStuff } from "./cartCalculationService";

/**
 * 장바구니 상품 수량 추가/감소/삭제 및 UI 처리까지 담당하는 서비스
 * @param {string} productId - 상품 ID
 * @param {number} quantityChangeValue - 수량 변경 값
 * @param {HTMLElement} cartContainer - 장바구니 컨테이너
 */
export const updateCartItem = (
  productId,
  quantityChangeValue,
  cartContainer
) => {
  // 상품 존재 체크
  const product = productStore
    .getState()
    .products.find((p) => p.id === productId);
  if (!product) return;

  // 현재 cartStore 상태에서 수량 확인
  const currentState = cartStore.getState();
  const existingItem = currentState.items.find((item) => item.id === productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const newQuantity = currentQuantity + quantityChangeValue;

  // 재고 확인 (수량이 증가하는 경우에만)
  if (
    quantityChangeValue > 0 &&
    newQuantity > product.quantity + currentQuantity
  ) {
    alert("재고가 부족합니다.");
    return;
  }

  // 재고 업데이트
  productStore.updateStock(productId, product.quantity - quantityChangeValue);

  // 수량 증가 또는 추가
  if (quantityChangeValue > 0) {
    cartStore.addCartItem(product);
  }

  // 수량 감소 또는 제거
  if (quantityChangeValue <= 0) {
    cartStore.updateItemQuantity(productId, newQuantity);
  }

  // 전체 UI 다시 렌더링 (DOM 조작 없이)
  const updatedCartItems = cartStore.getState().items;
  const cartItemsHTML = renderAllCartItems(updatedCartItems);
  cartContainer.innerHTML = cartItemsHTML;

  // 장바구니 계산
  handleCalculateCartStuff();
};

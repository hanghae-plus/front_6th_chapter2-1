import productStore from "../store/product";
import cartStore from "../store/cart";
import { renderAllCartItems } from "../ui/render/renderAllCartItems";
import { handleCalculateCartStuff } from "./cartCalculationService";

/**
 * 장바구니 상품 수량 추가/감소/삭제 및 UI 처리까지 담당하는 서비스
 */
export const updateCartItem = (
  productId,
  quantityChangeValue,
  cartContainer
) => {
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

  // cartStore 업데이트
  if (quantityChangeValue > 0) {
    // 수량 증가: addCartItem 사용
    cartStore.addCartItem(product);
  } else {
    // 수량 감소 또는 제거: updateItemQuantity 사용
    cartStore.updateItemQuantity(productId, newQuantity);
  }

  // 전체 UI 다시 렌더링 (DOM 조작 없이)
  const updatedCartItems = cartStore.getState().items;
  const cartItemsHTML = renderAllCartItems(updatedCartItems);
  cartContainer.innerHTML = cartItemsHTML;

  handleCalculateCartStuff();
};

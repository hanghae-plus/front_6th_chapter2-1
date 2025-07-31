import {
  getProduct,
  increaseProductQuantity,
  decreaseProductQuantity,
} from '../../state/cart.js';
import { updateCartDisplay } from '../../modules/index.js';
import { updateProductOptions } from '../../modules/updateProductOptions.js';
import { ALERT_MESSAGES } from '../../../shared/constants/event.js';

/**
 * 장바구니 아이템 클릭 이벤트 라우터
 * 클릭된 요소에 따라 적절한 핸들러로 이벤트를 분배
 */
export function handleCartItemClick({
  cartItemElement,
  cartState,
  setCartState,
}) {
  const productId = cartItemElement.id;
  const product = getProduct(cartState, productId);

  if (!product) {
    return;
  }

  const event = window.event;
  const target = event.target;

  // 수량 변경 버튼 클릭
  if (target.classList.contains('quantity-change')) {
    handleQuantityChangeButton({
      target,
      productId,
      product,
      cartItemElement,
      cartState,
      setCartState,
    });
  }

  // 삭제 버튼 클릭
  if (target.classList.contains('remove-item')) {
    handleRemoveButton({
      productId,
      product,
      cartItemElement,
      cartState,
      setCartState,
    });
  }
}

/**
 * 수량 변경 버튼 클릭 처리
 */
const handleQuantityChangeButton = ({
  target,
  productId,
  product,
  cartItemElement,
  cartState,
  setCartState,
}) => {
  const quantityChange = parseInt(target.dataset.change, 10);
  const quantityElement = cartItemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent, 10);
  const newQuantity = currentQuantity + quantityChange;

  // 수량이 0 이하가 되는 경우 아이템 제거
  if (newQuantity <= 0) {
    removeCartItemFromCart({
      productId,
      cartItemElement,
      currentQuantity,
      cartState,
      setCartState,
    });
    return;
  }

  // 재고 부족 검증
  if (isInsufficientStock(newQuantity, product, currentQuantity)) {
    alert(ALERT_MESSAGES.insufficientStock);
    return;
  }

  // 수량 업데이트
  updateItemQuantity(quantityElement, newQuantity);
  updateProductStock(cartState, productId, quantityChange, setCartState);
  updateCartUI(cartState);
};

/**
 * 재고 부족 여부 확인
 */
const isInsufficientStock = (newQuantity, product, currentQuantity) => {
  return newQuantity > product.q + currentQuantity;
};

/**
 * 아이템 수량 업데이트
 */
const updateItemQuantity = (quantityElement, newQuantity) => {
  quantityElement.textContent = newQuantity;
};

/**
 * 상품 재고 업데이트
 */
const updateProductStock = (
  cartState,
  productId,
  quantityChange,
  setCartState
) => {
  const newCartState = decreaseProductQuantity(
    cartState,
    productId,
    quantityChange
  );
  setCartState(newCartState);
};

/**
 * 삭제 버튼 클릭 처리
 */
const handleRemoveButton = ({
  productId,
  product,
  cartItemElement,
  cartState,
  setCartState,
}) => {
  const removedQuantity = getItemQuantity(cartItemElement);
  removeCartItemFromCart({
    productId,
    cartItemElement,
    removedQuantity,
    cartState,
    setCartState,
  });
};

/**
 * 아이템 수량 추출
 */
const getItemQuantity = cartItemElement => {
  const quantityElement = cartItemElement.querySelector('.quantity-number');
  return parseInt(quantityElement.textContent, 10);
};

/**
 * 장바구니에서 아이템 제거
 */
const removeCartItemFromCart = ({
  productId,
  cartItemElement,
  quantity,
  cartState,
  setCartState,
}) => {
  restoreProductStock(cartState, productId, quantity, setCartState);
  removeItemFromDOM(cartItemElement);
  updateCartUI(cartState);
};

/**
 * 상품 재고 복원
 */
const restoreProductStock = (cartState, productId, quantity, setCartState) => {
  const newCartState = increaseProductQuantity(cartState, productId, quantity);
  setCartState(newCartState);
};

/**
 * DOM에서 아이템 제거
 */
const removeItemFromDOM = cartItemElement => {
  cartItemElement.remove();
};

/**
 * 장바구니 UI 업데이트
 */
const updateCartUI = cartState => {
  updateCartDisplayUI(cartState);
  updateProductOptionsUI(cartState);
};

/**
 * 장바구니 표시 업데이트
 */
const updateCartDisplayUI = cartState => {
  const cartDisplayArea = document.getElementById('cart-items');
  updateCartDisplay({
    cartDisp: cartDisplayArea,
    prodList: cartState.productInventory,
  });
};

/**
 * 상품 선택 옵션 업데이트
 */
const updateProductOptionsUI = cartState => {
  const productSelector = document.getElementById('product-selector');
  if (productSelector) {
    updateProductOptions({
      sel: productSelector,
      prodList: cartState.productInventory,
    });
  }
};

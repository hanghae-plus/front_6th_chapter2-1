import { createCartItem } from './CartItem';

export const createCartDisplay = () => {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  return cartDisplay;
};

/**
 * 카트에 아이템 추가
 * @param {HTMLElement} cartDisplay - 카트 디스플레이 요소
 * @param {Object} product - 추가할 상품 정보
 */
export const addItemToCart = (cartDisplay, product) => {
  const cartItem = createCartItem(product);
  cartDisplay.appendChild(cartItem);
  return cartItem;
};

/**
 * 카트에서 아이템 제거
 * @param {string} productId - 제거할 상품 ID
 */
export const removeItemFromCart = (productId) => {
  const itemElement = document.getElementById(productId);
  if (itemElement) {
    itemElement.remove();
  }
};

/**
 * 카트의 모든 아이템 가져오기
 * @param {HTMLElement} cartDisplay - 카트 디스플레이 요소
 */
export const getCartItems = (cartDisplay) => {
  return cartDisplay.children;
};

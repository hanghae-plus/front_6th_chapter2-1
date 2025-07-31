import { PRODUCT_STATUS } from '../data/product.data';
import { getProductStatus } from './product.util';
import { findProductById } from './product.util.js';

/**
 * 장바구니 아이템들의 총 가격을 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 가격
 */
export function getCartTotalPrice(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.val * item.quantity, 0);
}

/**
 * 장바구니 아이템들의 총 개수를 계산하는 함수
 * @param {Array} cartItems - 장바구니 아이템 목록
 * @returns {number} 장바구니 아이템들의 총 개수
 */
export function getCartTotalCount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

export function getProductStatusIcon(product) {
  const icons = {
    [PRODUCT_STATUS.SUPER_SALE]: '⚡💝',
    [PRODUCT_STATUS.LIGHTNING_SALE]: '⚡',
    [PRODUCT_STATUS.SUGGESTION_SALE]: '💝',
    [PRODUCT_STATUS.OUT_OF_STOCK]: '',
    [PRODUCT_STATUS.NORMAL]: '',
  };

  const status = getProductStatus(product);

  return icons[status];
}

export function parseQuantityFromElement(element) {
  if (!element) return 0;
  return parseInt(element.textContent) || 0;
}

export function isQuantityValid(newQuantity) {
  return newQuantity > 0;
}

export function hasValidProduct(productToAdd) {
  return productToAdd && productToAdd.q > 0;
}

export function isExistingCartItem(productId) {
  return document.getElementById(productId);
}

export function isQuantityChangeButton(targetElement) {
  return targetElement.classList.contains('quantity-change');
}

export function isRemoveButton(targetElement) {
  return targetElement.classList.contains('remove-item');
}

/**
 * 장바구니 아이템 정보를 추출하는 공통 함수
 */
export function extractCartItemInfo(cartItem, productList) {
  const product = findProductById(cartItem.id, productList);
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseQuantityFromElement(quantityElement);

  return {
    cartItem,
    product,
    quantity,
    quantityElement,
    isValid: !!product,
    itemTotalPrice: product ? product.val * quantity : 0,
  };
}

/**
 * 장바구니 컨테이너를 아이템 배열로 변환
 */
export function getCartItemsArray(cartItemsContainer) {
  if (!cartItemsContainer) return [];
  return [...cartItemsContainer.children];
}

/**
 * 장바구니의 모든 아이템 정보를 추출
 */
export function getAllCartItemsInfo(cartItemsContainer, productList) {
  const cartItems = getCartItemsArray(cartItemsContainer);
  return cartItems.map(cartItem => extractCartItemInfo(cartItem, productList));
}

/**
 * 유효한 장바구니 아이템들만 필터링
 */
export function getValidCartItemsInfo(cartItemsContainer, productList) {
  return getAllCartItemsInfo(cartItemsContainer, productList).filter(info => info.isValid);
}

/**
 * 장바구니 총 수량 계산
 */
export function calculateTotalQuantity(cartItemsContainer) {
  const cartItems = getCartItemsArray(cartItemsContainer);
  return cartItems.reduce((total, cartItem) => {
    const quantityElement = cartItem.querySelector('.quantity-number');
    return total + parseQuantityFromElement(quantityElement);
  }, 0);
}

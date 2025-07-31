/**
 * 장바구니 관련 비즈니스 로직 함수들
 * 장바구니 아이템 관리, 수량 변경, 상태 업데이트 등의 기능을 제공
 */
import { createCartItemElement } from "../ui/cartUI.js";
import { $, clearSelectorCache } from "./$.js";

/**
 * 기존 장바구니 아이템 찾기
 * @param {string} productId - 상품 ID
 * @returns {Element|null} 기존 장바구니 아이템 요소
 */
export function findExistingCartItem(productId) {
  return $(`#${productId}`);
}

/**
 * 기존 아이템 수량 업데이트
 * @param {Element} existingItem - 기존 아이템 요소
 * @param {Object} product - 상품 객체
 * @returns {boolean} 업데이트 성공 여부
 */
export function updateExistingItemQuantity(existingItem, product) {
  const quantityElement = existingItem.querySelector(".quantity-number");
  if (!quantityElement) {
    console.warn("Quantity element not found");
    return false;
  }

  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q--;
    return true;
  }

  return false;
}

/**
 * 새 장바구니 아이템 생성 및 추가
 * @param {Object} product - 상품 객체
 * @param {Element} cartDisplay - 장바구니 표시 요소
 */
export function createAndAddNewCartItem(product, cartDisplay) {
  const element = createCartItemElement(product);
  cartDisplay.appendChild(element);
  product.q--;

  // 캐시 무효화
  clearSelectorCache();
}

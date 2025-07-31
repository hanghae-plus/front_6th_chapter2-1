/**
 * 프로모션 가격 서비스
 * 프로모션 관련 가격 업데이트 로직
 */

import { findProductById } from '@/basic/features/product/utils/productUtils.js';
import { setInnerHTML, setTextContent } from '@/basic/shared/core/domUtils.js';

/**
 * 장바구니의 모든 가격 업데이트 (메인 함수)
 * @param {HTMLElement} cartDisplayElement - Cart display container
 * @param {Array} productList - Product list
 * @param {Function} onCalculate - Callback for recalculation
 */
export const updatePricesInCart = (
  cartDisplayElement,
  productList,
  onCalculate,
) => {
  if (!cartDisplayElement || !cartDisplayElement.children) {
    return;
  }

  const cartItems = Array.from(cartDisplayElement.children);

  // 각 장바구니 아이템의 가격 디스플레이 업데이트
  cartItems.forEach(cartItem => {
    updateCartItemPrice(cartItem, productList);
  });

  // 재계산 트리거
  if (onCalculate) {
    onCalculate();
  }
};

/**
 * 개별 장바구니 아이템 가격 디스플레이 업데이트
 * @param {HTMLElement} cartItem - Cart item element
 * @param {Array} productList - Product list
 */
const updateCartItemPrice = (cartItem, productList) => {
  const itemId = cartItem.id;
  const product = findProductById(itemId, productList);

  if (!product) return;

  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');

  if (!priceDiv || !nameDiv) return;

  // 가격 디스플레이 업데이트
  updatePriceDisplay(priceDiv, product);

  // 이름에 세일 인디케이터 업데이트
  updateNameDisplay(nameDiv, product);
};

/**
 * 세일 포맷팅으로 가격 디스플레이 업데이트 (선언적)
 * @param {HTMLElement} priceDiv - Price display element
 * @param {object} product - Product data
 */
const updatePriceDisplay = (priceDiv, product) => {
  let priceHTML = '';

  if (product.onSale && product.suggestSale) {
    // 번개세일 + 추천세일
    priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
  } else if (product.onSale) {
    // 번개세일만
    priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
  } else if (product.suggestSale) {
    // 추천세일만
    priceHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
  } else {
    // 일반 가격
    priceHTML = `₩${product.val.toLocaleString()}`;
  }

  setInnerHTML(priceDiv, priceHTML);
};

/**
 * 세일 인디케이터로 이름 디스플레이 업데이트 (선언적)
 * @param {HTMLElement} nameDiv - Name display element
 * @param {object} product - Product data
 */
const updateNameDisplay = (nameDiv, product) => {
  let displayName = product.name;

  if (product.onSale && product.suggestSale) {
    displayName = `⚡💝${product.name}`;
  } else if (product.onSale) {
    displayName = `⚡${product.name}`;
  } else if (product.suggestSale) {
    displayName = `💝${product.name}`;
  }

  setTextContent(nameDiv, displayName);
};

/**
 * 번개세일 적용 (순수 함수)
 * @param {string} productId - 상품 ID
 * @param {number} discountRate - 할인율
 * @param {Array} productList - 상품 목록
 * @returns {boolean} 적용 성공 여부
 */
export const applyFlashSale = (productId, discountRate, productList) => {
  const product = findProductById(productId, productList);

  if (!product || product.onSale) {
    return false;
  }

  // 원가 저장
  if (!product.originalVal) {
    product.originalVal = product.val;
  }

  // 할인 적용
  product.val = Math.round(product.originalVal * (1 - discountRate));
  product.onSale = true;

  return true;
};

/**
 * 추천세일 적용 (순수 함수)
 * @param {string} productId - 상품 ID
 * @param {number} discountRate - 할인율
 * @param {Array} productList - 상품 목록
 * @returns {boolean} 적용 성공 여부
 */
export const applySuggestSale = (productId, discountRate, productList) => {
  const product = findProductById(productId, productList);

  if (!product || product.suggestSale) {
    return false;
  }

  // 원가 저장
  if (!product.originalVal) {
    product.originalVal = product.val;
  }

  // 할인 적용
  product.val = Math.round(product.originalVal * (1 - discountRate));
  product.suggestSale = true;

  return true;
};

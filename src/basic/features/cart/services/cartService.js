/**
 * 장바구니 서비스 - React-ready 구조
 * 순수 함수 중심, DOM 조작 최소화
 */

import { renderCartTotal } from '@/basic/features/cart/components/CartTotal.js';
import { calculateCart } from '@/basic/features/cart/services/cartCalculator.js';
import { highlightDiscountableItems } from '@/basic/features/cart/services/cartUIService.js';
import { PRODUCTS } from '@/basic/features/product/constants/index.js';
import { productState } from '@/basic/features/product/store/productStore.js';
import { BUSINESS_CONSTANTS } from '@/basic/shared/constants/business.js';

/**
 * DOM에서 장바구니 아이템 데이터 추출 (공통 함수)
 */
const getCartItems = () => {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return [];

  return Array.from(cartContainer.children)
    .map(item => {
      const productId = item.id;
      const product = productState.products.find(p => p.id === productId);
      const quantityElement = item.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || '0');

      return { product, quantity, element: item };
    })
    .filter(item => item.product);
};

/**
 * 장바구니 계산 (순수 함수 + DOM 추출)
 */
export const calculateCartTotals = () => {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    return {
      totalAmount: 0,
      discountRate: 0,
      totalItemCount: 0,
      isTuesday: new Date().getDay() === 2,
      appliedDiscounts: [],
    };
  }

  // DOM 요소들을 계산 함수에 전달
  const cartElements = cartItems.map(item => item.element);
  return calculateCart(
    cartElements,
    productState.products,
    BUSINESS_CONSTANTS,
    PRODUCTS,
  );
};

/**
 * 할인 정보 텍스트 생성 (순수 함수)
 */
const createDiscountInfoText = cartResults => {
  const { discountRate, appliedDiscounts } = cartResults;

  if (discountRate <= 0) return '';

  const discountText = `${(discountRate * 100).toFixed(1)}% 할인 적용`;
  const discountDetails =
    appliedDiscounts?.length > 0 ? ` (${appliedDiscounts.join(', ')})` : '';

  return discountText + discountDetails;
};

/**
 * 아이템 카운트 텍스트 생성 (순수 함수)
 */
const createItemCountText = totalItemCount => {
  return `🛍️ ${totalItemCount} items in cart`;
};

/**
 * 할인 정보 업데이트
 */
const updateDiscountInfo = cartResults => {
  const element = document.getElementById('discount-info');
  if (element) {
    element.textContent = createDiscountInfoText(cartResults);
  }
};

/**
 * 화요일 특별 할인 배너 업데이트
 */
const updateTuesdaySpecial = cartResults => {
  const element = document.getElementById('tuesday-special');
  if (element) {
    const shouldShow = cartResults.isTuesday && cartResults.totalAmount > 0;
    if (shouldShow) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
};

/**
 * 헤더 아이템 수 업데이트
 */
const updateHeaderItemCount = cartResults => {
  const element = document.getElementById('item-count');
  if (element) {
    element.textContent = createItemCountText(cartResults.totalItemCount);
  }
};

/**
 * 장바구니 UI 업데이트 (React-like)
 */
export const updateCartUI = cartResults => {
  updateDiscountInfo(cartResults);
  updateTuesdaySpecial(cartResults);
  updateHeaderItemCount(cartResults);
};

/**
 * 장바구니 총액 컴포넌트 렌더링
 */
export const renderCartTotalComponent = pointsResults => {
  const cartResults = calculateCartTotals();

  renderCartTotal({
    amount: cartResults.totalAmount,
    discountRate: cartResults.discountRate,
    point: pointsResults.points || 0,
  });

  const cartData = getCartItems().map(item => ({
    product: item.product,
    quantity: item.quantity,
  }));

  return {
    cartData,
    totalAmount: cartResults.totalAmount,
    discountRate: cartResults.discountRate,
  };
};

export { createDiscountInfoText, createItemCountText, getCartItems };

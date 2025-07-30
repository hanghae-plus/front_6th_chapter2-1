/**
 * 장바구니 서비스
 * 장바구니 관련 비즈니스 로직과 UI 업데이트
 */

import { BUSINESS_CONSTANTS } from '../../../shared/constants/business.js';
import {
  findElement,
  setInnerHTML,
  renderIf,
  setTextContent,
  batchDOM,
  safeDOM,
} from '../../../shared/core/domUtils.js';
import { PRODUCTS } from '../../product/constants/index.js';
import {
  productState,
  setProductState,
} from '../../product/store/ProductStore.js';
import { renderCartTotal } from '../components/CartTotal.js';

import { calculateCart } from './cartCalculator.js';
import { highlightDiscountableItems } from './cartUIService.js';

/**
 * 장바구니 아이템 데이터 추출 (순수 함수)
 * @param {HTMLCollection} cartElements - 카트 DOM 요소들
 * @param {Array} products - 상품 목록
 * @returns {Array} 카트 아이템 데이터
 */
const extractCartItems = (cartElements, products) => {
  return Array.from(cartElements)
    .map(item => {
      const productId = item.id;
      const product = products.find(p => p.id === productId);
      const quantityElement = item.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || '0');

      return { product, quantity, element: item };
    })
    .filter(item => item.product);
};

/**
 * 장바구니 계산 (순수 함수)
 * @returns {object} 계산 결과
 */
export const calculateCartTotals = () => {
  const cartDisplayElement = findElement('#cart-items');
  if (!cartDisplayElement) return null;

  const products = productState.products;
  const cartElements = cartDisplayElement.children;
  const cartItems = extractCartItems(cartElements, products);

  // 순수 함수로 계산
  const cartResults = calculateCart(
    cartElements,
    products,
    BUSINESS_CONSTANTS,
    PRODUCTS,
  );

  // 상태 업데이트
  setProductState({
    amount: cartResults.totalAmount,
    itemCount: cartResults.totalItemCount,
  });

  // UI 하이라이트 적용
  highlightDiscountableItems(cartItems, products, BUSINESS_CONSTANTS);

  return cartResults;
};

/**
 * 할인 정보 렌더링 (선언적)
 * @param {object} cartResults - 카트 계산 결과
 */
const renderDiscountInfo = cartResults => {
  const { subtotal, totalAmount, discountRate } = cartResults;

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = subtotal - totalAmount;
    const discountHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;

    safeDOM('#discount-info', element => setInnerHTML(element, discountHTML));
  } else {
    safeDOM('#discount-info', element => setInnerHTML(element, ''));
  }
};

/**
 * 화요일 특별 할인 배너 렌더링 (선언적)
 * @param {object} cartResults - 카트 계산 결과
 */
const renderTuesdaySpecial = cartResults => {
  const { isTuesday, totalAmount } = cartResults;
  const shouldShow = isTuesday && totalAmount > 0;

  safeDOM('#tuesday-special', element => renderIf(element, shouldShow));
};

/**
 * 헤더 아이템 수 업데이트 (선언적)
 * @param {object} cartResults - 카트 계산 결과
 */
const updateHeaderItemCount = cartResults => {
  const { totalItemCount } = cartResults;

  safeDOM('#item-count', element =>
    setTextContent(element, `🛍️ ${totalItemCount} items in cart`),
  );
};

/**
 * 장바구니 UI 업데이트
 * @param {object} cartResults - 카트 계산 결과
 */
export const updateCartUI = cartResults => {
  const operations = [
    {
      selector: '#discount-info',
      operation: () => renderDiscountInfo(cartResults),
    },
    {
      selector: '#tuesday-special',
      operation: () => renderTuesdaySpecial(cartResults),
    },
    {
      selector: '#item-count',
      operation: () => updateHeaderItemCount(cartResults),
    },
  ];

  batchDOM(operations);
};

/**
 * 장바구니 총액 컴포넌트 렌더링
 * @param {object} pointsResults - 포인트 계산 결과
 * @returns {object} 렌더링 결과
 */
export const renderCartTotalComponent = pointsResults => {
  const totalAmount = productState.amount;

  const cartDisplayElement = findElement('#cart-items');
  const cartElements = cartDisplayElement.children;

  const cartResults = calculateCart(
    cartElements,
    productState.products,
    BUSINESS_CONSTANTS,
    PRODUCTS,
  );
  const discountRate = cartResults.discountRate;

  renderCartTotal({
    amount: totalAmount,
    discountRate,
    point: pointsResults.points || 0,
  });

  const cartItems = document.querySelectorAll('#cart-items > *');
  const products = productState.products;

  const cartData = Array.from(cartItems).map(item => {
    const productId = item.id;
    const product = products.find(p => p.id === productId);
    const quantityElement = item.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement?.textContent || '0');

    return { product, quantity };
  });

  return { cartData, totalAmount, discountRate };
};

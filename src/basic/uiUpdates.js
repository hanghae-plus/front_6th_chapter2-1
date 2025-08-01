/**
 * UI 업데이트 함수들
 * 사용자 인터페이스 업데이트를 담당하는 함수들을 관리
 */

import { calculateAllPoints, calculateCartStatePure } from './businessLogic.js';
import { QUANTITY_THRESHOLDS } from './constants.js';
import {
  DOMElements,
  safeSetInnerHTML,
  safeSetTextContent,
  safeClearProductSelector,
  safeAddProductOption,
  safeUpdateStockInfo,
  safeQuerySelector,
  safeQuerySelectorAll,
  safeRemoveClass,
  safeAddClass,
} from './domElements.js';
import { getTotalStock, getStockStatusMessage, isTuesdayDay } from './utils.js';

// DOM 요소 캐싱
let cachedElements = null;

/**
 * DOM 요소 캐싱 초기화
 * @returns {Object} 캐시된 DOM 요소들
 */
const initializeCachedElements = () => {
  if (cachedElements) return cachedElements;
  cachedElements = DOMElements.getAllElements();
  return cachedElements;
};

/**
 * 상품 선택 옵션 업데이트
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getDOMElements - DOM 요소 가져오기 함수
 */
export const updateSelectOptions = (getProductList, getDOMElements) => {
  safeClearProductSelector();
  const productList = getProductList();
  const totalStock = getTotalStock(productList);

  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;

    let discountText = '';
    if (product.onSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    if (product.quantity === 0) {
      safeSetTextContent(option, `${product.name} - ${product.value}원 (품절)${discountText}`);
      option.disabled = true;
      option.className = 'text-gray-400';
    } else {
      if (product.onSale && product.suggestSale) {
        safeSetTextContent(
          option,
          `⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)`,
        );
        option.className = 'text-purple-600 font-bold';
      } else if (product.onSale) {
        safeSetTextContent(
          option,
          `⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)`,
        );
        option.className = 'text-red-500 font-bold';
      } else if (product.suggestSale) {
        safeSetTextContent(
          option,
          `💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)`,
        );
        option.className = 'text-blue-500 font-bold';
      } else {
        safeSetTextContent(option, `${product.name} - ${product.value}원${discountText}`);
      }
    }

    safeAddProductOption(option);
  });

  // 재고 경고 표시
  const elements = getDOMElements();
  if (totalStock < QUANTITY_THRESHOLDS.TOTAL_STOCK_WARNING) {
    elements.productSelector.style.borderColor = 'orange';
  } else {
    elements.productSelector.style.borderColor = '';
  }
};

/**
 * 장바구니 아이템 정보 추출
 * @returns {Array} 장바구니 아이템 정보 배열
 */
const extractCartItems = () =>
  DOMElements.getCartItems().map((item) => ({
    productId: item.id,
    quantity: parseInt(safeQuerySelector(item, '.quantity-number')?.textContent || '0'),
  }));

/**
 * 수량에 따른 폰트 스타일 업데이트
 */
const updateQuantityStyles = () => {
  DOMElements.getCartItems().forEach((item) => {
    const quantityElement = safeQuerySelector(item, '.quantity-number');
    const quantity = parseInt(quantityElement?.textContent || '0');
    const priceElements = safeQuerySelectorAll(item, '.text-lg, .text-xs');

    priceElements.forEach((elem) => {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });
  });
};

/**
 * 전역 변수 업데이트
 * @param {Object} cartState - 장바구니 상태
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 */
const updateGlobalState = (cartState, setCartState) => {
  setCartState(cartState);
};

/**
 * 장바구니 계산 및 UI 업데이트
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 */
export const calculateCart = (getProductList, getCartState, setCartState) => {
  // 1. 장바구니 아이템 정보 추출
  const cartItems = extractCartItems();

  // 2. 수량에 따른 폰트 스타일 업데이트
  updateQuantityStyles();

  // 3. 장바구니 상태 계산
  const productList = getProductList();
  const cartState = calculateCartStatePure(cartItems, productList);

  // 4. 전역 변수 업데이트
  updateGlobalState(cartState, setCartState);

  // 5. UI 업데이트
  updateCartUI(cartState, getProductList, getCartState);
  updatePointsDisplay(getCartState);
  updateStockInfo(getProductList);
};

/**
 * 아이템 수 표시 업데이트
 * @param {Object} elements - DOM 요소들
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 */
const updateItemCountDisplay = (elements, getCartState) => {
  if (elements.itemCount) {
    const { itemCount } = getCartState();
    safeSetTextContent(elements.itemCount, `🛍️ ${itemCount} items in cart`);
  }
};

/**
 * 상품별 정보 HTML 생성
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @returns {string} 생성된 HTML
 */
const generateProductItemsHTML = (getProductList) => {
  let html = '';
  const cartItems = DOMElements.getCartItems();
  const productList = getProductList();

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = productList.find((p) => p.id === cartItem.id);
    const quantityElement = safeQuerySelector(cartItem, '.quantity-number');
    const quantity = parseInt(quantityElement?.textContent || '0');
    const itemTotal = product.value * quantity;

    html += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  }

  return html;
};

/**
 * 할인 정보 HTML 생성
 * @param {Array} itemDiscounts - 아이템 할인 목록
 * @param {number} finalTotal - 최종 총액
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @returns {string} 생성된 HTML
 */
const generateDiscountHTML = (itemDiscounts, finalTotal, getCartState) => {
  let html = '';
  const { itemCount } = getCartState();

  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    html += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      html += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesdayDay() && finalTotal > 0) {
    html += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  return html;
};

/**
 * 요약 상세 정보 업데이트
 * @param {Object} elements - DOM 요소들
 * @param {number} subtotal - 소계
 * @param {Array} itemDiscounts - 아이템 할인 목록
 * @param {number} finalTotal - 최종 총액
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 */
const updateSummaryDetails = (
  elements,
  subtotal,
  itemDiscounts,
  finalTotal,
  getProductList,
  getCartState,
) => {
  if (!elements.summaryDetails) return;

  if (subtotal > 0) {
    // 모든 내용을 하나의 HTML로 조합
    const summaryHTML = `
      ${generateProductItemsHTML(getProductList)}
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
      ${generateDiscountHTML(itemDiscounts, finalTotal, getCartState)}
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;

    safeSetInnerHTML(elements.summaryDetails, summaryHTML);
  } else {
    // 장바구니가 비어있을 때 기본 메시지
    safeSetInnerHTML(
      elements.summaryDetails,
      `
      <div class="text-center text-gray-400 py-8">
        <p class="text-sm">장바구니가 비어있습니다</p>
        <p class="text-xs mt-2">상품을 추가해주세요</p>
      </div>
    `,
    );
  }
};

/**
 * 총액 표시 업데이트
 * @param {Object} elements - DOM 요소들
 * @param {number} finalTotal - 최종 총액
 */
const updateTotalDisplay = (elements, finalTotal) => {
  const totalDiv = safeQuerySelector(elements.cartTotal, '.text-2xl');
  if (totalDiv) {
    safeSetTextContent(totalDiv, `₩${Math.round(finalTotal).toLocaleString()}`);
  }
};

/**
 * 할인 정보 업데이트
 * @param {Object} elements - DOM 요소들
 * @param {number} subtotal - 소계
 * @param {number} finalTotal - 최종 총액
 * @param {number} discountRate - 할인율
 */
const updateDiscountInfo = (elements, subtotal, finalTotal, discountRate) => {
  if (!elements.discountInfo) return;

  safeSetInnerHTML(elements.discountInfo, '');

  if (discountRate > 0 && finalTotal > 0) {
    const savedAmount = subtotal - finalTotal;
    safeSetInnerHTML(
      elements.discountInfo,
      `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `,
    );
  }
};

/**
 * 화요일 특별 할인 배너 업데이트
 * @param {Object} elements - DOM 요소들
 * @param {number} finalTotal - 최종 총액
 */
const updateTuesdaySpecialBanner = (elements, finalTotal) => {
  if (elements.tuesdaySpecial) {
    if (isTuesdayDay() && finalTotal > 0) {
      safeRemoveClass(elements.tuesdaySpecial, 'hidden');
    } else {
      safeAddClass(elements.tuesdaySpecial, 'hidden');
    }
  }
};

/**
 * 장바구니 UI 업데이트
 * @param {Object} cartState - 장바구니 상태
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 */
const updateCartUI = (cartState, getProductList, getCartState) => {
  const { subtotal, itemDiscounts, totalAmount: finalTotal, discountRate } = cartState;
  const elements = initializeCachedElements();

  updateItemCountDisplay(elements, getCartState);
  updateSummaryDetails(elements, subtotal, itemDiscounts, finalTotal, getProductList, getCartState);
  updateTotalDisplay(elements, finalTotal);
  updateDiscountInfo(elements, subtotal, finalTotal, discountRate);
  updateTuesdaySpecialBanner(elements, finalTotal);
};

/**
 * 포인트 표시 업데이트
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 */
const updatePointsDisplay = (getCartState) => {
  const elements = initializeCachedElements();
  if (!elements.loyaltyPoints) return;

  if (DOMElements.getCartItems().length === 0) {
    elements.loyaltyPoints.style.display = 'none';
    return;
  }

  // DOM 요소를 배열 형태로 변환
  const cartItems = DOMElements.getCartItems().map((item) => ({
    productId: item.id,
    quantity: parseInt(safeQuerySelector(item, '.quantity-number')?.textContent || '0'),
  }));

  const { totalAmount, itemCount } = getCartState();
  const { finalPoints, pointsDetail } = calculateAllPoints(totalAmount, cartItems, itemCount);

  if (finalPoints > 0) {
    safeSetInnerHTML(
      elements.loyaltyPoints,
      `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `,
    );
    elements.loyaltyPoints.style.display = 'block';
  } else {
    safeSetTextContent(elements.loyaltyPoints, '적립 포인트: 0p');
    elements.loyaltyPoints.style.display = 'block';
  }
};

/**
 * 재고 정보 업데이트
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 */
const updateStockInfo = (getProductList) => {
  const productList = getProductList();
  const stockMessage = getStockStatusMessage(productList);
  safeUpdateStockInfo(stockMessage);
};

/**
 * 장바구니 내 가격 업데이트
 * @param {Function} getProductList - 상품 목록 가져오기 함수
 * @param {Function} getCartState - 장바구니 상태 가져오기 함수
 * @param {Function} setCartState - 장바구니 상태 설정 함수
 */
export const updatePricesInCart = (getProductList, getCartState, setCartState) => {
  const cartItems = DOMElements.getCartItems();
  const productList = getProductList();

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = productList.find((p) => p.id === cartItem.id);

    if (product) {
      const priceDiv = safeQuerySelector(cartItem, '.text-lg');
      const nameDiv = safeQuerySelector(cartItem, 'h3');

      if (product.onSale && product.suggestSale) {
        safeSetInnerHTML(
          priceDiv,
          `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-purple-600">₩${product.value.toLocaleString()}</span>`,
        );
        safeSetTextContent(nameDiv, `⚡💝${product.name}`);
      } else if (product.onSale) {
        safeSetInnerHTML(
          priceDiv,
          `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-red-500">₩${product.value.toLocaleString()}</span>`,
        );
        safeSetTextContent(nameDiv, `⚡${product.name}`);
      } else if (product.suggestSale) {
        safeSetInnerHTML(
          priceDiv,
          `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-blue-500">₩${product.value.toLocaleString()}</span>`,
        );
        safeSetTextContent(nameDiv, `💝${product.name}`);
      } else {
        safeSetTextContent(priceDiv, `₩${product.value.toLocaleString()}`);
        safeSetTextContent(nameDiv, product.name);
      }
    }
  }

  calculateCart(getProductList, getCartState, setCartState);
};

/**
 * 이벤트 핸들러 기능
 * 클린 코드 원칙에 따라 모듈화된 이벤트 처리 로직
 */

import { BUSINESS_CONSTANTS, PRODUCT_IDS } from '../../shared/constants/index.js';
import { findProductById, calculateTotalStock } from '../../shared/utils/product-utils.js';
import { calculateCartSubtotal, calculateFinalDiscount, updateCartUI } from '../pricing/index.js';

/**
 * 할인 텍스트 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 할인 텍스트
 */
function createDiscountText(product) {
  let discountText = '';
  if (product.onSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';
  return discountText;
}

/**
 * 상품 옵션 텍스트 생성
 * @param {Object} product - 상품 정보
 * @returns {Object} 텍스트와 스타일 정보
 */
function createProductOptionText(product) {
  const discountText = createDiscountText(product);

  if (product.onSale && product.suggestSale) {
    return {
      text: `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`,
      className: 'text-purple-600 font-bold',
    };
  } else if (product.onSale) {
    return {
      text: `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`,
      className: 'text-red-500 font-bold',
    };
  } else if (product.suggestSale) {
    return {
      text: `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`,
      className: 'text-blue-500 font-bold',
    };
  } else {
    return {
      text: `${product.name} - ${product.val}원${discountText}`,
      className: '',
    };
  }
}

/**
 * 상품 옵션 요소 생성
 * @param {Object} product - 상품 정보
 * @returns {HTMLOptionElement} 옵션 요소
 */
function createProductOption(product) {
  const option = document.createElement('option');
  option.value = product.id;

  if (product.q === 0) {
    option.textContent = `${product.name} - ${product.val}원 (품절)${createDiscountText(product)}`;
    option.disabled = true;
    option.className = 'text-gray-400';
  } else {
    const { text, className } = createProductOptionText(product);
    option.textContent = text;
    if (className) {
      option.className = className;
    }
  }

  return option;
}

/**
 * 상품 선택 옵션 업데이트
 * @param {Object} appState - AppState 인스턴스
 */
export function onUpdateSelectOptions(appState) {
  const productSelect = appState.elements.productSelect;
  productSelect.innerHTML = '';

  const totalStock = calculateTotalStock(appState.products);

  appState.products.forEach((product) => {
    const option = createProductOption(product);
    productSelect.appendChild(option);
  });

  // 재고 경고 표시
  if (totalStock < BUSINESS_CONSTANTS.STOCK_WARNING_THRESHOLD) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}

/**
 * 재고 상태 메시지 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 재고 상태 메시지
 */
function createStockMessage(product) {
  if (product.q < BUSINESS_CONSTANTS.LOW_STOCK_THRESHOLD) {
    if (product.q > 0) {
      return `${product.name}: 재고 부족 (${product.q}개 남음)\n`;
    } else {
      return `${product.name}: 품절\n`;
    }
  }
  return '';
}

/**
 * 재고 상태 업데이트
 * @param {Object} appState - AppState 인스턴스
 */
export function updateStockStatus(appState) {
  const stockMessages = appState.products
    .map((product) => createStockMessage(product))
    .filter((message) => message !== '')
    .join('');

  appState.elements.stockInfo.textContent = stockMessages;
}

/**
 * 장바구니 계산 처리
 * @param {Object} appState - AppState 인스턴스
 */
export function handleCalculateCartStuff(appState) {
  // 1. 장바구니 소계 및 개별 할인 계산
  const subtotalResult = calculateCartSubtotal(appState);

  // 2. 전체 할인 계산 (대량구매, 화요일)
  const discountResult = calculateFinalDiscount(appState, subtotalResult.subTotal);

  // 3. UI 업데이트
  updateCartUI(appState, subtotalResult.subTotal, subtotalResult.itemDiscounts, discountResult);

  // 4. 재고 상태 업데이트
  updateStockStatus(appState);

  // 5. 포인트 계산
  doRenderBonusPoints(appState);
}

/**
 * 기본 포인트 계산
 * @param {number} totalAmount - 총 금액
 * @returns {number} 기본 포인트
 */
function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / 1000);
}

/**
 * 화요일 보너스 포인트 계산
 * @param {number} basePoints - 기본 포인트
 * @returns {Object} 보너스 포인트와 상세 정보
 */
function calculateTuesdayBonus(basePoints) {
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday && basePoints > 0) {
    return {
      bonus: basePoints,
      detail: '화요일 2배',
    };
  }

  return { bonus: 0, detail: null };
}

/**
 * 세트 보너스 포인트 계산
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} products - 상품 목록
 * @returns {Object} 보너스 포인트와 상세 정보
 */
function calculateSetBonus(cartItems, products) {
  const itemIds = Array.from(cartItems).map((item) => item.id);
  const hasKeyboard = itemIds.includes(PRODUCT_IDS.KEYBOARD);
  const hasMouse = itemIds.includes(PRODUCT_IDS.MOUSE);
  const hasMonitorArm = itemIds.includes(PRODUCT_IDS.MONITOR_ARM);

  let bonus = 0;
  const details = [];

  if (hasKeyboard && hasMouse) {
    bonus += 50;
    details.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonus += 100;
    details.push('풀세트 구매 +100p');
  }

  return { bonus, details };
}

/**
 * 수량 보너스 포인트 계산
 * @param {number} itemCount - 아이템 수량
 * @returns {Object} 보너스 포인트와 상세 정보
 */
function calculateQuantityBonus(itemCount) {
  if (itemCount >= 30) {
    return { bonus: 100, detail: '대량구매(30개+) +100p' };
  } else if (itemCount >= 20) {
    return { bonus: 50, detail: '대량구매(20개+) +50p' };
  } else if (itemCount >= 10) {
    return { bonus: 20, detail: '대량구매(10개+) +20p' };
  }

  return { bonus: 0, detail: null };
}

/**
 * 포인트 상세 정보 HTML 생성
 * @param {Array} details - 포인트 상세 정보 배열
 * @returns {string} HTML 문자열
 */
function createPointsDetailHTML(details) {
  return `
    <div>적립 포인트: <span class="font-bold">${details.totalPoints}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${details.details.join(', ')}</div>
  `;
}

/**
 * 포인트 렌더링
 * @param {Object} appState - AppState 인스턴스
 */
export function doRenderBonusPoints(appState) {
  const loyaltyPointsElement = document.getElementById('loyalty-points');

  if (appState.elements.cartDisplay.children.length === 0) {
    loyaltyPointsElement.style.display = 'none';
    return;
  }

  // 기본 포인트 계산
  const basePoints = calculateBasePoints(appState.totalAmount);
  let finalPoints = basePoints;
  const pointsDetails = [];

  if (basePoints > 0) {
    pointsDetails.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  const tuesdayBonus = calculateTuesdayBonus(basePoints);
  if (tuesdayBonus.bonus > 0) {
    finalPoints += tuesdayBonus.bonus;
    pointsDetails.push(tuesdayBonus.detail);
  }

  // 세트 보너스
  const setBonus = calculateSetBonus(appState.elements.cartDisplay.children, appState.products);
  if (setBonus.bonus > 0) {
    finalPoints += setBonus.bonus;
    pointsDetails.push(...setBonus.details);
  }

  // 수량 보너스
  const quantityBonus = calculateQuantityBonus(appState.itemCount);
  if (quantityBonus.bonus > 0) {
    finalPoints += quantityBonus.bonus;
    pointsDetails.push(quantityBonus.detail);
  }

  // AppState 업데이트
  appState.bonusPts = finalPoints;

  // UI 업데이트
  if (loyaltyPointsElement) {
    if (appState.bonusPts > 0) {
      loyaltyPointsElement.innerHTML = createPointsDetailHTML({
        totalPoints: appState.bonusPts,
        details: pointsDetails,
      });
      loyaltyPointsElement.style.display = 'block';
    } else {
      loyaltyPointsElement.textContent = '적립 포인트: 0p';
      loyaltyPointsElement.style.display = 'block';
    }
  }
}

/**
 * 상품 가격 HTML 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 가격 HTML
 */
function createProductPriceHTML(product) {
  if (product.onSale && product.suggestSale) {
    return `
      <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
      <span class="text-purple-600">₩${product.val.toLocaleString()}</span>
    `;
  } else if (product.onSale) {
    return `
      <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
      <span class="text-red-500">₩${product.val.toLocaleString()}</span>
    `;
  } else if (product.suggestSale) {
    return `
      <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
      <span class="text-blue-500">₩${product.val.toLocaleString()}</span>
    `;
  } else {
    return `₩${product.val.toLocaleString()}`;
  }
}

/**
 * 상품 이름 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 상품 이름
 */
function createProductName(product) {
  if (product.onSale && product.suggestSale) {
    return `⚡💝${product.name}`;
  } else if (product.onSale) {
    return `⚡${product.name}`;
  } else if (product.suggestSale) {
    return `💝${product.name}`;
  } else {
    return product.name;
  }
}

/**
 * 장바구니 가격 업데이트
 * @param {Object} appState - AppState 인스턴스
 */
export function doUpdatePricesInCart(appState) {
  const cartItems = appState.elements.cartDisplay.children;

  // 장바구니의 각 아이템에 대해 가격과 이름 업데이트
  Array.from(cartItems).forEach((cartItem) => {
    const product = findProductById(appState.products, cartItem.id);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');

      // 가격 업데이트
      priceDiv.innerHTML = createProductPriceHTML(product);

      // 이름 업데이트
      nameDiv.textContent = createProductName(product);
    }
  });

  // 전체 계산 업데이트
  handleCalculateCartStuff(appState);
}

/**
 * 총 재고 조회
 * @param {Object} appState - AppState 인스턴스
 * @returns {number} 총 재고 수
 */
export function onGetStockTotal(appState) {
  return calculateTotalStock(appState.products);
}

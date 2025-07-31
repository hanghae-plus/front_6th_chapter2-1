import {
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
  PRODUCT_DISCOUNTS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_CASE,
  SPEAKER,
} from '../constants.js';
import { isTuesday } from '../utils/date.js';
import { findProductById } from '../utils/product.js';

/**
 * 장바구니 계산을 수행하는 메인 함수
 * @param {Object} params - 계산에 필요한 파라미터들
 * @param {Array} params.productList - 상품 목록
 * @param {HTMLElement} params.cartDisp - 장바구니 표시 요소
 * @param {HTMLElement} params.summaryDetails - 요약 상세 요소
 * @param {HTMLElement} params.totalDiv - 총액 표시 요소
 * @param {HTMLElement} params.discountInfoDiv - 할인 정보 표시 요소
 * @param {HTMLElement} params.itemCountElement - 아이템 수 표시 요소
 * @returns {Object} 계산 결과
 */
export function calculateCart(params) {
  const { productList, cartDisp, summaryDetails, totalDiv, discountInfoDiv, itemCountElement } =
    params;

  let totalAmt = 0;
  let itemCnt = 0;
  let originalTotal = 0;
  let subTot = 0;
  let discRate = 0;

  const itemDiscounts = [];
  const cartItems = cartDisp.children;

  // 각 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(productList, cartItems[i].id);
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    const itemTot = curItem.val * quantity;
    let disc = 0;

    itemCnt += quantity;
    subTot += itemTot;

    // 개별 상품 할인 적용
    updateItemPriceDisplay(cartItems[i], quantity);

    if (quantity >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
      disc = calculateIndividualDiscount(curItem.id);
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }

    totalAmt += itemTot * (1 - disc);
  }

  // 대량구매 할인 적용
  const { finalTotal: bulkTotal, discRate: bulkDiscRate } = applyBulkPurchaseDiscount(
    totalAmt,
    subTot,
    itemCnt
  );
  totalAmt = bulkTotal;
  originalTotal = subTot;

  // 화요일 특별 할인 적용
  const { finalTotal: tuesdayTotal, finalDiscRate: tuesdayDiscRate } = applyTuesdaySpecialDiscount(
    totalAmt,
    originalTotal,
    bulkDiscRate
  );
  totalAmt = tuesdayTotal;
  discRate = tuesdayDiscRate;

  // UI 업데이트
  updateSummaryDetails(cartItems, subTot, itemCnt, itemDiscounts, productList, summaryDetails);
  updateTotalDisplay(totalAmt, totalDiv);
  updateDiscountInfo(originalTotal, totalAmt, discRate, discountInfoDiv);
  updateItemCount(itemCnt, itemCountElement);

  return {
    totalAmt: Math.round(totalAmt),
    itemCnt,
    originalTotal,
    discRate,
  };
}

/**
 * 아이템 가격 표시를 업데이트합니다.
 * @param {HTMLElement} itemDiv - 아이템 요소
 * @param {number} qty - 수량
 */
function updateItemPriceDisplay(itemDiv, qty) {
  const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
  priceElems.forEach(function (elem) {
    if (elem.classList.contains('text-lg')) {
      elem.style.fontWeight = qty >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD ? 'bold' : 'normal';
    }
  });
}

/**
 * 개별 상품 할인을 계산합니다.
 * @param {string} productId - 상품 ID
 * @returns {number} 할인율 (0-1)
 */
function calculateIndividualDiscount(productId) {
  const discountMap = {
    [KEYBOARD]: PRODUCT_DISCOUNTS[KEYBOARD] / 100,
    [MOUSE]: PRODUCT_DISCOUNTS[MOUSE] / 100,
    [MONITOR_ARM]: PRODUCT_DISCOUNTS[MONITOR_ARM] / 100,
    [NOTEBOOK_CASE]: PRODUCT_DISCOUNTS[NOTEBOOK_CASE] / 100,
    [SPEAKER]: PRODUCT_DISCOUNTS[SPEAKER] / 100,
  };
  return discountMap[productId] || 0;
}

/**
 * 대량구매 할인을 적용합니다.
 * @param {number} totalAmt - 총액
 * @param {number} subTot - 소계
 * @param {number} itemCnt - 아이템 수
 * @returns {Object} 할인 적용 결과
 */
function applyBulkPurchaseDiscount(totalAmt, subTot, itemCnt) {
  let discRate = 0;

  if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
    totalAmt = (subTot * (100 - BULK_PURCHASE_DISCOUNT)) / 100;
    discRate = BULK_PURCHASE_DISCOUNT / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  return { finalTotal: totalAmt, discRate };
}

/**
 * 화요일 특별 할인을 적용합니다.
 * @param {number} totalAmt - 총액
 * @param {number} originalTotal - 원래 총액
 * @param {number} discRate - 기존 할인율
 * @returns {Object} 할인 적용 결과
 */
function applyTuesdaySpecialDiscount(totalAmt, originalTotal, discRate) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (tuesdaySpecial) {
    if (isTuesday()) {
      if (totalAmt > 0) {
        totalAmt = (totalAmt * (100 - TUESDAY_SPECIAL_DISCOUNT)) / 100;
        // 화요일 할인 적용 후의 최종 할인율 계산
        discRate = 1 - totalAmt / originalTotal;
        tuesdaySpecial.classList.remove('hidden');
      } else {
        tuesdaySpecial.classList.add('hidden');
      }
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }
  return { finalTotal: totalAmt, finalDiscRate: discRate };
}

/**
 * 요약 상세 정보를 업데이트합니다.
 * @param {HTMLCollection} cartItems - 장바구니 아이템들
 * @param {number} subTot - 소계
 * @param {number} itemCnt - 아이템 수
 * @param {Array} itemDiscounts - 아이템 할인 정보
 * @param {Array} productList - 상품 목록
 * @param {HTMLElement} summaryDetails - 요약 상세 요소
 */
function updateSummaryDetails(
  cartItems,
  subTot,
  itemCnt,
  itemDiscounts,
  productList,
  summaryDetails
) {
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 아이템별 상세 내역
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(productList, cartItems[i].id);
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * quantity;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보
    renderDiscountDetails(itemCnt, itemDiscounts, summaryDetails);

    // 배송 정보
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

/**
 * 할인 상세 정보를 렌더링합니다.
 * @param {number} itemCnt - 아이템 수
 * @param {Array} itemDiscounts - 아이템 할인 정보
 * @param {HTMLElement} summaryDetails - 요약 상세 요소
 */
function renderDiscountDetails(itemCnt, itemDiscounts, summaryDetails) {
  if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${BULK_PURCHASE_THRESHOLD}개 이상)</span>
        <span class="text-xs">-${BULK_PURCHASE_DISCOUNT}%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesday()) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${TUESDAY_SPECIAL_DISCOUNT}%</span>
      </div>
    `;
  }
}

/**
 * 총액 표시를 업데이트합니다.
 * @param {number} totalAmt - 총액
 * @param {HTMLElement} totalDiv - 총액 표시 요소
 */
function updateTotalDisplay(totalAmt, totalDiv) {
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
}

/**
 * 할인 정보를 업데이트합니다.
 * @param {number} originalTotal - 원래 총액
 * @param {number} totalAmt - 할인 후 총액
 * @param {number} discRate - 할인율
 * @param {HTMLElement} discountInfoDiv - 할인 정보 표시 요소
 */
function updateDiscountInfo(originalTotal, totalAmt, discRate, discountInfoDiv) {
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">
          ₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다
        </div>
      </div>
    `;
  }
}

/**
 * 아이템 수 표시를 업데이트합니다.
 * @param {number} itemCnt - 아이템 수
 * @param {HTMLElement} itemCountElement - 아이템 수 표시 요소
 */
function updateItemCount(itemCnt, itemCountElement) {
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `��️  ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

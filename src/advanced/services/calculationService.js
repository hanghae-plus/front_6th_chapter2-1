// ==========================================
// 계산 서비스
// ==========================================

import { DISCOUNT_RATES, THRESHOLDS, DAYS } from '../constant/index.js';
import { shouldApplyTuesdayDiscount } from '../utils/conditionUtils.js';

// 🏷️ 상품 ID 상수들
const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = 'p5';

/**
 * 🤖 [AI-REFACTORED] 장바구니 소계 및 개별 할인 계산 (순수 함수)
 *
 * @description 장바구니 아이템들의 소계와 개별 상품 할인을 계산하는 순수 함수
 *

 * - 중첩 반복문 제거 (O(n²) → O(n))
 * - 순수 함수로 테스트 가능
 * - 단일 책임: 계산만 담당
 *
 * @param {HTMLCollection} cartItems - 장바구니 DOM 요소들
 * @param {Array} productList - 상품 목록
 * @param {Function} getCartItemQuantity - 수량 조회 함수
 * @returns {Object} { subTotal, itemCount, totalAmount, itemDiscounts }
 */
export function calculateCartSubtotal(
  cartItems,
  productList,
  getCartItemQuantity,
) {
  // ==========================================

  // ==========================================
  const productMap = new Map();
  for (const product of productList) {
    productMap.set(product.id, product);
  }

  // ==========================================
  // 🧮 계산 변수 초기화
  // ==========================================
  let subTotal = 0;
  let itemCount = 0;
  let totalAmount = 0;
  const itemDiscounts = [];

  // ==========================================
  // 📊 장바구니 아이템 순회 - Array.from() + forEach()로 현대화
  // ==========================================
  Array.from(cartItems).forEach(cartItem => {
    const product = productMap.get(cartItem.id);

    if (!product) {
      return;
    }
    const quantity = getCartItemQuantity(cartItem);
    const itemTotal = product.val * quantity;

    subTotal += itemTotal;
    itemCount += quantity;

    // ==========================================

    // ==========================================
    let discountRate = 0;

    if (quantity >= THRESHOLDS.ITEM_DISCOUNT_MIN) {
      // 🔧 하드코딩 제거를 위한 임시 방안 (추후 개선 예정)
      const discountMap = {
        [PRODUCT_ONE]: DISCOUNT_RATES.KEYBOARD,
        [PRODUCT_TWO]: DISCOUNT_RATES.MOUSE,
        [PRODUCT_THREE]: DISCOUNT_RATES.MONITOR_ARM,
        [PRODUCT_FOUR]: DISCOUNT_RATES.POUCH,
        [PRODUCT_FIVE]: DISCOUNT_RATES.SPEAKER,
      };

      discountRate = discountMap[product.id] || 0;

      if (discountRate > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: discountRate * 100,
        });
      }
    }

    totalAmount += itemTotal * (1 - discountRate);

    // ==========================================
    // 🎨 UI 상태 업데이트 (임시 - 추후 분리 예정)
    // ==========================================
    const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(elem => {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight =
          quantity >= THRESHOLDS.ITEM_DISCOUNT_MIN ? 'bold' : 'normal';
      }
    });
  });

  return {
    subTotal,
    itemCount,
    totalAmount,
    itemDiscounts,
  };
}

/**
 * 🤖 [AI-REFACTORED] 할인 계산 (순수 함수)
 *
 * @description 대량구매 할인과 화요일 할인을 계산하는 순수 함수
 *

 * - 단일 책임: 할인 계산만 담당
 * - 순수 함수: 부작용 없음
 * - 테스트 가능: 입력/출력 명확
 *
 * @param {number} subTotal - 소계 금액
 * @param {number} itemCount - 총 아이템 수량
 * @param {number} totalAmountAfterItemDiscount - 개별 할인 적용 후 금액
 * @returns {Object} { finalAmount, discountRate, isTuesdayApplied }
 */
export function calculateFinalDiscounts(
  subTotal,
  itemCount,
  totalAmountAfterItemDiscount,
) {
  let finalAmount = totalAmountAfterItemDiscount;
  let discountRate = 0;

  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    finalAmount = subTotal * (1 - DISCOUNT_RATES.BULK_DISCOUNT);
    discountRate = DISCOUNT_RATES.BULK_DISCOUNT;
  } else {
    // 🧮 개별 할인만 적용된 경우의 전체 할인율 계산
    if (subTotal > 0) {
      discountRate = (subTotal - totalAmountAfterItemDiscount) / subTotal;
    }
  }

  const today = new Date();
  const isTuesday = today.getDay() === DAYS.TUESDAY;
  let isTuesdayApplied = false;

  if (shouldApplyTuesdayDiscount(isTuesday, finalAmount)) {
    finalAmount = finalAmount * (1 - DISCOUNT_RATES.TUESDAY_DISCOUNT);
    discountRate = 1 - finalAmount / subTotal;
    isTuesdayApplied = true;
  }

  return {
    finalAmount: Math.round(finalAmount),
    discountRate,
    isTuesdayApplied,
    originalTotal: subTotal,
  };
}

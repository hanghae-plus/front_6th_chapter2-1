// ==========================================
// 🎯 주문 요약 컴포넌트
// ==========================================

import { THRESHOLDS, DISCOUNT_RATES } from '../constant/index.js';

/**
 * 🤖 [AI-REFACTORED] 주문 요약 UI 업데이트 (SRP 적용)
 *
 * @description 장바구니 아이템별 상세 내역을 UI에 표시
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 주문 요약 UI 업데이트만 담당
 * - DOM 조작만 처리
 * - 비즈니스 로직 배제
 *
 * @param {HTMLCollection} cartItems - 장바구니 DOM 요소들
 * @param {Array} products - 상품 목록
 * @param {number} subTotal - 소계
 * @param {Array} itemDiscounts - 개별 상품 할인 정보
 * @param {number} itemCount - 총 아이템 수
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 */
export function updateOrderSummaryUI(
  cartItems,
  products,
  subTotal,
  itemDiscounts,
  itemCount,
  isTuesdayApplied,
) {
  // 🎯 캐시된 DOM 요소 사용 (중복 제거로 성능 향상)
  const summaryDetails = document.getElementById('summary-details');

  // 🚀 주문 요약 초기화 (기존 내용 삭제)
  summaryDetails.innerHTML = '';

  if (subTotal <= 0) {
    return;
  }

  // 🎯 성능 개선: Map으로 O(1) 검색
  const productMap = new Map();
  for (const product of products) {
    productMap.set(product.id, product);
  }

  // 📋 아이템별 상세 내역 (Array.from() + forEach()로 현대화)
  Array.from(cartItems).forEach(cartItem => {
    const product = productMap.get(cartItem.id);
    if (!product) {
      return; // 🛡️ Guard Clause: 유효하지 않은 상품은 건너뛰기
    }

    // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
    const quantity = parseInt(
      cartItem.querySelector('.quantity-number').textContent,
    );
    const itemTotal = product.val * quantity;

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  // 💰 소계 표시 (할인 적용 전 원래 금액)
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  // 🎯 할인 정보 표시 (개별 + 대량 + 화요일 할인)
  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach(item => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
                      <span class="text-xs">${item.name} (${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  // 🌟 화요일 특가 할인 표시 (10% 추가 할인)
  if (isTuesdayApplied) {
    summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%</span>
          </div>
        `;
  }

  // 🚚 배송비 표시 (무료 배송 기준)
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

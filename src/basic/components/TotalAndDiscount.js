// ==========================================
// 🎯 총액 및 할인 정보 컴포넌트
// ==========================================

import { THRESHOLDS } from '../constant/index.js';

/**
 * 🤖 [AI-REFACTORED] 총액 및 할인 정보 UI 업데이트 (SRP 적용)
 *
 * @description 최종 결제 금액, 할인 정보, 화요일 특가 표시를 업데이트
 *
 * 🎯 SRP 적용:
 * - 단일 책임: 총액 및 할인 정보 UI 업데이트만 담당
 * - DOM 조작만 처리
 * - 비즈니스 로직 배제
 *
 * @param {number} finalAmount - 최종 결제 금액
 * @param {number} discountRate - 할인율 (0~1)
 * @param {number} originalTotal - 할인 적용 전 원래 금액
 * @param {boolean} isTuesdayApplied - 화요일 할인 적용 여부
 */
export function updateTotalAndDiscountUI(
  finalAmount,
  discountRate,
  originalTotal,
  isTuesdayApplied,
) {
  // 💰 총액 업데이트 (최종 결제 금액)
  const cartTotal = document.getElementById('cart-total');
  const totalDiv = cartTotal?.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${finalAmount.toLocaleString()}`;
  }

  // 🎁 포인트 표시 업데이트 (캐시된 DOM 사용으로 성능 향상)
  // 🛡️ Guard Clause: DOM 요소가 있을 때만 포인트 업데이트 (원래 중첩 제거)
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    // ⚡ 성능 최적화: Math 함수 캐싱
    const points = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  }

  // 🎯 할인 정보 업데이트 (캐시된 DOM 사용으로 성능 향상)
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  if (shouldShowDiscount(discountRate, finalAmount)) {
    const savedAmount = originalTotal - finalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 🌟 화요일 특가 표시 업데이트 (캐시된 DOM 사용으로 성능 향상)
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesdayApplied) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

/**
 * 할인 표시 여부 확인 (유틸리티 함수)
 *
 * @param {number} discountRate - 할인율
 * @param {number} finalAmount - 최종 금액
 * @returns {boolean} 할인 정보를 표시할지 여부
 */
const shouldShowDiscount = (discountRate, finalAmount) =>
  discountRate > 0 && finalAmount > 0;

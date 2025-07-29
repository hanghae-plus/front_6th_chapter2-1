// ==========================================
// 총액 및 할인 정보 컴포넌트
// ==========================================

import { THRESHOLDS } from '../constant/index.js';

/**
 * 총액 및 할인 정보 UI 업데이트
 */
export function updateTotalAndDiscountUI(
  finalAmount,
  discountRate,
  originalTotal,
  isTuesdayApplied,
) {
  const cartTotal = document.getElementById('cart-total');
  const totalDiv = cartTotal?.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${finalAmount.toLocaleString()}`;
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  }

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

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

// ==========================================
// 총액 및 할인 정보 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';
import { THRESHOLDS } from '../constant/index';

/**
 * TotalAndDiscount Props 타입
 */
interface TotalAndDiscountProps {
  finalAmount: number;
  discountRate: number;
  originalTotal: number;
  isTuesdayApplied: boolean;
  className?: string;
}

/**
 * TotalAndDiscount 컴포넌트
 *
 * @description 총액, 할인 정보, 포인트 적립 정보를 표시
 */
export const TotalAndDiscount: React.FC<TotalAndDiscountProps> = ({
  finalAmount,
  discountRate,
  originalTotal,
  isTuesdayApplied,
  className = '',
}) => {
  const points = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);
  const shouldShowDiscount = discountRate > 0 && finalAmount > 0;
  const savedAmount = originalTotal - finalAmount;

  return (
    <div className={className}>
      {/* 총액 표시 */}
      <div id="cart-total" className="pt-5 border-t border-white/10">
        <div className="flex justify-between items-baseline">
          <span className="text-sm uppercase tracking-wider">Total</span>
          <div className="text-2xl tracking-tight">
            ₩{finalAmount.toLocaleString()}원
          </div>
        </div>
        
        {/* 포인트 적립 */}
        <div 
          id="loyalty-points" 
          className="text-xs text-blue-400 mt-2 text-right"
        >
          적립 포인트: {points}p
        </div>
      </div>

      {/* 할인 정보 */}
      {shouldShowDiscount && (
        <div id="discount-info" className="mt-4">
          <div className="bg-green-500/20 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase tracking-wide text-green-400">
                총 할인율
              </span>
              <span className="text-sm font-medium text-green-400">
                {(discountRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-2xs text-gray-300">
              ₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다
            </div>
          </div>
        </div>
      )}

      {/* 화요일 특가 */}
      {isTuesdayApplied && (
        <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xs">🎉</span>
            <span className="text-xs uppercase tracking-wide">
              Tuesday Special 10% Applied
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 총액 및 할인 정보 UI 업데이트 (호환성을 위한 유틸리티 함수)
 */
export function updateTotalAndDiscountUI(
  finalAmount: number,
  discountRate: number,
  originalTotal: number,
  isTuesdayApplied: boolean,
) {
  const cartTotal = document.getElementById('cart-total');
  const totalDiv = cartTotal?.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${finalAmount.toLocaleString()}원`;
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(finalAmount / THRESHOLDS.POINTS_PER_WON);
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  }

  const discountInfoDiv = document.getElementById('discount-info');
  if (discountInfoDiv) {
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
  }

  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (tuesdaySpecial) {
    if (isTuesdayApplied) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }
}

/**
 * 할인 표시 여부 확인 (유틸리티 함수)
 */
const shouldShowDiscount = (discountRate: number, finalAmount: number): boolean =>
  discountRate > 0 && finalAmount > 0;

export default TotalAndDiscount;
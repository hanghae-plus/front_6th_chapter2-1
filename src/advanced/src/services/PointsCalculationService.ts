import type { CartItem, PointsDetail, PointsCalculationResult } from '../types';
import { calculateTotalPoints } from '../utils/points';
import { isTuesday } from '../utils/date';

/**
 * 포인트 계산 서비스를 생성합니다.
 * @returns {Object} 포인트 계산 서비스
 */
export function createPointsCalculationService() {
  return {
    /**
     * 보너스 포인트를 계산합니다.
     * @param {CartItem[]} cartItems - 장바구니 아이템들
     * @param {number} totalAmount - 총액
     * @returns {PointsCalculationResult} 포인트 계산 결과
     */
    calculateBonusPoints(cartItems: CartItem[], totalAmount: number): PointsCalculationResult {
      const isTuesdayToday = isTuesday();
      const { totalPoints, pointsDetail } = calculateTotalPoints(totalAmount, cartItems, isTuesdayToday);

      return {
        bonusPoints: totalPoints,
        pointsDetail,
      };
    },

    /**
     * 포인트 표시를 업데이트합니다.
     * @param {number} bonusPoints - 보너스 포인트
     * @param {PointsDetail[]} pointsDetail - 포인트 상세 내역
     */
    updateLoyaltyPointsDisplay(bonusPoints: number, pointsDetail: PointsDetail[]): void {
      const loyaltyPointsElement = document.getElementById('loyalty-points');
      if (loyaltyPointsElement) {
        if (bonusPoints === 0) {
          loyaltyPointsElement.textContent = '적립 포인트: 0p';
        } else {
          loyaltyPointsElement.innerHTML = createLoyaltyPointsTag(bonusPoints, pointsDetail);
        }
      }
    },

    /**
     * 포인트 표시를 숨깁니다.
     */
    hideLoyaltyPoints(): void {
      const loyaltyPointsElement = document.getElementById('loyalty-points');
      if (loyaltyPointsElement) {
        loyaltyPointsElement.style.display = 'none';
      }
    },
  };
}

/**
 * 포인트 태그를 생성합니다.
 * @param {number} bonusPoints - 보너스 포인트
 * @param {PointsDetail[]} pointsDetail - 포인트 상세 내역
 * @returns {string} 포인트 태그 HTML
 */
function createLoyaltyPointsTag(bonusPoints: number, pointsDetail: PointsDetail[]): string {
  let html = `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>`;
  
  if (pointsDetail.length > 0) {
    const detailText = pointsDetail.map(detail => `${detail.description}: ${detail.amount}p`).join(', ');
    html += `<div class="text-2xs opacity-70 mt-1">${detailText}</div>`;
  }
  
  return html;
} 
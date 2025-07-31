// ==========================================
// 조건 유틸리티
// ==========================================

/**

 *
 * @description 화요일 할인 적용 조건을 확인하는 함수
 *
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} finalAmount - 최종 금액
 * @returns {boolean} 화요일 할인 적용 여부
 */
export const shouldApplyTuesdayDiscount = (isTuesday, finalAmount) =>
  isTuesday && finalAmount > 0;

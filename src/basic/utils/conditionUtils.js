// ==========================================
// 🎯 조건 유틸리티
// ==========================================

/**
 * 🧠 복잡한 조건 → 의미있는 함수로 개선
 *
 * @description 화요일 할인 적용 조건을 확인하는 함수
 *
 * @param {boolean} isTuesday - 화요일 여부
 * @param {number} finalAmount - 최종 금액
 * @returns {boolean} 화요일 할인 적용 여부
 */
export const shouldApplyTuesdayDiscount = (isTuesday, finalAmount) =>
  isTuesday && finalAmount > 0;

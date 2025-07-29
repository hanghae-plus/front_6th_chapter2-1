// ==========================================
// 검증 유틸리티
// ==========================================

/**
 * ⌨️ 키보드+마우스 세트 보유 여부 확인
 *
 * @param {boolean} hasKeyboard - 키보드 보유 여부
 * @param {boolean} hasMouse - 마우스 보유 여부
 * @returns {boolean} 키보드+마우스 세트 여부
 */
export const hasKeyboardMouseSet = (hasKeyboard, hasMouse) =>
  hasKeyboard && hasMouse;

/**

 *
 * @param {boolean} hasKeyboard - 키보드 보유 여부
 * @param {boolean} hasMouse - 마우스 보유 여부
 * @param {boolean} hasMonitorArm - 모니터암 보유 여부
 * @returns {boolean} 풀세트 여부
 */
export const hasFullProductSet = (hasKeyboard, hasMouse, hasMonitorArm) =>
  hasKeyboard && hasMouse && hasMonitorArm;

/**
 * 날짜 관련 유틸리티 함수들
 * @description 날짜 처리와 관련된 순수 함수들
 */

/**
 * 오늘이 화요일인지 확인
 * @returns {boolean} 화요일 여부
 */
export function isTuesday() {
  return new Date().getDay() === 2;
}

/**
 * 특정 요일인지 확인
 * @param {number} dayOfWeek - 요일 번호 (0: 일요일, 1: 월요일, ...)
 * @returns {boolean} 해당 요일 여부
 */
export function isDay(dayOfWeek) {
  return new Date().getDay() === dayOfWeek;
}
/**
 * 현재 날짜가 화요일인지 확인합니다.
 * @returns {boolean} 화요일 여부
 */
export function isTuesday(): boolean {
  const today = new Date();
  return today.getDay() === 2; // 0: 일요일, 1: 월요일, 2: 화요일
} 
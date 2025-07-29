/**
 * 현재 요일이 화요일인지 확인
 * @returns {boolean} 화요일 여부
 */
export function isTuesday() {
  const today = new Date();
  return today.getDay() === 2; // 0: 일요일, 1: 월요일, 2: 화요일
}

/**
 * 현재 날짜 정보를 가져옴
 * @returns {Object} 날짜 정보
 */
export function getCurrentDateInfo() {
  const today = new Date();
  return {
    day: today.getDay(),
    isTuesday: today.getDay() === 2,
    isWeekend: today.getDay() === 0 || today.getDay() === 6,
  };
}

// 요일 관련 상수
const TUESDAY = 2; // 화요일 (0=일요일, 1=월요일, 2=화요일, ...)

export function isTuesday() {
  const today = new Date();
  return today.getDay() === TUESDAY;
}

import { DISCOUNT_RULES, POINTS_RULES } from "../constants";

/**
 * 특별 할인 요일 체크
 * @param {Date} date
 * @returns {boolean}
 */
export const isSpecialDiscountDay = (date: Date = new Date()): boolean => {
  return DISCOUNT_RULES.SPECIAL_DISCOUNT_DAYS.includes(date.getDay());
};

/**
 * 특별 포인트 요일 체크
 * @param {Date} date
 * @returns {boolean}
 */
export const isSpecialPointsDay = (date: Date = new Date()): boolean => {
  return POINTS_RULES.SPECIAL_POINTS_DAYS.includes(date.getDay());
};
/**
 * 요일 이름 추출
 * @param {number} dayIndex
 * @returns {string} 요일 이름
 */
export const getKoreanDayName = (dayIndex: number): string => {
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return dayNames[dayIndex] || "";
};

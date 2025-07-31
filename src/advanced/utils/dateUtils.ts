import { DAYS_OF_WEEK } from '../constants/index.js';

// 현재 날짜가 화요일인지 확인
export const isTuesday = (): boolean => {
  const today = new Date();
  return today.getDay() === DAYS_OF_WEEK.TUESDAY;
};

// 두 날짜 간의 차이를 밀리초로 반환
export const getTimeDifference = (date1: Date, date2: Date): number => {
  return Math.abs(date1.getTime() - date2.getTime());
};

// 현재 시간을 반환
export const getCurrentTime = (): Date => {
  return new Date();
};
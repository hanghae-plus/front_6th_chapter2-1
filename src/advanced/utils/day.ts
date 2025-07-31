import { SPECIAL_DAY } from '../constants/day';

export function isSpecialDay() {
  const today = new Date();
  return today.getDay() === SPECIAL_DAY;
}

export function formatSpecialDay(lang: 'ko' | 'en' = 'ko') {
  const day = ['일', '월', '화', '수', '목', '금', '토'];
  const enDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return lang === 'ko' ? `${day[SPECIAL_DAY]}요일` : enDay[SPECIAL_DAY];
}

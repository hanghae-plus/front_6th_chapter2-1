// format.js - 금액, 숫자 등 포맷 관련 유틸 함수

/**
 * 금액을 3자리 콤마와 원 단위로 포맷
 * @param {number} value
 * @returns {string}
 */

export function formatPrice(value) {
  // 콤마가 포함된 문자열도 처리
  if (typeof value === 'string') {
    value = value.replace(/,/g, '').trim();
  }
  const num = Number(value);
  if (isNaN(num)) return '';
  return '₩' + num.toLocaleString('ko-KR');
}

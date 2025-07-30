/**
 * @description 기본 포인트 계산 (총 금액의 0.1%)
 * @param {number} totalAmount - 총 금액
 * @returns {number} 포인트
 */
export const calculateBasePoint = (totalAmount) => {
  return Math.floor(totalAmount / 1000);
};

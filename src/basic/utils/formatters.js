export const formatPoints = (points) => `${points}p`; // 포인트 포맷팅
export const formatPercentage = (rate) => `${(rate * 100).toFixed(1)}%`; // 퍼센트 포맷팅
export const formatNumber = (number) => {
  if (typeof number !== 'number' && typeof number !== 'string') {
    return number; // 숫자가 아니거나 문자열이 아니면 그대로 반환
  }
  return Number(number).toLocaleString();
};

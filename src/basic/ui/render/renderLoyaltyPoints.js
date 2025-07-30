/**
 * 포인트 정보 렌더링 함수
 * @param {Object} totals - 계산된 총계 정보
 * @returns {string} 렌더링된 HTML
 */
export const renderLoyaltyPoints = (totals) => {
  const { totalAmount } = totals;
  const points = Math.floor(totalAmount / 1000);

  if (points > 0) {
    return `<div>적립 포인트: <span class="font-bold">${points}p</span></div>`;
  } else {
    return "적립 포인트: 0p";
  }
};

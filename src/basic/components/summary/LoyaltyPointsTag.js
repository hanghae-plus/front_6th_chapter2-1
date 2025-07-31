/**
 * LoyaltyPointsTag 컴포넌트
 * 적립 포인트 정보를 표시하는 태그를 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {number} [props.bonusPoints=0] - 보너스 포인트
 * @param {Array} [props.pointsDetail] - 포인트 상세 내역
 * @returns {string} 적립 포인트 태그 HTML
 */
export function LoyaltyPointsTag({ bonusPoints = 0, pointsDetail }) {
  if (bonusPoints === 0) {
    return '적립 포인트: 0p';
  }

  return /* HTML */ `
    <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
    ${pointsDetail.length > 0
      ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
      : ''}
  `;
}

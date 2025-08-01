/**
 * 포인트 정보 렌더링 컴포넌트
 * 적립 포인트 정보를 표시하는 컴포넌트입니다.
 */
export function renderLoyaltyPoints(points, pointInfo) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  if (points > 0) {
    loyaltyPointsDiv.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${points}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointInfo.detailText}</div>`;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
}

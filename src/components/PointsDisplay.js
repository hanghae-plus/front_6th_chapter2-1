export function createPointsDisplay({ bonusPoints = 0, pointsDetail = [] }) {
  const container = document.createElement('div');

  if (bonusPoints > 0) {
    container.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
  } else {
    container.textContent = '적립 포인트: 0p';
  }

  return container;
}

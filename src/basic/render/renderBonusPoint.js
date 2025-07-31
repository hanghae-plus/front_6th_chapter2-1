// 포인트 출력
export const renderBonusPoints = (appState) => {
  const { totalPoints, pointsDetail } = appState;

  const pointDiv = document.getElementById('loyalty-points');
  if (!pointDiv) return;

  if (totalPoints > 0) {
    pointDiv.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      totalPoints +
      'p</span></div>' +
      '<div class="text-2xs opacity-70 mt-1">' +
      pointsDetail.join(', ') +
      '</div>';
    pointDiv.style.display = 'block';
  } else {
    pointDiv.textContent = '적립 포인트: 0p';
    pointDiv.style.display = 'none';
  }
};

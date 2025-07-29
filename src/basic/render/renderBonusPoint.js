// 포인트 출력
export const renderBonusPoints = (appState) => {
  const { totalPoints, pointsDetail } = appState;

  const ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) return;

  if (totalPoints > 0) {
    ptsTag.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      totalPoints +
      'p</span></div>' +
      '<div class="text-2xs opacity-70 mt-1">' +
      pointsDetail.join(', ') +
      '</div>';
    ptsTag.style.display = 'block';
  } else {
    ptsTag.textContent = '적립 포인트: 0p';
    ptsTag.style.display = 'none';
  }
};

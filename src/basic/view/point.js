export function renderBonusPoints(bonusPoints, detail) {
  const ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) return;

  if (bonusPoints > 0) {
    ptsTag.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${detail.join(', ')}</div>`;
  } else {
    ptsTag.textContent = '적립 포인트: 0p';
  }

  ptsTag.style.display = 'block';
}

/**
 * 보너스 포인트 UI 업데이트
 * @param {Object} bonusPointsData - 보너스 포인트 계산 결과
 */
export const updateBonusPoints = (bonusPointsData) => {
  const { finalPoints, pointsDetail } = bonusPointsData;

  // 포인트 태그 존재 체크
  const ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) return;

  // 장바구니가 비어있거나 포인트가 0이면 숨김
  if (finalPoints === 0) {
    ptsTag.style.display = "none";
    return;
  }

  // 포인트 태그 내용 업데이트
  ptsTag.innerHTML = /* HTML */ `
    <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>
  `;

  // 포인트 태그 표시
  ptsTag.style.display = "block";
};

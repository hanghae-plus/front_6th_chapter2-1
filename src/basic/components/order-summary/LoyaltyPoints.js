export const LoyaltyPoints = (bonusPts, pointsDetail) => {
  if (bonusPts <= 0) {
    return '<div>적립 포인트: 0p</div>';
  }
  const detailHTML =
    pointsDetail.length > 0
      ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
      : '';
  return `
    <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
    ${detailHTML}
  `;
};

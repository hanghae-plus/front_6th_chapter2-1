export const LoyaltyPoints = ({
  totalDiscountedPrice,
  cartItems,
  bonusPoints,
  pointsDetail,
}) => {
  const loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    if (bonusPoints > 0) {
      loyaltyPointsDiv.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>
      `;
      loyaltyPointsDiv.style.display = "block";
    } else {
      let points = Math.floor(totalDiscountedPrice / 1000);
      loyaltyPointsDiv.textContent =
        points > 0 ? `적립 포인트: ${points}p` : "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }

  if (cartItems.length === 0) {
    loyaltyPointsDiv.style.display = "none";
  }
};

export const LoyaltyPoints = ({ totalDiscountedPrice, cartItems }) => {
  const loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    let points = Math.floor(totalDiscountedPrice / 1000);

    loyaltyPointsDiv.textContent =
      points > 0 ? `적립 포인트: ${points}p` : "적립 포인트: 0p";
    loyaltyPointsDiv.style.display = "block";
  }

  if (cartItems.length === 0) {
    loyaltyPointsDiv.style.display = "none";
  }
};

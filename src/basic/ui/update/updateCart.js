import { renderCartSummary } from "../render/renderCartSummary";
import { renderDiscountInfo } from "../render/renderDiscountInfo";
import { renderLoyaltyPoints } from "../render/renderLoyaltyPoints";

/**
 * 장바구니 UI 업데이트
 * @param {Object} cartData - 장바구니 데이터
 */
export const updateCartUI = (cartData) => {
  const { totals } = cartData;

  // 아이템 수 표시 업데이트
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${totals.totalQty} items in cart`;
  }

  // 요약 상세 정보 렌더링
  const summaryDetails = document.getElementById("summary-details");
  if (summaryDetails) {
    summaryDetails.innerHTML = renderCartSummary(cartData);
  }

  // 총액 표시 업데이트
  const sum = document.getElementById("cart-total");
  const totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = `₩${totals.totalAmount.toLocaleString()}`;
  }

  // 포인트 정보 렌더링
  const loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    loyaltyPointsDiv.innerHTML = renderLoyaltyPoints(totals);
    loyaltyPointsDiv.style.display = "block";
  }

  // 할인 정보 렌더링
  const discountInfoDiv = document.getElementById("discount-info");
  if (discountInfoDiv) {
    discountInfoDiv.innerHTML = renderDiscountInfo(totals);
  }

  // 화요일 할인 표시 업데이트
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (tuesdaySpecial) {
    if (totals.isTuesday && totals.totalAmount > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }
};

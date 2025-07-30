import { getCartItems, getTotalCartQuantity } from '../services/cartService';
import { calculateCartTotals } from '../services/discountService';
import { calculateLoyaltyPoints } from '../services/pointService';

export function updateUI({
  productSelectComp,
  cartDisplayComp,
  stockInfoComp,
  summaryDetailsComp,
  discountInfoComp,
  totalDisplayComp,
  tuesdaySpecialComp,
}) {
  productSelectComp.updateOptions();
  cartDisplayComp.renderCart();
  stockInfoComp.updateStockInfo();

  const currentCartItems = getCartItems();
  const totalItemCount = getTotalCartQuantity();

  const {
    subtotal,
    finalTotal,
    savedAmount,
    overallDiscountRate,
    itemDiscountsApplied,
    isTuesdaySpecialApplied,
  } = calculateCartTotals(currentCartItems);

  const { points, details: pointsDetails } = calculateLoyaltyPoints(
    currentCartItems,
    finalTotal,
    totalItemCount
  );

  summaryDetailsComp.updateSummary(
    currentCartItems,
    subtotal,
    itemDiscountsApplied,
    isTuesdaySpecialApplied,
    totalItemCount
  );
  discountInfoComp.updateDiscountInfo(savedAmount, overallDiscountRate, finalTotal);
  totalDisplayComp.updateTotal(finalTotal, points, pointsDetails);
  tuesdaySpecialComp.toggleVisibility(isTuesdaySpecialApplied);

  document.getElementById('item-count').textContent = `🛍️ ${totalItemCount} items in cart`;
}

import { DOM_IDS } from "../shared/constants/index.js";
import { 
  updateCartTotal, 
  updateLoyaltyPoints, 
  updateDiscountInfo, 
  updateTuesdaySpecial 
} from "./OrderSummaryComponent.js";
import { updateItemCount } from "./ItemCountComponent.js";
import { updateStockInfo } from "./ProductSelectorComponent.js";

export function updateAllDisplays({ 
  sum, 
  totalAmt, 
  itemCount, 
  products, 
  stockInfo, 
  isTuesday 
}) {
  const summaryDetails = document.getElementById(DOM_IDS.SUMMARY_DETAILS);
  const itemCountElement = document.getElementById(DOM_IDS.ITEM_COUNT);
  const totalPriceElement = sum.querySelector(".text-2xl");

  summaryDetails.innerHTML = "";
  updateCartTotal({ totalPriceElement, totalAmt });
  updateLoyaltyPoints({ totalAmt });
  updateDiscountInfo({ discRate: 0, originalTotal: 0, totalAmt });
  updateTuesdaySpecial({ isTuesday, totalAmt });
  updateItemCount({ itemCountElement, itemCount });
  updateStockInfo({ stockInfo, products });

  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    ptsTag.style.display = "none";
  }
}
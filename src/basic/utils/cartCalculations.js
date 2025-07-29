import { QUANTITY_THRESHOLDS, DISCOUNT_RATES } from "../constants/index.js";
import { findProductById, calculateItemDiscount } from "./productUtils.js";

export function calculateCartTotals(cartItems, productList) {
  let totalAmt = 0;
  let itemCnt = 0;
  let subTot = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(cartItems[i].id, productList);
    if (!curItem) continue;

    const qtyElem = cartItems[i].querySelector(".quantity-number");
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.price * q;
    
    itemCnt += q;
    subTot += itemTot;
    
    const disc = calculateItemDiscount(curItem.id, q);
    if (disc > 0) {
      itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
    }
    
    totalAmt += itemTot * (1 - disc);
  }

  return { totalAmt, itemCnt, subTot, itemDiscounts };
}

export function applyBulkAndSpecialDiscounts(totalAmt, itemCnt, subTot) {
  let discRate = 0;
  const originalTotal = subTot;
  
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = subTot * DISCOUNT_RATES.BULK_PURCHASE;
    discRate = 1 - DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday && totalAmt > 0) {
    totalAmt = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL;
    discRate = 1 - totalAmt / originalTotal;
  }

  return { totalAmt, discRate, originalTotal, isTuesday };
}

export function getLowStockItems(productList) {
  const lowStockItems = [];
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING && productList[idx].quantity > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }
  return lowStockItems;
}
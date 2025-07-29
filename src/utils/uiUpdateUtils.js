import { createDiscountInfo } from '../components/DiscountInfo.js';
import { createOrderSummary } from '../components/OrderSummary/index.js';
import { getProduct } from '../managers/ProductManager.js';
import { getBulkBonus } from './productUtils.js';
import { createPointsDisplay } from '../components/PointsDisplay.js';
import { POINT_RATES } from '../constants/shopPolicy.js';
import { KEYBOARD_ID, MOUSE_ID, MONITOR_ID } from '../constants/productId.js';
import {
  isTuesday,
  formatPrice,
  getQuantityFromElement,
} from './global/index.js';

function updateTuesdaySpecial(isTuesdayFlag, finalTotal) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  tuesdaySpecial.classList.toggle('hidden', !(isTuesdayFlag && finalTotal > 0));
}

function updateItemCount(itemCnt) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

function replaceOrderSummary(cartData, discountData) {
  const { subTot, itemDiscounts, itemCnt, cartItems } = cartData;
  const { discRate, originalTotal, finalTotal, isTuesday } = discountData;

  const rightColumn = document.querySelector('.right-column');
  rightColumn.querySelector('.order-summary-section')?.remove();

  const newOrderSummary = createOrderSummary({
    subTot,
    cartItems,
    itemCnt,
    itemDiscounts,
    isTuesday,
    totalAmt: finalTotal,
    discRate,
    originalTotal,
    getProduct,
    getQuantityFromElement,
  });
  newOrderSummary.classList.add('order-summary-section');
  rightColumn.appendChild(newOrderSummary);
}

function updateCartTotal(finalTotal) {
  const rightColumn = document.querySelector('.right-column');
  const totalDiv = rightColumn.querySelector('#cart-total .text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(finalTotal);
  }
}

function updateDiscountInfo(discRate, finalTotal, originalTotal) {
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  discountInfoDiv.appendChild(
    createDiscountInfo({
      discRate,
      totalAmt: finalTotal,
      originalTotal,
      formatPrice,
    })
  );
}

function calculateBasePoints(totalAmt) {
  return Math.floor(totalAmt * POINT_RATES.BASE_RATE);
}

function calculateTuesdayBonus(basePoints) {
  if (basePoints > 0 && isTuesday()) {
    return {
      points: basePoints * POINT_RATES.TUESDAY_MULTIPLIER,
      detail: `화요일 ${POINT_RATES.TUESDAY_MULTIPLIER}배`,
    };
  }
  return null;
}

function checkProductsInCart(nodes) {
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  for (const node of nodes) {
    const product = getProduct(node.id);
    if (!product) continue;
    if (product.id === KEYBOARD_ID) {
      hasKeyboard = true;
    } else if (product.id === MOUSE_ID) {
      hasMouse = true;
    } else if (product.id === MONITOR_ID) {
      hasMonitorArm = true;
    }
  }

  return { hasKeyboard, hasMouse, hasMonitorArm };
}

function calculateSetBonuses(hasKeyboard, hasMouse, hasMonitorArm) {
  const bonuses = [];

  if (hasKeyboard && hasMouse) {
    bonuses.push({
      points: POINT_RATES.SETS.KEYBOARD_MOUSE,
      detail: `키보드+마우스 세트 +${POINT_RATES.SETS.KEYBOARD_MOUSE}p`,
    });
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonuses.push({
      points: POINT_RATES.SETS.FULL_SET,
      detail: `풀세트 구매 +${POINT_RATES.SETS.FULL_SET}p`,
    });
  }

  return bonuses;
}

function hidePointsDisplay() {
  document.getElementById('loyalty-points').style.display = 'none';
}

function renderPointsToDOM(bonusPoints, pointsDetail) {
  const ptsTag = document.getElementById('loyalty-points');
  const pointsDisplay = createPointsDisplay({
    bonusPoints,
    pointsDetail,
  });

  if (ptsTag.firstChild) {
    ptsTag.replaceChild(pointsDisplay, ptsTag.firstChild);
  } else {
    ptsTag.appendChild(pointsDisplay);
  }
  ptsTag.style.display = 'block';
}

function renderBonusPoints(totalAmt, itemCnt) {
  const cartDisp = document.getElementById('cart-items');
  const nodes = cartDisp.children;

  if (nodes.length === 0) {
    hidePointsDisplay();
    return;
  }

  const basePoints = calculateBasePoints(totalAmt);
  let finalPoints = basePoints;
  let pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push('기본: ' + basePoints + 'p');

    const tuesdayBonus = calculateTuesdayBonus(basePoints);
    if (tuesdayBonus) {
      finalPoints = tuesdayBonus.points;
      pointsDetail.push(tuesdayBonus.detail);
    }
  }

  const { hasKeyboard, hasMouse, hasMonitorArm } = checkProductsInCart(nodes);
  const setBonuses = calculateSetBonuses(hasKeyboard, hasMouse, hasMonitorArm);

  setBonuses.forEach((bonus) => {
    finalPoints += bonus.points;
    pointsDetail.push(bonus.detail);
  });

  const bulkBonus = getBulkBonus(itemCnt);
  if (bulkBonus) {
    finalPoints += bulkBonus.points;
    pointsDetail.push(
      `대량구매(${bulkBonus.threshold}개+) +${bulkBonus.points}p`
    );
  }

  renderPointsToDOM(finalPoints, pointsDetail);
}

export function updateUIAfterCartChange(cartData, discountData) {
  const {
    finalTotal,
    isTuesday: isTuesdayFlag,
    discRate,
    originalTotal,
  } = discountData;
  const { itemCnt } = cartData;

  updateTuesdaySpecial(isTuesdayFlag, finalTotal);
  updateItemCount(itemCnt);
  replaceOrderSummary(cartData, discountData);
  updateCartTotal(finalTotal);
  updateDiscountInfo(discRate, finalTotal, originalTotal);
  renderBonusPoints(finalTotal, itemCnt);

  return finalTotal;
}

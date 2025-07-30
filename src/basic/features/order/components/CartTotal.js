import { ELEMENT_IDS } from '../../../shared/constants/element-ids.js';
import { getCartTotalElement } from '../../../shared/utils/dom.js';

/**
 * CartTotal Component - Pure HTML Template
 * @param {object} props - Component props
 * @param {number} props.amount - Total amount
 * @param {number} props.discountRate - Discount rate (0-1)
 * @param {number} props.point - Loyalty points
 */
const CartTotal = ({ amount, discountRate, point }) => {
  return /* html */ `<div class="pt-5 border-t border-white/10">
    <div class="flex justify-between items-baseline">
      <span class="text-sm uppercase tracking-wider">Total</span>
      <div class="text-2xl tracking-tight">₩${Math.round(
        amount,
      ).toLocaleString()}${
        discountRate > 0
          ? `<span class="text-green-500 ml-2 text-sm">(${(
              discountRate * 100
            ).toFixed(1)}% 할인 적용)</span>`
          : ''
      }</div>
    </div>
    <div id="${
      ELEMENT_IDS.LOYALTY_POINTS
    }" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: ${point}p</div>
  </div>`;
};

export default CartTotal;

/**
 * Render CartTotal to DOM - Only update the total amount, preserve loyalty-points
 * @param {object} props - Component props
 */
export const renderCartTotal = ({ amount, discountRate }) => {
  const cartTotal = getCartTotalElement();
  if (!cartTotal) return;

  // Only update the total amount div, preserve existing loyalty-points
  const totalAmountDiv = cartTotal.querySelector('.text-2xl');
  if (totalAmountDiv) {
    totalAmountDiv.innerHTML = `₩${Math.round(amount).toLocaleString()}${
      discountRate > 0
        ? `<span class="text-green-500 ml-2 text-sm">(${(
            discountRate * 100
          ).toFixed(1)}% 할인 적용)</span>`
        : ''
    }`;
  }

  // Don't overwrite loyalty-points - doRenderBonusPoints handles that separately
};

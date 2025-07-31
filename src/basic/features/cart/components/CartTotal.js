import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';
import { setInnerHTML, setTextContent } from '@/basic/shared/core/domUtils.js';

/**
 * CartTotal Component - Pure HTML Template
 * @param {object} props - Component props
 * @param {number} props.amount - Total amount
 * @param {number} props.discountRate - Discount rate (0-1)
 * @param {number} props.point - Points to display
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
 * Render CartTotal to DOM - Update main.basic.js DOM structure
 * @param {object} props - Component props
 * @param {number} props.amount - Total amount
 * @param {number} props.discountRate - Discount rate (0-1)
 */
export const renderCartTotal = ({ amount, discountRate }) => {
  // Update total amount
  const totalAmountElement = document.getElementById('total-amount');
  if (totalAmountElement) {
    setTextContent(
      totalAmountElement,
      `총액: ₩${Math.round(amount).toLocaleString()}`,
    );
  }

  // Update discount info
  const discountInfoElement = document.getElementById('discount-info');
  if (discountInfoElement) {
    const discountHTML =
      discountRate > 0 ? `${(discountRate * 100).toFixed(1)}%` : '';
    setTextContent(discountInfoElement, discountHTML);
  }
};

import { getSummaryDetailsElement } from "../../../shared/utils/dom.js";

/**
 * OrderSummaryDetails Component - Pure HTML Template
 * @param {Object} props - Component props
 * @param {Array} props.cartItems - Cart items with product info
 * @param {number} props.subtotal - Subtotal amount
 * @param {number} props.totalItemCount - Total item count
 * @param {Array} props.itemDiscounts - Individual item discounts
 * @param {boolean} props.isTuesday - Tuesday discount status
 * @param {number} props.totalAmount - Final total amount
 */
const OrderSummaryDetails = ({
  cartItems = [],
  subtotal = 0,
  totalItemCount = 0,
  itemDiscounts = [],
  isTuesday = false,
  totalAmount = 0,
}) => {
  // Empty state
  if (subtotal === 0) {
    return /* html */ `<div class="text-gray-400 text-sm">장바구니가 비어있습니다</div>`;
  }

  // Cart items section
  const cartItemsHtml = cartItems
    .map(
      ({ product, quantity }) => /* html */ `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${product.name} x ${quantity}</span>
      <span>₩${(product.val * quantity).toLocaleString()}</span>
    </div>
  `
    )
    .join("");

  // Discounts section
  const discountsHtml = (() => {
    if (totalItemCount >= 30) {
      // Bulk discount
      return /* html */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      // Individual item discounts
      return itemDiscounts
        .map(
          (item) => /* html */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `
        )
        .join("");
    }
    return "";
  })();

  // Tuesday discount section
  const tuesdayDiscountHtml =
    isTuesday && totalAmount > 0
      ? /* html */ `
    <div class="flex justify-between text-sm tracking-wide text-purple-400">
      <span class="text-xs">🌟 화요일 추가 할인</span>
      <span class="text-xs">-10%</span>
    </div>
  `
      : "";

  return /* html */ `
    ${cartItemsHtml}
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
    ${discountsHtml}
    ${tuesdayDiscountHtml}
  `;
};

export default OrderSummaryDetails;

/**
 * Render OrderSummaryDetails to DOM
 * @param {Object} props - Component props (same as OrderSummaryDetails)
 */
export const renderOrderSummaryDetails = (props) => {
  const summaryDetailsContainer = getSummaryDetailsElement();
  if (!summaryDetailsContainer) return;

  const summaryHtml = OrderSummaryDetails(props);
  summaryDetailsContainer.innerHTML = summaryHtml;
};

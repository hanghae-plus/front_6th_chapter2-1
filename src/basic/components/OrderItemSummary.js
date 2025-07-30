export const OrderItemSummary = (summary) => {
  const itemsHTML = summary.cartItemsForDisplay
    .map(
      (item) => `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${item.name} x ${item.quantity}</span>
      <span>₩${item.totalPrice}</span>
    </div>
  `,
    )
    .join('');

  const discountsHTML = summary.discounts
    .map(
      (d) => `
    <div class="flex justify-between text-sm tracking-wide text-green-400">
      <span class="text-xs">${d.reason}</span>
      <span class="text-xs">-${d.amount}</span>
    </div>
  `,
    )
    .join('');

  if (summary.totalQuantity === 0) return '';

  return `
    ${itemsHTML}
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${summary.subtotal}</span>
    </div>
    ${discountsHTML}
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
};

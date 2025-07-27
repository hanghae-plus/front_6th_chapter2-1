const OrderSummary = ({
  cartItems,
  products,
  subtotal,
  totalItemCount,
  itemDiscounts,
  isTuesday,
  totalAmount,
  bulkDiscountThreshold,
}) => {
  let summaryHTML = "";

  if (subtotal > 0) {
    cartItems.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return;

      const qtyElement = cartItem.querySelector(".quantity-number");
      const quantity = parseInt(qtyElement.textContent);
      const itemTotal = product.val * quantity;

      summaryHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    summaryHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;

    summaryHTML += OrderSummary.getDiscountInfo({
      totalItemCount,
      itemDiscounts,
      isTuesday,
      totalAmount,
      bulkDiscountThreshold,
    });

    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  return summaryHTML;
};

OrderSummary.getDiscountInfo = ({
  totalItemCount,
  itemDiscounts,
  isTuesday,
  totalAmount,
  bulkDiscountThreshold,
}) => {
  let discountHTML = "";

  if (totalItemCount >= bulkDiscountThreshold) {
    discountHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      discountHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesday && totalAmount > 0) {
    discountHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  return discountHTML;
};

export default OrderSummary;

/**
 * 장바구니 요약 정보 렌더링 함수
 * @param {Object} cartData - 장바구니 데이터
 * @param {Array} cartData.items - 장바구니 아이템 배열
 * @param {Object} cartData.totals - 계산된 총계 정보
 * @returns {string} 렌더링된 HTML
 */
export const renderCartSummary = (cartData) => {
  const { items, totals } = cartData;
  const { subTotal, itemDiscounts, bulkDiscount, tuesdayDiscount, isTuesday } =
    totals;

  let html = "";

  // 아이템별 상세 정보
  if (subTotal > 0) {
    items.forEach((item) => {
      const itemTotal = item.val * item.quantity;
      html += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${item.name} x ${item.quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    // 구분선과 소계
    html += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보
    if (bulkDiscount > 0) {
      html += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-${bulkDiscount}%</span>
        </div>
      `;
    }

    // 아이템별 할인 정보
    if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        html += /* HTML */ `
          <div
            class="flex justify-between text-sm tracking-wide text-green-400"
          >
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 정보
    if (isTuesday && tuesdayDiscount > 0) {
      html += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-${tuesdayDiscount}%</span>
        </div>
      `;
    }

    // 배송비
    html += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  return html;
};

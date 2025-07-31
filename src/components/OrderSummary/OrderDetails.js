import { getProduct } from '../../managers/product.js';

export function createOrderDetails({
  originalTotal,
  cartItems,
  itemCnt,
  itemDiscounts,
  isTuesday,
  total,
  constants,
  getQuantityFromElement,
}) {
  const container = document.createElement('div');

  if (originalTotal > 0) {
    let html = '';

    // 개별 장바구니 항목 표시
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = getProduct(cartItems[i].id);
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = getQuantityFromElement(qtyElem);
      const itemTotal = curItem.price * q;

      html += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 부분합 표시
    html += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${originalTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (itemCnt >= constants.QUANTITY_THRESHOLDS.BONUS_LARGE) {
      html += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${constants.QUANTITY_THRESHOLDS.BONUS_LARGE}개 이상)</span>
          <span class="text-xs">-${constants.DISCOUNT_RATES.BULK * 100}%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        html += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (${constants.QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 추가 할인
    if (isTuesday && total > 0) {
      html += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-${constants.DISCOUNT_RATES.TUESDAY * 100}%</span>
        </div>
      `;
    }

    // 배송비 정보
    html += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;

    container.innerHTML = html;
  }

  return container;
}

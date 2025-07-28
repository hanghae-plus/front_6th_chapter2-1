export function createOrderSummary({
  subTot,
  cartItems,
  itemCnt,
  itemDiscounts,
  isTuesday,
  totalAmt,
  constants,
  findProductById,
  getQuantityFromElement,
}) {
  const container = document.createElement('div');

  if (subTot > 0) {
    let html = '';

    // 개별 장바구니 항목 표시
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(cartItems[i].id);
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = getQuantityFromElement(qtyElem);
      const itemTotal = curItem.val * q;

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
        <span>₩${subTot.toLocaleString()}</span>
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
    if (isTuesday && totalAmt > 0) {
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

export function createOrderSummarySection({
  summaryDetailsElement = null,
  discountInfoHtml = '',
  cartTotalElement = null,
  tuesdaySpecialElement = null,
  pointsNoticeHtml = '',
}) {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4">${discountInfoHtml}</div>
        <div id="cart-total" class="pt-5 border-t border-white/10"></div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden"></div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">${pointsNoticeHtml}</span>
    </p>
  `;

  // DOM 요소들을 적절한 위치에 삽입
  const summaryDetailsContainer = container.querySelector('#summary-details');
  if (summaryDetailsElement) {
    summaryDetailsContainer.appendChild(summaryDetailsElement);
  }

  const cartTotalContainer = container.querySelector('#cart-total');
  if (cartTotalElement) {
    cartTotalContainer.appendChild(cartTotalElement);
  }

  const tuesdaySpecialContainer = container.querySelector('#tuesday-special');
  if (tuesdaySpecialElement) {
    tuesdaySpecialContainer.appendChild(tuesdaySpecialElement);
  }

  return container;
}

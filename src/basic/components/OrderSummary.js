// ==========================================
// 주문 요약 컴포넌트
// ==========================================

import { THRESHOLDS, DISCOUNT_RATES } from '../constant/index.js';

/**
 * 주문 요약 HTML 생성
 */
export function OrderSummaryHTML() {
  const orderSummary = document.createElement('div');
  orderSummary.className = 'bg-black text-white p-8 flex flex-col';
  orderSummary.innerHTML = renderOrderSummary();

  return orderSummary;
}

/**
 * OrderSummary 렌더링 함수
 *
 * @description 주문 요약 HTML 문자열을 생성
 *
 * @returns {string} 주문 요약 HTML 문자열
 */
export const renderOrderSummary = () => {
  return `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
};

/**
 * 주문 요약 UI 업데이트
 */
export function updateOrderSummaryUI(
  cartItems,
  products,
  subTotal,
  itemDiscounts,
  itemCount,
  isTuesdayApplied,
) {
  const summaryDetails = document.getElementById('summary-details');

  summaryDetails.innerHTML = '';

  if (subTotal <= 0) {
    return;
  }

  const productMap = new Map();
  for (const product of products) {
    productMap.set(product.id, product);
  }

  Array.from(cartItems).forEach(cartItem => {
    const product = productMap.get(cartItem.id);
    if (!product) {
      return;
    }

    const quantity = parseInt(
      cartItem.querySelector('.quantity-number')?.textContent || '0',
    );
    const itemTotal = product.val * quantity;

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  if (itemCount >= THRESHOLDS.BULK_DISCOUNT_MIN) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${THRESHOLDS.BULK_DISCOUNT_MIN}개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach(item => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
                      <span class="text-xs">${item.name} (${THRESHOLDS.ITEM_DISCOUNT_MIN}개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesdayApplied) {
    summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT * 100}%</span>
          </div>
        `;
  }

  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

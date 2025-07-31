import { formatPrice } from '../utils/format.js';
import { BonusPoints } from './BonusPoints.js';

// UI 갱신 함수: 계산 결과를 받아 DOM만 갱신
export function renderCartSummaryUI(summary, domRefs) {
  const { itemCnt, subTot, totalAmt, discRate, savedAmount, itemDiscounts, isTuesday, stockMsg, points, pointDetails } =
    summary;
  const { cartDisp, stockInfo, sum } = domRefs;

  // 주문 요약
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    Array.from(cartDisp.children).forEach((cartItem) => {
      const curItem = domRefs.products.find((p) => p.id === cartItem.id);
      if (!curItem) return;
      const qtyElem = cartItem.querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.discountPrice * q;
      summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${curItem.name} x ${q}</span>
        <span>${formatPrice(itemTotal)}</span>
      </div>
    `;
    });
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subTot)}</span>
      </div>
    `;
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday && totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
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

  // 합계
  if (sum) {
    const totalDiv = sum.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = formatPrice(Math.round(totalAmt));
    }
  }

  // 할인 정보
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${formatPrice(Math.round(savedAmount))} 할인되었습니다</div>
      </div>
    `;
  }

  // 상품 수
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 메시지
  stockInfo.textContent = stockMsg;

  // 포인트 표시
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    const html = BonusPoints({ points, details: pointDetails });
    if (html === 'none') {
      ptsTag.style.display = 'none';
      ptsTag.innerHTML = '';
    } else {
      ptsTag.style.display = 'block';
      ptsTag.innerHTML = html;
    }
  }

  // 화요일 배너 표시
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (tuesdaySpecial) {
    if (isTuesday && totalAmt > 0) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }
}

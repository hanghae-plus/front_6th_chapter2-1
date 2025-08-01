import { handleCalculateCartStuff } from './utils/cart.js';
import { handleAddToCart, handleCartDispClick, initializeHandlers } from './utils/handlers.js';
import { productList } from './utils/stores.js';
import { doRenderBonusPoints } from './utils/ui/bonusPointsRender.js';
import { initialRender, stockInfo, sum } from './utils/ui/initialRenders.js';
import { onUpdateSelectOptions } from './utils/ui/productOptionRender.js';

export const cartState = {
  itemCnt: 0,
  totalAmt: 0,
};

export const cartDisp = document.createElement('div');
export const productSelect = document.createElement('select');
const addBtn = document.createElement('button');

function main() {
  initialRender(productSelect, addBtn, cartDisp);

  // 나머지 로직
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  initializeHandlers(cartDisp, handleCalculateCartStuff, onUpdateSelectOptions);

  addBtn.addEventListener('click', handleAddToCart);
  cartDisp.addEventListener('click', handleCartDispClick);
}

// UI 업데이트 함수 분리
export function updateCartSummaryUI({
  itemCnt,
  subTot,
  results,
  itemDiscounts,
  isTuesday,
  totalAmt,
  discRate,
  originalTotal,
}) {
  const itemCountElement = document.getElementById('item-count');
  const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
  itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
  if (previousCount !== itemCnt) {
    itemCountElement.setAttribute('data-changed', 'true');
  }

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    results.forEach(({ curItem, q, itemTot }) => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTot.toLocaleString()}</span>
        </div>
      `;
    });

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else {
      itemDiscounts.forEach(({ name, discount }) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${name} (10개↑)</span>
            <span class="text-xs">-${discount}%</span>
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

  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmt / 1000);
    loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
    loyaltyPointsDiv.style.display = 'block';
  }

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

// 보너스 줄까 말까

main();

// 핸들러함수

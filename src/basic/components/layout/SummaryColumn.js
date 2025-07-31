import { createCartTotal } from '../cart/CartTotal.js';
import { createDiscountInfo } from '../order/DiscountInfo.js';
import { createOrderSummary } from '../order/OrderSummary.js';
import { createRewardPoints } from '../order/RewardPoints.js';

export const createSummaryColumn = () => {
  const summaryColumn = document.createElement('div');
  summaryColumn.className = 'bg-black text-white p-8 flex flex-col';

  // 헤더
  summaryColumn.innerHTML = /* HTML */ `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col"></div>
  `;

  const mainContent = summaryColumn.querySelector('.flex-1');

  // 주문 상세 내역 추가
  const orderSummary = createOrderSummary();
  mainContent.appendChild(orderSummary);

  const bottomSection = document.createElement('div');
  bottomSection.className = 'mt-auto';

  const discountInfo = createDiscountInfo();
  const cartTotal = createCartTotal();
  const rewardPoints = createRewardPoints();

  // 화요일 특가 영역
  const tuesdaySpecial = document.createElement('div');
  tuesdaySpecial.id = 'tuesday-special';
  tuesdaySpecial.className = 'mt-4 p-3 bg-white/10 rounded-lg hidden';
  tuesdaySpecial.innerHTML = /* HTML */ `
    <div class="flex items-center gap-2">
      <span class="text-2xs"></span>
      <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
    </div>
  `;

  // 하단 섹션
  cartTotal.appendChild(rewardPoints);
  bottomSection.appendChild(discountInfo);
  bottomSection.appendChild(cartTotal);
  bottomSection.appendChild(tuesdaySpecial);
  mainContent.appendChild(bottomSection);

  // 푸터
  summaryColumn.innerHTML += /* HTML */ `
    <button
      class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
    >
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  return summaryColumn;
};

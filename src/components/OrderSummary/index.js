import { createOrderDetails } from './OrderDetails.js';
import { createDiscountInfo } from './DiscountInfo.js';
import { createCartTotal } from './CartTotal.js';
import { createTuesdayDiscount } from './TuesdayDiscount.js';
import { createCheckoutButton } from './CheckoutButton.js';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
} from '../../constants/shopPolicy.js';

export function createOrderSummary({
  subTot = 0,
  cartItems = [],
  itemCnt = 0,
  itemDiscounts = [],
  isTuesday = false,
  totalAmt = 0,
  discRate = 0,
  originalTotal = 0,
  findProductById,
  getQuantityFromElement,
}) {
  const container = document.createElement('div');

  // 내부에서 계산할 값들
  const tuesdayMessage = 'Tuesday Special 10% Applied';
  const constants = { QUANTITY_THRESHOLDS, DISCOUNT_RATES };

  // 주문 요약 상세 내용 생성
  const summaryDetails = createOrderDetails({
    subTot,
    cartItems,
    itemCnt,
    itemDiscounts,
    isTuesday,
    totalAmt,
    constants,
    findProductById,
    getQuantityFromElement,
  });

  // 할인 정보 생성
  const discountInfo = createDiscountInfo({
    discRate,
    totalAmt,
    originalTotal,
  });

  // 장바구니 총액 생성
  const cartTotal = createCartTotal({
    totalAmt,
  });

  // 화요일 특별 할인 생성
  const tuesdaySpecial = createTuesdayDiscount({
    isTuesday,
    totalAmt,
    tuesdayMessage,
  });

  container.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10"></div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg"></div>
        <div id="checkout-button" class="mt-6"></div>
      </div>
    </div>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  // 자식 컴포넌트들을 적절한 위치에 삽입
  const summaryDetailsContainer = container.querySelector('#summary-details');
  summaryDetailsContainer.appendChild(summaryDetails);

  const discountInfoContainer = container.querySelector('#discount-info');
  discountInfoContainer.appendChild(discountInfo);

  const cartTotalContainer = container.querySelector('#cart-total');
  cartTotalContainer.appendChild(cartTotal);

  const tuesdaySpecialContainer = container.querySelector('#tuesday-special');
  tuesdaySpecialContainer.appendChild(tuesdaySpecial);

  // 체크아웃 버튼 생성 및 삽입
  const checkoutButton = createCheckoutButton();

  const checkoutButtonContainer = container.querySelector('#checkout-button');
  checkoutButtonContainer.appendChild(checkoutButton);

  return container;
}

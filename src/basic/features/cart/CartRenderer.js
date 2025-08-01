import {
  getCartDisplayElement,
  getItemCountElement,
  getTotalDisplayElement,
  getDiscountInfoElement,
  getLoyaltyPointsElement,
  getTuesdaySpecialElement,
} from '../../shared/core/dom-refs.js';
import { getProductById } from '../../shared/core/business-state.js';
import { CartItem } from './components/CartItem.js';
import { formatRoundedPrice } from '../../shared/utils/formatters.js';

/**
 * 장바구니 아이템들을 DOM에 렌더링
 */
export function renderCartItems(cartData) {
  const cartDisplay = getCartDisplayElement();
  if (!cartDisplay) return;

  if (!cartData || cartData.length === 0) {
    cartDisplay.innerHTML = '';
    return;
  }

  cartDisplay.innerHTML = cartData
    .map((item) => {
      const product = getProductById(item.id);
      return CartItem(item, product);
    })
    .join('');
}

/**
 * 장바구니 수량 표시 업데이트
 */
export function renderCartCount(itemCount) {
  const itemCountElement = getItemCountElement();
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
}

/**
 * 주문 요약 UI 업데이트
 */
export function renderOrderSummary(summaryData) {
  const {
    finalAmount = 0,
    totalDiscountRate = 0,
    isTuesdayToday = false,
    individualDiscountInfo = [],
    subtotal = 0,
    cartData = [],
    totalQuantity = 0,
  } = summaryData;

  // 총액 표시 업데이트
  const totalDisplay = getTotalDisplayElement();
  if (totalDisplay) {
    const totalDiv = totalDisplay.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = formatRoundedPrice(finalAmount);
    }
  }

  // Order Summary 세부 내용 렌더링
  renderSummaryDetails(
    cartData,
    subtotal,
    totalQuantity,
    individualDiscountInfo,
    isTuesdayToday
  );

  // 할인 정보 렌더링
  renderDiscountInfo(individualDiscountInfo, totalDiscountRate);

  // 화요일 특별 할인 표시
  const tuesdaySpecial = getTuesdaySpecialElement();
  if (tuesdaySpecial) {
    tuesdaySpecial.classList.toggle('hidden', !isTuesdayToday);
  }
}

/**
 * 주문 요약 세부 내용 렌더링
 */
function renderSummaryDetails(
  cartData,
  subtotal,
  totalQuantity,
  individualDiscountInfo,
  isTuesdayToday
) {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  // 초기화
  summaryDetails.innerHTML = '';

  // 빈 장바구니면 아무것도 표시하지 않음
  if (!cartData || cartData.length === 0 || subtotal === 0) {
    return;
  }

  let summaryHTML = '';

  // 아이템별 요약 생성
  cartData.forEach((item) => {
    const product = getProductById(item.id);
    if (!product) return;

    const itemTotal = product.price * item.quantity;
    summaryHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${item.quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  // 소계 추가
  summaryHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보 표시
  if (totalQuantity >= 30) {
    // 대량 할인
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (individualDiscountInfo.length > 0) {
    // 개별 상품 할인
    individualDiscountInfo.forEach((info) => {
      summaryHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${info.name} (10개↑)</span>
          <span class="text-xs">-${info.discountPercent.toFixed(1)}%</span>
        </div>
      `;
    });
  }

  // 화요일 할인 표시
  if (isTuesdayToday) {
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  // 배송비 표시
  summaryHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  // 한번에 업데이트
  summaryDetails.innerHTML = summaryHTML;
}

/**
 * 할인 정보 표시 업데이트
 */
function renderDiscountInfo(individualDiscountInfo, totalDiscountRate) {
  const discountInfo = getDiscountInfoElement();
  if (!discountInfo) return;

  if (totalDiscountRate === 0) {
    discountInfo.innerHTML = '';
    return;
  }

  let discountHTML = '';

  // 개별 상품 할인 정보
  if (individualDiscountInfo.length > 0) {
    discountHTML += '<div class="text-xs text-white/70 mb-2">개별 할인:</div>';
    individualDiscountInfo.forEach((info) => {
      discountHTML += `<div class="text-xs text-blue-400">• ${info.name}: ${info.discountPercent.toFixed(1)}%</div>`;
    });
  }

  // 총 할인율
  discountHTML += `
    <div class="text-xs text-white/70 mt-2 pt-2 border-t border-white/20">
      <div class="flex justify-between">
        <span>총 할인율</span>
        <span class="text-red-400 font-medium">${(totalDiscountRate * 100).toFixed(1)}%</span>
      </div>
    </div>
  `;

  discountInfo.innerHTML = discountHTML;
}

/**
 * 포인트 표시 업데이트
 */
export function renderLoyaltyPoints(finalPoints, pointsDetails) {
  const loyaltyPointsElement = getLoyaltyPointsElement();
  if (!loyaltyPointsElement) return;

  if (finalPoints > 0) {
    loyaltyPointsElement.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetails.join(', ')}</div>
    `;
    loyaltyPointsElement.style.display = 'block';
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
    loyaltyPointsElement.style.display = 'block';
  }
}

/**
 * 빈 장바구니 시 포인트 숨기기
 */
export function hideLoyaltyPoints() {
  const loyaltyPointsElement = getLoyaltyPointsElement();
  if (loyaltyPointsElement) {
    loyaltyPointsElement.style.display = 'none';
  }
}

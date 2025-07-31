// ============================================
// UI UPDATES - DOM 조작 및 UI 렌더링
// ============================================

import { calculateAllPoints, getStockStatusMessage } from './businessLogic.js';
import { DISCOUNT_PERCENTAGES, QUANTITY_THRESHOLDS } from './constants.js';
import { formatPrice, isTuesday } from './utils.js';

// 모든 UI 업데이트를 한 곳에서 관리
export const updateAllUI = (cartState, AppState) => {
  updateItemCountDisplay(cartState.itemCount);
  updateTotalDisplay(cartState.totalAmount);
  updateSummaryDetails(
    cartState.cartItems,
    cartState.subtotal,
    cartState.itemCount,
    cartState.itemDiscounts,
    cartState.totalAmount,
  );
  updateDiscountInfo(cartState.discountRate, cartState.subtotal, cartState.totalAmount);
  updateTuesdaySpecialBanner(cartState.totalAmount);
  updateStockInfo(AppState);
  updateBasicPoints(cartState.totalAmount);
};

// 추가 계산 및 업데이트
export const updateAdditionalCalculations = (AppState) => {
  handleStockInfoUpdate(AppState);
  handleRenderBonusPoints(AppState);
};

// 아이템 수 표시 업데이트
const updateItemCountDisplay = (itemCount) => {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
};

// 총액 표시 업데이트
const updateTotalDisplay = (totalAmount) => {
  const totalDiv = AppState?.ui?.totalElement?.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(totalAmount);
  }
};

// 주문 요약 상세 업데이트
const updateSummaryDetails = (cartItems, subtotal, itemCount, itemDiscounts, totalAmount) => {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  summaryDetails.innerHTML = SummaryDetailsComponent(
    cartItems,
    subtotal,
    itemCount,
    itemDiscounts,
    totalAmount,
  );
};

// 할인 정보 업데이트
const updateDiscountInfo = (discountRate, originalTotal, totalAmount) => {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  discountInfoDiv.innerHTML = DiscountInfoComponent(discountRate, originalTotal, totalAmount);
};

// 화요일 특별 할인 배너 업데이트
const updateTuesdaySpecialBanner = (totalAmount) => {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (isTuesday() && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
};

// 재고 정보 업데이트
const updateStockInfo = (AppState) => {
  if (!AppState?.ui?.stockInfo) return;
  AppState.ui.stockInfo.textContent = StockInfoComponent(AppState);
};

// 기본 포인트 업데이트
const updateBasicPoints = (totalAmount) => {
  const points = Math.floor(totalAmount / 1000);
  if (points > 0) {
    updateLoyaltyPointsDisplay(points, [`기본: ${points}p`]);
  } else {
    updateLoyaltyPointsDisplay(0, []);
  }
};

// 재고 정보 업데이트 핸들러
const handleStockInfoUpdate = (AppState) => {
  if (!AppState?.ui?.stockInfo) return;
  AppState.ui.stockInfo.textContent = StockInfoComponent(AppState);
};

// 포인트 렌더링 핸들러
const handleRenderBonusPoints = (AppState) => {
  const cartItems = AppState.cart.items;

  if (cartItems.length === 0) {
    updateLoyaltyPointsDisplay(0, [], true);
    return;
  }

  const { finalPoints, pointsDetail } = calculateAllPoints(
    AppState.cart.totalAmount,
    cartItems,
    AppState.cart.itemCount,
  );

  AppState.cart.bonusPoints = finalPoints;
  updateLoyaltyPointsDisplay(finalPoints, pointsDetail);
};

// 포인트 표시 업데이트
const updateLoyaltyPointsDisplay = (finalPoints, pointsDetail, hide = false) => {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  if (hide) {
    loyaltyPointsElement.style.display = 'none';
  } else {
    loyaltyPointsElement.style.display = '';
    loyaltyPointsElement.innerHTML = LoyaltyPointsComponent(finalPoints, pointsDetail);
  }
};

// ============================================
// UI COMPONENTS - HTML 문자열 생성
// ============================================

// 주문 요약 상세 컴포넌트
const SummaryDetailsComponent = (cartItems, subtotal, itemCount, itemDiscounts, totalAmount) => {
  if (subtotal <= 0) return '';

  const cartItemSummaries = cartItems
    .map((cartItem) => CartItemSummaryComponent(cartItem))
    .join('');

  const discountComponents =
    itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE
      ? BulkDiscountComponent()
      : itemDiscounts.map((item) => IndividualDiscountComponent(item)).join('');

  const tuesdayDiscount = isTuesday() && totalAmount > 0 ? TuesdayDiscountComponent() : '';

  return `
    ${cartItemSummaries}
    ${SubtotalComponent(subtotal)}
    ${discountComponents}
    ${tuesdayDiscount}
    ${ShippingInfoComponent()}
  `;
};

// 장바구니 아이템 요약 컴포넌트
const CartItemSummaryComponent = (cartItem) => {
  const currentProduct = findProductById(AppState.products, cartItem.productId);
  const { quantity } = cartItem;
  const itemTotal = currentProduct.value * quantity;

  return `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${currentProduct.name} x ${quantity}</span>
      <span>${formatPrice(itemTotal)}</span>
    </div>
  `;
};

// 소계 컴포넌트
const SubtotalComponent = (subtotal) => `
  <div class="border-t border-white/10 my-3"></div>
  <div class="flex justify-between text-sm tracking-wide">
    <span>Subtotal</span>
    <span>${formatPrice(subtotal)}</span>
  </div>
`;

// 대량구매 할인 컴포넌트
const BulkDiscountComponent = () => `
  <div class="flex justify-between text-sm tracking-wide text-green-400">
    <span class="text-xs">🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_PURCHASE}개 이상)</span>
    <span class="text-xs">-${DISCOUNT_PERCENTAGES.BULK_PURCHASE}%</span>
  </div>
`;

// 개별 할인 컴포넌트
const IndividualDiscountComponent = (item) => `
  <div class="flex justify-between text-sm tracking-wide text-green-400">
    <span class="text-xs">${item.name} (${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑)</span>
    <span class="text-xs">-${item.discount}%</span>
  </div>
`;

// 화요일 할인 컴포넌트
const TuesdayDiscountComponent = () => `
  <div class="flex justify-between text-sm tracking-wide text-purple-400">
    <span class="text-xs">🌟 화요일 추가 할인</span>
    <span class="text-xs">-${DISCOUNT_PERCENTAGES.TUESDAY}%</span>
  </div>
`;

// 배송 정보 컴포넌트
const ShippingInfoComponent = () => `
  <div class="flex justify-between text-sm tracking-wide text-gray-400">
    <span>Shipping</span>
    <span>Free</span>
  </div>
`;

// 할인 정보 컴포넌트
const DiscountInfoComponent = (discountRate, originalTotal, totalAmount) => {
  if (discountRate <= 0 || originalTotal <= 0) return '';

  const discountAmount = originalTotal - totalAmount;
  const discountPercentage = (discountRate * 100).toFixed(1);

  return `
    <div class="flex justify-between text-sm tracking-wide text-green-400 mb-4">
      <span>할인</span>
      <span>-${formatPrice(discountAmount)} (${discountPercentage}%)</span>
    </div>
  `;
};

// 재고 정보 컴포넌트
const StockInfoComponent = (AppState) => {
  const stockMessage = getStockStatusMessage(AppState.products);
  return stockMessage || '';
};

// 포인트 컴포넌트
const LoyaltyPointsComponent = (finalPoints, pointsDetail, hide = false) => {
  if (hide) return '';

  if (finalPoints > 0) {
    return `<div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div><div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
  }

  return '적립 포인트: 0p';
};

// 임시 함수들 (나중에 제거 예정)
let AppState;
export const setAppState = (state) => {
  AppState = state;
};

const findProductById = (products, productId) =>
  products.find((product) => product.id === productId);

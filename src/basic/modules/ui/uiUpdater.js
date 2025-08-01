// UI Updater - React의 리렌더링과 유사한 패턴
import {
  subscribe,
  getStateSnapshot,
  getItemCount,
  getTotalAmount,
  getCartItemsContainer,
} from '../cart/cartState.js';
import { calculateCartItems } from '../cart/cartState.js';
import { calculateDiscounts } from '../services/discountService.js';
import { calculateLoyaltyPoints } from '../services/loyaltyService.js';
import { findProductById } from '../data/productData.js';
import { DISCOUNT_RATES } from '../data/productData.js';
import { isTuesday } from '../services/discountService.js';

// UI 업데이트 구독자들
let uiSubscribers = [];

// 포맷팅 헬퍼 함수
function formatPrice(price) {
  return '₩' + price.toLocaleString();
}

// UI 업데이트 함수들
function updateItemCountDisplay(count) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}

function updateSummaryDetails(cartItems, subtotal, itemDiscounts) {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  // 기존 내용 제거
  summaryDetails.innerHTML = '';

  if (subtotal <= 0) return;

  // DocumentFragment 사용으로 성능 개선
  const fragment = document.createDocumentFragment();

  // 개별 아이템들 추가
  Array.from(cartItems).forEach((itemElement) => {
    const product = findProductById(itemElement.id);
    if (!product) return;

    const quantity = parseInt(
      itemElement.querySelector('.quantity-number').textContent
    );
    const itemTotal = product.price * quantity;

    const itemRow = createSummaryItemRow(product.name, quantity, itemTotal);
    fragment.appendChild(itemRow);
  });

  // 구분선 추가
  const divider = createDivider();
  fragment.appendChild(divider);

  // 소계 추가
  const subtotalRow = createSummaryRow('Subtotal', formatPrice(subtotal));
  fragment.appendChild(subtotalRow);

  // 할인 정보 추가
  const discountRows = createDiscountRows(itemDiscounts);
  discountRows.forEach((row) => fragment.appendChild(row));

  // 화요일 할인 추가
  if (isTuesday()) {
    const tuesdayRow = createTuesdayDiscountRow();
    fragment.appendChild(tuesdayRow);
  }

  // 배송비 추가
  const shippingRow = createSummaryRow('Shipping', 'Free', 'text-gray-400');
  fragment.appendChild(shippingRow);

  // 한 번에 DOM에 추가
  summaryDetails.appendChild(fragment);
}

function createSummaryItemRow(productName, quantity, itemTotal) {
  const row = document.createElement('div');
  row.className = 'flex justify-between text-xs tracking-wide text-gray-400';
  row.innerHTML = `
    <span>${productName} x ${quantity}</span>
    <span>${formatPrice(itemTotal)}</span>
  `;
  return row;
}

function createDivider() {
  const divider = document.createElement('div');
  divider.className = 'border-t border-white/10 my-3';
  return divider;
}

function createSummaryRow(label, value, className = '') {
  const row = document.createElement('div');
  row.className = `flex justify-between text-sm tracking-wide ${className}`;
  row.innerHTML = `
    <span>${label}</span>
    <span>${value}</span>
  `;
  return row;
}

function createDiscountRows(itemDiscounts) {
  const rows = [];

  if (getItemCount() >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    const bulkRow = document.createElement('div');
    bulkRow.className =
      'flex justify-between text-sm tracking-wide text-green-400';
    bulkRow.innerHTML = `
      <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
      <span class="text-xs">-${DISCOUNT_RATES.BULK_PURCHASE_DISCOUNT}%</span>
    `;
    rows.push(bulkRow);
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      const discountRow = document.createElement('div');
      discountRow.className =
        'flex justify-between text-sm tracking-wide text-green-400';
      discountRow.innerHTML = `
        <span class="text-xs">${item.name} (10개↑)</span>
        <span class="text-xs">-${item.discount}%</span>
      `;
      rows.push(discountRow);
    });
  }

  return rows;
}

function createTuesdayDiscountRow() {
  const row = document.createElement('div');
  row.className = 'flex justify-between text-sm tracking-wide text-purple-400';
  row.innerHTML = `
    <span class="text-xs">🌟 화요일 추가 할인</span>
    <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT}%</span>
  `;
  return row;
}

function updateDiscountInfo(discountRate, totalAmount, originalTotal) {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  // 기존 내용 제거
  discountInfoDiv.innerHTML = '';

  if (discountRate <= 0 || totalAmount <= 0) return;

  const savedAmount = originalTotal - totalAmount;
  const discountElement = createDiscountInfoElement(discountRate, savedAmount);
  discountInfoDiv.appendChild(discountElement);
}

function createDiscountInfoElement(discountRate, savedAmount) {
  const container = document.createElement('div');
  container.className = 'bg-green-500/20 rounded-lg p-3';

  const headerRow = document.createElement('div');
  headerRow.className = 'flex justify-between items-center mb-1';
  headerRow.innerHTML = `
    <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
    <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
  `;

  const savedAmountText = document.createElement('div');
  savedAmountText.className = 'text-2xs text-gray-300';
  savedAmountText.textContent = `${formatPrice(Math.round(savedAmount))} 할인되었습니다`;

  container.appendChild(headerRow);
  container.appendChild(savedAmountText);

  return container;
}

function updateTuesdaySpecialDisplay() {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  const totalAmount = getTotalAmount();
  if (isTuesday() && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

function updateLoyaltyPointsDisplay(points, pointsDetail) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  // 기존 내용 제거
  loyaltyPointsDiv.innerHTML = '';

  if (getCartItemsContainer().children.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  if (points > 0) {
    const pointsElement = createLoyaltyPointsElement(points, pointsDetail);
    loyaltyPointsDiv.appendChild(pointsElement);
    loyaltyPointsDiv.style.display = 'block';
  } else {
    const zeroPointsElement = createZeroPointsElement();
    loyaltyPointsDiv.appendChild(zeroPointsElement);
    loyaltyPointsDiv.style.display = 'block';
  }
}

function createLoyaltyPointsElement(points, pointsDetail) {
  const container = document.createElement('div');

  const pointsText = document.createElement('div');
  pointsText.innerHTML = `적립 포인트: <span class="font-bold">${points}p</span>`;

  const detailText = document.createElement('div');
  detailText.className = 'text-2xs opacity-70 mt-1';
  detailText.textContent = pointsDetail.join(', ');

  container.appendChild(pointsText);
  container.appendChild(detailText);

  return container;
}

function createZeroPointsElement() {
  const element = document.createElement('div');
  element.textContent = '적립 포인트: 0p';
  return element;
}

// UI 업데이트 함수들
function updateCartUI(state) {
  const cartItemsContainer = state.cartItemsContainer;
  if (!cartItemsContainer) return;

  const cartItems = cartItemsContainer.children;

  // 장바구니 계산
  const cartData = calculateCartItems(cartItems);
  const { subtotal, totalQuantity } = cartData;

  // 할인 계산
  const discountData = calculateDiscounts(cartData);
  const { totalAmount, itemDiscounts, discountRate } = discountData;

  // UI 업데이트
  updateItemCountDisplay(totalQuantity);
  updateSummaryDetails(cartItems, subtotal, itemDiscounts);
  updateDiscountInfo(discountRate, totalAmount, subtotal);
  updateTuesdaySpecialDisplay();

  // 총액 표시 업데이트
  const cartTotalDisplay = state.cartTotalDisplay;
  if (cartTotalDisplay) {
    const totalDiv = cartTotalDisplay.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = formatPrice(Math.round(totalAmount));
    }
  }

  // 포인트 계산 및 표시
  const { finalPoints, pointsDetail } = calculateLoyaltyPoints(
    totalAmount,
    totalQuantity,
    Array.from(cartItems)
  );
  updateLoyaltyPointsDisplay(finalPoints, pointsDetail);
}

function updateStockUI(state) {
  const stockStatusDisplay = state.stockStatusDisplay;
  if (!stockStatusDisplay) return;

  // 재고 정보 업데이트 로직
  // (기존 updateStockInfo 함수의 로직을 여기로 이동 가능)
}

function updateProductSelectorUI(state) {
  const productSelectElement = state.productSelectElement;
  if (!productSelectElement) return;

  // 상품 선택 UI 업데이트 로직
  // (기존 updateSelectOptions 함수의 로직을 여기로 이동 가능)
}

// UI 업데이트 구독 설정
export function initializeUIUpdater() {
  // 상태 변경 시 UI 업데이트 구독
  const unsubscribe = subscribe((state) => {
    updateCartUI(state);
    updateStockUI(state);
    updateProductSelectorUI(state);
  });

  // 구독 해제 함수 저장
  uiSubscribers.push(unsubscribe);

  return unsubscribe;
}

// UI 업데이트 구독 해제
export function cleanupUIUpdater() {
  uiSubscribers.forEach((unsubscribe) => unsubscribe());
  uiSubscribers = [];
}

// 수동 UI 업데이트 트리거
export function triggerUIUpdate() {
  // 현재 상태로 UI 강제 업데이트
  const currentState = getStateSnapshot();
  updateCartUI(currentState);
  updateStockUI(currentState);
  updateProductSelectorUI(currentState);
}

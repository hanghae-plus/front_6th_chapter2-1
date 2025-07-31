// ============================================
// UI UPDATES - DOM 조작 및 UI 렌더링
// ============================================

import { calculateAllPoints, getStockStatusMessage } from './businessLogic.js';
import { DISCOUNT_PERCENTAGES, QUANTITY_THRESHOLDS } from './constants.js';
import { formatPrice, isTuesday } from './utils.js';

// ============================================
// RENDERING ENGINE - HTML 렌더링 처리
// ============================================

// 렌더링 엔진 (임시로만 사용, 나중에 React로 대체)
export const RenderingEngine = {
  // HTML 컴포넌트를 DOM에 렌더링
  render(componentHTML) {
    // HTML 문자열만 반환, DOM 조작은 하지 않음
    return componentHTML;
  },

  // 여러 컴포넌트를 한 번에 렌더링 - HTML 문자열만 반환
  renderAll(components) {
    return {
      itemCount: components.itemCount || '',
      total: components.total || '',
      summary: components.summary || '',
      discount: components.discount || '',
      tuesdayBanner: components.tuesdayBanner || '',
      stock: components.stock || '',
      points: components.points || '',
    };
  },

  // React 방식으로 실제 DOM에 렌더링
  renderToDOM(renderedHTML) {
    const elements = {
      itemCount: document.getElementById('item-count'),
      totalDiv: document.querySelector('#cart-total .text-2xl'),
      summaryDetails: document.getElementById('summary-details'),
      discountInfo: document.getElementById('discount-info'),
      tuesdaySpecial: document.getElementById('tuesday-special'),
      stockInfo: document.getElementById('stock-status'),
      loyaltyPoints: document.getElementById('loyalty-points'),
    };

    // 각 요소에 HTML 문자열 적용 (createElement 방식)
    if (renderedHTML.itemCount && elements.itemCount) {
      this.renderHTMLContent(elements.itemCount, renderedHTML.itemCount);
    }
    if (renderedHTML.total && elements.totalDiv) {
      this.renderHTMLContent(elements.totalDiv, renderedHTML.total);
    }
    if (renderedHTML.summary && elements.summaryDetails) {
      this.renderHTMLContent(elements.summaryDetails, renderedHTML.summary);
    }
    if (renderedHTML.discount && elements.discountInfo) {
      this.renderHTMLContent(elements.discountInfo, renderedHTML.discount);
    }
    if (renderedHTML.tuesdayBanner && elements.tuesdaySpecial) {
      this.renderHTMLContent(elements.tuesdaySpecial, renderedHTML.tuesdayBanner);
      elements.tuesdaySpecial.classList.remove('hidden');
    } else if (elements.tuesdaySpecial) {
      elements.tuesdaySpecial.classList.add('hidden');
    }
    if (renderedHTML.stock && elements.stockInfo) {
      this.renderHTMLContent(elements.stockInfo, renderedHTML.stock);
    }
    if (renderedHTML.points && elements.loyaltyPoints) {
      this.renderHTMLContent(elements.loyaltyPoints, renderedHTML.points);
    } else if (elements.loyaltyPoints) {
      // 빈 장바구니일 때 포인트 섹션 숨김
      elements.loyaltyPoints.style.display = 'none';
    }
  },

  // HTML 콘텐츠 렌더링 (innerHTML 없이 createElement 사용)
  renderHTMLContent(element, htmlString) {
    if (element) {
      // 기존 내용 제거
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

      // HTML 문자열을 DOM 요소로 변환
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;

      // 모든 자식 요소를 실제 요소에 추가
      while (tempDiv.firstChild) {
        element.appendChild(tempDiv.firstChild);
      }
    }
  },

  // 장바구니 아이템 수량 업데이트 (innerHTML 없이)
  updateCartItemQuantity(productId, newQuantity) {
    const quantityElement = document.querySelector(`#${productId} .quantity-number`);
    if (quantityElement) {
      quantityElement.textContent = newQuantity;
    }
  },
};

// 모든 UI 업데이트를 한 곳에서 관리 (HTML 리턴 방식)
export const updateAllUI = (cartState, AppState) => {
  // HTML 컴포넌트들 생성
  const itemCountHTML = ItemCountComponent(cartState.itemCount);
  const totalHTML = TotalComponent(cartState.totalAmount);
  const summaryHTML = SummaryDetailsComponent(
    cartState.cartItems,
    cartState.subtotal,
    cartState.itemCount,
    cartState.itemDiscounts,
    cartState.totalAmount,
    AppState.products,
  );
  const discountHTML = DiscountInfoComponent(
    cartState.discountRate,
    cartState.subtotal,
    cartState.totalAmount,
  );
  const tuesdayBannerHTML = TuesdaySpecialBannerComponent(cartState.totalAmount);
  const stockHTML = StockInfoComponent(AppState.products);
  // 포인트 업데이트 - 실제 포인트 계산 결과를 전달
  const pointsHTML = updateBasicPoints(
    cartState.totalAmount,
    cartState.cartItems,
    cartState.itemCount,
  );
  // HTML 컴포넌트들을 객체로 리턴
  return {
    itemCount: itemCountHTML,
    total: totalHTML,
    summary: summaryHTML,
    discount: discountHTML,
    tuesdayBanner: tuesdayBannerHTML,
    stock: stockHTML,
    points: pointsHTML,
  };
};

// 추가 계산 및 업데이트
export const updateAdditionalCalculations = (AppState) => {
  handleStockInfoUpdate(AppState);
  handleRenderBonusPoints(AppState);
};

// 아이템 수 표시 컴포넌트
const ItemCountComponent = (itemCount) =>
  `<p class="text-sm text-gray-500 font-normal mt-3" data-changed="true">🛍️ ${itemCount} items in cart</p>`;

// 총액 표시 컴포넌트
const TotalComponent = (totalAmount) =>
  `<div class="text-2xl tracking-tight">${formatPrice(totalAmount)}</div>`;

// 주문 요약 상세 컴포넌트 (이미 HTML 리턴 방식)
const SummaryDetailsComponent = (
  cartItems,
  subtotal,
  itemCount,
  itemDiscounts,
  totalAmount,
  products,
) => {
  if (subtotal <= 0) return '';

  const cartItemSummaries = cartItems
    .map((cartItem) => CartItemSummaryComponent(cartItem, products))
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

// 할인 정보 컴포넌트 (이미 HTML 리턴 방식)
const DiscountInfoComponent = (discountRate, originalTotal, totalAmount) => {
  if (discountRate <= 0 || originalTotal <= 0) return '';

  const discountAmount = originalTotal - totalAmount;
  const discountPercentage = (discountRate * 100).toFixed(1);

  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${discountPercentage}%</span>
      </div>
      <div class="text-2xs text-gray-300">${formatPrice(discountAmount)} 할인되었습니다</div>
    </div>
  `;
};

// 화요일 특별 할인 배너 컴포넌트
const TuesdaySpecialBannerComponent = (totalAmount) => {
  if (isTuesday() && totalAmount > 0) {
    return `
      <div class="mt-4 p-3 bg-white/10 rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-2xs">🎉</span>
          <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
        </div>
      </div>
    `;
  }
  return '';
};

// 기본 포인트 업데이트
const updateBasicPoints = (totalAmount, cartItems, itemCount) => {
  // 빈 장바구니일 때는 빈 문자열 반환 (리액트 변환을 위한 조건부 렌더링)
  if (cartItems.length === 0) {
    return '';
  }

  // businessLogic.js의 calculateAllPoints를 사용
  const { finalPoints, pointsDetail } = calculateAllPoints(totalAmount, cartItems, itemCount);
  return updateLoyaltyPointsDisplay(finalPoints, pointsDetail, false);
};

// 재고 정보 업데이트 핸들러
const handleStockInfoUpdate = (AppState) => StockInfoComponent(AppState.products);

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
const updateLoyaltyPointsDisplay = (finalPoints, pointsDetail, hide = false) =>
  LoyaltyPointsComponent(finalPoints, pointsDetail, hide);

// ============================================
// UI COMPONENTS - HTML 문자열 생성
// ============================================

// 장바구니 아이템 요약 컴포넌트
const CartItemSummaryComponent = (cartItem, products) => {
  const currentProduct = findProductById(products, cartItem.productId);
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

// 재고 정보 컴포넌트
const StockInfoComponent = (products) => {
  const stockMessage = getStockStatusMessage(products);
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

// 장바구니 아이템 수량 컴포넌트 (HTML 리턴 방식)
export const CartItemQuantityComponent = (productId, newQuantity) =>
  `<span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${newQuantity}</span>`;

// 임시 함수들 (나중에 제거 예정)
export const setAppState = () => {
  // AppState 설정 (현재는 사용하지 않지만 나중에 필요할 수 있음)
};

const findProductById = (products, productId) =>
  products.find((product) => product.id === productId);

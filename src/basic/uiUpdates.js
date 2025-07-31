// ============================================
// UI UPDATES - HTML 문자열 반환 방식 (리액트 변환 준비)
// ============================================

import { calculateAllPoints } from './businessLogic.js';
import {
  QUANTITY_THRESHOLDS,
  PRODUCT_IDS,
  DISCOUNT_RATES,
  DISCOUNT_PERCENTAGES,
} from './constants.js';

// 전역 AppState 참조
let AppState = null;

// AppState 설정 함수
export const setAppState = (state) => {
  AppState = state;
};

// 개별 상품 할인 계산 함수
const calculateIndividualDiscount = (productId, quantity) => {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    return 0;
  }

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  };

  return discountRates[productId] || 0;
};

// ============================================
// UI COMPONENTS - HTML 문자열 반환
// ============================================

// 아이템 카운트 컴포넌트
const ItemCountComponent = (itemCount) => `🛍️ ${itemCount} items in cart`;

// 총액 컴포넌트
const TotalComponent = (totalAmount) => `₩${totalAmount.toLocaleString()}`;

// 요약 세부사항 컴포넌트 (원본 스타일)
const SummaryDetailsComponent = (cartItems, products, cartState) => {
  if (cartItems.length === 0) {
    return '';
  }

  let summaryHTML = '';

  // 장바구니 아이템들
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    // 개별 할인 계산 (10개 이상 구매 시)
    const individualDiscount = calculateIndividualDiscount(product.id, item.quantity);
    const discountedPrice =
      individualDiscount > 0 ? product.value * (1 - individualDiscount) : product.value;
    const itemTotal = discountedPrice * item.quantity;

    summaryHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${item.quantity}</span>
        <span>₩${Math.round(itemTotal).toLocaleString()}</span>
      </div>
    `;
  });

  // 소계 (할인 적용된 가격으로 계산)
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;

    const individualDiscount = calculateIndividualDiscount(product.id, item.quantity);
    const discountedPrice =
      individualDiscount > 0 ? product.value * (1 - individualDiscount) : product.value;
    return sum + discountedPrice * item.quantity;
  }, 0);

  summaryHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보 (원본 스타일)
  const { individualDiscount, tuesdayDiscount } = cartState;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    // 대량구매 할인
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_PURCHASE}개 이상)</span>
        <span class="text-xs">-${DISCOUNT_PERCENTAGES.BULK_PURCHASE}%</span>
      </div>
    `;
  } else if (individualDiscount > 0) {
    // 개별 할인
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product && item.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        const discountPercent = calculateIndividualDiscount(product.id, item.quantity) * 100;

        if (discountPercent > 0) {
          summaryHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${product.name} (${QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑)</span>
              <span class="text-xs">-${discountPercent}%</span>
            </div>
          `;
        }
      }
    });
  }

  // 화요일 할인
  if (tuesdayDiscount > 0) {
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${DISCOUNT_PERCENTAGES.TUESDAY}%</span>
      </div>
    `;
  }

  // 배송 정보
  summaryHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  return summaryHTML;
};

// 할인 정보 컴포넌트 (원본 스타일)
const DiscountInfoComponent = (cartState) => {
  const { originalTotal, totalAmount } = cartState;
  const discRate = originalTotal > 0 ? (originalTotal - totalAmount) / originalTotal : 0;
  const savedAmount = originalTotal - totalAmount;

  if (discRate <= 0 || totalAmount <= 0) {
    return '';
  }

  // 원본과 정확히 동일한 스타일
  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
};

// 화요일 특별 배너 컴포넌트 (원본 스타일)
const TuesdaySpecialBannerComponent = (cartState) => {
  const { tuesdayDiscount } = cartState;
  if (tuesdayDiscount === 0) {
    return '';
  }

  // 원본과 정확히 동일한 구조
  return `
    <div class="flex items-center gap-2">
      <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide">Tuesday Special ${DISCOUNT_PERCENTAGES.TUESDAY}% Applied</span>
    </div>
  `;
};

// 재고 정보 컴포넌트
const StockInfoComponent = (products) => {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  let infoMsg = '';

  if (totalStock < QUANTITY_THRESHOLDS.LOW_STOCK) {
    // 원본과 동일하게 빈 문자열 반환
  }

  products.forEach((item) => {
    if (item.stock < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.stock > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.stock}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  return infoMsg;
};

// 적립 포인트 컴포넌트 (원본 스타일)
const LoyaltyPointsComponent = (finalPoints, pointsDetail, cartItems) => {
  const displayStyle = cartItems.length === 0 ? 'display: none' : 'display: block';

  if (finalPoints > 0) {
    return `<div style="${displayStyle}">적립 포인트: <span class="font-bold">${finalPoints}p</span></div><div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
  }
  return `<div style="${displayStyle}">적립 포인트: <span class="font-bold">0p</span></div>`;
};

// ============================================
// UI UPDATE FUNCTIONS - HTML 문자열 반환
// ============================================

// 기본 포인트 업데이트 (원본 스타일)
const updateBasicPoints = (totalAmount, cartItems, itemCount) => {
  const { finalPoints, pointsDetail } = calculateAllPoints(totalAmount, cartItems, itemCount);
  return LoyaltyPointsComponent(finalPoints, pointsDetail, cartItems);
};

// 전체 UI 업데이트 - HTML 컴포넌트 반환
export const updateAllUI = (cartState, appState) => {
  const { cart, products } = appState;
  const { items, totalAmount, itemCount } = cart;

  return {
    itemCount: ItemCountComponent(itemCount),
    total: TotalComponent(totalAmount),
    summary: SummaryDetailsComponent(items, products, cartState),
    discount: DiscountInfoComponent(cartState),
    tuesdayBanner: TuesdaySpecialBannerComponent(cartState),
    stock: StockInfoComponent(products),
    points: updateBasicPoints(totalAmount, items, itemCount),
  };
};

// 추가 계산 업데이트
export const updateAdditionalCalculations = () => {
  // 추가 계산 로직이 필요한 경우 여기에 구현
};

// ============================================
// RENDERING ENGINE - 리액트 변환 준비
// ============================================

// HTML 문자열 반환 방식으로 변경 (DOM 조작 제거)
export const RenderingEngine = {
  // HTML 문자열만 반환 (DOM 조작 없음)
  renderToDOM: (elements, renderedHTML) => ({
    itemCount: renderedHTML.itemCount,
    total: renderedHTML.total,
    summary: renderedHTML.summary,
    discount: renderedHTML.discount,
    tuesdayBanner: renderedHTML.tuesdayBanner,
    stock: renderedHTML.stock,
    points: renderedHTML.points,
  }),

  // HTML 컴포넌트들을 받아서 HTML 문자열 반환
  renderAll: (uiComponents) => ({
    itemCount: uiComponents.itemCount,
    total: uiComponents.total,
    summary: uiComponents.summary,
    discount: uiComponents.discount,
    tuesdayBanner: uiComponents.tuesdayBanner,
    stock: uiComponents.stock,
    points: uiComponents.points,
  }),

  // 장바구니 아이템 수량 업데이트 (HTML 문자열 반환)
  updateCartItemQuantity(productId, newQuantity) {
    const product = AppState.products.find((p) => p.id === productId);
    if (!product) return { success: false };

    // HTML 문자열만 반환 (DOM 조작 없음)
    if (product.onSale || product.suggestSale) {
      // 할인 적용된 경우: 원가(취소선) + 할인가
      const priceClass =
        product.onSale && product.suggestSale
          ? 'text-purple-600'
          : product.onSale
            ? 'text-red-500'
            : 'text-blue-500';

      const totalPriceStyle =
        newQuantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'font-bold' : 'font-normal';

      return {
        success: true,
        productId,
        newQuantity,
        totalPriceHTML: `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="${priceClass} ${totalPriceStyle}">₩${product.value.toLocaleString()}</span>`,
      };
    }

    // 할인 미적용: 단가만 표시
    const totalPriceStyle =
      newQuantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'font-bold' : 'font-normal';
    return {
      success: true,
      productId,
      newQuantity,
      totalPriceHTML: `<span class="${totalPriceStyle}">₩${product.value.toLocaleString()}</span>`,
    };
  },

  // 장바구니 아이템 추가 (HTML 문자열 반환)
  addCartItem(cartItemHTML) {
    return { cartItemHTML };
  },

  // 장바구니 아이템 제거 (HTML 문자열 반환)
  removeCartItem(productId) {
    return { productId, action: 'remove' };
  },

  // 셀렉트 옵션 업데이트 (HTML 문자열 반환)
  updateSelectOptions(optionsHTML) {
    return { optionsHTML };
  },
};

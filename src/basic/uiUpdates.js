// ============================================
// UI UPDATES - HTML 문자열 반환 방식 (리액트 변환 준비)
// ============================================

import { calculateAllPoints } from './businessLogic.js';
import { QUANTITY_THRESHOLDS } from './constants.js';

// 전역 AppState 참조
let AppState = null;

// AppState 설정 함수
export const setAppState = (state) => {
  AppState = state;
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

    const itemTotal = product.value * item.quantity;
    summaryHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${item.quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  // 소계
  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.value * item.quantity : 0);
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

  if (totalQuantity >= 30) {
    // 대량구매 할인
    summaryHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (individualDiscount > 0) {
    // 개별 할인
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product && item.quantity >= 10) {
        let discountPercent = 0;
        if (product.id === 'p1') discountPercent = 10;
        else if (product.id === 'p2') discountPercent = 15;
        else if (product.id === 'p3') discountPercent = 20;
        else if (product.id === 'p5') discountPercent = 25;

        if (discountPercent > 0) {
          summaryHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${product.name} (10개↑)</span>
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
        <span class="text-xs">-10%</span>
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

  // 원본과 정확히 동일한 내용 (HTML에 이미 정의되어 있음)
  return `
    <div class="flex items-center gap-2">
      <span class="text-2xs">🎉</span>
      <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
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

// 렌더링 엔진 (리액트 변환 시 이 부분만 교체)
export const RenderingEngine = {
  // HTML 문자열을 실제 DOM에 적용 (리액트 변환 시 제거)
  renderAll(htmlComponents) {
    return htmlComponents;
  },

  // 실제 DOM에 렌더링 (리액트 변환 시 제거)
  renderToDOM(renderedHTML) {
    // item-count 업데이트
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement && renderedHTML.itemCount) {
      itemCountElement.innerHTML = renderedHTML.itemCount;
    }

    // cart-total 업데이트
    const totalElement = document.getElementById('cart-total');
    if (totalElement && renderedHTML.total) {
      const totalTextElement = totalElement.querySelector('.text-2xl');
      if (totalTextElement) {
        totalTextElement.innerHTML = renderedHTML.total;
      }
    }

    // summary-details 업데이트
    const summaryElement = document.getElementById('summary-details');
    if (summaryElement && renderedHTML.summary) {
      summaryElement.innerHTML = renderedHTML.summary;
    }

    // discount-info 업데이트
    const discountElement = document.getElementById('discount-info');
    if (discountElement && renderedHTML.discount) {
      discountElement.innerHTML = renderedHTML.discount;
    }

    // tuesday-special 업데이트
    const tuesdayElement = document.getElementById('tuesday-special');
    if (tuesdayElement) {
      if (renderedHTML.tuesdayBanner) {
        tuesdayElement.innerHTML = renderedHTML.tuesdayBanner;
        tuesdayElement.classList.remove('hidden');
      } else {
        tuesdayElement.classList.add('hidden');
      }
    }

    // stock-status 업데이트
    const stockElement = document.getElementById('stock-status');
    if (stockElement && renderedHTML.stock !== undefined) {
      stockElement.innerHTML = renderedHTML.stock;
    }

    // loyalty-points 업데이트
    const pointsElement = document.getElementById('loyalty-points');
    if (pointsElement && renderedHTML.points) {
      pointsElement.innerHTML = renderedHTML.points;
      // 빈 장바구니일 때 포인트 섹션 숨김 (테스트 요구사항)
      if (renderedHTML.points.includes('style="display: none"')) {
        pointsElement.style.display = 'none';
      } else {
        pointsElement.style.display = 'block';
      }
    }
  },

  // 장바구니 아이템 수량 업데이트 (HTML 문자열 반환)
  updateCartItemQuantity(productId, newQuantity) {
    // 수량과 총액을 함께 업데이트
    const quantityElement = document.querySelector(`#${productId} .quantity-number`);
    const totalElement = document.querySelector(
      `#${productId} .text-lg.mb-2.tracking-tight.tabular-nums`,
    );

    if (quantityElement) {
      quantityElement.textContent = newQuantity;
    }

    if (totalElement) {
      // 총액 계산 및 폰트 스타일 처리
      const product = AppState.products.find((p) => p.id === productId);
      if (product) {
        const totalPrice = product.value * newQuantity;
        totalElement.textContent = `₩${totalPrice.toLocaleString()}`;

        // 폰트 스타일 설정 (10개 이상이면 볼드)
        if (newQuantity >= 10) {
          totalElement.style.fontWeight = 'bold';
        } else {
          totalElement.style.fontWeight = 'normal';
        }
      }
    }

    return { productId, newQuantity };
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

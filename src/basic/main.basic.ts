/**
 * ========================================
 * 전역 상태 변수 (Global State Variables)
 * ========================================
 *
 * 애플리케이션의 전역 상태를 관리하는 변수들입니다.
 * 향후 Store 패턴으로 마이그레이션 예정입니다.
 */

// 상품 관련 상태

let cartDisplay; // 장바구니 UI 요소

// UI 요소 참조
let productSelector; // 상품 선택 드롭다운
let addToCartButton; // 장바구니 추가 버튼
let stockInformation; // 재고 정보 표시 영역
let summaryElement; // 주문 요약 정보 요소

// 포인트 관련 상태
let bonusPoints = 0; // 보너스 포인트

import {
  BUSINESS_RULES,
  PRODUCT_IDS,
  TIMER_INTERVALS,
} from '../constants/index.ts';
import { App } from '../features/layout/App.ts';
import { calculateCart } from '../features/cart/cartCalculationUtils.ts';
import { CartItem } from '../features/cart/CartItem.ts';
import { PriceDisplay } from '../features/cart/PriceDisplay.ts';
import { DiscountInfo } from '../features/order/DiscountInfo.ts';
import {
  BulkDiscountSummary,
  CartItemSummary,
  IndividualDiscountSummary,
  ShippingSummary,
  SubtotalSummary,
  TuesdayDiscountSummary,
} from '../features/order/SummaryDetails.ts';
import { LoyaltyPoints } from '../features/points/LoyaltyPoints.ts';
import {
  createProductOptions,
  getDropdownBorderColor,
  renderProductOptions,
} from '../features/product/productOptionUtils.ts';
import { initializeProducts } from '../features/product/productUtils.ts';
import { useProductState } from '../features/product/store/productState.ts';
import { useCartState } from '../features/cart/store/cartState.ts';
import { useUIState } from '../features/ui/store/uiState.ts';
import { usePointsState } from '../features/points/store/pointsState.ts';
import {
  calculateStockStatus,
  calculateTotalStock,
} from '../features/stock/stockUtils.ts';
import { setupEventListeners } from '../features/events/eventManager.ts';

/**
 * ========================================
 * 애플리케이션 초기화 (Application Initialization)
 * ========================================
 *
 * 애플리케이션의 메인 진입점입니다.
 * DOM 구조 생성, 이벤트 리스너 등록, 타이머 설정을 담당합니다.
 */
function main() {
  // ========================================
  // 1. 상태 초기화 (State Initialization)
  // ========================================

  // ========================================
  // 2. 상품 데이터 초기화 (Product Data Initialization)
  // ========================================

  // 상품 도메인 상태 초기화
  const { dispatch: productDispatch } = useProductState();
  productDispatch({ type: 'SET_PRODUCTS', payload: initializeProducts() });

  // 장바구니 도메인 상태 초기화
  const { dispatch: cartDispatch } = useCartState();
  cartDispatch({ type: 'CLEAR_CART' });

  // UI 도메인 상태 초기화
  const { dispatch: uiDispatch } = useUIState();
  uiDispatch({ type: 'RESET_UI_STATE' });

  // 포인트 도메인 상태 초기화
  const { dispatch: pointsDispatch } = usePointsState();
  pointsDispatch({ type: 'RESET_POINTS_STATE' });

  // ========================================
  // 3. DOM 구조 생성 (DOM Structure Creation)
  // ========================================

  // 3.1 루트 요소 및 앱 컴포넌트 생성
  const root = document.getElementById('app');
  const app = App();

  setupEventListeners(app);

  // 3.2 필요한 DOM 요소 참조 설정
  productSelector = app.querySelector('#product-select');
  addToCartButton = app.querySelector('#add-to-cart');
  stockInformation = app.querySelector('#stock-status');
  cartDisplay = app.querySelector('#cart-items');
  summaryElement = app.querySelector('#cart-total');

  // 3.4 앱을 루트에 추가
  if (root) {
    root.appendChild(app);
  }

  onUpdateSelectOptions();
  handleCalculateCartStuff();
  const lightningDelay = Math.random() * TIMER_INTERVALS.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const { getState, dispatch } = useProductState();
      const products = getState().products;
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        // 상품 도메인 상태에서 번개세일 적용
        const updatedProduct = {
          ...luckyItem,
          val: Math.round((luckyItem.originalVal * 80) / 100),
          onSale: true,
        };
        dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_INTERVALS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      const { getState, dispatch } = useProductState();
      const state = getState();
      const lastSelected = state.lastSelected;
      if (lastSelected) {
        let suggest = null;
        const products = state.products;

        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSelected) {
            if (products[k].q > 0) {
              if (!products[k].suggestSale) {
                suggest = products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );

          // 상품 도메인 상태에서 추천세일 적용
          const updatedProduct = {
            ...suggest,
            val: Math.round((suggest.val * (100 - 5)) / 100),
            suggestSale: true,
          };
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_INTERVALS.SUGGESTED_SALE_INTERVAL);
  }, Math.random() * TIMER_INTERVALS.SUGGESTED_SALE_DELAY);
}

/**
 * ========================================
 * 상품 관련 함수들 (Product Related Functions)
 * ========================================
 */

/**
 * 상품 선택 옵션 업데이트
 *
 * 상품 목록을 기반으로 드롭다운 옵션을 생성하고 업데이트합니다.
 * 할인 상태, 품절 상태에 따라 옵션 텍스트와 스타일을 변경합니다.
 */
function onUpdateSelectOptions() {
  // 드롭다운 초기화
  productSelector.innerHTML = '';

  // 상품 도메인 상태에서 상품 목록 가져오기
  const state = useProductState().getState();
  const products = state.products;

  // 전체 재고 계산
  const totalStock = calculateTotalStock(products);

  // 상품 옵션 생성 및 렌더링
  const productOptions = createProductOptions(products);
  const optionsHTML = renderProductOptions(productOptions);
  productSelector.innerHTML = optionsHTML;

  // 재고 부족 시 드롭다운 테두리 색상 변경
  const borderColor = getDropdownBorderColor(totalStock);
  productSelector.style.borderColor = borderColor;

  // 마지막 선택된 상품이 있으면 선택
  const lastSelected = state.lastSelected;
  if (lastSelected) {
    productSelector.value = lastSelected;
  }
}
/**
 * ========================================
 * 장바구니 관련 함수들 (Cart Related Functions)
 * ========================================
 */

/**
 * 장바구니 계산 및 UI 업데이트
 *
 * 장바구니의 총액, 할인, 포인트를 계산하고 관련 UI를 업데이트합니다.
 * 개별 상품 할인, 대량구매 할인, 화요일 특별 할인을 모두 적용합니다.
 */
function handleCalculateCartStuff() {
  // 장바구니 상태 가져오기
  const { getState: getCartState, dispatch: cartDispatch } = useCartState();
  const cartState = getCartState();

  // 상품 상태 가져오기
  const { getState: getProductState } = useProductState();
  const productState = getProductState();

  const cartItems = cartDisplay.children;

  // 장바구니 계산
  const { cartItemCalculations, cartTotals } = calculateCart(
    cartItems,
    productState.products
  );

  // 장바구니 상태 업데이트
  cartDispatch({ type: 'SET_ITEM_COUNT', payload: cartTotals.totalQuantity });
  cartDispatch({ type: 'SET_SUBTOTAL', payload: cartTotals.subtotal });

  let finalTotal = cartTotals.finalTotal;

  // 대량구매 할인 적용
  if (cartTotals.totalQuantity >= BUSINESS_RULES.BULK_PURCHASE_THRESHOLD) {
    finalTotal = cartTotals.subtotal * 0.75; // 25% 할인
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === BUSINESS_RULES.TUESDAY_DAY_OF_WEEK;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday && finalTotal > 0) {
    finalTotal = finalTotal * 0.9; // 10% 할인
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 장바구니 상태에서 최종 총액 업데이트
  cartDispatch({ type: 'SET_FINAL_TOTAL', payload: finalTotal });

  // UI 업데이트
  const updatedCartState = getCartState();
  const { dispatch: uiDispatch } = useUIState();

  // 헤더 아이템 카운트 업데이트
  uiDispatch({
    type: 'SET_HEADER_ITEM_COUNT',
    payload: updatedCartState.itemCount,
  });

  document.getElementById('item-count').textContent =
    '🛍️ ' + updatedCartState.itemCount + ' items in cart';

  // 요약 상세 정보 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (cartTotals.subtotal > 0) {
    // 장바구니 아이템 요약
    cartItemCalculations.forEach(itemCalc => {
      summaryDetails.innerHTML += CartItemSummary({
        item: itemCalc.product,
        quantity: itemCalc.quantity,
      });
    });

    summaryDetails.innerHTML += SubtotalSummary({
      subTotal: cartTotals.subtotal,
    });

    // 할인 정보 표시
    if (updatedCartState.itemCount >= BUSINESS_RULES.BULK_PURCHASE_THRESHOLD) {
      summaryDetails.innerHTML += BulkDiscountSummary();
    } else if (cartTotals.itemDiscounts.length > 0) {
      summaryDetails.innerHTML += IndividualDiscountSummary({
        itemDiscounts: cartTotals.itemDiscounts,
      });
    }

    if (isTuesday && updatedCartState.finalTotal > 0) {
      summaryDetails.appendChild(TuesdayDiscountSummary());
    }

    summaryDetails.appendChild(ShippingSummary());
  }

  // 총액 표시
  const totalDiv = summaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent =
      '₩' + Math.round(updatedCartState.finalTotal).toLocaleString();
  }

  // 포인트 계산 및 표시
  const { dispatch: pointsDispatch, getState: getPointsState } =
    usePointsState();

  // 화요일 확인
  const todayForPoints = new Date();
  const isTuesdayForPoints =
    todayForPoints.getDay() === BUSINESS_RULES.TUESDAY_DAY_OF_WEEK;

  // 장바구니 아이템 정보 수집
  const cartItemsForPoints = Array.from(cartDisplay.children).map(item => {
    const productId = item.id;
    const quantityElem = item.querySelector('.quantity-number');
    const quantity = quantityElem ? parseInt(quantityElem.textContent) : 0;
    return { id: productId, quantity };
  });

  // 포인트 계산
  pointsDispatch({
    type: 'CALCULATE_POINTS',
    payload: {
      totalAmount: updatedCartState.finalTotal,
      cartItems: cartItemsForPoints,
      isTuesday: isTuesdayForPoints,
    },
  });

  // 포인트 표시
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const pointsState = getPointsState();
    const totalPoints = pointsState.currentPoints.total;
    const calculation = pointsState.currentPoints.calculation;

    // 장바구니가 비어있으면 포인트 섹션 숨김
    if (cartDisplay.children.length === 0) {
      loyaltyPointsDiv.style.display = 'none';
      return;
    }

    if (totalPoints > 0 && calculation) {
      // 상세 정보 표시
      loyaltyPointsDiv.innerHTML = '';
      loyaltyPointsDiv.appendChild(
        LoyaltyPoints({
          bonusPoints: totalPoints,
          pointsDetail: calculation.details,
        })
      );
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    }
    loyaltyPointsDiv.style.display = 'block';
  }

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  const discRate =
    cartTotals.subtotal > 0
      ? (cartTotals.subtotal - updatedCartState.finalTotal) /
        cartTotals.subtotal
      : 0;
  if (discRate > 0 && updatedCartState.finalTotal > 0) {
    const savedAmount = cartTotals.subtotal - updatedCartState.finalTotal;
    const discountInfo = DiscountInfo({ discRate, savedAmount });
    const discountInfoContainer = document.querySelector('#discount-info');
    if (discountInfoContainer) {
      discountInfoContainer.innerHTML = '';
      discountInfoContainer.appendChild(discountInfo);
    }
  }

  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || '0'
    );
    itemCountElement.textContent =
      '🛍️ ' + updatedCartState.itemCount + ' items in cart';
    if (previousCount !== updatedCartState.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 정보 업데이트
  const stockStatus = calculateStockStatus(
    useProductState().getState().products
  );
  stockInformation.textContent = stockStatus.stockMessage;

  handleStockInfoUpdate();
}
/**
 * ========================================
 * 재고 관련 함수들 (Stock Related Functions)
 * ========================================
 */
/**
 * ========================================
 * 재고 관련 함수들 (Stock Related Functions)
 * ========================================
 */

/**
 * 전체 재고 수량 계산
 *
 * 모든 상품의 재고 수량을 합산하여 반환합니다.
 * @returns {number} 전체 재고 수량
 */
function onGetStockTotal() {
  let sum = 0;
  const products = useProductState().getState().products;

  for (let i = 0; i < products.length; i++) {
    const currentProduct = products[i];
    sum += currentProduct.q;
  }
  return sum;
}

/**
 * 재고 정보 업데이트
 *
 * 재고 부족 또는 품절 상태인 상품들의 정보를 수집하고
 * UI에 표시합니다.
 */
const handleStockInfoUpdate = function () {
  let infoMsg;
  infoMsg = '';
  const totalStock = onGetStockTotal();

  // 전체 재고 부족 시나리오 처리 (향후 확장 예정)
  if (totalStock < 30) {
    // Handle low stock scenario if needed
  }

  // 각 상품의 재고 상태 확인
  useProductState()
    .getState()
    .products.forEach(function (item) {
      if (item.q < BUSINESS_RULES.LOW_STOCK_THRESHOLD) {
        if (item.q > 0) {
          infoMsg =
            infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
        } else {
          infoMsg = infoMsg + item.name + ': 품절\n';
        }
      }
    });

  // 재고 정보 UI 업데이트
  stockInformation.textContent = infoMsg;
};
/**
 * ========================================
 * UI 업데이트 함수들 (UI Update Functions)
 * ========================================
 */

/**
 * 장바구니 내 상품 가격 업데이트
 *
 * 할인 상태에 따라 장바구니에 표시된 상품들의
 * 가격과 이름을 업데이트합니다.
 */
function doUpdatePricesInCart() {
  const cartItems = cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    // 상품 도메인 상태에서 상품 정보 찾기
    const product = getProductById(itemId);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 UI 업데이트
      priceDiv.innerHTML = '';
      priceDiv.appendChild(PriceDisplay({ product }));

      if (product.onSale && product.suggestSale) {
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        nameDiv.textContent = '💝' + product.name;
      } else {
        nameDiv.textContent = product.name;
      }
    }
  }

  // 가격 변경 후 장바구니 재계산
  handleCalculateCartStuff();
}
/**
 * ========================================
 * 애플리케이션 실행 및 이벤트 리스너 등록
 * ========================================
 */

// 애플리케이션 초기화 실행
main();
// 장바구니 추가 버튼 이벤트는 AddToCartButton 컴포넌트에서 처리됨

// 장바구니 아이템 클릭 이벤트는 CartDisplay 컴포넌트에서 처리됨

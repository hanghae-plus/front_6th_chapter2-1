import {
  calculateCartTotals,
  calculateDiscountedTotal,
  applyBulkDiscount,
  applyTuesdayDiscount,
} from './cartUtils';
import {
  Header,
  GridContainer,
  LeftColumn,
  RightColumn,
} from './components/layout';
import {
  ManualToggle,
  ManualOverlay,
  ManualColumn,
  ManualModal,
} from './components/manual';
import {
  ProductSelector,
  generateProductOptions,
  CartContainer,
  CartItem,
  OrderSummary,
  PriceSummary,
} from './components/ui';
import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
  QUANTITY_THRESHOLDS,
  POINT_RATES_BULK_BONUS,
  PRODUCT_DEFAULT_DISCOUNT_RATES,
  TIMER_INTERVAL,
} from './constants';
import { initProductList } from './data';
import {
  attachCartEventListener,
  attachManualEventListener,
  attachAddToCartEventListener,
} from './eventListeners';
import { lightningTimer, recommendTimer } from './timer';
import { updateCartUI } from './uiEffects';
import { createCartHandlers, createManualHandlers } from './useCartHandlers';
import {
  isTuesday,
  getProductDiscountRate,
  getBonusPerBulkInfo,
} from './utils';

// 상품 데이터 및 장바구니 관련 변수
let productList;
let bonusPoints = 0;
let stockInfo;
let itemCount;
let lastSelectedProductId;
let selectElement;
let addButton;
let totalAmount = 0;
let sum;
let cartContainer;

// 메인 초기화 함수
function main() {
  // 초기값 설정
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProductId = null;

  // 상품 데이터 초기화
  productList = initProductList();

  // ----------------------------------------
  // 기본 DOM 구조 생성
  // ----------------------------------------
  const root = document.getElementById('app');

  // 헤더 생성
  const header = Header({ itemCount: 0 });

  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const rightColumn = RightColumn();

  const orderSummaryElement = OrderSummary();
  rightColumn.appendChild(orderSummaryElement);
  sum = rightColumn.querySelector('#cart-total');

  // 상품 선택 컨테이너
  const selectorContainer = ProductSelector();
  selectElement = selectorContainer.querySelector('#product-select');
  addButton = selectorContainer.querySelector('#add-to-cart');
  stockInfo = selectorContainer.querySelector('#stock-status');

  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartContainer = CartContainer();
  leftColumn.appendChild(cartContainer);

  // 도움말 모달 생성
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();

  // 장바구니 핸들러 초기화
  const cartHandlers = createCartHandlers({
    productList,
    cartContainer,
    selectElement,
    findProductById,
    handleCalculateCartStuff,
    onUpdateSelectOptions,
    setLastSelectedProductId: (id) => {
      lastSelectedProductId = id;
    },
  });

  // 도움말 모달 핸들러 초기화
  const manualHandlers = createManualHandlers(manualOverlay, manualColumn);

  // 이벤트 리스너 연결
  attachAddToCartEventListener(addButton, cartHandlers);
  attachCartEventListener(cartContainer, cartHandlers);
  attachManualEventListener(manualToggle, manualOverlay, manualHandlers);

  // ----------------------------------------
  // DOM 구조 조립
  // ----------------------------------------
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ----------------------------------------
  // 초기 데이터 설정
  // ----------------------------------------
  let initStock = 0;
  for (let i = 0; i < productList.length; i++) {
    initStock += productList[i].availableStock;
  }

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // ----------------------------------------
  // 타이머 기반 이벤트 설정
  // ----------------------------------------
  lightningTimer(productList, onUpdateSelectOptions, doUpdatePricesInCart);
  recommendTimer(
    productList,
    lastSelectedProductId,
    onUpdateSelectOptions,
    doUpdatePricesInCart,
  );
}

// 상품 옵션 업데이트 함수
function onUpdateSelectOptions() {
  generateProductOptions({ selectElement, productList });
}

// ========================================
// 장바구니 계산 및 표시 함수
// ========================================

function handleCalculateCartStuff() {
  // 변수 선언
  let subTotal;
  let idx;
  let originalTotal;
  let itemDisc;
  let savedAmount;
  let points;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;

  const cartItems = cartContainer.children;
  const bulkDisc = subTotal;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 초기값 설정
  totalAmount = 0;
  itemCount = 0;
  originalTotal = totalAmount;
  subTotal = 0;

  // ----------------------------------------
  // 재고 부족 상품 체크
  // ----------------------------------------
  for (idx = 0; idx < productList.length; idx++) {
    if (
      productList[idx].availableStock < 5 &&
      productList[idx].availableStock > 0
    ) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // 장바구니 아이템별 계산 (순수 함수 사용)
  const {
    subTotal: calculatedSubTotal,
    itemCount: calculatedItemCount,
    itemDiscounts: calculatedDiscounts,
  } = calculateCartTotals(cartItems, findProductById);
  subTotal = calculatedSubTotal;
  itemCount = calculatedItemCount;
  itemDiscounts.push(...calculatedDiscounts);

  // 개별 상품 할인 적용된 총액 계산
  totalAmount = calculateDiscountedTotal(cartItems, findProductById);

  // 대량 구매 할인 적용 (순수 함수 사용)
  originalTotal = subTotal;
  const bulkDiscountResult = applyBulkDiscount(
    itemCount,
    totalAmount,
    subTotal,
  );
  totalAmount = bulkDiscountResult.discountedAmount;
  let { discountRate } = bulkDiscountResult;

  // 화요일 특별 할인 적용 (순수 함수 사용)
  const tuesdayDiscountResult = applyTuesdayDiscount(
    totalAmount,
    originalTotal,
    isTuesday(),
  );
  totalAmount = tuesdayDiscountResult.discountedAmount;
  discountRate = tuesdayDiscountResult.finalDiscountRate;

  // UI 업데이트 (사이드 이펙트)
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (tuesdayDiscountResult.showTuesdaySpecial) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // UI 업데이트
  const uiUpdateResult = updateCartUI({
    // 계산된 데이터
    itemCount,
    subTotal,
    totalAmount,
    originalTotal,
    discountRate,
    itemDiscounts,
    cartItems,

    // 의존성
    productList,
    findProductById,
    showTuesdaySpecial: tuesdayDiscountResult.showTuesdaySpecial,

    // DOM 요소들
    sumElement: sum,
    stockInfoElement: stockInfo,

    // 이전 상태 (최적화용)
    previousCount,
  });

  // 전역 상태 업데이트
  bonusPoints = uiUpdateResult.bonusPoints || 0;
}

// ========================================
// 장바구니 가격 업데이트 함수
// ========================================

function doUpdatePricesInCart() {
  let totalCount = 0;
  let j = 0;

  // 총 수량 계산 (첫 번째 방법)
  while (cartContainer.children[j]) {
    const quantity =
      cartContainer.children[j].querySelector('.quantity-number');
    totalCount += quantity ? parseInt(quantity.textContent) : 0;
    j++;
  }

  // 총 수량 계산 (두 번째 방법)
  totalCount = 0;
  for (j = 0; j < cartContainer.children.length; j++) {
    totalCount += parseInt(
      cartContainer.children[j].querySelector('.quantity-number').textContent,
    );
  }

  // ----------------------------------------
  // 각 장바구니 아이템의 가격 업데이트
  // ----------------------------------------
  const cartItems = cartContainer.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(itemId);

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 및 이름 표시
      PriceSummary(priceDiv, product);
      nameDiv.textContent =
        (product.onSale && product.suggestSale
          ? '⚡💝'
          : product.onSale
            ? '⚡'
            : product.suggestSale
              ? '💝'
              : '') + product.name;
    }
  }

  handleCalculateCartStuff();
}

// 애플리케이션 초기화
main();

function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

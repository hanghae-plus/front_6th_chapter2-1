// 상수 import
// ================================================
import {
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_CASE,
  SPEAKER,
  LIGHTNING_SALE_DISCOUNT,
  SUGGEST_SALE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
  BULK_PURCHASE_DISCOUNT,
  PRODUCT_DISCOUNTS,
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  BULK_PURCHASE_THRESHOLD,
  TOTAL_STOCK_WARNING_THRESHOLD,
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
} from './constants.js';
import { bindEventListeners } from './events/bindings.js';
import { CartCalculationService } from './services/CartCalculationService.js';
import { LightningSaleService } from './services/LightningSaleService.js';
import { PointsCalculationService } from './services/PointsCalculationService.js';
import { PriceUpdateService } from './services/PriceUpdateService.js';
import { SuggestSaleService } from './services/SuggestSaleService.js';
import { cartState } from './states/cartState.js';
import { productState } from './states/productState.js';
import { stateActions, subscribeToState } from './states/state.js';
import { uiState } from './states/uiState.js';
import { getProductDiscountIcon, getProductDiscountStyle } from './utils/product.js';
import { generateStockWarningMessage, getLowStockProducts } from './utils/stock.js';

// ================================================
// 상품 데이터
// ================================================
const productList = [
  {
    id: KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: NOTEBOOK_CASE,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

/**
 * Header 컴포넌트
 * Props: itemCount - 장바구니 아이템 수
 */
function Header({ itemCount = 0 }) {
  return /* HTML */ `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
        🛍️ ${itemCount} items in cart
      </p>
    </div>
  `;
}

/**
 * GridContainer 컴포넌트
 * Props:
 * - total - 총 금액
 * - bonusPoints - 보너스 포인트
 * - pointsDetail - 포인트 상세 내역
 */
function GridContainer({ total = 0, bonusPoints = 0, pointsDetail = [] }) {
  return /* HTML */ `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftColumn()} ${RightColumn({ total, bonusPoints, pointsDetail })}
    </div>
  `;
}

/**
 * RightColumn 컴포넌트
 * Props:
 * - total - 총 금액
 * - bonusPoints - 보너스 포인트
 * - pointsDetail - 포인트 상세 내역
 */
function RightColumn({ total = 0, bonusPoints = 0, pointsDetail = [] }) {
  return /* HTML */ `
    <div class="bg-black text-white p-8 flex flex-col">
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-details" class="space-y-3"></div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4"></div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">₩${total.toLocaleString()}</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">
              ${LoyaltyPointsTag({ bonusPoints, pointsDetail })}
            </div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide"
                >Tuesday Special ${TUESDAY_SPECIAL_DISCOUNT}% Applied</span
              >
            </div>
          </div>
        </div>
      </div>
      <button
        class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
      >
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;
}

function LoyaltyPointsTag({ bonusPoints = 0, pointsDetail }) {
  if (bonusPoints === 0) {
    return '적립 포인트: 0p';
  }

  return /* HTML */ `
    <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
    ${pointsDetail.length > 0
      ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
      : ''}
  `;
}

/**
 * LeftColumn
 * - SelectorContainer
 * - CartDisplay
 */
function LeftColumn() {
  return /* HTML */ `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${SelectorContainer()} ${CartDisplay()}
    </div>
  `;
}

function CartDisplay() {
  return /* HTML */ ` <div id="cart-items"></div> `;
}

/**
 * Selector Container
 * - ProductSelector
 *   - ProductOption
 * - AddToCartButton
 * - StockInfo
 */
function SelectorContainer() {
  return /* HTML */ `
    <div class="mb-6 pb-6 border-b border-gray-200">
      ${ProductSelector()} ${AddToCartButton()} ${StockInfo()}
    </div>
  `;
}

function ProductSelector() {
  return /* HTML */ `
    <select
      id="product-select"
      class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    ></select>
  `;
}

/**
 * ProductOption 컴포넌트
 * Props: item - 상품 정보 객체
 * Returns: 상품 옵션 HTML
 */
function ProductOption({ item }) {
  const { id, name, val, originalVal, q, onSale, suggestSale } = item;

  // 할인 상태 계산
  const discountStates = [];
  if (onSale) discountStates.push('⚡SALE');
  if (suggestSale) discountStates.push('💝추천');
  const discountText = discountStates.join(' ');

  // 품절 상태
  if (q === 0) {
    return /* HTML */ `
      <option value="${id}" disabled class="text-gray-400">
        ${name} - ${val}원 (품절) ${discountText}
      </option>
    `;
  }

  // 할인 상태에 따른 렌더링
  if (onSale && suggestSale) {
    return /* HTML */ `
      <option value="${id}" class="text-purple-600 font-bold">
        ⚡💝${name} - ${originalVal}원 → ${val}원 (25% SUPER SALE!)
      </option>
    `;
  }

  if (onSale) {
    return /* HTML */ `
      <option value="${id}" class="text-red-500 font-bold">
        ⚡ ${name} - ${originalVal}원 → ${val}원 (20% SALE!)
      </option>
    `;
  }

  if (suggestSale) {
    return /* HTML */ `
      <option value="${id}" class="text-blue-500 font-bold">
        💝${name} - ${originalVal}원 → ${val}원 (5% 추천할인!)
      </option>
    `;
  }

  return /* HTML */ `
    <option value="${id}">${name} - ${val}원${discountText ? ` ${discountText}` : ''}</option>
  `;
}

function AddToCartButton() {
  return /* HTML */ `
    <button
      id="add-to-cart"
      class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  `;
}

function StockInfo() {
  return /* HTML */ `
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
  `;
}

function ManualToggle() {
  return /* HTML */ `
    <button
      id="manual-toggle"
      class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>
  `;
}

/**
 * ManualOverlay
 * - ManualColumn
 */
function ManualOverlay() {
  return /* HTML */ `
    <div
      id="manual-overlay"
      class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"
    >
      ${ManualColumn()}
    </div>
  `;
}

function ManualColumn() {
  return /* HTML */ `
    <div
      id="manual-column"
      class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-black"
        onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="text-gray-700 text-xs pl-2">
              • 키보드 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[KEYBOARD]}%<br />
              • 마우스 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[MOUSE]}%<br />
              • 모니터암 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[MONITOR_ARM]}%<br />
              • 스피커 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[SPEAKER]}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="text-gray-700 text-xs pl-2">
              • ${BULK_PURCHASE_THRESHOLD}개 이상: ${BULK_PURCHASE_DISCOUNT}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: +${TUESDAY_SPECIAL_DISCOUNT}%<br />
              • ⚡번개세일: ${LIGHTNING_SALE_DISCOUNT}%<br />
              • 💝추천할인: ${SUGGEST_SALE_DISCOUNT}%
            </p>
          </div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">기본</p>
            <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">추가</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: ${TUESDAY_POINTS_MULTIPLIER}배<br />
              • 키보드+마우스: +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p<br />
              • 풀세트: +${BONUS_POINTS.FULL_SET}p<br />
              • ${BONUS_POINTS_THRESHOLDS.SMALL}개↑: +${BONUS_POINTS.BULK_PURCHASE.SMALL}p /
              ${BONUS_POINTS_THRESHOLDS.MEDIUM}개↑: +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p /
              ${BONUS_POINTS_THRESHOLDS.LARGE}개↑: +${BONUS_POINTS.BULK_PURCHASE.LARGE}p
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br />
          • ⚡+💝 중복 가능<br />
          • 상품4 = 품절
        </p>
      </div>
    </div>
  `;
}

/**
 * NewItem 컴포넌트
 * Props: item - 상품 정보 객체
 * Returns: 장바구니 아이템 HTML
 */
function NewItem({ item }) {
  const { id, name, val, originalVal, onSale, suggestSale } = item;

  // 할인 아이콘과 스타일은 utils/product.js에서 가져옴

  // 가격 표시 렌더링
  const renderPrice = () => {
    if (onSale || suggestSale) {
      return `
        <span class="line-through text-gray-400">₩${originalVal}</span>
        <span class="${getProductDiscountStyle({ onSale, suggestSale })}">₩${val}</span>
      `;
    }
    return `₩${val}`;
  };

  return /* HTML */ `
    <div
      id="${id}"
      class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div
          class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
        ></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">
          ${getProductDiscountIcon({ onSale, suggestSale })}${name}
        </h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${renderPrice()}</p>
        <div class="flex items-center gap-4">
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="-1"
          >
            -
          </button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
            >1</span
          >
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="1"
          >
            +
          </button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${renderPrice()}</div>
        <a
          class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id="${id}"
          >Remove</a
        >
      </div>
    </div>
  `;
}

// findProductById는 utils/product.js에서 import됨

function main() {
  const root = document.getElementById('app');

  root.innerHTML += Header({ itemCount: cartState.itemCount });
  root.innerHTML += GridContainer({
    total: cartState.total,
    bonusPoints: 0,
    pointsDetail: [],
  });
  root.innerHTML += ManualToggle();
  root.innerHTML += ManualOverlay();

  const sel = root.querySelector('#product-select');
  const addBtn = root.querySelector('#add-to-cart');
  const stockInfo = root.querySelector('#stock-status');
  const cartDisp = root.querySelector('#cart-items');
  const sum = root.querySelector('#cart-total');
  const manualToggle = root.querySelector('#manual-toggle');
  const manualOverlay = root.querySelector('#manual-overlay');

  // 이벤트 핸들러는 bindEventListeners에서 처리됨

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 상태 변경 구독 설정
  subscribeToState(() => {
    // 상태 변경 시 UI 업데이트
    updateUIFromState();
  });

  // 번개세일 타이머 시작
  const lightningSaleService = new LightningSaleService(productList, doUpdatePricesInCart);
  lightningSaleService.startLightningSaleTimer();

  // 추천할인 타이머 시작
  const suggestSaleService = new SuggestSaleService(
    productList,
    productState,
    doUpdatePricesInCart
  );
  suggestSaleService.startSuggestSaleTimer();

  function onUpdateSelectOptions() {
    sel.innerHTML = '';
    const totalStock = productList.reduce((acc, product) => acc + product.q, 0);

    const optionsHTML = productList.map((item) => ProductOption({ item })).join('');
    sel.innerHTML = optionsHTML;

    if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
      sel.style.borderColor = 'orange';
    } else {
      sel.style.borderColor = '';
    }
  }

  function handleCalculateCartStuff() {
    const cartCalculationService = new CartCalculationService(
      productList,
      cartDisp,
      document.getElementById('summary-details'),
      sum.querySelector('.text-2xl'),
      document.getElementById('discount-info'),
      document.getElementById('item-count')
    );

    const result = cartCalculationService.calculateCart();

    // 상태 업데이트
    stateActions.updateCartTotal(result.totalAmt);
    stateActions.updateCartItemCount(result.itemCnt);

    handleStockInfoUpdate();
    doRenderBonusPoints();
  }

  function doRenderBonusPoints() {
    const pointsCalculationService = new PointsCalculationService(productList, cartDisp, cartState);

    const { bonusPoints, pointsDetail } = pointsCalculationService.calculateBonusPoints();

    // 빈 장바구니가 아닐 때만 포인트 표시 업데이트
    if (cartDisp.children.length > 0) {
      pointsCalculationService.updateLoyaltyPointsDisplay(bonusPoints, pointsDetail);
    }
  }

  function updateUIFromState() {
    // 아이템 카운트 업데이트
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️  ${cartState.itemCount} items in cart`;
    }

    // 매뉴얼 오버레이 상태 업데이트
    const manualOverlay = document.getElementById('manual-overlay');
    const manualColumn = document.getElementById('manual-column');
    if (manualOverlay && manualColumn) {
      if (uiState.isManualOpen) {
        manualOverlay.classList.remove('hidden');
        manualColumn.classList.remove('translate-x-full');
      } else {
        manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      }
    }
  }

  function handleStockInfoUpdate() {
    const lowStockProducts = getLowStockProducts(productList);
    stockInfo.textContent = generateStockWarningMessage(lowStockProducts);
  }

  function doUpdatePricesInCart() {
    const priceUpdateService = new PriceUpdateService(
      productList,
      cartDisp,
      handleCalculateCartStuff
    );

    priceUpdateService.updatePricesInCart();
  }

  // 컨텍스트 객체 생성
  const context = {
    productList,
    cartDisp,
    sel,
    addBtn,
    manualToggle,
    manualOverlay,
    stockInfo,
    handleCalculateCartStuff,
    stateActions,
    NewItem,
    ProductOption,
    onUpdateSelectOptions,
  };

  // 이벤트 리스너 바인딩
  bindEventListeners(context);
}

main();

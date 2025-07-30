// 상수 분리 (리액트 변환을 위한 준비)
const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

const DISCOUNT_RATES = {
  KEYBOARD: 0.1, // 10%
  MOUSE: 0.15, // 15%
  MONITOR_ARM: 0.2, // 20%
  LAPTOP_POUCH: 0.05, // 5%
  SPEAKER: 0.25, // 25%
};

const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  LOW_STOCK: 5,
  POINTS_BONUS_10: 10,
  POINTS_BONUS_20: 20,
};

const POINTS_CONFIG = {
  POINTS_DIVISOR: 1000,
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BONUS_10_ITEMS: 20,
  BONUS_20_ITEMS: 50,
  BONUS_30_ITEMS: 100,
};

const TIMER_CONFIG = {
  LIGHTNING_SALE_DELAY: 10000,
  LIGHTNING_SALE_INTERVAL: 30000,
  RECOMMENDATION_DELAY: 20000,
  RECOMMENDATION_INTERVAL: 60000,
};

// 상태 관리 객체 (리액트 변환을 위한 준비)
const AppState = {
  products: [],
  cart: {
    items: [],
    totalAmount: 0,
    itemCount: 0,
    bonusPoints: 0,
  },
  ui: {
    selectedProduct: null,
    lastSelectedProduct: null,
    selectElement: null,
    addButton: null,
    cartDisplay: null,
    totalElement: null,
    stockInfo: null,
    isModalOpen: false,
  },
  init() {
    this.products = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: '버그 없애는 키보드',
        value: 10000,
        originalValue: 10000,
        quantity: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: '생산성 폭발 마우스',
        value: 20000,
        originalValue: 20000,
        quantity: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: '거북목 탈출 모니터암',
        value: 30000,
        originalValue: 30000,
        quantity: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_POUCH,
        name: '에러 방지 노트북 파우치',
        value: 15000,
        originalValue: 15000,
        quantity: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: `코딩할 때 듣는 Lo-Fi 스피커`,
        value: 25000,
        originalValue: 25000,
        quantity: 10,
        onSale: false,
        suggestSale: false,
      },
    ];
  },
};

// React 변환 준비 완료 - 모든 전역 변수가 AppState로 통합됨

// 초기화 함수들
function initializeApp() {
  AppState.init();

  // 전역 변수들 AppState와 연결 (호환성 유지)
  window.productList = AppState.products;
  window.bonusPoints = AppState.cart.bonusPoints;
  window.totalAmount = AppState.cart.totalAmount;
  window.itemCount = AppState.cart.itemCount;
  window.AppState = AppState;
  window.renderApp = renderApp;
}

function Header(props = {}) {
  const { itemCount = 0 } = props;

  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
    </div>
  `;
}

function ProductSelector() {
  const options = AppState.products
    .map((product) => {
      let discountText = '';
      if (product.onSale) discountText += ' ⚡SALE';
      if (product.suggestSale) discountText += ' 💝추천';

      if (product.quantity === 0) {
        return `<option value="${product.id}" disabled class="text-gray-400">${product.name} - ${product.value}원 (품절)${discountText}</option>`;
      }
      if (product.onSale && product.suggestSale) {
        return `<option value="${product.id}" class="text-purple-600 font-bold">⚡💝${product.name} - ${product.originalValue}원 → ${product.value}원 (25% SUPER SALE!)</option>`;
      }
      if (product.onSale) {
        return `<option value="${product.id}" class="text-red-500 font-bold">⚡${product.name} - ${product.originalValue}원 → ${product.value}원 (20% SALE!)</option>`;
      }
      if (product.suggestSale) {
        return `<option value="${product.id}" class="text-blue-500 font-bold">💝${product.name} - ${product.originalValue}원 → ${product.value}원 (5% 추천할인!)</option>`;
      }
      return `<option value="${product.id}">${product.name} - ${product.value}원${discountText}</option>`;
    })
    .join('');

  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
        ${options}
      </select>
      <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
        Add to Cart
      </button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
    </div>
  `;
}

function CartDisplay() {
  return `<div id="cart-items"></div>`;
}

function OrderSummary() {
  return `
    <div class="bg-black text-white p-8 flex flex-col">
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-details" class="space-y-3"></div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4"></div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">₩0</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
        </div>
      </div>
      <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br>
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;
}

function ManualModal() {
  const isOpen = AppState.ui.isModalOpen;
  const overlayHidden = isOpen ? '' : 'hidden';
  const columnTransform = isOpen ? '' : 'translate-x-full';

  return `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${overlayHidden}"></div>
    <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transition-transform duration-300 ${columnTransform}">
      <button class="absolute top-4 right-4 text-gray-500 hover:text-black">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
     
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="text-gray-700 text-xs pl-2">
              • 키보드 10개↑: 10%<br>
              • 마우스 10개↑: 15%<br>
              • 모니터암 10개↑: 20%<br>
              • 스피커 10개↑: 25%
            </p>
          </div>
       
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
          </div>
       
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: +10%<br>
              • ⚡번개세일: 20%<br>
              • 💝추천할인: 5%
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
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
            </p>
          </div>
        </div>
      </div>
     
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br>
          • ⚡+💝 중복 가능<br>
          • 상품4 = 품절
        </p>
    </div>
  `;
}

function createUI() {
  return `
    ${Header({ itemCount: AppState.cart.itemCount })}
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        ${ProductSelector()}
        ${CartDisplay()}
      </div>
      ${OrderSummary()}
    </div>
    ${ManualModal()}
  `;
}

function renderApp() {
  const root = document.getElementById('app');
  root.innerHTML = createUI();

  // DOM 요소 참조 업데이트
  AppState.ui.selectElement = document.getElementById('product-select');
  AppState.ui.addButton = document.getElementById('add-to-cart');
  AppState.ui.cartDisplay = document.getElementById('cart-items');
  AppState.ui.totalElement = document.getElementById('cart-total');
  AppState.ui.stockInfo = document.getElementById('stock-status');
}

// 이벤트 핸들러 함수들

// 이벤트 핸들러 함수들

function setupModalEventListeners() {
  const manualToggle = document.getElementById('manual-toggle');
  const manualOverlay = document.getElementById('manual-overlay');
  const manualColumn = document.getElementById('manual-column');

  if (manualToggle) {
    manualToggle.onclick = function () {
      AppState.ui.isModalOpen = !AppState.ui.isModalOpen;
      updateModalVisibility();
    };
  }

  if (manualOverlay) {
    manualOverlay.onclick = function (e) {
      if (e.target === manualOverlay) {
        AppState.ui.isModalOpen = false;
        updateModalVisibility();
      }
    };
  }

  if (manualColumn) {
    const closeButton = manualColumn.querySelector('button');
    if (closeButton) {
      closeButton.onclick = function () {
        AppState.ui.isModalOpen = false;
        updateModalVisibility();
      };
    }
  }
}

function updateModalVisibility() {
  const overlay = document.getElementById('manual-overlay');
  const column = document.getElementById('manual-column');

  if (overlay && column) {
    if (AppState.ui.isModalOpen) {
      overlay.classList.remove('hidden');
      column.classList.remove('translate-x-full');
    } else {
      overlay.classList.add('hidden');
      column.classList.add('translate-x-full');
    }
  }
}

// 타이머 관련 함수들
function setupLightningSaleTimer() {
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIndex = Math.floor(Math.random() * AppState.products.length);
      const luckyItem = AppState.products[luckyIndex];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.value = Math.round((luckyItem.originalValue * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

function setupRecommendationTimer() {
  setTimeout(function () {
    setInterval(function () {
      if (AppState.ui.cartDisplay.children.length === 0) {
        return;
      }
      if (AppState.ui.lastSelectedProduct) {
        let suggest = null;

        for (let k = 0; k < AppState.products.length; k++) {
          if (AppState.products[k].id !== AppState.ui.lastSelectedProduct) {
            if (AppState.products[k].quantity > 0) {
              if (!AppState.products[k].suggestSale) {
                suggest = AppState.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.value = Math.round((suggest.value * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY);
}

function setupTimers() {
  setupLightningSaleTimer();
  setupRecommendationTimer();
}

// 메인 함수 (리팩토링된 버전)
function main() {
  // 1. 앱 초기화
  initializeApp();

  // 2. UI 렌더링
  renderApp();

  // 3. 이벤트 리스너 설정
  setupCartEventListeners();
  setupModalEventListeners();

  // 4. 초기화
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 5. 타이머 설정
  setupTimers();
}

function onUpdateSelectOptions() {
  let totalStock = 0;
  AppState.ui.selectElement.innerHTML = '';

  for (let idx = 0; idx < AppState.products.length; idx++) {
    const product = AppState.products[idx];
    totalStock = totalStock + product.quantity;
  }

  AppState.products.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    let discountText = '';

    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.quantity === 0) {
      option.textContent = `${item.name} - ${item.value}원 (품절)${discountText}`;
      option.disabled = true;
      option.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        option.textContent = `⚡💝${item.name} - ${item.originalValue}원 → ${item.value}원 (25% SUPER SALE!)`;
        option.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        option.textContent = `⚡${item.name} - ${item.originalValue}원 → ${item.value}원 (20% SALE!)`;
        option.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        option.textContent = `💝${item.name} - ${item.originalValue}원 → ${item.value}원 (5% 추천할인!)`;
        option.className = 'text-blue-500 font-bold';
      } else {
        option.textContent = `${item.name} - ${item.value}원${discountText}`;
      }
    }
    AppState.ui.selectElement.appendChild(option);
  });

  if (totalStock < 50) {
    AppState.ui.selectElement.style.borderColor = 'orange';
  } else {
    AppState.ui.selectElement.style.borderColor = '';
  }
}

// 공통 유틸리티 함수들
function findProductById(productId) {
  return AppState.products.find((product) => product.id === productId);
}

function findProductByElement(cartItemElement) {
  return findProductById(cartItemElement.id);
}

function formatPrice(price) {
  return `₩${Math.round(price).toLocaleString()}`;
}

function isTuesday() {
  return new Date().getDay() === 2;
}

function calculateIndividualDiscount(productId, quantity) {
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
}

function calculateBulkDiscount(itemCount) {
  return itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE ? 0.25 : 0;
}

function calculateTuesdayDiscount(totalAmount) {
  return isTuesday() ? totalAmount * 0.1 : 0;
}

function getStockStatusMessage() {
  return AppState.products
    .filter((product) => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK)
    .map((product) => {
      if (product.quantity > 0) {
        return `${product.name}: 재고 부족 (${product.quantity}개 남음)`;
      }
      return `${product.name}: 품절`;
    })
    .join('\n');
}

// 장바구니 계산 관련 함수들
function calculateCartItems(cartItems) {
  let subtotal = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  Array.from(cartItems).forEach((cartItem) => {
    const currentProduct = findProductByElement(cartItem);
    const quantityElement = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = currentProduct.value * quantity;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 할인 계산
    const discount = calculateIndividualDiscount(currentProduct.id, quantity);
    if (discount > 0) {
      itemDiscounts.push({
        name: currentProduct.name,
        discount: discount * 100,
      });
    }

    // UI 스타일 업데이트
    updatePriceElementStyle(cartItem, quantity);
  });

  return { subtotal, itemCount, itemDiscounts };
}

function updatePriceElementStyle(cartItemElement, quantity) {
  const priceElements = cartItemElement.querySelectorAll('.text-lg, .text-xs');
  priceElements.forEach((element) => {
    if (element.classList.contains('text-lg')) {
      element.style.fontWeight =
        quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'bold' : 'normal';
    }
  });
}

function calculateTotalWithDiscounts(subtotal, itemCount, itemDiscounts) {
  let totalAmount = subtotal;
  let discountRate = 0;

  // 대량구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount);
  if (bulkDiscount > 0) {
    totalAmount = subtotal * (1 - bulkDiscount);
    discountRate = bulkDiscount;
  } else {
    // 개별 할인 적용
    const individualDiscountTotal = itemDiscounts.reduce(
      (sum, item) => sum + subtotal * (item.discount / 100),
      0,
    );
    totalAmount = subtotal - individualDiscountTotal;
    discountRate = individualDiscountTotal / subtotal;
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmount);
  if (tuesdayDiscount > 0) {
    totalAmount -= tuesdayDiscount;
    discountRate = 1 - totalAmount / subtotal;
  }

  return { totalAmount, discountRate, tuesdayDiscount };
}

// UI 업데이트 함수들
function updateItemCountDisplay(itemCount) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

function updateTotalDisplay(totalAmount) {
  const totalDiv = AppState.ui.totalElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(totalAmount);
  }
}

// 주문 요약 컴포넌트들
function CartItemSummaryComponent(cartItem) {
  const currentProduct = findProductByElement(cartItem);
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement.textContent);
  const itemTotal = currentProduct.value * quantity;

  return `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${currentProduct.name} x ${quantity}</span>
      <span>${formatPrice(itemTotal)}</span>
    </div>
  `;
}

function SubtotalComponent(subtotal) {
  return `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
  `;
}

function BulkDiscountComponent() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-green-400">
      <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
      <span class="text-xs">-25%</span>
    </div>
  `;
}

function IndividualDiscountComponent(item) {
  return `
    <div class="flex justify-between text-sm tracking-wide text-green-400">
      <span class="text-xs">${item.name} (10개↑)</span>
      <span class="text-xs">-${item.discount}%</span>
    </div>
  `;
}

function TuesdayDiscountComponent() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-purple-400">
      <span class="text-xs">🌟 화요일 추가 할인</span>
      <span class="text-xs">-10%</span>
    </div>
  `;
}

function ShippingInfoComponent() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

function SummaryDetailsComponent(cartItems, subtotal, itemCount, itemDiscounts, totalAmount) {
  if (subtotal <= 0) return '';

  const cartItemSummaries = Array.from(cartItems)
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
}

function updateSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, totalAmount) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = SummaryDetailsComponent(
    cartItems,
    subtotal,
    itemCount,
    itemDiscounts,
    totalAmount,
  );
}

function updateDiscountInfo(discountRate, originalTotal, totalAmount) {
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${formatPrice(savedAmount)} 할인되었습니다</div>
      </div>
    `;
  }
}

function updateTuesdaySpecialBanner(totalAmount) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday() && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

function updateStockInfo() {
  const stockMessage = getStockStatusMessage();
  AppState.ui.stockInfo.textContent = stockMessage;
}

function updateBasicPoints(totalAmount) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
}

// 메인 계산 함수 (리팩토링된 버전)
function handleCalculateCartStuff() {
  const cartItems = AppState.ui.cartDisplay.children;

  // 1. 장바구니 아이템 계산
  const { subtotal, itemCount, itemDiscounts } = calculateCartItems(cartItems);

  // 2. 할인 적용하여 최종 금액 계산
  const { totalAmount, discountRate } = calculateTotalWithDiscounts(
    subtotal,
    itemCount,
    itemDiscounts,
  );

  // 3. 전역 변수 업데이트
  window.totalAmount = totalAmount;
  window.itemCount = itemCount;

  // 4. UI 업데이트
  updateItemCountDisplay(itemCount);
  updateTotalDisplay(totalAmount);
  updateSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, totalAmount);
  updateDiscountInfo(discountRate, subtotal, totalAmount);
  updateTuesdaySpecialBanner(totalAmount);
  updateStockInfo();
  updateBasicPoints(totalAmount);

  // 5. 추가 계산 및 업데이트
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

const doRenderBonusPoints = function () {
  const basePoints = Math.floor(window.totalAmount / POINTS_CONFIG.POINTS_DIVISOR);
  let finalPoints;
  const pointsDetail = [];
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  const nodes = AppState.ui.cartDisplay.children;

  if (AppState.ui.cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  finalPoints = 0;

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;

  Array.from(nodes).forEach((node) => {
    const product = AppState.products.find((p) => p.id === node.id);
    if (!product) return;
    if (product.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  });

  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINTS_CONFIG.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (window.itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_30_ITEMS;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (window.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_20_ITEMS;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (window.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_10_ITEMS;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  AppState.cart.bonusPoints = finalPoints;
  window.bonusPoints = finalPoints;
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (loyaltyPointsElement) {
    if (AppState.cart.bonusPoints > 0) {
      loyaltyPointsElement.innerHTML = `<div>적립 포인트: <span class="font-bold">${AppState.cart.bonusPoints}p</span></div><div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
      loyaltyPointsElement.style.display = 'block';
    } else {
      loyaltyPointsElement.textContent = '적립 포인트: 0p';
      loyaltyPointsElement.style.display = 'block';
    }
  }
};

function onGetStockTotal() {
  return AppState.products.reduce((sum, currentProduct) => sum + currentProduct.quantity, 0);
}

const handleStockInfoUpdate = function () {
  let infoMessage = '';
  const totalStock = onGetStockTotal();
  if (totalStock < 30) {
    // 재고 부족 시 추가 처리 가능
  }
  AppState.products.forEach((item) => {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        infoMessage += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMessage += `${item.name}: 품절\n`;
      }
    }
  });
  AppState.ui.stockInfo.textContent = infoMessage;
};

function doUpdatePricesInCart() {
  const cartItems = AppState.ui.cartDisplay.children;
  Array.from(cartItems).forEach((cartItem) => {
    const itemId = cartItem.id;
    const product = AppState.products.find((p) => p.id === itemId);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-purple-600">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-red-500">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="text-blue-500">₩${product.value.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.value.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  });
  handleCalculateCartStuff();
}

// 장바구니 아이템 생성 함수
function CartItemElement(product) {
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="${product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}">₩${product.value.toLocaleString()}</span>`
      : `₩${product.value.toLocaleString()}`;

  return `
    <div id="${product.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    </div>
  `;
}

// 상태 변경 함수들 (비즈니스 로직)
function addItemToCart(productId) {
  const product = findProductById(productId);
  if (!product || product.quantity <= 0) {
    return false;
  }

  const existingItem = document.getElementById(productId);
  if (existingItem) {
    // 기존 아이템 수량 증가
    const quantityElement = existingItem.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= product.quantity + currentQuantity) {
      quantityElement.textContent = newQuantity;
      product.quantity--;
      return true;
    }
    alert('재고가 부족합니다.');
    return false;
  }

  // 새 아이템 추가
  const newItemHTML = CartItemElement(product);
  AppState.ui.cartDisplay.insertAdjacentHTML('beforeend', newItemHTML);
  product.quantity--;
  return true;
}

function updateItemQuantity(productId, change) {
  const product = findProductById(productId);
  const itemElement = document.getElementById(productId);

  if (!product || !itemElement) {
    return false;
  }

  const quantityElement = itemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.quantity -= change;
    return true;
  }

  if (newQuantity <= 0) {
    // 아이템 제거
    product.quantity += currentQuantity;
    itemElement.remove();
    return true;
  }

  alert('재고가 부족합니다.');
  return false;
}

function removeItemFromCart(productId) {
  const product = findProductById(productId);
  const itemElement = document.getElementById(productId);

  if (!product || !itemElement) {
    return false;
  }

  const quantityElement = itemElement.querySelector('.quantity-number');
  const removeQuantity = parseInt(quantityElement.textContent);
  product.quantity += removeQuantity;
  itemElement.remove();
  return true;
}

// 이벤트 핸들러 함수들
function handleAddToCart() {
  const selectedProductId = AppState.ui.selectElement.value;

  if (!selectedProductId) {
    return;
  }

  const product = findProductById(selectedProductId);
  if (!product) {
    return;
  }

  if (addItemToCart(selectedProductId)) {
    handleCalculateCartStuff();
    AppState.ui.lastSelectedProduct = selectedProductId;
    window.lastSelectedProduct = selectedProductId; // 호환성 유지
  }
}

function handleQuantityChange(productId, change) {
  if (updateItemQuantity(productId, change)) {
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}

function handleRemoveItem(productId) {
  if (removeItemFromCart(productId)) {
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}

function handleCartClick(event) {
  const { target } = event;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const { productId } = target.dataset;
  if (!productId) {
    return;
  }

  if (target.classList.contains('quantity-change')) {
    const change = parseInt(target.dataset.change);
    handleQuantityChange(productId, change);
  } else if (target.classList.contains('remove-item')) {
    handleRemoveItem(productId);
  }
}

// 이벤트 리스너 설정 함수
function setupCartEventListeners() {
  AppState.ui.addButton.addEventListener('click', handleAddToCart);
  AppState.ui.cartDisplay.addEventListener('click', handleCartClick);
}

main();

// 이벤트 리스너 설정
setupCartEventListeners();

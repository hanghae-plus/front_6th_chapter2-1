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
  },
  init() {
    this.products = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: '버그 없애는 키보드',
        val: 10000,
        originalVal: 10000,
        quantity: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: '생산성 폭발 마우스',
        val: 20000,
        originalVal: 20000,
        quantity: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: '거북목 탈출 모니터암',
        val: 30000,
        originalVal: 30000,
        quantity: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_POUCH,
        name: '에러 방지 노트북 파우치',
        val: 15000,
        originalVal: 15000,
        quantity: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: `코딩할 때 듣는 Lo-Fi 스피커`,
        val: 25000,
        originalVal: 25000,
        quantity: 10,
        onSale: false,
        suggestSale: false,
      },
    ];
  },
};

// 기존 전역 변수들 (호환성 유지) - React 변환 시 제거 예정
let lastSelectedProduct;
let totalElement;

// 초기화 함수들
function initializeApp() {
  AppState.init();

  // 전역 변수들 AppState와 연결 (호환성 유지)
  window.productList = AppState.products;
  window.bonusPoints = AppState.cart.bonusPoints;
  window.totalAmount = AppState.cart.totalAmount;
  window.itemCount = AppState.cart.itemCount;
}

function createHeader() {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  return header;
}

function createProductSelector() {
  AppState.ui.selectElement = document.createElement('select');
  AppState.ui.selectElement.id = 'product-select';
  AppState.ui.selectElement.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  AppState.ui.addButton = document.createElement('button');
  AppState.ui.addButton.id = 'add-to-cart';
  AppState.ui.addButton.innerHTML = 'Add to Cart';
  AppState.ui.addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  AppState.ui.stockInfo = document.createElement('div');
  AppState.ui.stockInfo.id = 'stock-status';
  AppState.ui.stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(AppState.ui.selectElement);
  selectorContainer.appendChild(AppState.ui.addButton);
  selectorContainer.appendChild(AppState.ui.stockInfo);

  return selectorContainer;
}

function createCartDisplay() {
  AppState.ui.cartDisplay = document.createElement('div');
  AppState.ui.cartDisplay.id = 'cart-items';
  return AppState.ui.cartDisplay;
}

function createOrderSummary() {
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
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
  `;

  totalElement = rightColumn.querySelector('#cart-total');
  return rightColumn;
}

function createHelpModal() {
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
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

  return { manualToggle, manualOverlay, manualColumn };
}

function createUI() {
  const root = document.getElementById('app');

  // 헤더 생성
  const header = createHeader();

  // 상품 선택 영역 생성
  const selectorContainer = createProductSelector();
  const cartDisplayElement = createCartDisplay();

  // 좌측 컬럼 구성
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElement);

  // 주문 요약 영역 생성
  const rightColumn = createOrderSummary();

  // 그리드 컨테이너 구성
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  // 도움말 모달 생성
  const { manualToggle, manualOverlay, manualColumn } = createHelpModal();
  manualOverlay.appendChild(manualColumn);

  // DOM에 요소들 추가
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return { manualToggle, manualOverlay, manualColumn };
}

function connectAppStateToUI() {
  // AppState와 UI 연결은 이미 createProductSelector, createCartDisplay에서 처리됨
}

// 이벤트 핸들러 함수들
function handleModalToggle(manualOverlay, manualColumn) {
  manualOverlay.classList.toggle('hidden');
  manualColumn.classList.toggle('translate-x-full');
}

function handleModalClose(manualOverlay, manualColumn) {
  manualOverlay.classList.add('hidden');
  manualColumn.classList.add('translate-x-full');
}

function handleModalBackgroundClick(event, manualOverlay, manualColumn) {
  if (event.target === manualOverlay) {
    handleModalClose(manualOverlay, manualColumn);
  }
}

function setupModalEvents(manualToggle, manualOverlay, manualColumn) {
  manualToggle.onclick = () => handleModalToggle(manualOverlay, manualColumn);
  manualOverlay.onclick = (e) => handleModalBackgroundClick(e, manualOverlay, manualColumn);
}

// 타이머 관련 함수들
function setupLightningSaleTimer() {
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIndex];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
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
      if (cartDisplay.children.length === 0) {
        return;
      }
      if (lastSelectedProduct) {
        let suggest = null;

        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProduct) {
            if (productList[k].quantity > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
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

  // 2. UI 생성
  const { manualToggle, manualOverlay, manualColumn } = createUI();

  // 3. AppState와 UI 연결
  connectAppStateToUI();

  // 4. 모달 이벤트 설정
  setupModalEvents(manualToggle, manualOverlay, manualColumn);

  // 5. 초기화
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 6. 타이머 설정
  setupTimers();
}

function onUpdateSelectOptions() {
  let totalStock = 0;
  AppState.ui.selectElement.innerHTML = '';

  for (let idx = 0; idx < AppState.products.length; idx++) {
    const product = AppState.products[idx];
    totalStock = totalStock + product.quantity;
  }

  for (let i = 0; i < AppState.products.length; i++) {
    (function () {
      const item = AppState.products[i];
      const option = document.createElement('option');
      option.value = item.id;
      let discountText = '';

      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      if (item.quantity === 0) {
        option.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          option.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
          option.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          option.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
          option.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          option.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
          option.className = 'text-blue-500 font-bold';
        } else {
          option.textContent = `${item.name} - ${item.val}원${discountText}`;
        }
      }
      AppState.ui.selectElement.appendChild(option);
    })();
  }

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

  for (let i = 0; i < cartItems.length; i++) {
    const currentProduct = findProductByElement(cartItems[i]);
    const quantityElement = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(quantityElement.textContent);
    const itemTotal = currentProduct.val * quantity;

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
    updatePriceElementStyle(cartItems[i], quantity);
  }

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
  const totalDiv = totalElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(totalAmount);
  }
}

function updateSummaryDetails(cartItems, subtotal, itemCount, itemDiscounts, totalAmount) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subtotal > 0) {
    // 상품별 상세 정보
    for (let i = 0; i < cartItems.length; i++) {
      const currentProduct = findProductByElement(cartItems[i]);
      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
      const itemTotal = currentProduct.val * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${currentProduct.name} x ${quantity}</span>
          <span>${formatPrice(itemTotal)}</span>
        </div>
      `;
    }

    // 소계
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
    `;

    // 할인 정보
    if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인
    if (isTuesday() && totalAmount > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송비
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
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

  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < AppState.products.length; pIdx++) {
      if (AppState.products[pIdx].id === node.id) {
        product = AppState.products[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }

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
  let sum = 0;
  for (let i = 0; i < AppState.products.length; i++) {
    const currentProduct = AppState.products[i];
    sum += currentProduct.quantity;
  }
  return sum;
}

const handleStockInfoUpdate = function () {
  let infoMessage = '';
  const totalStock = onGetStockTotal();
  if (totalStock < 30) {
    // 재고 부족 시 추가 처리 가능
  }
  AppState.products.forEach(function (item) {
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
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    for (let productIdx = 0; productIdx < AppState.products.length; productIdx++) {
      if (AppState.products[productIdx].id === itemId) {
        product = AppState.products[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}

// 장바구니 아이템 생성 함수
function createCartItemElement(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

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
      ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}">₩${product.val.toLocaleString()}</span>`
      : `₩${product.val.toLocaleString()}`;

  newItem.innerHTML = `
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
  `;

  return newItem;
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
  const newItem = createCartItemElement(product);
  AppState.ui.cartDisplay.appendChild(newItem);
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

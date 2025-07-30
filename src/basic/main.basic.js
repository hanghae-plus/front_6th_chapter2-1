// 리팩토링 완료 후 파일 분리할 것

// ============================================
// 📦 상수 및 설정
// ============================================

// 상품 ID 상수
const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

// 할인율 상수
const DISCOUNT_RATES = {
  KEYBOARD: 10, // 키보드 10개↑ 할인율
  MOUSE: 15, // 마우스 10개↑ 할인율
  MONITOR_ARM: 20, // 모니터암 10개↑ 할인율
  LAPTOP_POUCH: 5, // 노트북파우치 10개↑ 할인율
  SPEAKER: 25, // 스피커 10개↑ 할인율
  BULK_PURCHASE: 25, // 대량구매 할인율 (30개↑)
  TUESDAY: 10, // 화요일 추가 할인율
  LIGHTNING_SALE: 20, // 번개세일 할인율
  RECOMMENDATION: 5, // 추천할인율
};

// 수량 기준 상수
const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10, // 개별 상품 할인 시작 수량
  BULK_PURCHASE: 30, // 대량구매 할인 시작 수량
  LOW_STOCK: 5, // 재고 부족 기준
  POINTS_BONUS_10: 10, // 포인트 보너스 10개 기준
  POINTS_BONUS_20: 20, // 포인트 보너스 20개 기준
  POINTS_BONUS_30: 30, // 포인트 보너스 30개 기준
};

// 포인트 관련 상수
const POINTS_CONFIG = {
  BASE_RATE: 0.1, // 기본 적립률 (0.1%)
  TUESDAY_MULTIPLIER: 2, // 화요일 포인트 배수
  KEYBOARD_MOUSE_BONUS: 50, // 키보드+마우스 세트 보너스
  FULL_SET_BONUS: 100, // 풀세트 보너스
  BONUS_10_ITEMS: 20, // 10개↑ 보너스
  BONUS_20_ITEMS: 50, // 20개↑ 보너스
  BONUS_30_ITEMS: 100, // 30개↑ 보너스
};

// 타이머 관련 상수
const TIMER_CONFIG = {
  LIGHTNING_SALE_DELAY: 10000, // 번개세일 초기 지연시간 (10초)
  LIGHTNING_SALE_INTERVAL: 30000, // 번개세일 반복 간격 (30초)
  RECOMMENDATION_DELAY: 20000, // 추천할인 초기 지연시간 (20초)
  RECOMMENDATION_INTERVAL: 60000, // 추천할인 반복 간격 (60초)
};

// 계산 관련 상수
const CALCULATION_CONFIG = {
  PERCENTAGE_DIVISOR: 100, // 퍼센트 계산용 나누기 값
  POINTS_DIVISOR: 1000, // 포인트 계산용 나누기 값
  TUESDAY_DAY_OF_WEEK: 2, // 화요일 요일 번호
};

// 기존 상수들 (하위 호환성을 위해 유지)
const PRODUCT_1 = PRODUCT_IDS.KEYBOARD;
const PRODUCT_2 = PRODUCT_IDS.MOUSE;
const PRODUCT_3 = PRODUCT_IDS.MONITOR_ARM;
const PRODUCT_4 = PRODUCT_IDS.LAPTOP_POUCH;
const PRODUCT_5 = PRODUCT_IDS.SPEAKER;

// ============================================
// 🗃️ 전역 상태 관리
// ============================================
const AppState = {
  // 상품 데이터
  productList: [],

  // UI 상태
  lastSelector: null,
  totalAmount: 0,
  itemCount: 0,
  stockInfo: '',

  // 카트 아이템 상태 (React 변환용)
  cartItems: [],

  // 상태 초기화 함수
  initialize() {
    this.productList = [];
    this.lastSelector = null;
    this.totalAmount = 0;
    this.itemCount = 0;
    this.cartItems = [];
  },

  // 상태 업데이트 함수들
  setProductList(products) {
    this.productList = products;
  },

  setLastSelector(selector) {
    this.lastSelector = selector;
  },

  setTotalAmount(amount) {
    this.totalAmount = amount;
  },

  setItemCount(count) {
    this.itemCount = count;
  },

  setStockInfo(info) {
    this.stockInfo = info;
  },

  // 카트 아이템 관리
  addCartItem(productId, quantity = 1) {
    const existingItem = this.cartItems.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ productId, quantity });
    }
  },

  updateCartItemQuantity(productId, newQuantity) {
    const item = this.cartItems.find((item) => item.productId === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeCartItem(productId);
      } else {
        item.quantity = newQuantity;
      }
    }
  },

  removeCartItem(productId) {
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
  },

  getCartItemQuantity(productId) {
    const item = this.cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  },
};

// ============================================
// 컴포넌트 함수들
// ============================================
const Header = () => `
  <div class="mb-8">
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  </div>
`;

// 셀렉터 컨테이너 (상품 선택 영역)
const SelectorContainer = () => `
  <div class="mb-6 pb-6 border-b border-gray-200">
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" data-handler="selectChange">
    </select>
    <button 
      id="add-to-cart" 
      class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      data-handler="addToCart"
    >
      Add to Cart
    </button>
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">${AppState.stockInfo || ''}</div>
  </div>
`;

// 카트 아이템 렌더링 함수
const renderCartItems = () => {
  if (AppState.cartItems.length === 0) {
    return '<div class="text-gray-500 text-center py-8">장바구니가 비어있습니다.</div>';
  }

  return AppState.cartItems
    .map((cartItem) => {
      const product = AppState.productList.find((p) => p.id === cartItem.productId);
      if (!product) return '';

      const displayName =
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

      return `
      <div id="${product.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${displayName}${product.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${priceDisplay}</p>
          <div class="flex items-center gap-4">
            <button 
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" 
              data-product-id="${product.id}" 
              data-change="-1"
              data-handler="quantityChange"
            >−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${cartItem.quantity}</span>
            <button 
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" 
              data-product-id="${product.id}" 
              data-change="1"
              data-handler="quantityChange"
            >+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
          <a 
            class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" 
            data-product-id="${product.id}"
            data-handler="removeItem"
          >Remove</a>
        </div>
      </div>
    `;
    })
    .join('');
};

// 왼쪽 컬럼 (상품 선택 + 카트)
const LeftColumn = () => `
  <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
    ${SelectorContainer()}
    <div id="cart-items">
      ${renderCartItems()}
    </div>
  </div>
`;

// 오른쪽 컬럼 (주문 요약)
const RightColumn = () => `
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

// 메인 그리드 컨테이너
const GridContainer = () => `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    ${LeftColumn()}
    ${RightColumn()}
  </div>
`;

const ManualToggle = () => `
  <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </button>
`;

const ManualOverlay = () => `
  <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
    <!-- 수동 안내 컬럼 -->
    <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
      <button id="manual-close" class="absolute top-4 right-4 text-gray-500 hover:text-black">
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
            <p class="text-gray-700 text-xs pl-2">• 구매액의 ${POINTS_CONFIG.BASE_RATE * 100}%</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">추가</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: ${POINTS_CONFIG.TUESDAY_MULTIPLIER}배<br>
              • 키보드+마우스: +${POINTS_CONFIG.KEYBOARD_MOUSE_BONUS}p<br>
              • 풀세트: +${POINTS_CONFIG.FULL_SET_BONUS}p<br>
              • 10개↑: +${POINTS_CONFIG.BONUS_10_ITEMS}p / 20개↑: +${POINTS_CONFIG.BONUS_20_ITEMS}p / 30개↑: +${POINTS_CONFIG.BONUS_30_ITEMS}p
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
    </div>
  </div>
`;

const isTuesday = () => new Date().getDay() === 2;
// ============================================
// 메인 함수
// ============================================
const main = () => {
  // ============================================
  // 앱 상태 초기화
  // ============================================
  AppState.initialize();

  // ============================================
  // 상품 데이터 정의
  // ============================================
  const productList = [
    {
      id: PRODUCT_1,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  // 상품 데이터를 상태에 저장
  AppState.setProductList(productList);

  // ============================================
  // DOM 요소 생성 및 설정
  // ============================================
  const root = document.getElementById('app');

  // 랜더
  const htmlContent = `
    ${Header()}
    ${GridContainer()}
    ${ManualToggle()}
    ${ManualOverlay()}
  `;
  // 실제로 DOM에 추가
  root.innerHTML = htmlContent;

  // ============================================
  // 초기 이벤트 리스너 설정
  // ============================================
  setupEventListeners();

  // ============================================
  // 초기화 및 이벤트 설정
  // ============================================
  // 초기 UI 업데이트
  handleUpdateSelectOptions();
  handleCalculateCart();

  // ============================================
  // 자동 할인 시스템 설정
  // ============================================
  // 번개세일 타이머
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * AppState.productList.length);
      const luckyItem = AppState.productList[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        const lightningDiscountRate =
          DISCOUNT_RATES.LIGHTNING_SALE / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        luckyItem.val = Math.round(luckyItem.originalVal * (1 - lightningDiscountRate));
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE}% 할인 중입니다!`,
        );
        handleUpdateSelectOptions();
        handleUpdatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  // 추천 할인 타이머
  setTimeout(() => {
    setInterval(() => {
      const cartDisplay = document.getElementById('cart-items');
      if (cartDisplay.children.length === 0) {
        // 카트가 비어있을 때 처리
      }
      if (AppState.lastSelector) {
        let suggest = null;
        for (let k = 0; k < AppState.productList.length; k++) {
          if (AppState.productList[k].id !== AppState.lastSelector) {
            if (AppState.productList[k].quantity > 0) {
              if (!AppState.productList[k].suggestSale) {
                suggest = AppState.productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.RECOMMENDATION}% 추가 할인!`,
          );
          const recommendationDiscountRate =
            DISCOUNT_RATES.RECOMMENDATION / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
          suggest.val = Math.round(suggest.val * (1 - recommendationDiscountRate));
          suggest.suggestSale = true;
          handleUpdateSelectOptions();
          handleUpdatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY);
};

// 전역 변수 sum은 AppState.sum으로 대체됨

// ============================================
// UI 업데이트 함수들
// ============================================
// 원본 함수명: onUpdateSelectOptions
const handleUpdateSelectOptions = () => {
  // 상태 기반으로 셀렉터 옵션 생성
  let totalStock = 0;
  let options = '';

  // 총 재고 계산
  for (let idx = 0; idx < AppState.productList.length; idx++) {
    const _p = AppState.productList[idx];
    totalStock = totalStock + _p.quantity;
  }

  // 각 상품별 옵션 생성
  for (let i = 0; i < AppState.productList.length; i++) {
    const item = AppState.productList[i];
    let discountText = '';

    // 할인 상태에 따른 텍스트 설정
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    // 품절 여부에 따른 옵션 설정
    if (item.quantity === 0) {
      options += `<option value="${item.id}" disabled class="text-gray-400">${item.name} - ${item.val}원 (품절)${discountText}</option>`;
    } else {
      // 할인 상태에 따른 가격 표시
      if (item.onSale && item.suggestSale) {
        options += `<option value="${item.id}" class="text-purple-600 font-bold">⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)</option>`;
      } else if (item.onSale) {
        options += `<option value="${item.id}" class="text-red-500 font-bold">⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)</option>`;
      } else if (item.suggestSale) {
        options += `<option value="${item.id}" class="text-blue-500 font-bold">💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)</option>`;
      } else {
        options += `<option value="${item.id}">${item.name} - ${item.val}원${discountText}</option>`;
      }
    }
  }

  // 셀렉터 컨테이너를 다시 렌더링
  const selectorContainer = document.querySelector('.mb-6.pb-6.border-b.border-gray-200');
  if (selectorContainer) {
    selectorContainer.innerHTML = `
      <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3 ${totalStock < 50 ? 'border-orange-500' : ''}" data-handler="selectChange">
        ${options}
      </select>
      <button 
        id="add-to-cart" 
        class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        data-handler="addToCart"
      >
        Add to Cart
      </button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">${AppState.stockInfo || ''}</div>
    `;
  }
};

// ============================================
// 카트 계산 및 UI 업데이트 함수
// ============================================
// 원본 함수명: handleCalculateCartStuff
const handleCalculateCart = () => {
  // ============================================
  // 초기화
  // ============================================
  AppState.setTotalAmount(0);
  AppState.setItemCount(0);
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // ============================================
  // 재고 부족 상품 확인
  // ============================================
  for (let idx = 0; idx < AppState.productList.length; idx++) {
    if (AppState.productList[idx].quantity < 5 && AppState.productList[idx].quantity > 0) {
      lowStockItems.push(AppState.productList[idx].name);
    }
  }

  // ============================================
  // 카트 아이템별 계산
  // ============================================
  for (let i = 0; i < AppState.cartItems.length; i++) {
    (() => {
      const cartItem = AppState.cartItems[i];

      // 상품 정보 찾기
      let curItem;
      for (let j = 0; j < AppState.productList.length; j++) {
        if (AppState.productList[j].id === cartItem.productId) {
          curItem = AppState.productList[j];
          break;
        }
      }

      // 수량 및 가격 계산
      const q = cartItem.quantity;
      const itemTot = curItem.val * q;
      let disc = 0;
      AppState.setItemCount(AppState.itemCount + q);
      subTot += itemTot;

      // ============================================
      // UI 스타일 업데이트 (상태 기반으로 처리됨)
      // ============================================

      // ============================================
      // 개별 상품 할인 계산
      // ============================================
      if (q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        if (curItem.id === PRODUCT_IDS.KEYBOARD) {
          disc = DISCOUNT_RATES.KEYBOARD / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        } else if (curItem.id === PRODUCT_IDS.MOUSE) {
          disc = DISCOUNT_RATES.MOUSE / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        } else if (curItem.id === PRODUCT_IDS.MONITOR_ARM) {
          disc = DISCOUNT_RATES.MONITOR_ARM / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        } else if (curItem.id === PRODUCT_IDS.LAPTOP_POUCH) {
          disc = DISCOUNT_RATES.LAPTOP_POUCH / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        } else if (curItem.id === PRODUCT_IDS.SPEAKER) {
          disc = DISCOUNT_RATES.SPEAKER / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
        }
        if (disc > 0) {
          itemDiscounts.push({
            name: curItem.name,
            discount: disc * CALCULATION_CONFIG.PERCENTAGE_DIVISOR,
          });
        }
      }
      AppState.setTotalAmount(AppState.totalAmount + itemTot * (1 - disc));
    })();
  }

  // ============================================
  // 전체 할인 계산
  // ============================================
  let discRate = 0;
  const originalTotal = subTot;

  // 대량구매 할인 (30개 이상)
  if (AppState.itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    const bulkDiscountRate = DISCOUNT_RATES.BULK_PURCHASE / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
    AppState.setTotalAmount(subTot * (1 - bulkDiscountRate));
    discRate = bulkDiscountRate;
  } else {
    discRate = (subTot - AppState.totalAmount) / subTot;
  }

  // ============================================
  // 화요일 특별 할인
  // ============================================
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday()) {
    if (AppState.totalAmount > 0) {
      const tuesdayDiscountRate = DISCOUNT_RATES.TUESDAY / CALCULATION_CONFIG.PERCENTAGE_DIVISOR;
      AppState.setTotalAmount(AppState.totalAmount * (1 - tuesdayDiscountRate));
      discRate = 1 - AppState.totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ============================================
  // 상태 업데이트 (UI는 renderApp에서 처리)
  // ============================================
  handleUpdateStockInfo();
  handleRenderBonusPoints();
};

// ============================================
// 포인트 렌더링 함수
// ============================================
// 원본 함수명: doRenderBonusPoints
const handleRenderBonusPoints = () => {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let bonusPts = 0;

  if (AppState.cartItems.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // ============================================
  // 기본 포인트 계산
  // ============================================
  const basePoints = Math.floor(AppState.totalAmount / CALCULATION_CONFIG.POINTS_DIVISOR);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // ============================================
  // 화요일 2배 포인트
  // ============================================
  if (isTuesday()) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }

  // ============================================
  // 상품 조합 보너스 포인트
  // ============================================
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;

  for (const cartItem of AppState.cartItems) {
    let product = null;
    for (let pIdx = 0; pIdx < AppState.productList.length; pIdx++) {
      if (AppState.productList[pIdx].id === cartItem.productId) {
        product = AppState.productList[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push(`키보드+마우스 세트 +${POINTS_CONFIG.KEYBOARD_MOUSE_BONUS}p`);
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINTS_CONFIG.FULL_SET_BONUS;
    pointsDetail.push(`풀세트 구매 +${POINTS_CONFIG.FULL_SET_BONUS}p`);
  }

  // ============================================
  // 대량구매 보너스 포인트
  // ============================================
  if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_30) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_30_ITEMS;
    pointsDetail.push(`대량구매(30개+) +${POINTS_CONFIG.BONUS_30_ITEMS}p`);
  } else if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_20_ITEMS;
    pointsDetail.push(`대량구매(20개+) +${POINTS_CONFIG.BONUS_20_ITEMS}p`);
  } else if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_10_ITEMS;
    pointsDetail.push(`대량구매(10개+) +${POINTS_CONFIG.BONUS_10_ITEMS}p`);
  }

  // ============================================
  // 포인트 UI 업데이트
  // ============================================
  bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

// ============================================
// 유틸리티 함수들
// ============================================
// 원본 함수명: onGetStockTotal
const handleGetStockTotal = () => {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < AppState.productList.length; i++) {
    currentProduct = AppState.productList[i];
    sum += currentProduct.quantity;
  }
  return sum;
};

// 원본 함수명: handleStockInfoUpdate
const handleUpdateStockInfo = () => {
  let infoMsg = '';
  const totalStock = handleGetStockTotal();

  AppState.productList.forEach((item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  AppState.setStockInfo(infoMsg);
};

// 원본 함수명: doUpdatePricesInCart
const handleUpdatePricesInCart = () => {
  // 상태 기반으로 UI 다시 렌더링
  renderApp();
};

// ============================================
// 이벤트 핸들러 함수들 (React 변환 시 onClick으로 변경)
// ============================================

// 카트에 상품 추가 핸들러
const handleAddToCart = () => {
  // 현재 선택된 상품 ID (상태에서 가져오기)
  const selItem = AppState.lastSelector;
  if (!selItem) return;

  // 추가할 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < AppState.productList.length; j++) {
    if (AppState.productList[j].id === selItem) {
      itemToAdd = AppState.productList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.quantity > 0) {
    // 상태 기반으로 카트 아이템 추가
    AppState.addCartItem(itemToAdd.id, 1);
    itemToAdd.quantity--;

    // UI 다시 렌더링
    renderApp();
  }
};

// 수량 변경 핸들러
const handleQuantityChange = (productId, change) => {
  let prod = null;

  // 상품 정보 찾기
  for (let prdIdx = 0; prdIdx < AppState.productList.length; prdIdx++) {
    if (AppState.productList[prdIdx].id === productId) {
      prod = AppState.productList[prdIdx];
      break;
    }
  }

  if (!prod) return;

  // 현재 카트 수량 확인
  const currentQty = AppState.getCartItemQuantity(productId);
  const newQty = currentQty + change;

  if (newQty > 0 && newQty <= prod.quantity + currentQty) {
    // 수량 변경
    AppState.updateCartItemQuantity(productId, newQty);
    prod.quantity -= change;
  } else if (newQty <= 0) {
    // 아이템 제거
    prod.quantity += currentQty;
    AppState.removeCartItem(productId);
  } else {
    alert('재고가 부족합니다.');
    return;
  }

  // UI 다시 렌더링
  renderApp();

  handleCalculateCart();
  handleUpdateSelectOptions();
  handleUpdateStockInfo();
};

// 아이템 삭제 핸들러
const handleRemoveItem = (productId) => {
  let prod = null;

  // 상품 정보 찾기
  for (let prdIdx = 0; prdIdx < AppState.productList.length; prdIdx++) {
    if (AppState.productList[prdIdx].id === productId) {
      prod = AppState.productList[prdIdx];
      break;
    }
  }

  if (!prod) return;

  // 현재 카트 수량 확인
  const currentQty = AppState.getCartItemQuantity(productId);

  // 재고 복구
  prod.quantity += currentQty;

  // 카트에서 제거
  AppState.removeCartItem(productId);

  // UI 다시 렌더링
  renderApp();

  handleCalculateCart();
  handleUpdateSelectOptions();
  handleUpdateStockInfo();
};

// ============================================
// 이벤트 위임 핸들러 (중앙 집중식 이벤트 관리)
// ============================================
const handleEventDelegation = (event) => {
  const { target } = event;
  const { handler } = target.dataset;

  switch (handler) {
    case 'addToCart':
      handleAddToCart();
      break;
    case 'selectChange':
      AppState.setLastSelector(target.value);
      break;
    case 'quantityChange':
      const { productId, change } = target.dataset;
      handleQuantityChange(productId, parseInt(change));
      break;
    case 'removeItem':
      const { productId: removeProductId } = target.dataset;
      handleRemoveItem(removeProductId);
      break;
  }
};

// ============================================
// UI 렌더링 함수 (React 변환용)
// ============================================
const renderApp = () => {
  const root = document.getElementById('app');
  if (!root) return;

  const htmlContent = `
    ${Header()}
    ${GridContainer()}
    ${ManualToggle()}
    ${ManualOverlay()}
  `;
  root.innerHTML = htmlContent;

  // 이벤트 리스너 다시 설정
  setupEventListeners();

  // 초기화 함수들 호출
  handleUpdateSelectOptions();
  handleCalculateCart();
};

// ============================================
// 이벤트 리스너 설정 함수
// ============================================
const setupEventListeners = () => {
  // 수동 안내 이벤트 리스너 설정
  const manualToggle = document.getElementById('manual-toggle');
  const manualOverlay = document.getElementById('manual-overlay');
  const manualColumn = document.getElementById('manual-column');

  if (manualToggle && manualOverlay && manualColumn) {
    manualToggle.addEventListener('click', () => {
      manualOverlay.classList.toggle('hidden');
      manualColumn.classList.toggle('translate-x-full');
    });

    manualOverlay.addEventListener('click', (e) => {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      }
    });

    const manualClose = document.getElementById('manual-close');
    if (manualClose) {
      manualClose.addEventListener('click', () => {
        manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      });
    }
  }
};

// ============================================
// 앱 초기화 및 이벤트 설정
// ============================================
main();

document.addEventListener('click', handleEventDelegation);

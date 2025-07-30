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

  // DOM 참조 (나중에 React로 전환 시 제거)
  cartDisplay: null,
  stockInfo: null,
  productSelect: null,
  addBtn: null,
  sum: null,

  // 상태 초기화 함수
  initialize() {
    this.productList = [];
    this.lastSelector = null;
    this.totalAmount = 0;
    this.itemCount = 0;
    this.cartDisplay = null;
    this.stockInfo = null;
    this.productSelect = null;
    this.addBtn = null;
    this.sum = null;
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

  setDOMReferences(refs) {
    this.cartDisplay = refs.cartDisplay;
    this.stockInfo = refs.stockInfo;
    this.productSelect = refs.productSelect;
    this.addBtn = refs.addBtn;
    this.sum = refs.sum;
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

const GridContainer = () => `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    <!-- 왼쪽 컬럼 (상품 선택 + 카트) -->
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      <!-- 셀렉터 컨테이너 -->
      <div class="mb-6 pb-6 border-b border-gray-200">
        <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
        </select>
        <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
          Add to Cart
        </button>
        <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
      </div>
      
      <!-- 카트 표시 영역 -->
      <div id="cart-items"></div>
    </div>

    <!-- 오른쪽 컬럼 (주문 요약) -->
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
  // DOM 요소 참조 설정
  // ============================================
  const productSelect = document.getElementById('product-select');
  const addBtn = document.getElementById('add-to-cart');
  const stockInfo = document.getElementById('stock-status');
  const cartDisplay = document.getElementById('cart-items');
  const sum = document.getElementById('cart-total');

  // DOM 참조를 상태에 저장
  AppState.setDOMReferences({
    productSelect,
    addBtn,
    stockInfo,
    cartDisplay,
    sum,
  });
  const manualToggle = document.getElementById('manual-toggle');
  const manualOverlay = document.getElementById('manual-overlay');
  const manualColumn = document.getElementById('manual-column');

  // ============================================
  // 수동 안내 이벤트 리스너 설정
  // ============================================
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

  document.getElementById('manual-close').addEventListener('click', () => {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  });

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
      if (AppState.cartDisplay.children.length === 0) {
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
  // 상품 셀렉터 옵션 업데이트
  let totalStock;
  let option;
  let discountText;

  AppState.productSelect.innerHTML = '';
  totalStock = 0;

  // 총 재고 계산
  for (let idx = 0; idx < AppState.productList.length; idx++) {
    const _p = AppState.productList[idx];
    totalStock = totalStock + _p.quantity;
  }

  // 각 상품별 옵션 생성
  for (let i = 0; i < AppState.productList.length; i++) {
    (() => {
      const item = AppState.productList[i];
      option = document.createElement('option');
      option.value = item.id;
      discountText = '';

      // 할인 상태에 따른 텍스트 설정
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      // 품절 여부에 따른 옵션 설정
      if (item.quantity === 0) {
        option.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        // 할인 상태에 따른 가격 표시
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
      AppState.productSelect.appendChild(option);
    })();
  }

  // 재고 부족 시 셀렉터 스타일 변경
  if (totalStock < 50) {
    AppState.productSelect.style.borderColor = 'orange';
  } else {
    AppState.productSelect.style.borderColor = '';
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
  const cartItems = AppState.cartDisplay.children;
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
  for (let i = 0; i < cartItems.length; i++) {
    (() => {
      // 상품 정보 찾기
      let curItem;
      for (let j = 0; j < AppState.productList.length; j++) {
        if (AppState.productList[j].id === cartItems[i].id) {
          curItem = AppState.productList[j];
          break;
        }
      }

      // 수량 및 가격 계산
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      let disc = 0;
      AppState.setItemCount(AppState.itemCount + q);
      subTot += itemTot;

      // ============================================
      // UI 스타일 업데이트
      // ============================================
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach((elem) => {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });

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
  // UI 업데이트
  // ============================================
  // 아이템 카운트 업데이트
  document.getElementById('item-count').textContent = `🛍️ ${AppState.itemCount} items in cart`;

  // 요약 상세 정보 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 각 아이템별 요약 정보
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < AppState.productList.length; j++) {
        if (AppState.productList[j].id === cartItems[i].id) {
          curItem = AppState.productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (AppState.itemCount >= 30) {
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

    // 화요일 할인 표시
    if (isTuesday()) {
      if (AppState.totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }

    // 배송비 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // ============================================
  // 총액 및 포인트 업데이트
  // ============================================
  const totalDiv = AppState.sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(AppState.totalAmount).toLocaleString()}`;
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(AppState.totalAmount / CALCULATION_CONFIG.POINTS_DIVISOR);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // ============================================
  // 할인 정보 표시
  // ============================================
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && AppState.totalAmount > 0) {
    const savedAmount = originalTotal - AppState.totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // ============================================
  // 아이템 카운트 업데이트
  // ============================================
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${AppState.itemCount} items in cart`;
    if (previousCount !== AppState.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

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

  if (AppState.cartDisplay.children.length === 0) {
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
  const nodes = AppState.cartDisplay.children;

  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < AppState.productList.length; pIdx++) {
      if (AppState.productList[pIdx].id === node.id) {
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
  let infoMsg;
  const totalStock = handleGetStockTotal();
  const stockInfo = document.getElementById('stock-status');
  infoMsg = '';
  if (totalStock < 30) {
  }
  AppState.productList.forEach((item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg = `${infoMsg}${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg}${item.name}: 품절\n`;
      }
    }
  });
  stockInfo.textContent = infoMsg;
};

// 원본 함수명: doUpdatePricesInCart
const handleUpdatePricesInCart = () => {
  // ============================================
  // 카트 아이템 가격 업데이트
  // ============================================
  const cartItems = AppState.cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < AppState.productList.length; productIdx++) {
      if (AppState.productList[productIdx].id === itemId) {
        product = AppState.productList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 표시
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-purple-600">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-red-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-blue-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCart();
};

// ============================================
// 이벤트 리스너 설정
// ============================================
main();

// ============================================
// 카트 추가 버튼 이벤트
// ============================================
AppState.addBtn.addEventListener('click', () => {
  const selItem = AppState.productSelect.value;
  let hasItem = false;

  // 선택된 상품 유효성 검사
  for (let idx = 0; idx < AppState.productList.length; idx++) {
    if (AppState.productList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }

  // 추가할 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < AppState.productList.length; j++) {
    if (AppState.productList[j].id === selItem) {
      itemToAdd = AppState.productList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.quantity) {
        itemToAdd.quantity--;
        qtyElem.textContent = newQty;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 생성
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      AppState.cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    handleCalculateCart();
    AppState.setLastSelector(selItem);
  }
});

// ============================================
// 카트 아이템 이벤트 (수량 변경, 삭제)
// ============================================
AppState.cartDisplay.addEventListener('click', (event) => {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 찾기
    for (let prdIdx = 0; prdIdx < AppState.productList.length; prdIdx++) {
      if (AppState.productList[prdIdx].id === prodId) {
        prod = AppState.productList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // 아이템 삭제 처리
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }

    if (prod && prod.quantity < 5) {
      let infoMsg = '';
      // 모든 상품을 순회하여 재고 부족/품절 상품 표시
      for (let i = 0; i < AppState.productList.length; i++) {
        const item = AppState.productList[i];
        if (item.quantity < 5) {
          if (item.quantity > 0) {
            infoMsg = `${infoMsg}${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
          } else {
            infoMsg = `${infoMsg}${item.name}: 품절\n`;
          }
        }
      }
      AppState.stockInfo.textContent = infoMsg;
    }
    handleCalculateCart();
    handleUpdateSelectOptions();
  }
});

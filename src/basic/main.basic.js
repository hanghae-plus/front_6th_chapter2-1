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

// ============================================
// 🗃️ 전역 상태 관리
// ============================================

// 애플리케이션 상태 관리 객체
const AppState = {
  // ============================================
  // 📦 데이터 상태
  // ============================================

  // 상품 목록 데이터
  productList: [],

  // 카트 아이템 데이터 (React 변환용)
  cartItems: [],

  // ============================================
  // 🎨 UI 상태
  // ============================================

  // 선택 관련 상태
  lastSelector: null,
  selectedProductId: null,

  // 계산 결과 상태
  totalAmount: 0,
  itemCount: 0,

  // 정보 표시 상태
  stockInfo: '',

  // 모달 상태
  isManualOpen: false,

  // ============================================
  // 🔧 상태 초기화
  // ============================================

  initialize() {
    this.productList = [
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
        name: '코딩할 때 듣는 Lo-Fi 스피커',
        val: 25000,
        originalVal: 25000,
        quantity: 10,
        onSale: false,
        suggestSale: false,
      },
    ];

    // UI 상태 초기화
    this.lastSelector = null;
    this.selectedProductId = null;
    this.totalAmount = 0;
    this.itemCount = 0;
    this.cartItems = [];
    this.stockInfo = '';
    this.isManualOpen = false;
  },

  // ============================================
  // 📝 상태 업데이트 메서드
  // ============================================

  // 상품 목록 업데이트
  setProductList(products) {
    this.productList = products;
  },

  // 선택 상태 업데이트
  setLastSelector(selector) {
    this.lastSelector = selector;
  },

  setSelectedProductId(productId) {
    this.selectedProductId = productId;
  },

  // 계산 결과 업데이트
  setTotalAmount(amount) {
    this.totalAmount = amount;
  },

  setItemCount(count) {
    this.itemCount = count;
  },

  // 정보 표시 업데이트
  setStockInfo(info) {
    this.stockInfo = info;
  },

  // ============================================
  // 🛒 카트 아이템 관리
  // ============================================

  // 카트에 상품 추가
  addCartItem(productId, quantity = 1) {
    const existingItem = this.cartItems.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ productId, quantity });
    }
  },

  // 카트 아이템 수량 업데이트
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

  // 카트에서 상품 제거
  removeCartItem(productId) {
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
  },

  // 카트 아이템 수량 조회
  getCartItemQuantity(productId) {
    const item = this.cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  },

  // ============================================
  // 🔍 상태 조회 메서드
  // ============================================

  // 상품 조회
  getProduct(productId) {
    return this.productList.find((product) => product.id === productId);
  },

  // 카트 아이템 조회
  getCartItem(productId) {
    return this.cartItems.find((item) => item.productId === productId);
  },

  // 총 재고 수량 조회
  getTotalStock() {
    return this.productList.reduce((sum, product) => sum + product.quantity, 0);
  },

  // 카트가 비어있는지 확인
  isCartEmpty() {
    return this.cartItems.length === 0;
  },

  // 특정 상품이 카트에 있는지 확인
  hasProductInCart(productId) {
    return this.cartItems.some((item) => item.productId === productId);
  },
};

// ============================================
// 🎨 UI 컴포넌트
// ============================================

// 헤더 컴포넌트
const Header = ({ itemCount }) => {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
    </div>
  `;
};

// 셀렉터 컨테이너 (상품 선택 영역)
const SelectorContainer = ({ totalStock, stockInfo, productList, selectedProductId }) => {
  // 재고 상태에 따른 테두리 색상 결정 (상태 기반)
  const borderColorClass = totalStock < 50 ? 'border-orange-500' : 'border-gray-300';

  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border ${borderColorClass} rounded-lg text-base mb-3">
        ${generateSelectOptions({ productList, selectedProductId })}
      </select>
      <button 
        id="add-to-cart" 
        class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">${stockInfo || ''}</div>
    </div>
  `;
};

// React 변환용: 셀렉터 옵션 생성 함수
const generateSelectOptions = ({ productList, selectedProductId }) => {
  let totalStock = 0;
  let options = '';

  // 총 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.quantity;
  }

  // 각 상품별 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    let discountText = '';

    // 할인 상태에 따른 텍스트 설정
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    // 선택 상태 확인
    const isSelected = selectedProductId === item.id ? 'selected' : '';

    // 품절 여부에 따른 옵션 설정
    if (item.quantity === 0) {
      options += `<option value="${item.id}" disabled class="text-gray-400" ${isSelected}>${item.name} - ${item.val}원 (품절)${discountText}</option>`;
    } else {
      // 할인 상태에 따른 가격 표시
      if (item.onSale && item.suggestSale) {
        options += `<option value="${item.id}" class="text-purple-600 font-bold" ${isSelected}>⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)</option>`;
      } else if (item.onSale) {
        options += `<option value="${item.id}" class="text-red-500 font-bold" ${isSelected}>⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)</option>`;
      } else if (item.suggestSale) {
        options += `<option value="${item.id}" class="text-blue-500 font-bold" ${isSelected}>💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)</option>`;
      } else {
        options += `<option value="${item.id}" ${isSelected}>${item.name} - ${item.val}원${discountText}</option>`;
      }
    }
  }

  return options;
};

// 카트 아이템 렌더링 함수
const renderCartItems = ({ cartItems, productList }) => {
  if (cartItems.length === 0) {
    return ''; // 빈 장바구니일 때는 빈 문자열 반환 (테스트 호환성)
  }

  const result = cartItems
    .map((cartItem) => {
      const product = productList.find((p) => p.id === cartItem.productId);
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
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${cartItem.quantity}</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
        </div>
      </div>
    `;
    })
    .join('');

  return result;
};

// 좌측 컬럼 (상품 선택 + 장바구니)
const LeftColumn = ({ totalStock, stockInfo, productList, selectedProductId, cartItems }) => {
  return `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${SelectorContainer({ totalStock, stockInfo, productList, selectedProductId })}
      <div id="cart-items">
        ${renderCartItems({ cartItems, productList })}
      </div>
    </div>
  `;
};

// 우측 컬럼 (주문 요약)
const RightColumn = ({ totalAmount }) => {
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
              <div class="text-2xl tracking-tight">₩${totalAmount.toLocaleString()}</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right" style="display: none;">적립 포인트: 0p</div>
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
};

// 그리드 컨테이너
const GridContainer = ({
  totalStock,
  stockInfo,
  productList,
  selectedProductId,
  cartItems,
  totalAmount,
}) => {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftColumn({ totalStock, stockInfo, productList, selectedProductId, cartItems })}
      ${RightColumn({ totalAmount })}
    </div>
  `;
};

// 수동 안내 토글 버튼
const ManualToggle = () => {
  return `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
};

// 수동 안내 오버레이
const ManualOverlay = ({ isOpen }) => {
  return `
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 ${isOpen ? '' : 'hidden'} transition-opacity duration-300">
      <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform ${isOpen ? '' : 'translate-x-full'} transition-transform duration-300">
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
      </div>
    </div>
  `;
};

// ============================================
// 🔧 유틸리티 함수
// ============================================

// 화요일 체크
const isTuesday = () => {
  return new Date().getDay() === CALCULATION_CONFIG.TUESDAY_DAY_OF_WEEK;
};

// ============================================
// 🏪 비즈니스 로직 서비스
// ============================================

// 셀렉터 옵션 업데이트
const handleUpdateSelectOptions = () => {
  renderApp();
};

// ============================================
// 🧮 계산 서비스
// ============================================

// 개별 상품 할인율 계산
const calculateIndividualDiscount = (productId, quantity) => {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) return 0;

  switch (productId) {
    case PRODUCT_IDS.KEYBOARD:
      return DISCOUNT_RATES.KEYBOARD / 100;
    case PRODUCT_IDS.MOUSE:
      return DISCOUNT_RATES.MOUSE / 100;
    case PRODUCT_IDS.MONITOR_ARM:
      return DISCOUNT_RATES.MONITOR_ARM / 100;
    case PRODUCT_IDS.LAPTOP_POUCH:
      return DISCOUNT_RATES.LAPTOP_POUCH / 100;
    case PRODUCT_IDS.SPEAKER:
      return DISCOUNT_RATES.SPEAKER / 100;
    default:
      return 0;
  }
};

// 전체 수량 할인율 계산
const calculateBulkDiscount = (itemCount) => {
  return itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE ? DISCOUNT_RATES.BULK_PURCHASE / 100 : 0;
};

// 화요일 할인율 계산
const calculateTuesdayDiscount = () => {
  return isTuesday() ? DISCOUNT_RATES.TUESDAY / 100 : 0;
};

// 카트 계산
const handleCalculateCart = () => {
  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;

  // 카트 아이템 계산
  AppState.cartItems.forEach((cartItem) => {
    const product = AppState.productList.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const { quantity } = cartItem;
    const itemTotal = product.val * quantity;
    const individualDiscount = calculateIndividualDiscount(product.id, quantity);

    itemCount += quantity;
    subtotal += itemTotal;
    totalAmount += itemTotal * (1 - individualDiscount);
  });

  // 전체 수량 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCount);
  const originalTotal = subtotal;

  if (bulkDiscount > 0) {
    totalAmount = subtotal * (1 - bulkDiscount);
  }

  // 화요일 할인 적용
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0 && totalAmount > 0) {
    totalAmount = totalAmount * (1 - tuesdayDiscount);
  }

  // 할인율 계산
  const discountRate = originalTotal > 0 ? (originalTotal - totalAmount) / originalTotal : 0;

  // 상태 업데이트
  AppState.setTotalAmount(totalAmount);
  AppState.setItemCount(itemCount);

  // UI 업데이트
  updateUI({
    totalAmount,
    itemCount,
    discountRate,
    originalTotal,
  });

  // 포인트 계산
  handleRenderBonusPoints();
};

// ============================================
// 🎨 UI 업데이트 서비스
// ============================================

// UI 업데이트
const updateUI = () => {
  handleUpdateStockInfo();
};

// ============================================
// 🎁 포인트 서비스
// ============================================

// 기본 포인트 계산
const calculateBasePoints = (totalAmount) => {
  return Math.floor(totalAmount / POINTS_CONFIG.POINTS_DIVISOR);
};

// 화요일 포인트 배수 적용
const calculateTuesdayPoints = (basePoints) => {
  return isTuesday() && basePoints > 0 ? basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER : basePoints;
};

// 세트 보너스 포인트 계산
const calculateSetBonusPoints = (cartItems) => {
  let bonusPoints = 0;
  const hasKeyboard = cartItems.some((item) => item.productId === PRODUCT_IDS.KEYBOARD);
  const hasMouse = cartItems.some((item) => item.productId === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = cartItems.some((item) => item.productId === PRODUCT_IDS.MONITOR_ARM);

  if (hasKeyboard && hasMouse) {
    bonusPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonusPoints += POINTS_CONFIG.FULL_SET_BONUS;
  }

  return bonusPoints;
};

// 수량별 보너스 포인트 계산
const calculateQuantityBonusPoints = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_30) {
    return POINTS_CONFIG.BONUS_30_ITEMS;
  } else if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    return POINTS_CONFIG.BONUS_20_ITEMS;
  } else if (itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    return POINTS_CONFIG.BONUS_10_ITEMS;
  }
  return 0;
};

// 포인트 상세 정보 생성
const generatePointsDetail = (basePoints, tuesdayPoints, setBonus, quantityBonus) => {
  const details = [];

  if (basePoints > 0) {
    details.push(`기본: ${basePoints}p`);
  }

  if (tuesdayPoints > basePoints) {
    details.push('화요일 2배');
  }

  if (setBonus > 0) {
    if (setBonus >= POINTS_CONFIG.FULL_SET_BONUS) {
      details.push('풀세트 구매 +100p');
    } else {
      details.push('키보드+마우스 세트 +50p');
    }
  }

  if (quantityBonus > 0) {
    if (quantityBonus >= POINTS_CONFIG.BONUS_30_ITEMS) {
      details.push('대량구매(30개+) +100p');
    } else if (quantityBonus >= POINTS_CONFIG.BONUS_20_ITEMS) {
      details.push('대량구매(20개+) +50p');
    } else {
      details.push('대량구매(10개+) +20p');
    }
  }

  return details;
};

// 포인트 렌더링
const handleRenderBonusPoints = () => {
  if (AppState.cartItems.length === 0) {
    return;
  }

  const basePoints = calculateBasePoints(AppState.totalAmount);
  const tuesdayPoints = calculateTuesdayPoints(basePoints);
  const setBonus = calculateSetBonusPoints(AppState.cartItems);
  const quantityBonus = calculateQuantityBonusPoints(AppState.itemCount);
};

// ============================================
// 📦 재고 서비스
// ============================================

// 재고 정보 생성
const generateStockInfo = (productList) => {
  let infoMsg = '';

  productList.forEach((item) => {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  return infoMsg;
};

// 재고 정보 업데이트
const handleUpdateStockInfo = () => {
  const stockInfo = generateStockInfo(AppState.productList);
  AppState.setStockInfo(stockInfo);
};

// ============================================
// ⏰ 타이머 서비스
// ============================================

// 번개세일 적용
const applyLightningSale = () => {
  const luckyIdx = Math.floor(Math.random() * AppState.productList.length);
  const luckyItem = AppState.productList[luckyIdx];

  if (luckyItem.quantity > 0 && !luckyItem.onSale) {
    luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
    luckyItem.onSale = true;
    alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    renderApp();
  }
};

// 추천할인 적용
const applyRecommendationSale = () => {
  if (AppState.cartItems.length === 0 || !AppState.lastSelector) return;

  const suggest = AppState.productList.find(
    (product) =>
      product.id !== AppState.lastSelector && product.quantity > 0 && !product.suggestSale,
  );

  if (suggest) {
    alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    suggest.val = Math.round((suggest.val * 95) / 100);
    suggest.suggestSale = true;
    renderApp();
  }
};

// 타이머 설정
const setupTimers = () => {
  // 번개세일 타이머
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(applyLightningSale, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  // 추천할인 타이머
  setTimeout(() => {
    setInterval(applyRecommendationSale, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY);
};

// ============================================
// 🎯 이벤트 핸들러 (React 스타일 - 전역 함수로 노출)
// ============================================

// ============================================
// 🎯 전역 이벤트 핸들러 (HTML onclick 호환용)
// ============================================

// 카트에 상품 추가 핸들러
window.handleAddToCart = function () {
  const selectElement = document.getElementById('product-select');
  const selItem = selectElement ? selectElement.value : null;

  if (!selItem) return;

  const itemToAdd = AppState.productList.find((product) => product.id === selItem);
  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  AppState.addCartItem(itemToAdd.id, 1);
  itemToAdd.quantity--;
  renderApp();
};

// 수량 변경 핸들러
window.handleQuantityChange = function (productId, change) {
  const product = AppState.productList.find((p) => p.id === productId);
  if (!product) return;

  const currentQuantity = AppState.getCartItemQuantity(productId);
  const newQuantity = currentQuantity + change;

  if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
    AppState.updateCartItemQuantity(productId, newQuantity);
    product.quantity -= change;
  } else if (newQuantity <= 0) {
    product.quantity += currentQuantity;
    AppState.removeCartItem(productId);
  } else {
    alert('재고가 부족합니다.');
    return;
  }

  renderApp();
};

// 상품 제거 핸들러
window.handleRemoveItem = function (productId) {
  const product = AppState.productList.find((p) => p.id === productId);
  if (!product) return;

  const currentQuantity = AppState.getCartItemQuantity(productId);
  product.quantity += currentQuantity;
  AppState.removeCartItem(productId);
  renderApp();
};

// ============================================
// 🎯 이벤트 핸들러 서비스
// ============================================

// 카트 관련 이벤트 핸들러
const handleCartEvents = (target) => {
  // Add to Cart 버튼 클릭
  if (target.id === 'add-to-cart' || target.closest('#add-to-cart')) {
    window.handleAddToCart();
    return true;
  }

  // 수량 변경 버튼
  if (target.classList.contains('quantity-change')) {
    const { productId } = target.dataset;
    const change = parseInt(target.dataset.change);
    window.handleQuantityChange(productId, change);
    return true;
  }

  // 상품 제거 버튼
  if (target.classList.contains('remove-item')) {
    const { productId } = target.dataset;
    window.handleRemoveItem(productId);
    return true;
  }

  return false;
};

// 상품 선택 이벤트 핸들러
const handleProductSelectionEvents = (target) => {
  if (target.id === 'product-select') {
    AppState.setLastSelector(target.value);
    AppState.setSelectedProductId(target.value);
    return true;
  }
  return false;
};

// 모달 관련 이벤트 핸들러
const handleModalEvents = (target) => {
  // 모달 토글 버튼
  if (target.id === 'manual-toggle' || target.closest('#manual-toggle')) {
    AppState.isManualOpen = !AppState.isManualOpen;
    renderApp();
    return true;
  }

  // 모달 배경 클릭
  if (target.id === 'manual-overlay') {
    AppState.isManualOpen = false;
    renderApp();
    return true;
  }

  // 모달 닫기 버튼
  if (target.id === 'manual-close' || target.closest('#manual-close')) {
    AppState.isManualOpen = false;
    renderApp();
    return true;
  }

  return false;
};

// 이벤트 위임 핸들러
const handleEventDelegation = (event) => {
  const { target } = event;

  // 카트 관련 이벤트 처리
  if (handleCartEvents(target)) return;

  // 상품 선택 이벤트 처리
  if (handleProductSelectionEvents(target)) return;

  // 모달 관련 이벤트 처리
  if (handleModalEvents(target)) return;
};

// 앱 렌더링
const renderApp = () => {
  const root = document.getElementById('app');
  if (!root) return;

  const htmlContent = `
    ${Header({ itemCount: AppState.itemCount })}
    ${GridContainer({
      totalStock: AppState.getTotalStock(),
      stockInfo: AppState.stockInfo,
      productList: AppState.productList,
      selectedProductId: AppState.selectedProductId,
      cartItems: AppState.cartItems,
      totalAmount: AppState.totalAmount,
    })}
    ${ManualToggle()}
    ${ManualOverlay({ isOpen: AppState.isManualOpen })}
  `;
  root.innerHTML = htmlContent;

  // 카트 아이템 렌더링
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = renderCartItems({
      cartItems: AppState.cartItems,
      productList: AppState.productList,
    });
  }

  // 계산 및 상태 업데이트
  handleCalculateCart();
};

// ============================================
// 🚀 메인 함수
// ============================================

const main = () => {
  // 상태 초기화
  AppState.initialize();

  // DOM 요소 생성
  const root = document.getElementById('app');
  if (!root) return;

  const htmlContent = `
    ${Header({ itemCount: AppState.itemCount })}
    ${GridContainer({
      totalStock: AppState.getTotalStock(),
      stockInfo: AppState.stockInfo,
      productList: AppState.productList,
      selectedProductId: AppState.selectedProductId,
      cartItems: AppState.cartItems,
      totalAmount: AppState.totalAmount,
    })}
    ${ManualToggle()}
    ${ManualOverlay({ isOpen: AppState.isManualOpen })}
  `;
  root.innerHTML = htmlContent;

  // 초기 계산
  handleCalculateCart();
  handleUpdateSelectOptions();

  // 타이머 설정 (번개세일, 추천할인)
  setupTimers();

  // 전역 이벤트 리스너 설정
  document.addEventListener('click', handleEventDelegation);
  document.addEventListener('change', handleEventDelegation);
};

// ============================================
// 🎬 앱 시작
// ============================================

main();

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
const Header = () => {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${AppState.itemCount} items in cart</p>
    </div>
  `;
};

// 셀렉터 컨테이너 (상품 선택 영역)
const SelectorContainer = () => {
  // 재고 상태에 따른 테두리 색상 결정 (상태 기반)
  const totalStock = AppState.getTotalStock();
  const borderColorClass = totalStock < 50 ? 'border-orange-500' : 'border-gray-300';

  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border ${borderColorClass} rounded-lg text-base mb-3">
        ${generateSelectOptions()}
      </select>
      <button 
        id="add-to-cart" 
        class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onclick="handleAddToCart()"
      >
        Add to Cart
      </button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">${AppState.stockInfo || ''}</div>
    </div>
  `;
};

// React 변환용: 셀렉터 옵션 생성 함수
const generateSelectOptions = () => {
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

    // 선택 상태 확인
    const isSelected = AppState.selectedProductId === item.id ? 'selected' : '';

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
const renderCartItems = () => {
  if (AppState.cartItems.length === 0) {
    return ''; // 빈 장바구니일 때는 빈 문자열 반환 (테스트 호환성)
  }

  const result = AppState.cartItems
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
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1" onclick="handleQuantityChange('${product.id}', -1)">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${cartItem.quantity}</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1" onclick="handleQuantityChange('${product.id}', 1)">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}" onclick="handleRemoveItem('${product.id}')">Remove</a>
        </div>
      </div>
    `;
    })
    .join('');

  return result;
};

// 좌측 컬럼 (상품 선택 + 장바구니)
const LeftColumn = () => {
  return `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${SelectorContainer()}
      <div id="cart-items">
        ${renderCartItems()}
      </div>
    </div>
  `;
};

// 우측 컬럼 (주문 요약)
const RightColumn = () => {
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
              <div class="text-2xl tracking-tight">₩${AppState.totalAmount.toLocaleString()}</div>
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
const GridContainer = () => {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftColumn()}
      ${RightColumn()}
    </div>
  `;
};

// 수동 안내 토글 버튼
const ManualToggle = () => {
  return `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50" onclick="handleManualToggle()">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
};

// 수동 안내 오버레이
const ManualOverlay = () => {
  const isOpen = AppState.isManualOpen;
  return `
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 ${isOpen ? '' : 'hidden'} transition-opacity duration-300" onclick="handleModalBackgroundClick()">
      <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform ${isOpen ? '' : 'translate-x-full'} transition-transform duration-300">
        <button id="manual-close" class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="handleModalClose()">
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

// 셀렉터 옵션 업데이트 (React 변환용 - 전체 앱 다시 렌더링)
const handleUpdateSelectOptions = () => {
  // DOM 직접 조작 대신 전체 앱 다시 렌더링
  renderApp();
};

// 카트 계산
const handleCalculateCart = () => {
  let totalAmount = 0;
  let itemCount = 0;
  let subtotal = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 재고 부족 상품 체크
  AppState.productList.forEach((product) => {
    if (product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK && product.quantity > 0) {
      lowStockItems.push(product.name);
    }
  });

  // 카트 아이템 계산
  AppState.cartItems.forEach((cartItem) => {
    const product = AppState.productList.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const { quantity } = cartItem;
    const itemTotal = product.val * quantity;
    let discount = 0;

    itemCount += quantity;
    subtotal += itemTotal;

    // 개별 상품 할인 적용
    if (quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
      switch (product.id) {
        case PRODUCT_IDS.KEYBOARD:
          discount = DISCOUNT_RATES.KEYBOARD / 100;
          break;
        case PRODUCT_IDS.MOUSE:
          discount = DISCOUNT_RATES.MOUSE / 100;
          break;
        case PRODUCT_IDS.MONITOR_ARM:
          discount = DISCOUNT_RATES.MONITOR_ARM / 100;
          break;
        case PRODUCT_IDS.LAPTOP_POUCH:
          discount = DISCOUNT_RATES.LAPTOP_POUCH / 100;
          break;
        case PRODUCT_IDS.SPEAKER:
          discount = DISCOUNT_RATES.SPEAKER / 100;
          break;
      }

      if (discount > 0) {
        itemDiscounts.push({ name: product.name, discount: discount * 100 });
      }
    }

    totalAmount += itemTotal * (1 - discount);
  });

  // 전체 수량 할인 적용
  let discountRate = 0;
  const originalTotal = subtotal;

  if (itemCount >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmount = subtotal * (1 - DISCOUNT_RATES.BULK_PURCHASE / 100);
    discountRate = DISCOUNT_RATES.BULK_PURCHASE / 100;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }

  // 화요일 할인 적용
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday()) {
    if (totalAmount > 0) {
      totalAmount = totalAmount * (1 - DISCOUNT_RATES.TUESDAY / 100);
      discountRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

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

// UI 업데이트
const updateUI = ({ totalAmount, itemCount, discountRate, originalTotal }) => {
  // 총액 표시 업데이트
  const totalDiv = document.querySelector('#cart-total .text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  // 아이템 수 표시 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }

  // 할인 정보 표시 업데이트
  const discountInfoDiv = document.getElementById('discount-info');
  if (discountInfoDiv && discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else if (discountInfoDiv) {
    discountInfoDiv.innerHTML = '';
  }

  // 재고 정보 업데이트
  handleUpdateStockInfo();
};

// 포인트 렌더링
const handleRenderBonusPoints = () => {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  if (AppState.cartItems.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  const basePoints = Math.floor(AppState.totalAmount / POINTS_CONFIG.POINTS_DIVISOR);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 포인트 배수
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }

  // 세트 보너스 체크
  const hasKeyboard = AppState.cartItems.some((item) => item.productId === PRODUCT_IDS.KEYBOARD);
  const hasMouse = AppState.cartItems.some((item) => item.productId === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = AppState.cartItems.some(
    (item) => item.productId === PRODUCT_IDS.MONITOR_ARM,
  );

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS_CONFIG.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 수량별 보너스
  if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_30) {
    finalPoints += POINTS_CONFIG.BONUS_30_ITEMS;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    finalPoints += POINTS_CONFIG.BONUS_20_ITEMS;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (AppState.itemCount >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    finalPoints += POINTS_CONFIG.BONUS_10_ITEMS;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  // 포인트 표시
  if (finalPoints > 0) {
    loyaltyPointsDiv.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
};

// 재고 총합 계산
const handleGetStockTotal = () => {
  return AppState.productList.reduce((sum, product) => sum + product.quantity, 0);
};

// 재고 정보 업데이트
const handleUpdateStockInfo = () => {
  let infoMsg = '';

  AppState.productList.forEach((item) => {
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  AppState.setStockInfo(infoMsg);

  const stockInfoElement = document.getElementById('stock-status');
  if (stockInfoElement) {
    stockInfoElement.textContent = infoMsg;
  }
};

// 카트 내 가격 업데이트
const handleUpdatePricesInCart = () => {
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = renderCartItems();
  }
  handleCalculateCart();
};

// 타이머 설정
const setupTimers = () => {
  // 번개세일 타이머
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * AppState.productList.length);
      const luckyItem = AppState.productList[luckyIdx];

      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        handleUpdateSelectOptions();
        handleUpdatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  // 추천할인 타이머
  setTimeout(() => {
    setInterval(() => {
      if (AppState.cartItems.length === 0) return;

      if (AppState.lastSelector) {
        const suggest = AppState.productList.find(
          (product) =>
            product.id !== AppState.lastSelector && product.quantity > 0 && !product.suggestSale,
        );

        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round((suggest.val * 95) / 100);
          suggest.suggestSale = true;
          handleUpdateSelectOptions();
          handleUpdatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY);
};

// ============================================
// 🎯 이벤트 핸들러 (React 스타일 - 전역 함수로 노출)
// ============================================

// 카트에 상품 추가 핸들러 (React 스타일)
window.handleAddToCart = function () {
  // DOM에서 현재 선택된 상품 ID 가져오기
  const selectElement = document.getElementById('product-select');
  const selItem = selectElement ? selectElement.value : null;

  if (!selItem) return;

  // 추가할 상품 찾기
  const itemToAdd = AppState.productList.find((product) => product.id === selItem);
  if (!itemToAdd || itemToAdd.quantity <= 0) return;

  // 상태 기반으로 카트 아이템 추가
  AppState.addCartItem(itemToAdd.id, 1);
  itemToAdd.quantity--;

  // UI 업데이트: 전체 렌더링 (상태 기반)
  renderApp();
};

// 수량 변경 핸들러 (React 스타일)
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

  // UI 업데이트: 전체 렌더링 (상태 기반)
  renderApp();
};

// 상품 제거 핸들러 (React 스타일)
window.handleRemoveItem = function (productId) {
  const product = AppState.productList.find((p) => p.id === productId);
  if (!product) return;

  const currentQuantity = AppState.getCartItemQuantity(productId);
  product.quantity += currentQuantity;

  // 카트에서 제거
  AppState.removeCartItem(productId);

  // UI 업데이트: 전체 렌더링 (상태 기반)
  renderApp();
};

// 수동 안내 토글 핸들러 (React 스타일)
window.handleManualToggle = function () {
  AppState.isManualOpen = !AppState.isManualOpen;
  renderApp();
};

// 모달 배경 클릭 핸들러 (React 스타일)
window.handleModalBackgroundClick = function () {
  AppState.isManualOpen = false;
  renderApp();
};

// 모달 닫기 버튼 핸들러 (React 스타일)
window.handleModalClose = function () {
  AppState.isManualOpen = false;
  renderApp();
};

// 이벤트 위임 핸들러
const handleEventDelegation = (event) => {
  const { target } = event;

  // Add to Cart 버튼 클릭 (테스트 호환성을 위해 여러 방법으로 체크)
  if (target.id === 'add-to-cart' || target.closest('#add-to-cart')) {
    handleAddToCart();
    return;
  }

  // 상품 선택 변경
  if (target.id === 'product-select') {
    AppState.setLastSelector(target.value);
    AppState.setSelectedProductId(target.value);
    return;
  }

  // 수량 변경 버튼
  if (target.classList.contains('quantity-change')) {
    const { productId } = target.dataset;
    const change = parseInt(target.dataset.change);
    handleQuantityChange(productId, change);
    return;
  }

  // 상품 제거 버튼
  if (target.classList.contains('remove-item')) {
    const { productId } = target.dataset;
    handleRemoveItem(productId);
    return;
  }
};

// 앱 렌더링
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

  // 카트 아이템 렌더링
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = renderCartItems();
  }

  // 계산 및 상태 업데이트
  handleCalculateCart();
};

// 이벤트 리스너 설정
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
// 🚀 메인 함수
// ============================================

const main = () => {
  // 상태 초기화
  AppState.initialize();

  // DOM 요소 생성
  const root = document.getElementById('app');
  if (!root) return;

  const htmlContent = `
    ${Header()}
    ${GridContainer()}
    ${ManualToggle()}
    ${ManualOverlay()}
  `;
  root.innerHTML = htmlContent;

  // 이벤트 리스너 설정
  setupEventListeners();

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

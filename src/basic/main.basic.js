// 상품 상수 정의
const PRODUCTS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_CASE: 'p4',
  SPEAKER: 'p5',
};

// 할인 정책 상수 정의
const DISCOUNT_POLICIES = {
  BULK_PURCHASE: { threshold: 30, rate: 0.25 },
  INDIVIDUAL: {
    [PRODUCTS.KEYBOARD]: { threshold: 10, rate: 0.1 },
    [PRODUCTS.MOUSE]: { threshold: 10, rate: 0.15 },
    [PRODUCTS.MONITOR_ARM]: { threshold: 10, rate: 0.2 },
    [PRODUCTS.SPEAKER]: { threshold: 10, rate: 0.25 },
  },
  TUESDAY: { rate: 0.1 },
  LIGHTNING: { rate: 0.2 },
  SUGGESTION: { rate: 0.05 },
};

// 포인트 정책 상수 정의
const POINT_POLICIES = {
  BASE_RATE: 0.001, // 구매액의 0.1%
  TUESDAY_MULTIPLIER: 2,
  SET_BONUSES: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
  QUANTITY_BONUSES: {
    10: 20,
    20: 50,
    30: 100,
  },
};

// 재고 경고 임계값
const STOCK_THRESHOLDS = {
  LOW_STOCK: 5,
  TOTAL_LOW_STOCK: 50,
};

// 유틸리티 함수들
const utils = {
  // 금액 포맷팅
  formatPrice: (price) => `₩${price.toLocaleString()}`,

  // 날짜 관련
  isTuesday: () => new Date().getDay() === 2,

  // 배열 유틸리티
  findById: (array, id) => array.find((item) => item.id === id),
  findIndexById: (array, id) => array.findIndex((item) => item.id === id),

  // 수량 계산
  calculateTotalQuantity: (items) => items.reduce((total, item) => total + item.quantity, 0),

  // 할인율 계산
  calculateDiscountAmount: (originalPrice, discountRate) => originalPrice * discountRate,

  // 포인트 계산
  calculateBasePoints: (amount) => Math.floor(amount * POINT_POLICIES.BASE_RATE),
};

// 상태 관리 스토어 생성 함수
const createStore = (initialState) => {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  return { getState, setState, subscribe };
};

// 상품 상태 관리
const productStore = createStore({
  products: [
    {
      id: PRODUCTS.KEYBOARD,
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      stock: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.MOUSE,
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      stock: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.MONITOR_ARM,
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      stock: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.LAPTOP_CASE,
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      stock: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.SPEAKER,
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      price: 25000,
      originalPrice: 25000,
      stock: 10,
      onSale: false,
      suggestSale: false,
    },
  ],
});

// 장바구니 상태 관리
const cartStore = createStore({
  items: [],
  totalAmount: 0,
  itemCount: 0,
});

// 할인 상태 관리
const discountStore = createStore({
  appliedDiscounts: [],
  totalDiscountRate: 0,
});

// 상품 관련 함수들
const productActions = {
  // 상품 조회
  getProduct: (productId) => {
    const { products } = productStore.getState();
    return utils.findById(products, productId);
  },

  // 상품 목록 조회
  getAllProducts: () => {
    const { products } = productStore.getState();
    return products;
  },

  // 재고 업데이트
  updateStock: (productId, quantity) => {
    const { products } = productStore.getState();
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, stock: product.stock + quantity } : product
    );
    productStore.setState({ products: updatedProducts });
  },

  // 할인 적용
  applyDiscount: (productId, discountType) => {
    const { products } = productStore.getState();
    const updatedProducts = products.map((product) => {
      if (product.id !== productId) return product;

      let newPrice = product.price;
      let onSale = product.onSale;
      let suggestSale = product.suggestSale;

      switch (discountType) {
        case 'lightning':
          newPrice = Math.round(product.originalPrice * (1 - DISCOUNT_POLICIES.LIGHTNING.rate));
          onSale = true;
          break;
        case 'suggestion':
          newPrice = Math.round(product.originalPrice * (1 - DISCOUNT_POLICIES.SUGGESTION.rate));
          suggestSale = true;
          break;
      }

      return { ...product, price: newPrice, onSale, suggestSale };
    });

    productStore.setState({ products: updatedProducts });
  },

  // 할인 초기화
  resetDiscounts: () => {
    const { products } = productStore.getState();
    const updatedProducts = products.map((product) => ({
      ...product,
      price: product.originalPrice,
      onSale: false,
      suggestSale: false,
    }));
    productStore.setState({ products: updatedProducts });
  },
};

// 장바구니 관련 함수들
const cartActions = {
  // 장바구니 아이템 추가
  addItem: (productId, quantity = 1) => {
    const product = productActions.getProduct(productId);
    if (!product || product.stock < quantity) return false;

    const { items } = cartStore.getState();
    const existingItem = utils.findById(items, productId);

    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
      );
      cartStore.setState({ items: updatedItems });
    } else {
      cartStore.setState({
        items: [
          ...items,
          {
            productId,
            quantity,
            price: product.price,
            originalPrice: product.originalPrice,
          },
        ],
      });
    }

    productActions.updateStock(productId, -quantity);
    return true;
  },

  // 장바구니 아이템 수량 변경
  updateItemQuantity: (productId, quantity) => {
    const { items } = cartStore.getState();
    const item = utils.findById(items, productId);
    if (!item) return false;

    const quantityDiff = quantity - item.quantity;
    const product = productActions.getProduct(productId);

    if (product.stock < quantityDiff) return false;

    const updatedItems = items.map((item) => (item.productId === productId ? { ...item, quantity } : item));

    cartStore.setState({ items: updatedItems });
    productActions.updateStock(productId, -quantityDiff);
    return true;
  },

  // 장바구니 아이템 제거
  removeItem: (productId) => {
    const { items } = cartStore.getState();
    const item = utils.findById(items, productId);
    if (!item) return false;

    const updatedItems = items.filter((item) => item.productId !== productId);
    cartStore.setState({ items: updatedItems });

    productActions.updateStock(productId, item.quantity);
    return true;
  },

  // 장바구니 비우기
  clearCart: () => {
    const { items } = cartStore.getState();
    items.forEach((item) => {
      productActions.updateStock(item.productId, item.quantity);
    });
    cartStore.setState({ items: [] });
  },

  // 장바구니 상태 조회
  getCartState: () => cartStore.getState(),

  // 장바구니 구독
  subscribe: (listener) => cartStore.subscribe(listener),
};

// 할인 계산 함수들
const discountActions = {
  // 개별 상품 할인 계산
  calculateItemDiscount: (productId, quantity) => {
    const policy = DISCOUNT_POLICIES.INDIVIDUAL[productId];
    if (!policy || quantity < policy.threshold) return 0;
    return policy.rate;
  },

  // 대량구매 할인 계산
  calculateBulkDiscount: (totalQuantity) => {
    const { threshold, rate } = DISCOUNT_POLICIES.BULK_PURCHASE;
    return totalQuantity >= threshold ? rate : 0;
  },

  // 화요일 할인 계산
  calculateTuesdayDiscount: () => {
    return utils.isTuesday() ? DISCOUNT_POLICIES.TUESDAY.rate : 0;
  },

  // 총 할인율 계산
  calculateTotalDiscount: (cartItems) => {
    let totalDiscount = 0;
    const totalQuantity = utils.calculateTotalQuantity(cartItems);

    // 개별 상품 할인
    cartItems.forEach((item) => {
      const itemDiscount = discountActions.calculateItemDiscount(item.productId, item.quantity);
      totalDiscount += item.originalPrice * item.quantity * itemDiscount;
    });

    // 대량구매 할인
    const bulkDiscount = discountActions.calculateBulkDiscount(totalQuantity);
    if (bulkDiscount > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalDiscount += subtotal * bulkDiscount;
    }

    return totalDiscount;
  },
};

// 포인트 계산 함수들
const pointActions = {
  // 기본 포인트 계산
  calculateBasePoints: (amount) => {
    return utils.calculateBasePoints(amount);
  },

  // 화요일 보너스 포인트
  calculateTuesdayBonus: (basePoints) => {
    return utils.isTuesday() ? basePoints * POINT_POLICIES.TUESDAY_MULTIPLIER : basePoints;
  },

  // 세트 보너스 포인트
  calculateSetBonus: (cartItems) => {
    let bonus = 0;
    const productIds = cartItems.map((item) => item.productId);

    // 키보드+마우스 세트
    if (productIds.includes(PRODUCTS.KEYBOARD) && productIds.includes(PRODUCTS.MOUSE)) {
      bonus += POINT_POLICIES.SET_BONUSES.KEYBOARD_MOUSE;
    }

    // 풀세트 (키보드+마우스+모니터암)
    if (
      productIds.includes(PRODUCTS.KEYBOARD) &&
      productIds.includes(PRODUCTS.MOUSE) &&
      productIds.includes(PRODUCTS.MONITOR_ARM)
    ) {
      bonus += POINT_POLICIES.SET_BONUSES.FULL_SET;
    }

    return bonus;
  },

  // 수량 보너스 포인트
  calculateQuantityBonus: (totalQuantity) => {
    const bonuses = Object.keys(POINT_POLICIES.QUANTITY_BONUSES)
      .map(Number)
      .sort((a, b) => b - a);

    for (const threshold of bonuses) {
      if (totalQuantity >= threshold) {
        return POINT_POLICIES.QUANTITY_BONUSES[threshold];
      }
    }

    return 0;
  },

  // 총 포인트 계산
  calculateTotalPoints: (amount, cartItems) => {
    const basePoints = pointActions.calculateBasePoints(amount);
    const tuesdayPoints = pointActions.calculateTuesdayBonus(basePoints);
    const setBonus = pointActions.calculateSetBonus(cartItems);
    const totalQuantity = utils.calculateTotalQuantity(cartItems);
    const quantityBonus = pointActions.calculateQuantityBonus(totalQuantity);

    return tuesdayPoints + setBonus + quantityBonus;
  },
};

// ===== 기존 전역 변수들 (기능 유지를 위해 임시로 유지) =====
var prodList;
var bonusPts = 0;
var stockInfo;
var itemCnt;
var lastSel;
var sel;
var addBtn;
var totalAmt = 0;
var PRODUCT_ONE = 'p1';
var p2 = 'p2';
var product_3 = 'p3';
var p4 = 'p4';
var PRODUCT_5 = `p5`;
var cartDisp;
function main() {
  var root;
  var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  var lightningDelay;
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  prodList = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    { id: p2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false },
    {
      id: product_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
  var root = document.getElementById('app');
  header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  sel = document.createElement('select');
  sel.id = 'product-select';
  gridContainer = document.createElement('div');
  leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = document.createElement('div');
  leftColumn.appendChild(cartDisp);
  cartDisp.id = 'cart-items';
  rightColumn = document.createElement('div');
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
  sum = rightColumn.querySelector('#cart-total');
  manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  manualColumn = document.createElement('div');
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
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  var initStock = 0;
  for (var i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        var suggest = null;
        for (var k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== lastSel) {
            if (prodList[k].q > 0) {
              if (!prodList[k].suggestSale) {
                suggest = prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
var sum;
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  sel.innerHTML = '';
  totalStock = 0;
  for (var idx = 0; idx < prodList.length; idx++) {
    var _p = prodList[idx];
    totalStock = totalStock + _p.q;
  }
  for (var i = 0; i < prodList.length; i++) {
    (function () {
      var item = prodList[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      sel.appendChild(opt);
    })();
  }
  if (totalStock < STOCK_THRESHOLDS.TOTAL_LOW_STOCK) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}
function handleCalculateCartStuff() {
  var cartItems;
  var subTot;
  var itemDiscounts;
  var lowStockItems;
  var idx;
  var originalTotal;
  var bulkDisc;
  var itemDisc;
  var savedAmount;
  var summaryDetails;
  var totalDiv;
  var loyaltyPointsDiv;
  var points;
  var discountInfoDiv;
  var itemCountElement;
  var previousCount;
  var stockMsg;
  var pts;
  var hasP1;
  var hasP2;
  var loyaltyDiv;
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt;
  cartItems = cartDisp.children;
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < STOCK_THRESHOLDS.LOW_STOCK && prodList[idx].q > 0) {
      lowStockItems.push(prodList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q;
      var itemTot;
      var disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_ONE) {
          disc = DISCOUNT_POLICIES.INDIVIDUAL[PRODUCTS.KEYBOARD].rate;
        } else {
          if (curItem.id === p2) {
            disc = DISCOUNT_POLICIES.INDIVIDUAL[PRODUCTS.MOUSE].rate;
          } else {
            if (curItem.id === product_3) {
              disc = DISCOUNT_POLICIES.INDIVIDUAL[PRODUCTS.MONITOR_ARM].rate;
            } else {
              if (curItem.id === p4) {
                disc = 5 / 100; // LAPTOP_CASE는 정책에 없으므로 기존 값 유지
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = DISCOUNT_POLICIES.INDIVIDUAL[PRODUCTS.SPEAKER].rate;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  var originalTotal = subTot;
  if (itemCnt >= DISCOUNT_POLICIES.BULK_PURCHASE.threshold) {
    totalAmt = subTot * (1 - DISCOUNT_POLICIES.BULK_PURCHASE.rate);
    discRate = DISCOUNT_POLICIES.BULK_PURCHASE.rate;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  const today = new Date();
  var isTuesday = today.getDay() === 2;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * (1 - DISCOUNT_POLICIES.TUESDAY.rate);
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>${utils.formatPrice(itemTotal)}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${utils.formatPrice(subTot)}</span>
      </div>
    `;
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = utils.formatPrice(Math.round(totalAmt));
  }
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = utils.calculateBasePoints(totalAmt);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${utils.formatPrice(Math.round(savedAmount))} 할인되었습니다</div>
      </div>
    `;
  }
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  stockMsg = '';
  for (var stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    var item = prodList[stockIdx];
    if (item.q < STOCK_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = utils.calculateBasePoints(totalAmt);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (utils.isTuesday()) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_POLICIES.TUESDAY_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = null;
    for (var pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === node.id) {
        product = prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_POLICIES.SET_BONUSES.KEYBOARD_MOUSE;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_POLICIES.SET_BONUSES.FULL_SET;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= 30) {
    finalPoints = finalPoints + POINT_POLICIES.QUANTITY_BONUSES[30];
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + POINT_POLICIES.QUANTITY_BONUSES[20];
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + POINT_POLICIES.QUANTITY_BONUSES[10];
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
function onGetStockTotal() {
  var sum;
  var i;
  var currentProduct;
  sum = 0;
  for (i = 0; i < prodList.length; i++) {
    currentProduct = prodList[i];
    sum += currentProduct.q;
  }
  return sum;
}
var handleStockInfoUpdate = function () {
  var infoMsg;
  var totalStock;
  var messageOptimizer;
  infoMsg = '';
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
  }
  prodList.forEach(function (item) {
    if (item.q < STOCK_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  var totalCount = 0,
    j = 0;
  var cartItems;
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
  }
  cartItems = cartDisp.children;
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;
    for (var productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var hasItem = false;
  for (var idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  var itemToAdd = null;
  for (var j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd['id']);
    if (item) {
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
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
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});
cartDisp.addEventListener('click', function (event) {
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = null;
    for (var prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector('.quantity-number');
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var qtyElem = itemElem.querySelector('.quantity-number');
      var remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

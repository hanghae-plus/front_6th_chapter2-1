// 원본 코드 기반 리팩토링 - React 변환 준비

// ============================================
// 📦 상수 및 설정 (React 변환용)
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
  KEYBOARD: 10,
  MOUSE: 15,
  MONITOR_ARM: 20,
  LAPTOP_POUCH: 5,
  SPEAKER: 25,
  BULK_PURCHASE: 25,
  TUESDAY: 10,
  LIGHTNING_SALE: 20,
  RECOMMENDATION: 5,
};

// 수량 기준 상수
const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  LOW_STOCK: 5,
  POINTS_BONUS_10: 10,
  POINTS_BONUS_20: 20,
  POINTS_BONUS_30: 30,
};

// 포인트 관련 상수
const POINTS_CONFIG = {
  BASE_RATE: 0.1,
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BONUS_10_ITEMS: 20,
  BONUS_20_ITEMS: 50,
  BONUS_30_ITEMS: 100,
  POINTS_DIVISOR: 1000,
};

// 타이머 관련 상수
const TIMER_CONFIG = {
  LIGHTNING_SALE_DELAY: 10000,
  LIGHTNING_SALE_INTERVAL: 30000,
  RECOMMENDATION_DELAY: 20000,
  RECOMMENDATION_INTERVAL: 60000,
};

// ============================================
// 🗃️ 전역 상태 관리 (React 변환 준비)
// ============================================

// 앱 상태 객체
const AppState = {
  // 상품 데이터
  products: [],

  // 장바구니 상태
  cart: {
    items: [],
    totalAmount: 0,
    itemCount: 0,
    bonusPoints: 0,
  },

  // UI 상태
  ui: {
    lastSelectedProduct: null,
    stockInfo: null,
    selectElement: null,
    addButton: null,
    cartDisplay: null,
    totalElement: null,
  },

  // 초기화 메서드
  init() {
    this.products = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: '버그 없애는 키보드',
        val: 10000,
        originalVal: 10000,
        q: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: '생산성 폭발 마우스',
        val: 20000,
        originalVal: 20000,
        q: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: '거북목 탈출 모니터암',
        val: 30000,
        originalVal: 30000,
        q: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_POUCH,
        name: '에러 방지 노트북 파우치',
        val: 15000,
        originalVal: 15000,
        q: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: `코딩할 때 듣는 Lo-Fi 스피커`,
        val: 25000,
        originalVal: 25000,
        q: 10,
        onSale: false,
        suggestSale: false,
      },
    ];
  },

  // 상태 업데이트 메서드
  updateCart() {
    this.cart.items = Array.from(this.ui.cartDisplay?.children || []);
    this.cart.itemCount = this.cart.items.reduce((total, item) => {
      const qtyElem = item.querySelector('.quantity-number');
      return total + (qtyElem ? parseInt(qtyElem.textContent) : 0);
    }, 0);
  },

  // 상품 찾기 메서드
  findProduct(productId) {
    return this.products.find((p) => p.id === productId);
  },
};

// 기존 전역 변수들 (호환성 유지)
var prodList = AppState.products;
var bonusPts = AppState.cart.bonusPoints;
var stockInfo = AppState.ui.stockInfo;
var itemCnt = AppState.cart.itemCount;
var lastSel = AppState.ui.lastSelectedProduct;
var sel = AppState.ui.selectElement;
var addBtn = AppState.ui.addButton;
var totalAmt = AppState.cart.totalAmount;
var cartDisp = AppState.ui.cartDisplay;
var sum = AppState.ui.totalElement;

// ============================================
// 🔧 유틸리티 함수
// ============================================

// 화요일 체크
const isTuesday = () => new Date().getDay() === 2;

// ============================================
// 🏪 비즈니스 로직 서비스
// ============================================

// 셀렉터 옵션 업데이트 (원본 방식)
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
          opt.textContent =
            '⚡💝' +
            item.name +
            ' - ' +
            item.originalVal +
            '원 → ' +
            item.val +
            '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent =
            '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent =
            '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      sel.appendChild(opt);
    })();
  }

  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// 카트 계산 (함수 분리)
function handleCalculateCartStuff() {
  // 1. 초기화
  initializeCartCalculation();

  // 2. 장바구니 아이템 처리
  const { subTot, itemDiscounts } = processCartItems();

  // 3. 할인 계산
  const { discRate, originalTotal } = calculateDiscounts(subTot);

  // 4. 화요일 할인 적용
  const finalDiscRate = applyTuesdayDiscount(discRate, originalTotal);

  // 5. UI 업데이트
  updateCartUI(subTot, itemDiscounts, finalDiscRate, originalTotal);

  // 6. 재고 정보 업데이트
  updateStockInfo();

  // 7. 포인트 렌더링
  doRenderBonusPoints();
}

// 초기화 함수
function initializeCartCalculation() {
  totalAmt = 0;
  itemCnt = 0;
}

// 장바구니 아이템 처리 함수
function processCartItems() {
  const cartItems = cartDisp.children;
  let subTot = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(cartItems[i].id);
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.val * q;

    itemCnt += q;
    subTot += itemTot;

    updateItemPriceDisplay(cartItems[i], q);

    const discount = calculateItemDiscount(curItem, q);
    if (discount > 0) {
      itemDiscounts.push({ name: curItem.name, discount: discount * 100 });
    }

    totalAmt += itemTot * (1 - discount);
  }

  return { subTot, itemDiscounts };
}

// 상품 ID로 상품 찾기
function findProductById(productId) {
  return prodList.find((p) => p.id === productId);
}

// 아이템 가격 표시 업데이트
function updateItemPriceDisplay(itemDiv, quantity) {
  const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
  priceElems.forEach(function (elem) {
    if (elem.classList.contains('text-lg')) {
      elem.style.fontWeight =
        quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'bold' : 'normal';
    }
  });
}

// 개별 상품 할인 계산
function calculateItemDiscount(product, quantity) {
  if (quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) return 0;

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: DISCOUNT_RATES.KEYBOARD,
    [PRODUCT_IDS.MOUSE]: DISCOUNT_RATES.MOUSE,
    [PRODUCT_IDS.MONITOR_ARM]: DISCOUNT_RATES.MONITOR_ARM,
    [PRODUCT_IDS.LAPTOP_POUCH]: DISCOUNT_RATES.LAPTOP_POUCH,
    [PRODUCT_IDS.SPEAKER]: DISCOUNT_RATES.SPEAKER,
  };

  return (discountRates[product.id] || 0) / 100;
}

// 할인 계산 함수
function calculateDiscounts(subTot) {
  let discRate = 0;
  const originalTotal = subTot;

  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = (subTot * (100 - DISCOUNT_RATES.BULK_PURCHASE)) / 100;
    discRate = DISCOUNT_RATES.BULK_PURCHASE / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  return { discRate, originalTotal };
}

// 화요일 할인 적용 함수
function applyTuesdayDiscount(discRate, originalTotal) {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * (100 - DISCOUNT_RATES.TUESDAY)) / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  return discRate;
}

// 카트 UI 업데이트 함수
function updateCartUI(subTot, itemDiscounts, discRate, originalTotal) {
  updateItemCount();
  updateSummaryDetails(subTot, itemDiscounts);
  updateTotalDisplay();
  updateLoyaltyPoints();
  updateDiscountInfo(discRate, originalTotal);
}

// 아이템 카운트 업데이트
function updateItemCount() {
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';
}

// 요약 상세 업데이트
function updateSummaryDetails(subTot, itemDiscounts) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    renderCartItemsSummary(summaryDetails);
    renderSubtotal(summaryDetails, subTot);
    renderDiscounts(summaryDetails, itemDiscounts);
    renderShippingInfo(summaryDetails);
  }
}

// 장바구니 아이템 요약 렌더링
function renderCartItemsSummary(summaryDetails) {
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(cartItems[i].id);
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
}

// 소계 렌더링
function renderSubtotal(summaryDetails, subTot) {
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTot.toLocaleString()}</span>
    </div>
  `;
}

// 할인 정보 렌더링
function renderDiscounts(summaryDetails, itemDiscounts) {
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_PURCHASE}개 이상)</span>
        <span class="text-xs">-${DISCOUNT_RATES.BULK_PURCHASE}%</span>
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

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmt > 0) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${DISCOUNT_RATES.TUESDAY}%</span>
      </div>
    `;
  }
}

// 배송 정보 렌더링
function renderShippingInfo(summaryDetails) {
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// 총액 표시 업데이트
function updateTotalDisplay() {
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }
}

// 포인트 표시 업데이트
function updateLoyaltyPoints() {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmt / POINTS_CONFIG.POINTS_DIVISOR);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
}

// 할인 정보 업데이트
function updateDiscountInfo(discRate, originalTotal) {
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
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
}

// 재고 정보 업데이트
function updateStockInfo() {
  let stockMsg = '';
  for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    const item = prodList[stockIdx];
    if (item.q < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
}

// 포인트 렌더링 (원본 방식)
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

  basePoints = Math.floor(totalAmt / POINTS_CONFIG.POINTS_DIVISOR);
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
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

  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_30_ITEMS;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.POINTS_BONUS_20) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_20_ITEMS;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.POINTS_BONUS_10) {
    finalPoints = finalPoints + POINTS_CONFIG.BONUS_10_ITEMS;
    pointsDetail.push('대량구매(10개+) +20p');
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
    if (item.q < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
};

// 가격 업데이트 (원본 방식)
function doUpdatePricesInCart() {
  for (var i = 0; i < cartDisp.children.length; i++) {
    var cartItem = cartDisp.children[i];
    var productId = cartItem.id;
    var product = prodList.find((p) => p.id === productId);
    if (!product) continue;

    var priceDisplay = cartItem.querySelector('.text-lg');
    if (priceDisplay) {
      if (product.onSale || product.suggestSale) {
        priceDisplay.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="' +
          (product.onSale && product.suggestSale
            ? 'text-purple-600'
            : product.onSale
              ? 'text-red-500'
              : 'text-blue-500') +
          '">₩' +
          product.val.toLocaleString() +
          '</span>';
      } else {
        priceDisplay.textContent = '₩' + product.val.toLocaleString();
      }
    }
  }
}

// ============================================
// 🎯 이벤트 핸들러 (원본 방식)
// ============================================

// ============================================
// 🚀 메인 함수 (원본 방식)
// ============================================

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

  // AppState 초기화
  AppState.init();

  // 전역 변수들 AppState와 연결
  prodList = AppState.products;
  totalAmt = AppState.cart.totalAmount;
  itemCnt = AppState.cart.itemCount;
  lastSel = AppState.ui.lastSelectedProduct;

  root = document.getElementById('app');

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
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

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

  // AppState UI 요소들 연결
  AppState.ui.selectElement = sel;
  AppState.ui.addButton = addBtn;
  AppState.ui.stockInfo = stockInfo;
  AppState.ui.cartDisplay = cartDisp;

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
  `;

  sum = rightColumn.querySelector('#cart-total');

  // AppState totalElement 연결
  AppState.ui.totalElement = sum;

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

  // 이벤트 리스너 설정 (함수 분리)
  setupEventListeners();

  // 초기화
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 타이머 설정
  setupTimers();
}

// ============================================
// 🎯 이벤트 핸들러 (함수 분리)
// ============================================

// 이벤트 리스너 설정 함수
function setupEventListeners() {
  addBtn.addEventListener('click', handleAddToCart);
  cartDisp.addEventListener('click', handleCartEventDelegation);
  sel.addEventListener('change', handleProductSelection);
}

// 장바구니 추가 이벤트 핸들러
function handleAddToCart() {
  const selItem = sel.value;

  if (!isValidProductSelection(selItem)) {
    return;
  }

  const itemToAdd = findProductById(selItem);
  if (!itemToAdd || itemToAdd.q <= 0) {
    return;
  }

  const existingItem = document.getElementById(itemToAdd.id);
  if (existingItem) {
    handleExistingItemUpdate(existingItem, itemToAdd);
  } else {
    handleNewItemCreation(itemToAdd);
  }

  handleCalculateCartStuff();
  lastSel = selItem;
}

// 상품 선택 유효성 검사
function isValidProductSelection(selItem) {
  if (!selItem) return false;

  return prodList.some((product) => product.id === selItem);
}

// 기존 아이템 수량 업데이트
function handleExistingItemUpdate(item, product) {
  const qtyElem = item.querySelector('.quantity-number');
  const newQty = parseInt(qtyElem.textContent) + 1;

  if (newQty <= product.q + parseInt(qtyElem.textContent)) {
    qtyElem.textContent = newQty;
    product.q--;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 새 아이템 생성
function handleNewItemCreation(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  newItem.innerHTML = generateCartItemHTML(product);
  cartDisp.appendChild(newItem);
  product.q--;
}

// 장바구니 아이템 HTML 생성
function generateCartItemHTML(product) {
  const saleIcon = getSaleIcon(product);
  const priceDisplay = generatePriceDisplay(product);

  return `
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
}

// 할인 아이콘 생성
function getSaleIcon(product) {
  if (product.onSale && product.suggestSale) return '⚡💝';
  if (product.onSale) return '⚡';
  if (product.suggestSale) return '💝';
  return '';
}

// 가격 표시 생성
function generatePriceDisplay(product) {
  if (!product.onSale && !product.suggestSale) {
    return `₩${product.val.toLocaleString()}`;
  }

  const originalPrice = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>`;
  const salePrice = `<span class="${getSalePriceClass(product)}">₩${product.val.toLocaleString()}</span>`;

  return `${originalPrice} ${salePrice}`;
}

// 할인 가격 클래스 결정
function getSalePriceClass(product) {
  if (product.onSale && product.suggestSale) return 'text-purple-600';
  if (product.onSale) return 'text-red-500';
  if (product.suggestSale) return 'text-blue-500';
  return '';
}

// 장바구니 이벤트 위임 핸들러
function handleCartEventDelegation(event) {
  const target = event.target;

  if (target.classList.contains('quantity-change')) {
    handleQuantityChange(target);
  } else if (target.classList.contains('remove-item')) {
    handleItemRemoval(target);
  }
}

// 수량 변경 핸들러
function handleQuantityChange(target) {
  const prodId = target.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const product = findProductById(prodId);

  if (!product || !itemElem) return;

  const qtyChange = parseInt(target.dataset.change);
  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty + qtyChange;

  if (newQty > 0 && newQty <= product.q + currentQty) {
    qtyElem.textContent = newQty;
    product.q -= qtyChange;
  } else if (newQty <= 0) {
    product.q += currentQty;
    itemElem.remove();
  } else {
    alert('재고가 부족합니다.');
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

// 아이템 제거 핸들러
function handleItemRemoval(target) {
  const prodId = target.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const product = findProductById(prodId);

  if (!product || !itemElem) return;

  const qtyElem = itemElem.querySelector('.quantity-number');
  const removedQty = parseInt(qtyElem.textContent);

  product.q += removedQty;
  itemElem.remove();

  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

// 상품 선택 이벤트 핸들러
function handleProductSelection() {
  lastSel = sel.value;
}

// 타이머 설정 함수들
function setupTimers() {
  setupLightningSaleTimer();
  setupRecommendationTimer();
}

// 번개세일 타이머 설정
function setupLightningSaleTimer() {
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

// 추천할인 타이머 설정
function setupRecommendationTimer() {
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
        return;
      }
      if (lastSel) {
        const suggest = findRecommendationProduct();
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
  }, Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY);
}

// 추천 상품 찾기
function findRecommendationProduct() {
  for (let k = 0; k < prodList.length; k++) {
    if (prodList[k].id !== lastSel && prodList[k].q > 0 && !prodList[k].suggestSale) {
      return prodList[k];
    }
  }
  return null;
}

// ============================================
// 🎬 앱 시작
// ============================================

main();

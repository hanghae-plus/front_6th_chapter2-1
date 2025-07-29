

// AppState: 애플리케이션 전체 상태를 관리하는 객체
const AppState = {
  // 애플리케이션 상태
  products: [],
  bonusPoints: 0,
  itemCount: 0,
  lastSelection: null,
  totalAmount: 0,
  
  // DOM 요소 참조
  elements: {
    stockInfo: null,
    productSelect: null,
    addButton: null,
    cartDisplay: null,
    sum: null
  },
  
  // 상품 ID 상수
  PRODUCT_IDS: {
    KEYBOARD: 'p1',
    MOUSE: 'p2', 
    MONITOR_ARM: 'p3',
    LAPTOP_POUCH: 'p4',
    SPEAKER: 'p5'
  },
  
  // 비즈니스 로직 상수
  CONSTANTS: {
    // 할인 관련
    BULK_DISCOUNT_THRESHOLD: 10,
    BULK_QUANTITY_THRESHOLD: 30,
    BULK_QUANTITY_DISCOUNT_RATE: 0.25,
    TUESDAY_DISCOUNT_RATE: 0.10,
    
    // 개별 상품 할인율
    KEYBOARD_DISCOUNT: 0.10,
    MOUSE_DISCOUNT: 0.15,
    MONITOR_ARM_DISCOUNT: 0.20,
    LAPTOP_POUCH_DISCOUNT: 0.05,
    SPEAKER_DISCOUNT: 0.25,
    
    // 재고 관련
    LOW_STOCK_THRESHOLD: 5,
    STOCK_WARNING_THRESHOLD: 50,
    
    // 포인트 관련
    POINTS_RATE: 0.001, // 0.1%
    TUESDAY_POINTS_MULTIPLIER: 2,
    
    // UI 관련
    TUESDAY_DAY_OF_WEEK: 2
  }
};

// 상품 검색 유틸리티 함수들
function findProductById(productId) {
  for (var i = 0; i < AppState.products.length; i++) {
    if (AppState.products[i].id === productId) {
      return AppState.products[i];
    }
  }
  return null;
}

function findAvailableProductExcept(excludeId) {
  for (var i = 0; i < AppState.products.length; i++) {
    var product = AppState.products[i];
    if (product.id !== excludeId && product.q > 0 && !product.suggestSale) {
      return product;
    }
  }
  return null;
}

function calculateTotalStock() {
  var total = 0;
  for (var i = 0; i < AppState.products.length; i++) {
    total += AppState.products[i].q;
  }
  return total;
}

// 레거시 호환성을 위한 전역 변수들 (점진적 제거 예정)
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var sel
var addBtn
var totalAmt = 0
var cartDisp
function initializeApplication() {
  // AppState 초기화
  AppState.totalAmount = 0;
  AppState.itemCount = 0;
  AppState.lastSelection = null;
  
  // 레거시 변수 동기화
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
}

function initializeProductData() {
  // AppState에 상품 데이터 설정
  AppState.products = [
    {id: AppState.PRODUCT_IDS.KEYBOARD, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false},
    {id: AppState.PRODUCT_IDS.MOUSE, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false},
    {id: AppState.PRODUCT_IDS.MONITOR_ARM, name: "거북목 탈출 모니터암", val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false},
    {id: AppState.PRODUCT_IDS.LAPTOP_POUCH, name: "에러 방지 노트북 파우치", val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false},
    {id: AppState.PRODUCT_IDS.SPEAKER, name: `코딩할 때 듣는 Lo-Fi 스피커`, val: 25000, originalVal: 25000, q: 10, onSale: false, suggestSale: false}
  ];
  
  // 레거시 변수 동기화
  prodList = AppState.products;
}

function createDOMElements() {
  var root;
  var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;

  var root = document.getElementById('app')
  header = document.createElement('div');
  header.className = 'mb-8'
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  // DOM 요소 생성 및 AppState에 저장
  sel = document.createElement('select');
  AppState.elements.productSelect = sel;
  sel.id = 'product-select';
  gridContainer = document.createElement('div');
  leftColumn = document.createElement("div");
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto'
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addBtn = document.createElement('button');
  AppState.elements.addButton = addBtn;
  stockInfo = document.createElement('div');
  AppState.elements.stockInfo = stockInfo;
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className = 'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = document.createElement('div');
  AppState.elements.cartDisplay = cartDisp;
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
  AppState.elements.sum = sum;
  manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className = 'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
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
  manualColumn.className = 'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
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
}

function setupPromotionTimers() {
  var lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);
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
        var suggest = findAvailableProductExcept(lastSel);
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * (100 - 5) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function initializeUI() {
  var initStock = calculateTotalStock();
  onUpdateSelectOptions();
  handleCalculateCartStuff();
}

function main() {
  initializeApplication();
  initializeProductData();
  createDOMElements();
  setupPromotionTimers();
  initializeUI();
};
var sum
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  AppState.elements.productSelect.innerHTML = '';
  sel.innerHTML = ''; // 레거시 동기화
  
  totalStock = calculateTotalStock();
  for (var i = 0; i < AppState.products.length; i++) {
    (function() {
      var item = AppState.products[i];
      opt = document.createElement("option")
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText
        opt.disabled = true
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
      AppState.elements.productSelect.appendChild(opt);
      sel.appendChild(opt); // 레거시 동기화
    })();
  }
  if (totalStock < AppState.CONSTANTS.STOCK_WARNING_THRESHOLD) {
    AppState.elements.productSelect.style.borderColor = 'orange';
    sel.style.borderColor = 'orange'; // 레거시 동기화
  } else {
    AppState.elements.productSelect.style.borderColor = '';
    sel.style.borderColor = ''; // 레거시 동기화
  }
}
function calculateCartSubtotal() {
  var cartItems = AppState.elements.cartDisplay.children;
  var subTotal = 0;
  var itemDiscounts = [];
  
  // AppState 값 초기화
  AppState.totalAmount = 0;
  AppState.itemCount = 0;
  
  // 레거시 변수 동기화
  totalAmt = 0;
  itemCnt = 0;
  
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem = findProductById(cartItems[i].id);
      
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var quantity = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * quantity;
      var discount = 0;
      
      // AppState 업데이트
      AppState.itemCount += quantity;
      
      // 레거시 변수 동기화
      itemCnt += quantity;
      subTotal += itemTotal;
      
      // DOM 스타일 업데이트
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
      
      // 개별 할인 계산 (상수 사용)
      if (quantity >= AppState.CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
        if (curItem.id === AppState.PRODUCT_IDS.KEYBOARD) {
          discount = AppState.CONSTANTS.KEYBOARD_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.MOUSE) {
          discount = AppState.CONSTANTS.MOUSE_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.MONITOR_ARM) {
          discount = AppState.CONSTANTS.MONITOR_ARM_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.LAPTOP_POUCH) {
          discount = AppState.CONSTANTS.LAPTOP_POUCH_DISCOUNT;
        } else if (curItem.id === AppState.PRODUCT_IDS.SPEAKER) {
          discount = AppState.CONSTANTS.SPEAKER_DISCOUNT;
        }
        if (discount > 0) {
          itemDiscounts.push({name: curItem.name, discount: discount * 100});
        }
      }
      
      var finalItemTotal = itemTotal * (1 - discount);
      AppState.totalAmount += finalItemTotal;
      
      // 레거시 변수 동기화
      totalAmt += finalItemTotal;
    })();
  }
  
  return {
    subTotal: subTotal,
    itemDiscounts: itemDiscounts
  };
}

function calculateFinalDiscount(subTotal) {
  var discountRate = 0;
  var originalTotal = subTotal;
  
  // 대량구매 할인
  if (AppState.itemCount >= AppState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
    AppState.totalAmount = subTotal * (1 - AppState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE);
    totalAmt = AppState.totalAmount; // 레거시 동기화
    discountRate = AppState.CONSTANTS.BULK_QUANTITY_DISCOUNT_RATE;
  } else {
    discountRate = (subTotal - AppState.totalAmount) / subTotal;
  }
  
  // 화요일 할인
  const today = new Date();
  var isTuesday = today.getDay() === AppState.CONSTANTS.TUESDAY_DAY_OF_WEEK;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  
  if (isTuesday) {
    if (AppState.totalAmount > 0) {
      AppState.totalAmount = AppState.totalAmount * (1 - AppState.CONSTANTS.TUESDAY_DISCOUNT_RATE);
      totalAmt = AppState.totalAmount; // 레거시 동기화
      discountRate = 1 - (AppState.totalAmount / originalTotal);
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  
  return {
    discountRate: discountRate,
    originalTotal: originalTotal,
    isTuesday: isTuesday
  };
}

function updateCartUI(subTotal, itemDiscounts, discountInfo) {
  var cartItems = AppState.elements.cartDisplay.children;
  
  // 아이템 개수 업데이트 (AppState 사용)
  document.getElementById('item-count').textContent = '🛍️ ' + AppState.itemCount + ' items in cart';
  
  // 요약 정보 업데이트
  var summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  
  if (subTotal > 0) {
    // 개별 아이템 표시
    for (let i = 0; i < cartItems.length; i++) {
      var curItem = findProductById(cartItems[i].id);
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
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
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;
    
    // 할인 정보 표시
    if (AppState.itemCount >= AppState.CONSTANTS.BULK_QUANTITY_THRESHOLD) {
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
    
    // 화요일 할인 표시
    if (discountInfo.isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    
    // 배송 정보 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  
  // 총액 업데이트 (AppState 사용)
  var totalDiv = AppState.elements.sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(AppState.totalAmount).toLocaleString();
  }
  
  // 기본 포인트 표시 업데이트 (AppState 사용)
  var loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    var points = Math.floor(AppState.totalAmount * AppState.CONSTANTS.POINTS_RATE * 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  
  // 할인 정보 표시
  var discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  
  if (discountInfo.discountRate > 0 && AppState.totalAmount > 0) {
    var savedAmount = discountInfo.originalTotal - AppState.totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountInfo.discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  
  // 아이템 카운트 변경 표시 (AppState 사용)
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    var previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + AppState.itemCount + ' items in cart';
    if (previousCount !== AppState.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

function updateStockStatus() {
  var stockMsg = '';
  
  for (var stockIdx = 0; stockIdx < AppState.products.length; stockIdx++) {
    var item = AppState.products[stockIdx];
    if (item.q < AppState.CONSTANTS.LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  
  AppState.elements.stockInfo.textContent = stockMsg;
  
  // 레거시 변수 동기화
  stockInfo.textContent = stockMsg;
}

function handleCalculateCartStuff() {
  // 1. 장바구니 소계 및 개별 할인 계산
  var subtotalResult = calculateCartSubtotal();
  
  // 2. 전체 할인 계산 (대량구매, 화요일)
  var discountResult = calculateFinalDiscount(subtotalResult.subTotal);
  
  // 3. UI 업데이트
  updateCartUI(subtotalResult.subTotal, subtotalResult.itemDiscounts, discountResult);
  
  // 4. 재고 상태 업데이트
  updateStockStatus();
  
  // 5. 포인트 계산
  doRenderBonusPoints();
}
var doRenderBonusPoints = function() {
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
  basePoints = Math.floor(totalAmt / 1000)
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = findProductById(node.id);
    if (!product) continue;
    if (product.id === AppState.PRODUCT_IDS.KEYBOARD) {
      hasKeyboard = true;
    } else if (product.id === AppState.PRODUCT_IDS.MOUSE) {
      hasMouse = true;
    } else if (product.id === AppState.PRODUCT_IDS.MONITOR_ARM) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML = '<div>적립 포인트: <span class="font-bold">' + bonusPts + 'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' + pointsDetail.join(', ') + '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block'
    }
  }
}
function onGetStockTotal() {
  return calculateTotalStock();
}
function doUpdatePricesInCart() {
  var cartItems = cartDisp.children;
  
  // 장바구니의 각 아이템에 대해 가격과 이름 업데이트
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = findProductById(itemId);
    
    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');
      
      // 세일 상태에 따른 가격 및 이름 표시
      if (product.onSale && product.suggestSale) {
        // 번개세일 + 추천할인
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-purple-600">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 번개세일만
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-red-500">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천할인만
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-blue-500">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 일반 가격
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  
  // 전체 계산 업데이트
  handleCalculateCartStuff();
}
main();

// 장바구니 추가 버튼 이벤트 핸들러
addBtn.addEventListener("click", function () {
  var selItem = sel.value;
  var hasItem = findProductById(selItem) !== null;
  
  if (!selItem || !hasItem) {
    return;
  }
  
  var itemToAdd = findProductById(selItem);
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);
    
    if (item) {
      // 기존 아이템 수량 증가
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem.textContent) + 1;
      
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      
      var saleIcon = '';
      var priceClass = '';
      var priceHTML = '';
      
      if (itemToAdd.onSale && itemToAdd.suggestSale) {
        saleIcon = '⚡💝';
        priceClass = 'text-purple-600';
      } else if (itemToAdd.onSale) {
        saleIcon = '⚡';
        priceClass = 'text-red-500';
      } else if (itemToAdd.suggestSale) {
        saleIcon = '💝';
        priceClass = 'text-blue-500';
      }
      
      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        priceHTML = '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + priceClass + '">₩' + itemToAdd.val.toLocaleString() + '</span>';
      } else {
        priceHTML = '₩' + itemToAdd.val.toLocaleString();
      }
      
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${priceHTML}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
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

// 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러
cartDisp.addEventListener("click", function (event) {
  var target = event.target;
  
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    var productId = target.dataset.productId;
    var itemElement = document.getElementById(productId);
    var product = findProductById(productId);
    
    if (target.classList.contains('quantity-change')) {
      // 수량 변경 처리
      var quantityChange = parseInt(target.dataset.change);
      var quantityElement = itemElement.querySelector('.quantity-number');
      var currentQuantity = parseInt(quantityElement.textContent);
      var newQuantity = currentQuantity + quantityChange;
      
      if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
        quantityElement.textContent = newQuantity;
        product.q -= quantityChange;
      } else if (newQuantity <= 0) {
        // 수량이 0 이하가 되면 아이템 제거
        product.q += currentQuantity;
        itemElement.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 아이템 완전 제거
      var quantityElement = itemElement.querySelector('.quantity-number');
      var removeQuantity = parseInt(quantityElement.textContent);
      product.q += removeQuantity;
      itemElement.remove();
    }
    
    // UI 업데이트
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});
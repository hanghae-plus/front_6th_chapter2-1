// Constants
const PRODUCT_CONSTANTS = {
  PRODUCT_ONE: 'p1',
  PRODUCT_TWO: 'p2',
  PRODUCT_THREE: 'p3',
  PRODUCT_FOUR: 'p4',
  PRODUCT_FIVE: 'p5',
};

const DISCOUNT_RATES = {
  BULK_PURCHASE_THRESHOLD: 30,
  BULK_PURCHASE_DISCOUNT: 25,
  TUESDAY_DISCOUNT: 10,
  LIGHTNING_SALE_DISCOUNT: 20,
  RECOMMENDATION_DISCOUNT: 5,
  INDIVIDUAL_PRODUCT_DISCOUNTS: {
    [PRODUCT_CONSTANTS.PRODUCT_ONE]: 10,
    [PRODUCT_CONSTANTS.PRODUCT_TWO]: 15,
    [PRODUCT_CONSTANTS.PRODUCT_THREE]: 20,
    [PRODUCT_CONSTANTS.PRODUCT_FOUR]: 5,
    [PRODUCT_CONSTANTS.PRODUCT_FIVE]: 25,
  },
  INDIVIDUAL_DISCOUNT_THRESHOLD: 10,
};

const POINTS_CONFIG = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  KEYBOARD_MOUSE_BONUS: 50,
  FULL_SET_BONUS: 100,
  BULK_PURCHASE_BONUSES: {
    10: 20,
    20: 50,
    30: 100,
  },
};

const TIMING_CONFIG = {
  LIGHTNING_SALE_INTERVAL: 30000,
  LIGHTNING_SALE_DELAY: 10000,
  RECOMMENDATION_INTERVAL: 60000,
  RECOMMENDATION_DELAY: 20000,
};

const STOCK_WARNING_THRESHOLD = 5;
const LOW_STOCK_THRESHOLD = 50;

// Product data
const prodList = [
  {
    id: PRODUCT_CONSTANTS.PRODUCT_ONE,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_TWO,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_THREE,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_FOUR,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_CONSTANTS.PRODUCT_FIVE,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// Global state
let stockInfo;
let itemCnt;
let sel;
let totalAmt = 0;
let cartDisp;

// Utility functions
function findProductById(productId) {
  return prodList.find((product) => product.id === productId);
}

function getTotalStock() {
  return prodList.reduce((total, product) => total + product.q, 0);
}

function isTuesday() {
  return new Date().getDay() === 2;
}

function calculateIndividualDiscount(productId, quantity) {
  if (quantity < DISCOUNT_RATES.INDIVIDUAL_DISCOUNT_THRESHOLD) {
    return 0;
  }
  return DISCOUNT_RATES.INDIVIDUAL_PRODUCT_DISCOUNTS[productId] || 0;
}

function calculateBulkDiscount(totalQuantity) {
  if (totalQuantity >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    return DISCOUNT_RATES.BULK_PURCHASE_DISCOUNT;
  }
  return 0;
}

function calculateTuesdayDiscount(amount) {
  return isTuesday() ? DISCOUNT_RATES.TUESDAY_DISCOUNT : 0;
}

function getLowStockProducts() {
  return prodList.filter(
    (product) => product.q < STOCK_WARNING_THRESHOLD && product.q > 0
  );
}

function getOutOfStockProducts() {
  return prodList.filter((product) => product.q === 0);
}

function formatPrice(price) {
  return '₩' + price.toLocaleString();
}

function createProductOption(product) {
  const option = document.createElement('option');
  option.value = product.id;

  let discountText = '';
  if (product.onSale) discountText += ' ⚡SALE';
  if (product.suggestSale) discountText += ' 💝추천';

  if (product.q === 0) {
    option.textContent = `${product.name} - ${product.val}원 (품절)${discountText}`;
    option.disabled = true;
    option.className = 'text-gray-400';
  } else {
    if (product.onSale && product.suggestSale) {
      option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
      option.className = 'text-purple-600 font-bold';
    } else if (product.onSale) {
      option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
      option.className = 'text-red-500 font-bold';
    } else if (product.suggestSale) {
      option.textContent = `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
      option.className = 'text-blue-500 font-bold';
    } else {
      option.textContent = `${product.name} - ${product.val}원${discountText}`;
    }
  }

  return option;
}

function updateSelectOptions() {
  sel.innerHTML = '';
  const totalStock = getTotalStock();

  prodList.forEach((product) => {
    const option = createProductOption(product);
    sel.appendChild(option);
  });

  if (totalStock < LOW_STOCK_THRESHOLD) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

function updateStockInfo() {
  const lowStockItems = getLowStockProducts();
  const outOfStockItems = getOutOfStockProducts();

  let stockMessage = '';

  lowStockItems.forEach((item) => {
    stockMessage += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
  });

  outOfStockItems.forEach((item) => {
    stockMessage += `${item.name}: 품절\n`;
  });

  stockInfo.textContent = stockMessage;
}

function updatePricesInCart() {
  const cartItems = cartDisp.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemElement = cartItems[i];
    const product = findProductById(itemElement.id);

    if (product) {
      const priceDiv = itemElement.querySelector('.text-lg');
      const nameDiv = itemElement.querySelector('h3');

      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-purple-600">${formatPrice(product.val)}</span>`;
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-red-500">${formatPrice(product.val)}</span>`;
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">${formatPrice(product.originalVal)}</span> <span class="text-blue-500">${formatPrice(product.val)}</span>`;
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = formatPrice(product.val);
        nameDiv.textContent = product.name;
      }
    }
  }

  handleCalculateCartStuff();
}

function calculateLoyaltyPoints(totalAmount, totalQuantity, cartItems) {
  let basePoints = Math.floor(totalAmount * POINTS_CONFIG.BASE_RATE);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // Tuesday bonus
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * POINTS_CONFIG.TUESDAY_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }

  // Product combination bonuses
  const hasKeyboard = cartItems.some(
    (item) => item.id === PRODUCT_CONSTANTS.PRODUCT_ONE
  );
  const hasMouse = cartItems.some(
    (item) => item.id === PRODUCT_CONSTANTS.PRODUCT_TWO
  );
  const hasMonitorArm = cartItems.some(
    (item) => item.id === PRODUCT_CONSTANTS.PRODUCT_THREE
  );

  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS_CONFIG.KEYBOARD_MOUSE_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS_CONFIG.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // Bulk purchase bonuses
  const bulkBonus =
    POINTS_CONFIG.BULK_PURCHASE_BONUSES[30] ||
    POINTS_CONFIG.BULK_PURCHASE_BONUSES[20] ||
    POINTS_CONFIG.BULK_PURCHASE_BONUSES[10] ||
    0;

  if (totalQuantity >= 30) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[30];
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (totalQuantity >= 20) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[20];
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (totalQuantity >= 10) {
    finalPoints += POINTS_CONFIG.BULK_PURCHASE_BONUSES[10];
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return { finalPoints, pointsDetail };
}

function updateLoyaltyPointsDisplay(points, pointsDetail) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  if (cartDisp.children.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  if (points > 0) {
    loyaltyPointsDiv.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${points}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
}

function updateItemCountDisplay(count) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}

function updateSummaryDetails(cartItems, subtotal, itemDiscounts) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subtotal > 0) {
    // Add individual items
    Array.from(cartItems).forEach((itemElement) => {
      const product = findProductById(itemElement.id);
      const quantity = parseInt(
        itemElement.querySelector('.quantity-number').textContent
      );
      const itemTotal = product.val * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>${formatPrice(itemTotal)}</span>
        </div>
      `;
    });

    // Add subtotal
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
    `;

    // Add bulk discount
    if (itemCnt >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-${DISCOUNT_RATES.BULK_PURCHASE_DISCOUNT}%</span>
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

    // Add Tuesday discount
    if (isTuesday()) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT}%</span>
        </div>
      `;
    }

    // Add shipping
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

function updateDiscountInfo(discountRate, totalAmount, originalTotal) {
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
        <div class="text-2xs text-gray-300">${formatPrice(Math.round(savedAmount))} 할인되었습니다</div>
      </div>
    `;
  }
}

function updateTuesdaySpecialDisplay() {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday() && totalAmt > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

function main() {
  const rootElement = document.getElementById('app');
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;

  totalAmt = 0;
  itemCnt = 0;
  let lastSel = null;

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
  leftColumn['className'] =
    'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  const addBtn = document.createElement('button');
  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
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
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
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
  rootElement.appendChild(header);
  rootElement.appendChild(gridContainer);
  rootElement.appendChild(manualToggle);
  rootElement.appendChild(manualOverlay);
  var initStock = 0;
  for (var i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }
  updateSelectOptions();
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
        updateSelectOptions();
        updatePricesInCart();
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
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          updateSelectOptions();
          updatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
var sum;
function handleCalculateCartStuff() {
  totalAmt = 0;
  itemCnt = 0;

  const cartItems = cartDisp.children;
  let subtotal = 0;
  const itemDiscounts = [];

  // Calculate individual items and discounts
  for (let i = 0; i < cartItems.length; i++) {
    const itemElement = cartItems[i];
    const product = findProductById(itemElement.id);
    const quantity = parseInt(
      itemElement.querySelector('.quantity-number').textContent
    );
    const itemTotal = product.val * quantity;

    itemCnt += quantity;
    subtotal += itemTotal;

    // Update visual styling for bulk items
    const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
    priceElements.forEach((elem) => {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight =
          quantity >= DISCOUNT_RATES.INDIVIDUAL_DISCOUNT_THRESHOLD
            ? 'bold'
            : 'normal';
      }
    });

    // Calculate individual product discounts
    const individualDiscount = calculateIndividualDiscount(
      product.id,
      quantity
    );
    if (individualDiscount > 0) {
      itemDiscounts.push({ name: product.name, discount: individualDiscount });
      totalAmt += itemTotal * (1 - individualDiscount / 100);
    } else {
      totalAmt += itemTotal;
    }
  }

  const originalTotal = subtotal;
  let discountRate = 0;

  // Apply bulk purchase discount
  const bulkDiscount = calculateBulkDiscount(itemCnt);
  if (bulkDiscount > 0) {
    totalAmt = subtotal * (1 - bulkDiscount / 100);
    discountRate = bulkDiscount / 100;
  } else {
    discountRate = (subtotal - totalAmt) / subtotal;
  }

  // Apply Tuesday discount
  const tuesdayDiscount = calculateTuesdayDiscount(totalAmt);
  if (tuesdayDiscount > 0 && totalAmt > 0) {
    totalAmt = totalAmt * (1 - tuesdayDiscount / 100);
    discountRate = 1 - totalAmt / originalTotal;
  }

  // Update UI
  updateItemCountDisplay(itemCnt);
  updateSummaryDetails(cartItems, subtotal, itemDiscounts);
  updateDiscountInfo(discountRate, totalAmt, originalTotal);
  updateTuesdaySpecialDisplay();

  // Update total display
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(Math.round(totalAmt));
  }

  // Calculate and display loyalty points
  const { finalPoints, pointsDetail } = calculateLoyaltyPoints(
    totalAmt,
    itemCnt,
    Array.from(cartItems)
  );
  updateLoyaltyPointsDisplay(finalPoints, pointsDetail);

  // Update stock information
  updateStockInfo();
}

main();

cartDisp.addEventListener('click', function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
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
    updateSelectOptions();
  }
});

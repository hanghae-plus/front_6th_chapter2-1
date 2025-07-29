// =================================================================================================
// 전역 변수 및 상수 선언
// =================================================================================================

let prodList;
let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;
let sum;

const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = 'p4';
const PRODUCT_5 = `p5`;

// =================================================================================================
// 주 애플리케이션 초기화 함수
// =================================================================================================

function main() {
  // --------------------------------------------------------------------------------
  // 초기화
  // --------------------------------------------------------------------------------

  initializeVariables();
  initializeProductList();

  // --------------------------------------------------------------------------------
  // UI 요소 생성 및 설정
  // --------------------------------------------------------------------------------

  const root = document.getElementById('app');
  const header = createHeader();
  const { gridContainer, leftColumn, rightColumn } = createLayout();
  const { selectorContainer, stockInfo: newStockInfo, addBtn: newAddBtn, sel: newSel } = createProductSelector();
  
  sel = newSel;
  addBtn = newAddBtn;
  stockInfo = newStockInfo;

  leftColumn.appendChild(selectorContainer);
  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';
  leftColumn.appendChild(cartDisp);

  const { manualToggle, manualOverlay } = createManualElements();

  // --------------------------------------------------------------------------------
  // UI 렌더링
  // --------------------------------------------------------------------------------

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  sum = rightColumn.querySelector('#cart-total');

  // --------------------------------------------------------------------------------
  // 초기 데이터 처리 및 이벤트 리스너 설정
  // --------------------------------------------------------------------------------

  onUpdateSelectOptions();
  handleCalculateCartStuff();
  setupEventListeners();
  startTimers();
}

// =================================================================================================
// 초기화 함수
// =================================================================================================

function initializeVariables() {
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
}

function initializeProductList() {
  prodList = [
    { id: PRODUCT_ONE, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false },
    { id: p2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false },
    { id: product_3, name: '거북목 탈출 모니터암', val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false },
    { id: p4, name: '에러 방지 노트북 파우치', val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false },
    { id: PRODUCT_5, name: `코딩할 때 듣는 Lo-Fi 스피커`, val: 25000, originalVal: 25000, q: 10, onSale: false, suggestSale: false },
  ];
}

// =================================================================================================
// UI 생성 함수
// =================================================================================================

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

function createLayout() {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

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

  return { gridContainer, leftColumn, rightColumn };
}

function createProductSelector() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className = 'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  return { selectorContainer, stockInfo, addBtn, sel };
}

function createManualElements() {
  const manualToggle = document.createElement('button');
  manualToggle.className = 'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const manualColumn = document.createElement('div');
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

  manualOverlay.appendChild(manualColumn);

  manualToggle.onclick = () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  return { manualToggle, manualOverlay };
}

// =================================================================================================
// 이벤트 리스너 설정
// =================================================================================================

function setupEventListeners() {
  addBtn.addEventListener('click', handleAddToCart);
  cartDisp.addEventListener('click', handleCartActions);
}

// =================================================================================================
// 타이머 설정
// =================================================================================================

function startTimers() {
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(triggerLightningSale, 30000);
  }, lightningDelay);

  setTimeout(() => {
    setInterval(triggerSuggestion, 60000);
  }, Math.random() * 20000);
}

// =================================================================================================
// 이벤트 핸들러 및 관련 함수
// =================================================================================================

function handleAddToCart() {
  const selItem = sel.value;
  const itemToAdd = prodList.find(p => p.id === selItem);

  if (!itemToAdd || itemToAdd.q <= 0) {
    if (itemToAdd && itemToAdd.q <= 0) {
      alert('재고가 부족합니다.');
    }
    return;
  }

  const cartItem = document.getElementById(itemToAdd.id);

  if (cartItem) {
    const qtyElem = cartItem.querySelector('.quantity-number');
    const newQty = parseInt(qtyElem.textContent) + 1;
    if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
      qtyElem.textContent = newQty;
      itemToAdd.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = createCartItemElement(itemToAdd);
    cartDisp.appendChild(newItem);
    itemToAdd.q--;
  }

  handleCalculateCartStuff();
  lastSel = selItem;
}

function handleCartActions(event) {
  const tgt = event.target;
  const isQuantityChange = tgt.classList.contains('quantity-change');
  const isRemoveItem = tgt.classList.contains('remove-item');

  if (!isQuantityChange && !isRemoveItem) return;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = prodList.find(p => p.id === prodId);

  if (!prod) return;

  if (isQuantityChange) {
    const qtyChange = parseInt(tgt.dataset.change);
    const qtyElem = itemElem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + qtyChange;

    if (newQty > 0 && newQty <= prod.q + currentQty) {
      qtyElem.textContent = newQty;
      prod.q -= qtyChange;
    } else if (newQty <= 0) {
      prod.q += currentQty;
      itemElem.remove();
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (isRemoveItem) {
    const qtyElem = itemElem.querySelector('.quantity-number');
    const remQty = parseInt(qtyElem.textContent);
    prod.q += remQty;
    itemElem.remove();
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

// =================================================================================================
// UI 업데이트 함수
// =================================================================================================

function onUpdateSelectOptions() {
  sel.innerHTML = '';
  const totalStock = prodList.reduce((acc, p) => acc + p.q, 0);

  prodList.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    
    let discountText = '';
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.q === 0) {
      opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
    }
    sel.appendChild(opt);
  });

  sel.style.borderColor = totalStock < 50 ? 'orange' : '';
}

function doUpdatePricesInCart() {
  const cartItems = Array.from(cartDisp.children);
  cartItems.forEach(cartItem => {
    const itemId = cartItem.id;
    const product = prodList.find(p => p.id === itemId);

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      
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
  });
  handleCalculateCartStuff();
}

function createCartItemElement(item) {
  const newItem = document.createElement('div');
  newItem.id = item.id;
  newItem.className = 'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  
  const saleType = item.onSale && item.suggestSale ? '⚡💝' : item.onSale ? '⚡' : item.suggestSale ? '💝' : '';
  const priceHtml = item.onSale || item.suggestSale
    ? `<span class="line-through text-gray-400">₩${item.originalVal.toLocaleString()}</span> <span class="${
        item.onSale && item.suggestSale ? 'text-purple-600' : item.onSale ? 'text-red-500' : 'text-blue-500'
      }">₩${item.val.toLocaleString()}</span>`
    : `₩${item.val.toLocaleString()}`;

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleType}${item.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceHtml}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHtml}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
    </div>
  `;
  return newItem;
}

// =================================================================================================
// 계산 및 데이터 처리 함수
// =================================================================================================

function handleCalculateCartStuff() {
  const cartItems = Array.from(cartDisp.children);
  let subTot = 0;
  const itemDiscounts = [];
  
  itemCnt = cartItems.reduce((acc, cartItem) => {
    const qty = parseInt(cartItem.querySelector('.quantity-number').textContent);
    return acc + qty;
  }, 0);

  totalAmt = cartItems.reduce((acc, cartItem) => {
    const curItem = prodList.find(p => p.id === cartItem.id);
    const qty = parseInt(cartItem.querySelector('.quantity-number').textContent);
    const itemTot = curItem.val * qty;
    subTot += itemTot;

    let disc = 0;
    if (qty >= 10) {
      if (curItem.id === PRODUCT_ONE) disc = 0.1;
      else if (curItem.id === p2) disc = 0.15;
      else if (curItem.id === product_3) disc = 0.2;
      else if (curItem.id === PRODUCT_5) disc = 0.25;
      
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    return acc + (itemTot * (1 - disc));
  }, 0);

  const originalTotal = subTot;
  let discRate = 0;

  if (itemCnt >= 30) {
    totalAmt = subTot * 0.75;
    discRate = 0.25;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday && totalAmt > 0) {
    totalAmt *= 0.9;
    discRate = 1 - totalAmt / originalTotal;
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  updateUICartSummary(subTot, itemDiscounts, isTuesday);
  updateUICartTotal();
  updateUIDiscountInfo(originalTotal, discRate);
  updateUIItemCount();
  updateUIStockInfo();
  doRenderBonusPoints();
}

function updateUICartSummary(subTot, itemDiscounts, isTuesday) {
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    const cartItems = Array.from(cartDisp.children);
    cartItems.forEach(cartItem => {
      const curItem = prodList.find(p => p.id === cartItem.id);
      const q = parseInt(cartItem.querySelector('.quantity-number').textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
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
      itemDiscounts.forEach(item => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday && totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

function updateUICartTotal() {
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
}

function updateUIDiscountInfo(originalTotal, discRate) {
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

function updateUIItemCount() {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || '0');
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

function updateUIStockInfo() {
  let stockMsg = '';
  prodList.forEach(item => {
    if (item.q < 5) {
      stockMsg += item.q > 0
        ? `${item.name}: 재고 부족 (${item.q}개 남음)\n`
        : `${item.name}: 품절\n`;
    }
  });
  stockInfo.textContent = stockMsg;
}

const doRenderBonusPoints = () => {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (cartDisp.children.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  let basePoints = Math.floor(totalAmt / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (new Date().getDay() === 2 && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push('화요일 2배');
  }

  const hasKeyboard = Array.from(cartDisp.children).some(node => node.id === PRODUCT_ONE);
  const hasMouse = Array.from(cartDisp.children).some(node => node.id === p2);
  const hasMonitorArm = Array.from(cartDisp.children).some(node => node.id === product_3);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (itemCnt >= 30) {
    finalPoints += 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= 20) {
    finalPoints += 50;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= 10) {
    finalPoints += 20;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  bonusPts = finalPoints;

  if (bonusPts > 0) {
    loyaltyPointsDiv.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
    `;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
};

// =================================================================================================
// 유틸리티 함수
// =================================================================================================

function onGetStockTotal() {
  return prodList.reduce((sum, currentProduct) => sum + currentProduct.q, 0);
}

// =================================================================================================
// 프로모션 관련 함수
// =================================================================================================

function triggerLightningSale() {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  if (luckyItem.q > 0 && !luckyItem.onSale) {
    luckyItem.val = Math.round(luckyItem.originalVal * 0.8);
    luckyItem.onSale = true;
    alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    onUpdateSelectOptions();
    doUpdatePricesInCart();
  }
}

function triggerSuggestion() {
  if (cartDisp.children.length === 0 || !lastSel) return;

  const suggest = prodList.find(p => p.id !== lastSel && p.q > 0 && !p.suggestSale);
  if (suggest) {
    alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    suggest.val = Math.round(suggest.val * 0.95);
    suggest.suggestSale = true;
    onUpdateSelectOptions();
    doUpdatePricesInCart();
  }
}

// =================================================================================================
// 애플리케이션 시작
// =================================================================================================

main();

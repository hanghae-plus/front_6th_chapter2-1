const PRODUCT_IDS = {
  P1: 'p1', // 버그 없애는 키보드
  P2: 'p2', // 생산성 폭발 마우스
  P3: 'p3', // 거북목 탈출 모니터암
  P4: 'p4', // 에러 방지 노트북 파우치
  P5: 'p5', // 코딩할 때 듣는 Lo-Fi 스피커
};

const DISCOUNT_RATES = {
  INDIVIDUAL: {
    [PRODUCT_IDS.P1]: 0.1,
    [PRODUCT_IDS.P2]: 0.15,
    [PRODUCT_IDS.P3]: 0.2,
    [PRODUCT_IDS.P5]: 0.25,
  },
  BULK: 0.25,
  TUESDAY: 0.1,
};

const state = {
  products: [],
};

let stockInfo;
let sel;

let itemCnt;
let lastSel;
let addBtn;
let totalAmt = 0;
let cartDisp;
let sum;

const ProductSelectItem = (product) => {
  // 품절 상품
  if (product.q === 0) {
    return `
      <option value="${product.id}" disabled class="text-gray-400">
        ${product.name} - ${product.val}원 (품절)
      </option>
    `;
  }
  // ⚡ 번개 세일 + 💝 추천 할인
  if (product.onSale && product.suggestSale) {
    return `
      <option value="${product.id}" class="text-purple-600 font-bold">
        ⚡💝 ${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)
      </option>
    `;
  }
  // ⚡ 번개 세일
  if (product.onSale) {
    return `
      <option value="${product.id}" class="text-red-500 font-bold">
        ⚡ ${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)
      </option>
    `;
  }
  // 💝 추천 할인
  if (product.suggestSale) {
    return `
      <option value="${product.id}" class="text-blue-500 font-bold">
        💝 ${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)
      </option>
    `;
  }
  // 기본 상품
  return `
    <option value="${product.id}">
      ${product.name} - ${product.val}원
    </option>
		`;
};

const CartProductItem = (item) => {
  const saleIcon =
    item.onSale && item.suggestSale ? '⚡💝' : item.onSale ? '⚡' : item.suggestSale ? '💝' : '';

  const priceHTML =
    item.onSale || item.suggestSale
      ? `<span class="line-through text-gray-400">₩${item.originalVal}</span> <span class="${
          item.onSale && item.suggestSale
            ? 'text-purple-600'
            : item.onSale
              ? 'text-red-500'
              : 'text-blue-500'
        }">₩${item.val}</span>`
      : `₩${item.val}`;

  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon} ${item.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceHTML}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
    </div>
  `;
};

const StockInfo = () => {
  let text = '';

  state.products.forEach(function (item) {
    if (item.q === 0) {
      text += `${item.name} : 품절\n`;
    } else if (item.q < 5) {
      text += `${item.name} : 재고 부족 (${item.q}개 남음)\n`;
    }
  });

  return `
	<div id='stock-status' class='text-xs text-red-500 mt-3 whitespace-pre-line'>
	${text}
	</div>`;
};

const LoyaltyPoints = (bonusPts, pointsDetail) => {
  if (bonusPts > 0)
    return `<div>${'적립 포인트: '}<span class="font-bold">
    ${bonusPts}p</span></div>
		<div class="text-2xs opacity-70 mt-1">
    ${pointsDetail.join(', ')}</div>`;

  return '<div>적립 포인트: 0p</div>';
};

function renderProductSelectOptions() {
  sel.innerHTML = state.products.map(ProductSelectItem).join('');
}
function renderStockInfo() {
  stockInfo.innerHTML = StockInfo();
}

function render() {
  const root = document.getElementById('app');

  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  sel = document.createElement('select');
  sel.id = 'product-select';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisp);

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
  sum = rightColumn.querySelector('#cart-total');

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
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

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

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
}

function initState() {
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  state.products = [
    {
      id: PRODUCT_IDS.P1,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.P5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}

function main() {
  const lightningDelay = Math.random() * 10000;

  initState();
  render();

  renderProductSelectOptions();
  handleCalculateCartStuff();

  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * state.products.length);
      const luckyItem = state.products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        renderProductSelectOptions();
        renderCartItemUpdates();
      }
    }, 30000);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < state.products.length; k++) {
          if (state.products[k].id !== lastSel) {
            if (state.products[k].q > 0) {
              if (!state.products[k].suggestSale) {
                suggest = state.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          renderProductSelectOptions();
          renderCartItemUpdates();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function handleCalculateCartStuff() {
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  let originalTotal;

  let subTot;
  let idx;
  let savedAmount;
  let previousCount;
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt;
  subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];
  const cartItems = cartDisp.children;

  for (idx = 0; idx < state.products.length; idx++) {
    if (state.products[idx].q < 5 && state.products[idx].q > 0) {
      lowStockItems.push(state.products[idx].name);
    }
  }

  for (let i = 0; i < cartItems.length; i++) {
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    let curItem;
    for (let j = 0; j < state.products.length; j++) {
      if (state.products[j].id === cartItems[i].id) {
        curItem = state.products[j];
        break;
      }
    }

    let disc;
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.val * q;
    disc = 0;
    itemCnt += q;
    subTot += itemTot;
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');

    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
      }
    });

    if (q >= 10) {
      disc = DISCOUNT_RATES.INDIVIDUAL[curItem.id];

      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    totalAmt += itemTot * (1 - disc);
  }

  let totalDiscountRate = 0;
  originalTotal = subTot;

  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
  }

  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday && totalAmt > 0) {
    totalAmt = totalAmt - totalAmt * DISCOUNT_RATES.TUESDAY;
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  totalDiscountRate = 1 - totalAmt / originalTotal;

  document.getElementById('item-count').textContent = `🛍️ ${itemCnt} items in cart`;
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    // const cartItemsHTML = cartItems
    //   .map((item) => {
    //     const result = state.products.filter((product) => product.id === item.id);
    //     if (result.length > 0) {
    //       return CartItem(item, result[0]);
    //     }
    //     return '';
    //   })
    //   .join('');
    // summaryDetails.innerHTML += cartItemsHTML;
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < state.products.length; j++) {
        if (state.products[j].id === cartItems[i].id) {
          curItem = state.products[j];
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

  const totalDiv = sum.querySelector('.text-2xl');

  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }

  const points = Math.floor(totalAmt / 1000);

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  loyaltyPointsDiv.style.display = 'block';
  loyaltyPointsDiv.innerHTML = LoyaltyPoints(points, []);

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (totalDiscountRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(totalDiscountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  const itemCountElement = document.getElementById('item-count');

  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  renderStockInfo();
  renderBonusPoints();
}

const renderBonusPoints = function () {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  const basePoints = Math.floor(totalAmt / 1000);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
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
  const nodes = cartDisp.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < state.products.length; pIdx++) {
      if (state.products[pIdx].id === node.id) {
        product = state.products[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_IDS.P1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_IDS.P2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_IDS.P3) {
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

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  loyaltyPointsDiv.style.display = 'block';
  loyaltyPointsDiv.innerHTML = LoyaltyPoints(finalPoints, pointsDetail);
};

const renderCartItemUpdates = () => {
  const cartItemElements = Array.from(cartDisp.children);

  for (const cartItem of cartItemElements) {
    const product = state.products.find((p) => p.id === cartItem.id);

    if (!product) continue;

    const priceHTML = getCartItemDisplay(product);

    const nameDiv = cartItem.querySelector('h3');
    const priceDiv = cartItem.querySelector('.text-lg');

    if (nameDiv) nameDiv.textContent = `${saleIcon} ${product.name}`;
    if (priceDiv) priceDiv.innerHTML = priceHTML;
  }

  handleCalculateCartStuff();
};

const getCartItemDisplay = (product) => {
  let { name } = product;
  let priceHTML = `₩${product.val.toLocaleString()}`;

  if (product.onSale || product.suggestSale) {
    const saleIcon = product.onSale && product.suggestSale ? '⚡💝' : product.onSale ? '⚡' : '💝';
    const colorClass =
      product.onSale && product.suggestSale
        ? 'text-purple-600'
        : product.onSale
          ? 'text-red-500'
          : 'text-blue-500';

    name = `${saleIcon} ${product.name}`;
    priceHTML = `
      <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
      <span class="${colorClass}">₩${product.val.toLocaleString()}</span>
    `;
  }

  return { name, priceHTML };
};

const handleAddItemToCart = () => {
  const selectedId = sel.value;
  const itemToAdd = state.products.find((p) => p.id === selectedId);

  if (!itemToAdd || itemToAdd.q <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  const existingCartItem = document.getElementById(itemToAdd.id);

  if (existingCartItem) {
    const qtyElem = existingCartItem.querySelector('.quantity-number');
    qtyElem.textContent = parseInt(qtyElem.textContent, 10) + 1;
  } else {
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

    newItem.innerHTML = CartProductItem(itemToAdd);
    cartDisp.appendChild(newItem);
  }

  itemToAdd.q--;
  lastSel = selectedId;
  handleCalculateCartStuff();
};

const handleCartItemActions = (event) => {
  const { target } = event;
  const isQuantityChange = target.classList.contains('quantity-change');
  const isRemoveItem = target.classList.contains('remove-item');

  if (!isQuantityChange && !isRemoveItem) {
    return;
  }

  const { productId } = target.dataset;
  const product = state.products.find((p) => p.id === productId);
  const cartItemElement = document.getElementById(productId);

  if (!product || !cartItemElement) {
    return;
  }

  const quantityElement = cartItemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent, 10);

  if (isRemoveItem) {
    removeItemFromCart(cartItemElement, product, currentQuantity);
  }

  if (isQuantityChange) {
    const change = parseInt(target.dataset.change, 10);

    if (change > 0) {
      if (product.q > 0) {
        quantityElement.textContent = currentQuantity + 1;
        product.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    }

    if (change < 0) {
      if (currentQuantity > 1) {
        quantityElement.textContent = currentQuantity - 1;
        product.q++;
      } else {
        removeItemFromCart(cartItemElement, product, currentQuantity);
      }
    }
  }
  handleCalculateCartStuff();
  renderProductSelectOptions();
};

const removeItemFromCart = (itemElement, product, quantityInCart) => {
  product.q += quantityInCart;
  itemElement.remove();
};

main();

addBtn.addEventListener('click', handleAddItemToCart);
cartDisp.addEventListener('click', handleCartItemActions);

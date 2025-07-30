// ================================================
// 상품 ID 상수
// ================================================
const KEYBOARD = 'p1';
const MOUSE = 'p2';
const MONITOR_ARM = 'p3';
const NOTEBOOK_CASE = 'p4';
const SPEAKER = 'p5';

// ================================================
// 상품 데이터
// ================================================
const productList = [
  {
    id: KEYBOARD,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: NOTEBOOK_CASE,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// ================================================
// 할인 관련 상수
// ================================================
const LIGHTNING_SALE_DISCOUNT = 20; // 번개세일 할인율 (%)
const SUGGEST_SALE_DISCOUNT = 5; // 추천세일 할인율 (%)
const TUESDAY_SPECIAL_DISCOUNT = 10; // 화요일 특별 할인율 (%)
const BULK_PURCHASE_DISCOUNT = 25; // 대량구매 할인율 (%)

// 개별 상품 할인율
const PRODUCT_DISCOUNTS = {
  [KEYBOARD]: 10, // 키보드
  [MOUSE]: 15, // 마우스
  [MONITOR_ARM]: 20, // 모니터암
  [NOTEBOOK_CASE]: 5, // 노트북 파우치
  [SPEAKER]: 25, // 스피커
};

// ================================================
// 수량 기준 상수
// ================================================
const INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD = 10; // 개별 상품 할인 시작 기준
const BULK_PURCHASE_THRESHOLD = 30; // 대량구매 할인 시작 기준
const LOW_STOCK_THRESHOLD = 5; // 재고 부족 경고 기준
const TOTAL_STOCK_WARNING_THRESHOLD = 50; // 전체 재고 부족 경고 기준

// 포인트 적립 기준 수량
const BONUS_POINTS_THRESHOLDS = {
  SMALL: 10, // 10개+ = +20p
  MEDIUM: 20, // 20개+ = +50p
  LARGE: 30, // 30개+ = +100p
};

// ================================================
// 포인트 관련 상수
// ================================================
const BASE_POINTS_RATE = 1000; // 기본 포인트 적립 기준 (원)
const TUESDAY_POINTS_MULTIPLIER = 2; // 화요일 포인트 배수
const BONUS_POINTS = {
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트
  FULL_SET: 100, // 풀세트
  BULK_PURCHASE: {
    SMALL: 20,
    MEDIUM: 50,
    LARGE: 100,
  },
};

// ================================================
// 타이머 관련 상수
// ================================================
const LIGHTNING_SALE_INTERVAL = 30000; // 번개세일 간격 (30초)
const SUGGEST_SALE_INTERVAL = 60000; // 추천할인 간격 (60초)
const LIGHTNING_DELAY_RANGE = 10000; // 번개세일 시작 지연 범위 (10초)
const SUGGEST_DELAY_RANGE = 20000; // 추천할인 시작 지연 범위 (20초)

// ================================================
// 요일 관련 상수
// ================================================
const TUESDAY = 2; // 화요일 (0=일요일, 1=월요일, 2=화요일, ...)

function Header() {
  return /* HTML */ `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  `;
}

/**
 * GridContainer
 * - LeftColumn
 * - RightColumn
 */
function GridContainer() {
  return /* HTML */ `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftColumn()} ${RightColumn()}
    </div>
  `;
}

function RightColumn() {
  return /* HTML */ `
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
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">
              적립 포인트: 0p
            </div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide"
                >Tuesday Special ${TUESDAY_SPECIAL_DISCOUNT}% Applied</span
              >
            </div>
          </div>
        </div>
      </div>
      <button
        class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
      >
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;
}

/**
 * LeftColumn
 * - SelectorContainer
 * - CartDisplay
 */
function LeftColumn() {
  return /* HTML */ `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${SelectorContainer()} ${CartDisplay()}
    </div>
  `;
}

function CartDisplay() {
  return /* HTML */ ` <div id="cart-items"></div> `;
}

/**
 * Selector Container
 * - ProductSelector
 *   - ProductOption
 * - AddToCartButton
 * - StockInfo
 */
function SelectorContainer() {
  return /* HTML */ `
    <div class="mb-6 pb-6 border-b border-gray-200">
      ${ProductSelector()} ${AddToCartButton()} ${StockInfo()}
    </div>
  `;
}

function ProductSelector() {
  return /* HTML */ `
    <select
      id="product-select"
      class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
    ></select>
  `;
}

function ProductOption({ item }) {
  /**
   * @todo 배열 방식으로 할 지? 팀원들과 이야기해보기
   */
  let discountText = '';
  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';

  /**
   * @todo item.q -> item.quantity 변경 필요
   */
  if (item.q === 0) {
    return /* HTML */ `
      <option value="${item.id}" disabled class="text-gray-400">
        ${item.name} - ${item.val}원 (품절) ${discountText}
      </option>
    `;
  }

  if (item.onSale && item.suggestSale) {
    return /* HTML */ `
      <option value="${item.id}" class="text-purple-600 font-bold">
        ⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)
      </option>
    `;
  }

  if (item.onSale) {
    return /* HTML */ `
      <option value="${item.id}" class="text-red-500 font-bold">
        ⚡ ${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)
      </option>
    `;
  }

  if (item.suggestSale) {
    return /* HTML */ `
      <option value="${item.id}" class="text-blue-500 font-bold">
        💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)
      </option>
    `;
  }

  return /* HTML */ `
    <option value="${item.id}">${item.name} - ${item.val}원${discountText}</option>
  `;
}

function AddToCartButton() {
  return /* HTML */ `
    <button
      id="add-to-cart"
      class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
    >
      Add to Cart
    </button>
  `;
}

function StockInfo() {
  return /* HTML */ `
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
  `;
}

function ManualToggle() {
  return /* HTML */ `
    <button
      id="manual-toggle"
      class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>
  `;
}

/**
 * ManualOverlay
 * - ManualColumn
 */
function ManualOverlay() {
  return /* HTML */ `
    <div
      id="manual-overlay"
      class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"
    >
      ${ManualColumn()}
    </div>
  `;
}

function ManualColumn() {
  return /* HTML */ `
    <div
      id="manual-column"
      class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300"
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-black"
        onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
        <div class="space-y-3">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">개별 상품</p>
            <p class="text-gray-700 text-xs pl-2">
              • 키보드 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[KEYBOARD]}%<br />
              • 마우스 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[MOUSE]}%<br />
              • 모니터암 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑:
              ${PRODUCT_DISCOUNTS[MONITOR_ARM]}%<br />
              • 스피커 ${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑: ${PRODUCT_DISCOUNTS[SPEAKER]}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">전체 수량</p>
            <p class="text-gray-700 text-xs pl-2">
              • ${BULK_PURCHASE_THRESHOLD}개 이상: ${BULK_PURCHASE_DISCOUNT}%
            </p>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm mb-1">특별 할인</p>
            <p class="text-gray-700 text-xs pl-2">
              • 화요일: +${TUESDAY_SPECIAL_DISCOUNT}%<br />
              • ⚡번개세일: ${LIGHTNING_SALE_DISCOUNT}%<br />
              • 💝추천할인: ${SUGGEST_SALE_DISCOUNT}%
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
              • 화요일: ${TUESDAY_POINTS_MULTIPLIER}배<br />
              • 키보드+마우스: +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p<br />
              • 풀세트: +${BONUS_POINTS.FULL_SET}p<br />
              • ${BONUS_POINTS_THRESHOLDS.SMALL}개↑: +${BONUS_POINTS.BULK_PURCHASE.SMALL}p /
              ${BONUS_POINTS_THRESHOLDS.MEDIUM}개↑: +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p /
              ${BONUS_POINTS_THRESHOLDS.LARGE}개↑: +${BONUS_POINTS.BULK_PURCHASE.LARGE}p
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">💡 TIP</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          • 화요일 대량구매 = MAX 혜택<br />
          • ⚡+💝 중복 가능<br />
          • 상품4 = 품절
        </p>
      </div>
    </div>
  `;
}

function findProductById(productId) {
  return productList.find((product) => product.id === productId);
}

function isTuesday() {
  const today = new Date();
  return today.getDay() === TUESDAY;
}

function main() {
  let totalAmt = 0;
  let lastSel = null;
  let itemCnt = 0;

  const root = document.getElementById('app');

  root.innerHTML += Header();
  root.innerHTML += GridContainer();
  root.innerHTML += ManualToggle();
  root.innerHTML += ManualOverlay();

  const sel = root.querySelector('#product-select');
  const addBtn = root.querySelector('#add-to-cart');
  const stockInfo = root.querySelector('#stock-status');
  const cartDisp = root.querySelector('#cart-items');
  const sum = root.querySelector('#cart-total');
  const manualToggle = root.querySelector('#manual-toggle');
  const manualOverlay = root.querySelector('#manual-overlay');
  const manualColumn = root.querySelector('#manual-column');

  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  const lightningDelay = Math.random() * LIGHTNING_DELAY_RANGE;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * (100 - LIGHTNING_SALE_DISCOUNT)) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name} 이(가) ${LIGHTNING_SALE_DISCOUNT}% 할인 중입니다!`);
        doUpdatePricesInCart();
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSel) {
            if (productList[k].q > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name} 은(는) 어떠세요? 지금 구매하시면 ${SUGGEST_SALE_DISCOUNT}% 추가 할인!`
          );
          suggest.val = Math.round((suggest.val * (100 - SUGGEST_SALE_DISCOUNT)) / 100);
          suggest.suggestSale = true;
          doUpdatePricesInCart();
        }
      }
    }, SUGGEST_SALE_INTERVAL);
  }, Math.random() * SUGGEST_DELAY_RANGE);

  function onUpdateSelectOptions() {
    sel.innerHTML = '';
    let totalStock = 0;
    for (let idx = 0; idx < productList.length; idx++) {
      const _p = productList[idx];
      totalStock = totalStock + _p.q;
    }

    const optionsHTML = productList.map((item) => ProductOption({ item })).join('');
    sel.innerHTML = optionsHTML;

    if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
      sel.style.borderColor = 'orange';
    } else {
      sel.style.borderColor = '';
    }
  }
  function handleCalculateCartStuff() {
    totalAmt = 0;
    itemCnt = 0;
    let originalTotal = totalAmt;
    let subTot = 0;

    const itemDiscounts = [];
    const lowStockItems = [];
    for (let idx = 0; idx < productList.length; idx++) {
      if (productList[idx].q < LOW_STOCK_THRESHOLD && productList[idx].q > 0) {
        lowStockItems.push(productList[idx].name);
      }
    }

    const cartItems = cartDisp.children;
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(cartItems[i].id);
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD ? 'bold' : 'normal';
        }
      });
      if (q >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
        if (curItem.id === KEYBOARD) {
          disc = PRODUCT_DISCOUNTS[KEYBOARD] / 100;
        } else {
          if (curItem.id === MOUSE) {
            disc = PRODUCT_DISCOUNTS[MOUSE] / 100;
          } else {
            if (curItem.id === MONITOR_ARM) {
              disc = PRODUCT_DISCOUNTS[MONITOR_ARM] / 100;
            } else {
              if (curItem.id === NOTEBOOK_CASE) {
                disc = PRODUCT_DISCOUNTS[NOTEBOOK_CASE] / 100;
              } else {
                if (curItem.id === SPEAKER) {
                  disc = PRODUCT_DISCOUNTS[SPEAKER] / 100;
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
    }

    let discRate = 0;
    originalTotal = subTot;
    if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
      totalAmt = (subTot * (100 - BULK_PURCHASE_DISCOUNT)) / 100;
      discRate = BULK_PURCHASE_DISCOUNT / 100;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
    const tuesdaySpecial = document.getElementById('tuesday-special');
    if (isTuesday()) {
      if (totalAmt > 0) {
        totalAmt = (totalAmt * (100 - TUESDAY_SPECIAL_DISCOUNT)) / 100;
        discRate = 1 - totalAmt / originalTotal;
        tuesdaySpecial.classList.remove('hidden');
      } else {
        tuesdaySpecial.classList.add('hidden');
      }
    } else {
      tuesdaySpecial.classList.add('hidden');
    }

    const summaryDetails = document.getElementById('summary-details');
    summaryDetails.innerHTML = '';
    if (subTot > 0) {
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
      summaryDetails.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subTot.toLocaleString()}</span>
        </div>
      `;
      if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">🎉 대량구매 할인 (${BULK_PURCHASE_THRESHOLD}개 이상)</span>
            <span class="text-xs">-${BULK_PURCHASE_DISCOUNT}%</span>
          </div>
        `;
      } else if (itemDiscounts.length > 0) {
        itemDiscounts.forEach(function (item) {
          summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${item.name} (${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑)</span>
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
              <span class="text-xs">-${TUESDAY_SPECIAL_DISCOUNT}%</span>
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
          <div class="text-2xs text-gray-300">
            ₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다
          </div>
        </div>
      `;
    }
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
      itemCountElement.textContent = `🛍️  ${itemCnt} items in cart`;
      if (previousCount !== itemCnt) {
        itemCountElement.setAttribute('data-changed', 'true');
      }
    }
    handleStockInfoUpdate();
    doRenderBonusPoints();
  }
  function doRenderBonusPoints() {
    if (cartDisp.children.length === 0) {
      document.getElementById('loyalty-points').style.display = 'none';
      return;
    }

    const basePoints = Math.floor(totalAmt / BASE_POINTS_RATE);
    const pointsDetail = [];
    let finalPoints = 0;

    if (basePoints > 0) {
      finalPoints = basePoints;
      pointsDetail.push(`기본: ${basePoints}p`);
    }
    if (isTuesday()) {
      if (basePoints > 0) {
        finalPoints = basePoints * TUESDAY_POINTS_MULTIPLIER;
        pointsDetail.push('화요일 2배');
      }
    }
    let hasKeyboard = false;
    let hasMouse = false;
    let hasMonitorArm = false;

    const nodes = cartDisp.children;
    for (const node of nodes) {
      const product = findProductById(node.id);
      if (!product) continue;

      if (product.id === KEYBOARD) {
        hasKeyboard = true;
      } else if (product.id === MOUSE) {
        hasMouse = true;
      } else if (product.id === MONITOR_ARM) {
        hasMonitorArm = true;
      }
    }
    if (hasKeyboard && hasMouse) {
      finalPoints = finalPoints + BONUS_POINTS.KEYBOARD_MOUSE_SET;
      pointsDetail.push(`키보드+마우스 세트 +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p`);
    }
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints = finalPoints + BONUS_POINTS.FULL_SET;
      pointsDetail.push(`풀세트 구매 +${BONUS_POINTS.FULL_SET}p`);
    }
    if (itemCnt >= BONUS_POINTS_THRESHOLDS.LARGE) {
      finalPoints = finalPoints + BONUS_POINTS.BULK_PURCHASE.LARGE;
      pointsDetail.push(
        `대량구매(${BONUS_POINTS_THRESHOLDS.LARGE}개+) +${BONUS_POINTS.BULK_PURCHASE.LARGE}p`
      );
    } else {
      if (itemCnt >= BONUS_POINTS_THRESHOLDS.MEDIUM) {
        finalPoints = finalPoints + BONUS_POINTS.BULK_PURCHASE.MEDIUM;
        pointsDetail.push(
          `대량구매(${BONUS_POINTS_THRESHOLDS.MEDIUM}개+) +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p`
        );
      } else {
        if (itemCnt >= BONUS_POINTS_THRESHOLDS.SMALL) {
          finalPoints = finalPoints + BONUS_POINTS.BULK_PURCHASE.SMALL;
          pointsDetail.push(
            `대량구매(${BONUS_POINTS_THRESHOLDS.SMALL}개+) +${BONUS_POINTS.BULK_PURCHASE.SMALL}p`
          );
        }
      }
    }
    const bonusPts = finalPoints;
    const ptsTag = document.getElementById('loyalty-points');
    if (ptsTag) {
      if (bonusPts > 0) {
        ptsTag.innerHTML = `
          <div>
            적립 포인트: <span class="font-bold">${bonusPts}p</span>
          </div>
          <div class="text-2xs opacity-70 mt-1">
            ${pointsDetail.join(', ')}
          </div>
        `;
        ptsTag.style.display = 'block';
      } else {
        ptsTag.textContent = '적립 포인트: 0p';
        ptsTag.style.display = 'block';
      }
    }
  }

  function handleStockInfoUpdate() {
    let stockInfoMsg = '';
    productList.forEach(function (item) {
      if (item.q < LOW_STOCK_THRESHOLD) {
        if (item.q > 0) {
          stockInfoMsg = `${stockInfoMsg}${item.name}: 재고 부족 (${item.q}개 남음)\n`;
        } else {
          stockInfoMsg = `${stockInfoMsg}${item.name}: 품절\n`;
        }
      }
    });
    stockInfo.textContent = stockInfoMsg;
  }
  function doUpdatePricesInCart() {
    const cartItems = cartDisp.children;
    for (let i = 0; i < cartItems.length; i++) {
      const itemId = cartItems[i].id;
      const product = findProductById(itemId);
      if (product) {
        const priceDiv = cartItems[i].querySelector('.text-lg');
        const nameDiv = cartItems[i].querySelector('h3');
        if (product.onSale && product.suggestSale) {
          priceDiv.innerHTML = `
            <span class="line-through text-gray-400">
              ₩${product.originalVal.toLocaleString()}
            </span>
            <span class="text-purple-600">
              ₩${product.val.toLocaleString()}
            </span>
          `;
          nameDiv.textContent = `⚡💝${product.name}`;
        } else if (product.onSale) {
          priceDiv.innerHTML = `
            <span class="line-through text-gray-400">
              ₩${product.originalVal.toLocaleString()}
            </span>
            <span class="text-red-500">
              ₩${product.val.toLocaleString()}
            </span>
          `;
          nameDiv.textContent = `⚡${product.name}`;
        } else if (product.suggestSale) {
          priceDiv.innerHTML = `
            <span class="line-through text-gray-400">
              ₩${product.originalVal.toLocaleString()}
            </span>
            <span class="text-blue-500">
              ₩${product.val.toLocaleString()}
            </span>
          `;
          nameDiv.textContent = `💝${product.name}`;
        } else {
          priceDiv.textContent = `₩${product.val.toLocaleString()}`;
          nameDiv.textContent = product.name;
        }
      }
    }
    handleCalculateCartStuff();
  }

  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    let hasItem = false;
    for (let idx = 0; idx < productList.length; idx++) {
      if (productList[idx].id === selItem) {
        hasItem = true;
        break;
      }
    }
    if (!selItem || !hasItem) {
      return;
    }

    const itemToAdd = findProductById(selItem);

    if (itemToAdd && itemToAdd.q > 0) {
      const item = document.getElementById(itemToAdd['id']);
      if (item) {
        const qtyElem = item.querySelector('.quantity-number');
        const newQty = parseInt(qtyElem['textContent']) + 1;
        if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
          qtyElem.textContent = newQty;
          itemToAdd['q']--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className =
          'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
        newItem.innerHTML = `
          <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
            <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
          <div>
            <h3 class="text-base font-normal mb-1 tracking-tight">${
              itemToAdd.onSale && itemToAdd.suggestSale
                ? '⚡💝'
                : itemToAdd.onSale
                ? '⚡'
                : itemToAdd.suggestSale
                ? '💝'
                : ''
            }${itemToAdd.name}</h3>
            <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
            <p class="text-xs text-black mb-3">${
              itemToAdd.onSale || itemToAdd.suggestSale
                ? `
                  <span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span>
                  <span class="${
                    itemToAdd.onSale && itemToAdd.suggestSale
                      ? 'text-purple-600'
                      : itemToAdd.onSale
                      ? 'text-red-500'
                      : 'text-blue-500'
                  }">₩${itemToAdd.val.toLocaleString()}</span>`
                : `₩${itemToAdd.val.toLocaleString()}`
            }</p>
            <div class="flex items-center gap-4">
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
                itemToAdd.id
              }" data-change="-1">−</button>
              <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
              <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
                itemToAdd.id
              }" data-change="1">+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg mb-2 tracking-tight tabular-nums">${
              itemToAdd.onSale || itemToAdd.suggestSale
                ? `
                  <span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span>
                  <span class="${
                    itemToAdd.onSale && itemToAdd.suggestSale
                      ? 'text-purple-600'
                      : itemToAdd.onSale
                      ? 'text-red-500'
                      : 'text-blue-500'
                  }">₩${itemToAdd.val.toLocaleString()}</span>`
                : `₩${itemToAdd.val.toLocaleString()}`
            }</div>
            <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
              itemToAdd.id
            }">Remove</a>
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
    const tgt = event.target;

    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = findProductById(prodId);

      if (tgt.classList.contains('quantity-change')) {
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
      } else if (tgt.classList.contains('remove-item')) {
        const qtyElem = itemElem.querySelector('.quantity-number');
        const remQty = parseInt(qtyElem.textContent);
        prod.q += remQty;
        itemElem.remove();
      }
      handleCalculateCartStuff();
    }
  });
}

main();

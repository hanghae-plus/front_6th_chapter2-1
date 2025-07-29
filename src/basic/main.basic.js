let prodList;
let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;

const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
};

const DISCOUNT_RULES = {
  // 개별 상품 할인 임계값 및 할인율 (백분율로 저장)
  ITEM_DISCOUNT_THRESHOLD: 10,
  ITEM_DISCOUNT_RATES: {
    [PRODUCT_IDS.KEYBOARD]: 10,
    [PRODUCT_IDS.MOUSE]: 15,
    [PRODUCT_IDS.MONITOR_ARM]: 20,
    [PRODUCT_IDS.LAPTOP_POUCH]: 5,
    [PRODUCT_IDS.SPEAKER]: 25,
  },

  // 대량 구매 할인
  BULK_DISCOUNT_THRESHOLD: 30,
  BULK_DISCOUNT_RATE: 25, // 25%

  // 특별 할인 요일 설정
  SPECIAL_DISCOUNT_DAYS: [2],
  SPECIAL_DISCOUNT_RATE: 10,

  // 특별 세일
  LIGHTNING_SALE_RATE: 20,
  RECOMMENDATION_DISCOUNT_RATE: 5,
};

// 재고 관리 상수
const STOCK_THRESHOLDS = {
  LOW_STOCK_WARNING: 5, // 재고 부족 경고
  TOTAL_STOCK_WARNING: 50, // 전체 재고 경고
  TOTAL_STOCK_CRITICAL: 30, // 전체 재고 위험
};

// 포인트 적립 상수
const POINTS_RULES = {
  BASE_CALCULATION_UNIT: 1000, // 1000원당 1포인트

  // 특별 포인트 요일 설정
  SPECIAL_POINTS_DAYS: [2],
  SPECIAL_POINTS_MULTIPLIER: 2, // 2배

  // 세트 구매 보너스
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },

  // 수량별 보너스
  QUANTITY_BONUS: {
    TIER_1: { threshold: 10, bonus: 20 },
    TIER_2: { threshold: 20, bonus: 50 },
    TIER_3: { threshold: 30, bonus: 100 },
  },
};

/**
 * 특별 할인 요일 체크
 * @param {Date} date
 * @returns {boolean}
 */
const isSpecialDiscountDay = (date = new Date()) => {
  return DISCOUNT_RULES.SPECIAL_DISCOUNT_DAYS.includes(date.getDay());
};

/**
 * 특별 포인트 요일 체크
 * @param {Date} date
 * @returns {boolean}
 */
const isSpecialPointsDay = (date = new Date()) => {
  return POINTS_RULES.SPECIAL_POINTS_DAYS.includes(date.getDay());
};

/**
 * 요일 이름 추출
 * @param {number} dayIndex
 * @returns {string} 요일 이름
 */
const getKoreanDayName = (dayIndex) => {
  if (dayIndex === 0) return "일요일";
  if (dayIndex === 1) return "월요일";
  if (dayIndex === 2) return "화요일";
  if (dayIndex === 3) return "수요일";
  if (dayIndex === 4) return "목요일";
  if (dayIndex === 5) return "금요일";
  if (dayIndex === 6) return "토요일";
  return "";
};

// ✅ 특별 세일 타이머 상수
const SALE_INTERVALS = {
  LIGHTNING_SALE_INTERVAL: 30000, // 30초마다 번개세일
  RECOMMENDATION_INTERVAL: 60000, // 60초마다 추천할인
  LIGHTNING_SALE_INITIAL_DELAY: 10000, // 최대 10초 후 첫 번째 세일 시작
};

// ✅ 상품 데이터 관리
const useProductData = {
  products: [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_POUCH,
      name: "에러 방지 노트북 파우치",
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
  ],
};

let cartDisp;
function main() {
  var root;
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
  lastSel = null;

  var root = document.getElementById("app");
  header = document.createElement("div");
  header.className = "mb-8";
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  sel = document.createElement("select");
  sel.id = "product-select";
  gridContainer = document.createElement("div");
  leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";
  selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";
  sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
  gridContainer.className = "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  addBtn = document.createElement("button");
  stockInfo = document.createElement("div");
  addBtn.id = "add-to-cart";
  stockInfo.id = "stock-status";
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  addBtn.innerHTML = "Add to Cart";
  addBtn.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = document.createElement("div");
  leftColumn.appendChild(cartDisp);
  cartDisp.id = "cart-items";
  rightColumn = document.createElement("div");
  rightColumn.className = "bg-black text-white p-8 flex flex-col";
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
  sum = rightColumn.querySelector("#cart-total");
  manualToggle = document.createElement("button");
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };
  manualToggle.className =
    "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  manualOverlay = document.createElement("div");
  manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };
  manualColumn = document.createElement("div");
  manualColumn.className =
    "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
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
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * SALE_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * useProductData.products.length);
      const luckyItem = useProductData.products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * (100 - DISCOUNT_RULES.LIGHTNING_SALE_RATE)) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RULES.LIGHTNING_SALE_RATE}% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < useProductData.products.length; k++) {
          if (useProductData.products[k].id !== lastSel) {
            if (useProductData.products[k].q > 0) {
              if (!useProductData.products[k].suggestSale) {
                suggest = useProductData.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% 추가 할인!`,
          );
          suggest.val = Math.round((suggest.val * (100 - DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, SALE_INTERVALS.RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
}
let sum;
function onUpdateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;
  sel.innerHTML = "";
  totalStock = 0;
  for (let idx = 0; idx < useProductData.products.length; idx++) {
    const _p = useProductData.products[idx];
    totalStock += _p.q;
  }
  for (var i = 0; i < useProductData.products.length; i++) {
    (function () {
      const item = useProductData.products[i];
      opt = document.createElement("option");
      opt.value = item.id;
      discountText = "";
      if (item.onSale) discountText += " ⚡SALE";
      if (item.suggestSale) discountText += " 💝추천";
      if (item.q === 0) {
        opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        opt.disabled = true;
        opt.className = "text-gray-400";
      } else if (item.onSale && item.suggestSale) {
        opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RULES.LIGHTNING_SALE_RATE + DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% SUPER SALE!)`;
        opt.className = "text-purple-600 font-bold";
      } else if (item.onSale) {
        opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RULES.LIGHTNING_SALE_RATE}% SALE!)`;
        opt.className = "text-red-500 font-bold";
      } else if (item.suggestSale) {
        opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% 추천할인!)`;
        opt.className = "text-blue-500 font-bold";
      } else {
        opt.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
      sel.appendChild(opt);
    })();
  }
  if (totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING) {
    sel.style.borderColor = "orange";
  } else {
    sel.style.borderColor = "";
  }
}
function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  var originalTotal;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt;
  cartItems = cartDisp.children;
  subTot = 0;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < useProductData.products.length; idx++) {
    if (useProductData.products[idx].q < 5 && useProductData.products[idx].q > 0) {
      lowStockItems.push(useProductData.products[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < useProductData.products.length; j++) {
        if (useProductData.products[j].id === cartItems[i].id) {
          curItem = useProductData.products[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          // ✅ 상수 적용
          elem.style.fontWeight = q >= DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD ? "bold" : "normal";
        }
      });

      if (q >= DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD) {
        disc = (DISCOUNT_RULES.ITEM_DISCOUNT_RATES[curItem.id] || 0) / 100;
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: DISCOUNT_RULES.ITEM_DISCOUNT_RATES[curItem.id] });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  var originalTotal = subTot;

  // ✅ 상수 적용: 대량 할인
  if (itemCnt >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
    totalAmt = subTot * (1 - DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100);
    discRate = DISCOUNT_RULES.BULK_DISCOUNT_RATE / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const today = new Date();
  const isSpecialDiscount = isSpecialDiscountDay(today);
  const tuesdaySpecial = document.getElementById("tuesday-special");

  if (isSpecialDiscount) {
    if (totalAmt > 0) {
      totalAmt *= 1 - DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
  document.getElementById("item-count").textContent = `🛍️ ${itemCnt} items in cart`;
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (let j = 0; j < useProductData.products.length; j++) {
        if (useProductData.products[j].id === cartItems[i].id) {
          curItem = useProductData.products[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
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
    // ✅ 상수 적용: 대량 할인 표시
    if (itemCnt >= DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${DISCOUNT_RULES.BULK_DISCOUNT_THRESHOLD}개 이상)</span>
          <span class="text-xs">-${DISCOUNT_RULES.BULK_DISCOUNT_RATE}%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (${DISCOUNT_RULES.ITEM_DISCOUNT_THRESHOLD}개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isSpecialDiscount) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 ${DISCOUNT_RULES.SPECIAL_DISCOUNT_DAYS.map(getKoreanDayName).join(", ")} 추가 할인</span>
            <span class="text-xs">-${DISCOUNT_RULES.SPECIAL_DISCOUNT_RATE}%</span>
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
  totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / POINTS_RULES.BASE_CALCULATION_UNIT);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }
  discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
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
  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
  stockMsg = "";
  for (let stockIdx = 0; stockIdx < useProductData.products.length; stockIdx++) {
    const item = useProductData.products[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        stockMsg = `${stockMsg + item.name}: 품절\n`;
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  if (cartDisp.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }
  basePoints = Math.floor(totalAmt / POINTS_RULES.BASE_CALCULATION_UNIT);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // ✅ 유연한 특별 포인트 날짜 체크
  if (isSpecialPointsDay()) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINTS_RULES.SPECIAL_POINTS_MULTIPLIER;
      pointsDetail.push(
        `${POINTS_RULES.SPECIAL_POINTS_DAYS.map(getKoreanDayName).join(", ")} ${POINTS_RULES.SPECIAL_POINTS_MULTIPLIER}배`,
      );
    }
  }

  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < useProductData.products.length; pIdx++) {
      if (useProductData.products[pIdx].id === node.id) {
        product = useProductData.products[pIdx];
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

  // ✅ 상수 적용: 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints += POINTS_RULES.COMBO_BONUS.KEYBOARD_MOUSE;
    pointsDetail.push(`키보드+마우스 세트 +${POINTS_RULES.COMBO_BONUS.KEYBOARD_MOUSE}p`);
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINTS_RULES.COMBO_BONUS.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINTS_RULES.COMBO_BONUS.FULL_SET}p`);
  }

  // ✅ 상수 적용: 수량별 보너스
  if (itemCnt >= POINTS_RULES.QUANTITY_BONUS.TIER_3.threshold) {
    finalPoints += POINTS_RULES.QUANTITY_BONUS.TIER_3.bonus;
    pointsDetail.push(
      `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_3.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_3.bonus}p`,
    );
  } else if (itemCnt >= POINTS_RULES.QUANTITY_BONUS.TIER_2.threshold) {
    finalPoints += POINTS_RULES.QUANTITY_BONUS.TIER_2.bonus;
    pointsDetail.push(
      `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_2.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_2.bonus}p`,
    );
  } else if (itemCnt >= POINTS_RULES.QUANTITY_BONUS.TIER_1.threshold) {
    finalPoints += POINTS_RULES.QUANTITY_BONUS.TIER_1.bonus;
    pointsDetail.push(
      `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_1.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_1.bonus}p`,
    );
  }

  bonusPts = finalPoints;
  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>`;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};
function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < useProductData.products.length; i++) {
    currentProduct = useProductData.products[i];
    sum += currentProduct.q;
  }
  return sum;
}
var handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_CRITICAL) {
  }
  useProductData.products.forEach(function (item) {
    if (item.q < STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.q > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });
  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < useProductData.products.length; productIdx++) {
      if (useProductData.products[productIdx].id === itemId) {
        product = useProductData.products[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector(".text-lg");
      const nameDiv = cartItems[i].querySelector("h3");
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
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener("click", function () {
  const selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < useProductData.products.length; idx++) {
    if (useProductData.products[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < useProductData.products.length; j++) {
    if (useProductData.products[j].id === selItem) {
      itemToAdd = useProductData.products[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem.textContent) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className =
        "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? "⚡💝" : itemToAdd.onSale ? "⚡" : itemToAdd.suggestSale ? "💝" : ""}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
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
cartDisp.addEventListener("click", function (event) {
  const tgt = event.target;
  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < useProductData.products.length; prdIdx++) {
      if (useProductData.products[prdIdx].id === prodId) {
        prod = useProductData.products[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector(".quantity-number");
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      var qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

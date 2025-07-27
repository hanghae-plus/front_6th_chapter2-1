// ========================
// 상수 정의 (Constants)
// ========================
const PRODUCT_IDS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
};

const DISCOUNT_CONFIG = {
  BULK_THRESHOLD: 10,
  BULK_DISCOUNT_THRESHOLD: 30,
  BULK_DISCOUNT_RATE: 0.25,
  LOW_STOCK_THRESHOLD: 5,
  STOCK_WARNING_THRESHOLD: 50,
  LIGHTNING_SALE_DISCOUNT: 0.2,
  SUGGEST_SALE_DISCOUNT: 0.05,
  TUESDAY_DISCOUNT: 0.1,
};

const PRODUCT_DISCOUNTS = {
  [PRODUCT_IDS.KEYBOARD]: 0.1,
  [PRODUCT_IDS.MOUSE]: 0.15,
  [PRODUCT_IDS.MONITOR_ARM]: 0.2,
  [PRODUCT_IDS.LAPTOP_POUCH]: 0.05,
  [PRODUCT_IDS.SPEAKER]: 0.25,
};

const LOYALTY_POINTS_CONFIG = {
  BASE_RATE: 0.001, // 0.1%
  TUESDAY_MULTIPLIER: 2,
  COMBO_BONUS: {
    KEYBOARD_MOUSE: 50,
    FULL_SET: 100,
  },
  BULK_BONUS: {
    THRESHOLD_10: { min: 10, points: 20 },
    THRESHOLD_20: { min: 20, points: 50 },
    THRESHOLD_30: { min: 30, points: 100 },
  },
};

const TIMER_CONFIG = {
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
  SUGGEST_SALE_INTERVAL: 60000, // 60초
  LIGHTNING_DELAY_MAX: 10000, // 10초
  SUGGEST_DELAY_MAX: 20000, // 20초
};

// ========================
// 전역 상태 (추후 제거 예정)
// ========================
var prodList;
var bonusPts = 0;
var stockInfo;
var itemCnt;
var lastSel;
var sel;
var addBtn;
var totalAmt = 0;
var cartDisp;
// ========================
// 유틸리티 순수 함수들 (Pure Functions)
// ========================

// 날짜 관련 유틸리티
function isTuesday() {
  return new Date().getDay() === 2;
}

// 상품 찾기 유틸리티
function findProductById(products, productId) {
  return products.find((product) => product.id === productId) || null;
}

// 재고 관련 유틸리티
function getTotalStock(products) {
  return products.reduce((total, product) => total + product.q, 0);
}

function getLowStockItems(products) {
  return products.filter(
    (product) =>
      product.q < DISCOUNT_CONFIG.LOW_STOCK_THRESHOLD && product.q > 0
  );
}

function getOutOfStockItems(products) {
  return products.filter((product) => product.q === 0);
}

// 할인 계산 유틸리티
function calculateProductDiscount(productId, quantity) {
  if (quantity < DISCOUNT_CONFIG.BULK_THRESHOLD) return 0;
  return PRODUCT_DISCOUNTS[productId] || 0;
}

function calculateBulkDiscount(totalQuantity) {
  return totalQuantity >= DISCOUNT_CONFIG.BULK_DISCOUNT_THRESHOLD
    ? DISCOUNT_CONFIG.BULK_DISCOUNT_RATE
    : 0;
}

// 포인트 계산 유틸리티
function calculateBasePoints(amount) {
  return Math.floor(amount * LOYALTY_POINTS_CONFIG.BASE_RATE);
}

function calculateBulkBonusPoints(itemCount) {
  const { THRESHOLD_30, THRESHOLD_20, THRESHOLD_10 } =
    LOYALTY_POINTS_CONFIG.BULK_BONUS;

  if (itemCount >= THRESHOLD_30.min) return THRESHOLD_30.points;
  if (itemCount >= THRESHOLD_20.min) return THRESHOLD_20.points;
  if (itemCount >= THRESHOLD_10.min) return THRESHOLD_10.points;
  return 0;
}

// ========================
// 제품 데이터 생성 함수 (Pure Function)
// ========================
function createInitialProducts() {
  return [
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
  ];
}

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
  prodList = createInitialProducts();
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
  leftColumn["className"] =
    "bg-white border border-gray-200 p-8 overflow-y-auto";
  selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";
  sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
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
  manualOverlay.className =
    "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
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
  var initStock = 0;
  for (var i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const availableProducts = prodList.filter(
        (item) => item.q > 0 && !item.onSale
      );
      if (availableProducts.length === 0) return;

      const luckyIdx = Math.floor(Math.random() * availableProducts.length);
      const luckyItem = availableProducts[luckyIdx];

      luckyItem.val = Math.round(
        luckyItem.originalVal * (1 - DISCOUNT_CONFIG.LIGHTNING_SALE_DISCOUNT)
      );
      luckyItem.onSale = true;
      alert(
        `⚡번개세일! ${luckyItem.name}이(가) ${
          DISCOUNT_CONFIG.LIGHTNING_SALE_DISCOUNT * 100
        }% 할인 중입니다!`
      );
      onUpdateSelectOptions();
      doUpdatePricesInCart();
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0 || !lastSel) return;

      const suggest = prodList.find(
        (product) =>
          product.id !== lastSel && product.q > 0 && !product.suggestSale
      );

      if (suggest) {
        alert(
          `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${
            DISCOUNT_CONFIG.SUGGEST_SALE_DISCOUNT * 100
          }% 추가 할인!`
        );
        suggest.val = Math.round(
          suggest.val * (1 - DISCOUNT_CONFIG.SUGGEST_SALE_DISCOUNT)
        );
        suggest.suggestSale = true;
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_CONFIG.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIMER_CONFIG.SUGGEST_DELAY_MAX);
}
var sum;
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  sel.innerHTML = "";
  totalStock = 0;
  for (var idx = 0; idx < prodList.length; idx++) {
    var _p = prodList[idx];
    totalStock = totalStock + _p.q;
  }
  for (var i = 0; i < prodList.length; i++) {
    (function () {
      var item = prodList[i];
      opt = document.createElement("option");
      opt.value = item.id;
      discountText = "";
      if (item.onSale) discountText += " ⚡SALE";
      if (item.suggestSale) discountText += " 💝추천";
      if (item.q === 0) {
        opt.textContent =
          item.name + " - " + item.val + "원 (품절)" + discountText;
        opt.disabled = true;
        opt.className = "text-gray-400";
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent =
            "⚡💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (25% SUPER SALE!)";
          opt.className = "text-purple-600 font-bold";
        } else if (item.onSale) {
          opt.textContent =
            "⚡" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (20% SALE!)";
          opt.className = "text-red-500 font-bold";
        } else if (item.suggestSale) {
          opt.textContent =
            "💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (5% 추천할인!)";
          opt.className = "text-blue-500 font-bold";
        } else {
          opt.textContent = item.name + " - " + item.val + "원" + discountText;
        }
      }
      sel.appendChild(opt);
    })();
  }
  if (totalStock < 50) {
    sel.style.borderColor = "orange";
  } else {
    sel.style.borderColor = "";
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
  cartItems = cartDisp.children;
  subTot = 0;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
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
      var qtyElem = cartItems[i].querySelector(".quantity-number");
      var q;
      var itemTot;
      var disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
        }
      });
      if (q >= DISCOUNT_CONFIG.BULK_THRESHOLD) {
        disc = calculateProductDiscount(curItem.id, q);
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  var originalTotal = subTot;

  // 대량 구매 할인 적용
  const bulkDiscount = calculateBulkDiscount(itemCnt);
  if (bulkDiscount > 0) {
    totalAmt = subTot * (1 - bulkDiscount);
    discRate = bulkDiscount;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 추가 할인
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday()) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * (1 - DISCOUNT_CONFIG.TUESDAY_DISCOUNT);
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
  document.getElementById("item-count").textContent =
    "🛍️ " + itemCnt + " items in cart";
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector(".quantity-number");
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
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

    if (itemCnt >= DISCOUNT_CONFIG.BULK_DISCOUNT_THRESHOLD) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${
            DISCOUNT_CONFIG.BULK_DISCOUNT_THRESHOLD
          }개 이상)</span>
          <span class="text-xs">-${
            DISCOUNT_CONFIG.BULK_DISCOUNT_RATE * 100
          }%</span>
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
    if (isTuesday()) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-${
              DISCOUNT_CONFIG.TUESDAY_DISCOUNT * 100
            }%</span>
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
    totalDiv.textContent = "₩" + Math.round(totalAmt).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
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
          <span class="text-sm font-medium text-green-400">${(
            discRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = "🛍️ " + itemCnt + " items in cart";
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
  stockMsg = "";

  for (var stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    var item = prodList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg =
          stockMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
  if (cartDisp.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }

  let finalPoints = 0;
  const pointsDetail = [];

  // 기본 포인트 계산
  const basePoints = calculateBasePoints(totalAmt);
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // 화요일 2배 적용
  if (isTuesday() && basePoints > 0) {
    finalPoints = basePoints * LOYALTY_POINTS_CONFIG.TUESDAY_MULTIPLIER;
    pointsDetail.push("화요일 2배");
  }

  // 콤보 보너스 체크
  const cartProducts = Array.from(cartDisp.children)
    .map((node) => findProductById(prodList, node.id))
    .filter(Boolean);

  const hasKeyboard = cartProducts.some((p) => p.id === PRODUCT_IDS.KEYBOARD);
  const hasMouse = cartProducts.some((p) => p.id === PRODUCT_IDS.MOUSE);
  const hasMonitorArm = cartProducts.some(
    (p) => p.id === PRODUCT_IDS.MONITOR_ARM
  );

  if (hasKeyboard && hasMouse) {
    finalPoints += LOYALTY_POINTS_CONFIG.COMBO_BONUS.KEYBOARD_MOUSE;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += LOYALTY_POINTS_CONFIG.COMBO_BONUS.FULL_SET;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 대량 구매 보너스
  const bulkBonus = calculateBulkBonusPoints(itemCnt);
  if (bulkBonus > 0) {
    finalPoints += bulkBonus;
    if (itemCnt >= 30) pointsDetail.push("대량구매(30개+) +100p");
    else if (itemCnt >= 20) pointsDetail.push("대량구매(20개+) +50p");
    else if (itemCnt >= 10) pointsDetail.push("대량구매(10개+) +20p");
  }

  bonusPts = finalPoints;
  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(
          ", "
        )}</div>`;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};
function onGetStockTotal() {
  return getTotalStock(prodList);
}

var handleStockInfoUpdate = function () {
  const infoMsg = prodList
    .filter((item) => item.q < DISCOUNT_CONFIG.LOW_STOCK_THRESHOLD)
    .map((item) => {
      if (item.q > 0) {
        return `${item.name}: 재고 부족 (${item.q}개 남음)`;
      } else {
        return `${item.name}: 품절`;
      }
    })
    .join("\n");

  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  var totalCount = 0,
    j = 0;
  var cartItems;
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(
      cartDisp.children[j].querySelector(".quantity-number").textContent
    );
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
      var priceDiv = cartItems[i].querySelector(".text-lg");
      var nameDiv = cartItems[i].querySelector("h3");
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "⚡💝" + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "⚡" + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          "</span>";
        nameDiv.textContent = "💝" + product.name;
      } else {
        priceDiv.textContent = "₩" + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener("click", function () {
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
    var item = document.getElementById(itemToAdd["id"]);
    if (item) {
      var qtyElem = item.querySelector(".quantity-number");
      var newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className =
        "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${
            itemToAdd.onSale && itemToAdd.suggestSale
              ? "⚡💝"
              : itemToAdd.onSale
              ? "⚡"
              : itemToAdd.suggestSale
              ? "💝"
              : ""
          }${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${
            itemToAdd.onSale || itemToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? "text-purple-600"
                  : itemToAdd.onSale
                  ? "text-red-500"
                  : "text-blue-500") +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                "</span>"
              : "₩" + itemToAdd.val.toLocaleString()
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
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? "text-purple-600"
                  : itemToAdd.onSale
                  ? "text-red-500"
                  : "text-blue-500") +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                "</span>"
              : "₩" + itemToAdd.val.toLocaleString()
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
cartDisp.addEventListener("click", function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
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
    if (tgt.classList.contains("quantity-change")) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector(".quantity-number");
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;
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

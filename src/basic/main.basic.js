import {
  DISCOUNT_RATE_PRODUCT_1,
  DISCOUNT_RATE_PRODUCT_2,
  DISCOUNT_RATE_PRODUCT_3,
  DISCOUNT_RATE_PRODUCT_4,
  DISCOUNT_RATE_PRODUCT_5,
  DISCOUNT_RATE_BULK,
  DISCOUNT_RATE_TUESDAY,
  DISCOUNT_RATE_LIGHTNING,
  DISCOUNT_RATE_SUGGESTION,
} from "./data/discount.data.js";
import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  PRODUCT_5,
  PRODUCT_LIST,
} from "./data/product.data.js";
import {
  MIN_QUANTITY_FOR_DISCOUNT,
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
  LOW_STOCK_THRESHOLD,
  TOTAL_STOCK_WARNING_THRESHOLD,
} from "./data/quantity.data.js";
import {
  POINT_RATE_BASE,
  POINT_BONUS_KEYBOARD_MOUSE_SET,
  POINT_BONUS_FULL_SET,
  POINT_BONUS_QUANTITY_TIER1,
  POINT_BONUS_QUANTITY_TIER2,
  POINT_BONUS_QUANTITY_TIER3,
  POINT_MULTIPLIER_TUESDAY,
} from "./data/point.data.js";
import {
  LIGHTNING_SALE_MAX_DELAY,
  LIGHTNING_SALE_INTERVAL,
  SUGGESTION_SALE_INTERVAL,
  SUGGESTION_SALE_MAX_DELAY,
} from "./data/time.data.js";
import { TUESDAY_DAY_OF_WEEK } from "./data/date.data.js";

// 상태 변수
let itemCounts;
let lastSelect;
let totalAmount = 0;

// DOM 요소
let stockInfo;
let select;
let addButton;
let cartDisplay;

function main() {
  let root;
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;

  totalAmount = 0;
  itemCounts = 0;
  lastSelect = null;

  root = document.getElementById("app");

  header = document.createElement("div");
  header.className = "mb-8";
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  select = document.createElement("select");
  select.id = "product-select";
  select.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";

  leftColumn = document.createElement("div");
  leftColumn["className"] = "bg-white border border-gray-200 p-8 overflow-y-auto";

  selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  addButton = document.createElement("button");
  stockInfo = document.createElement("div");
  addButton.id = "add-to-cart";
  stockInfo.id = "stock-status";
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  addButton.innerHTML = "Add to Cart";
  addButton.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  selectorContainer.appendChild(select);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisplay = document.createElement("div");
  leftColumn.appendChild(cartDisplay);
  cartDisplay.id = "cart-items";
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
  let initStock = 0;
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    initStock += PRODUCT_LIST[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * LIGHTNING_SALE_MAX_DELAY;
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * (100 - DISCOUNT_RATE_LIGHTNING)) / 100);
        luckyItem.onSale = true;
        alert(
          "⚡번개세일! " + luckyItem.name + "이(가) " + DISCOUNT_RATE_LIGHTNING + "% 할인 중입니다!"
        );
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(() => {
    setInterval(() => {
      if (cartDisplay.children.length === 0) {
      }
      if (lastSelect) {
        let suggest = null;
        for (let k = 0; k < PRODUCT_LIST.length; k++) {
          if (PRODUCT_LIST[k].id !== lastSelect) {
            if (PRODUCT_LIST[k].q > 0) {
              if (!PRODUCT_LIST[k].suggestSale) {
                suggest = PRODUCT_LIST[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            "💝 " +
              suggest.name +
              "은(는) 어떠세요? 지금 구매하시면 " +
              DISCOUNT_RATE_SUGGESTION +
              "% 추가 할인!"
          );
          suggest.val = Math.round((suggest.val * (100 - DISCOUNT_RATE_SUGGESTION)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, SUGGESTION_SALE_INTERVAL);
  }, Math.random() * SUGGESTION_SALE_MAX_DELAY);
}

function onUpdateSelectOptions() {
  select.innerHTML = "";

  // 총 재고 계산
  let totalStock = 0;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    const _p = PRODUCT_LIST[idx];
    totalStock = totalStock + _p.q;
  }

  // 옵션 생성
  for (let i = 0; i < PRODUCT_LIST.length; i++) {
    (function () {
      const item = PRODUCT_LIST[i];
      const opt = document.createElement("option");
      opt.value = item.id;
      let discountText = "";
      if (item.onSale) {
        discountText += " ⚡SALE";
      }
      if (item.suggestSale) {
        discountText += " 💝추천";
      }
      if (item.q === 0) {
        opt.textContent = item.name + " - " + item.val + "원 (품절)" + discountText;
        opt.disabled = true;
        opt.className = "text-gray-400";
      } else {
        if (item.onSale && item.suggestSale) {
          const superSaleRate = DISCOUNT_RATE_LIGHTNING + DISCOUNT_RATE_SUGGESTION;
          opt.textContent =
            "⚡💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (" +
            superSaleRate +
            "% SUPER SALE!)";
          opt.className = "text-purple-600 font-bold";
        } else if (item.onSale) {
          opt.textContent =
            "⚡" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (" +
            DISCOUNT_RATE_LIGHTNING +
            "% SALE!)";
          opt.className = "text-red-500 font-bold";
        } else if (item.suggestSale) {
          opt.textContent =
            "💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (" +
            DISCOUNT_RATE_SUGGESTION +
            "% 추천할인!)";
          opt.className = "text-blue-500 font-bold";
        } else {
          opt.textContent = item.name + " - " + item.val + "원" + discountText;
        }
      }
      select.appendChild(opt);
    })();
  }
  if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
    select.style.borderColor = "orange";
  } else {
    select.style.borderColor = "";
  }
}

function handleCalculateCartStuff() {
  // 초기화
  totalAmount = 0;
  itemCounts = 0;
  let originalTotal = totalAmount;
  const cartItems = cartDisplay.children;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].q < LOW_STOCK_THRESHOLD && PRODUCT_LIST[idx].q > 0) {
      lowStockItems.push(PRODUCT_LIST[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
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
      itemCounts += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(elem => {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= MIN_QUANTITY_FOR_DISCOUNT ? "bold" : "normal";
        }
      });
      if (q >= MIN_QUANTITY_FOR_DISCOUNT) {
        if (curItem.id === PRODUCT_1) {
          disc = DISCOUNT_RATE_PRODUCT_1 / 100;
        } else {
          if (curItem.id === PRODUCT_2) {
            disc = DISCOUNT_RATE_PRODUCT_2 / 100;
          } else {
            if (curItem.id === PRODUCT_3) {
              disc = DISCOUNT_RATE_PRODUCT_3 / 100;
            } else {
              if (curItem.id === PRODUCT_4) {
                disc = DISCOUNT_RATE_PRODUCT_4 / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = DISCOUNT_RATE_PRODUCT_5 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  originalTotal = subTot;
  if (itemCounts >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    totalAmount = (subTot * (100 - DISCOUNT_RATE_BULK)) / 100;
    discRate = DISCOUNT_RATE_BULK / 100;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }
  const today = new Date();
  const isTuesday = today.getDay() === TUESDAY_DAY_OF_WEEK;
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * (100 - DISCOUNT_RATE_TUESDAY)) / 100;
      discRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  // DOM 업데이트
  document.getElementById("item-count").textContent = "🛍️ " + itemCounts + " items in cart";
  const summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
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
    if (itemCounts >= 30) {
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
    if (isTuesday) {
      if (totalAmount > 0) {
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

  // 총액 및 포인트 표시
  const cartTotalElement = document.getElementById("cart-total");
  const totalDiv = cartTotalElement.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmount).toLocaleString();
  }

  const loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / POINT_RATE_BASE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (discRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
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

  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = "🛍️ " + itemCounts + " items in cart";
    if (previousCount !== itemCounts) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }

  // 재고 메시지 생성
  let stockMsg = "";
  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const item = PRODUCT_LIST[stockIdx];
    if (item.q < LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

const doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  if (cartDisplay.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }
  basePoints = Math.floor(totalAmount / POINT_RATE_BASE);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }
  if (new Date().getDay() === TUESDAY_DAY_OF_WEEK) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_MULTIPLIER_TUESDAY;
      pointsDetail.push("화요일 2배");
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisplay.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < PRODUCT_LIST.length; pIdx++) {
      if (PRODUCT_LIST[pIdx].id === node.id) {
        product = PRODUCT_LIST[pIdx];
        break;
      }
    }
    if (!product) {
      continue;
    }
    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_BONUS_KEYBOARD_MOUSE_SET;
    pointsDetail.push("키보드+마우스 세트 +" + POINT_BONUS_KEYBOARD_MOUSE_SET + "p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_BONUS_FULL_SET;
    pointsDetail.push("풀세트 구매 +" + POINT_BONUS_FULL_SET + "p");
  }
  if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER3;
    pointsDetail.push(
      "대량구매(" + MIN_QUANTITY_FOR_POINT_BONUS_TIER3 + "개+) +" + POINT_BONUS_QUANTITY_TIER3 + "p"
    );
  } else {
    if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
      finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER2;
      pointsDetail.push(
        "대량구매(" +
          MIN_QUANTITY_FOR_POINT_BONUS_TIER2 +
          "개+) +" +
          POINT_BONUS_QUANTITY_TIER2 +
          "p"
      );
    } else {
      if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
        finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER1;
        pointsDetail.push(
          "대량구매(" +
            MIN_QUANTITY_FOR_POINT_BONUS_TIER1 +
            "개+) +" +
            POINT_BONUS_QUANTITY_TIER1 +
            "p"
        );
      }
    }
  }
  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(", ") +
        "</div>";
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
  for (i = 0; i < PRODUCT_LIST.length; i++) {
    currentProduct = PRODUCT_LIST[i];
    sum += currentProduct.q;
  }
  return sum;
}

const handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < MIN_QUANTITY_FOR_BULK_DISCOUNT) {
  }
  PRODUCT_LIST.forEach(item => {
    if (item.q < LOW_STOCK_THRESHOLD) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });
  stockInfo.textContent = infoMsg;
};

function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (cartDisplay.children[j]) {
    const qty = cartDisplay.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(cartDisplay.children[j].querySelector(".quantity-number").textContent);
  }
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector(".text-lg");
      const nameDiv = cartItems[i].querySelector("h3");
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

addButton.addEventListener("click", () => {
  const selItem = select.value;
  let hasItem = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selItem) {
      itemToAdd = PRODUCT_LIST[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd["id"]);
    if (item) {
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
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
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500") + '">₩' + itemToAdd.val.toLocaleString() + "</span>" : "₩" + itemToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500") + '">₩' + itemToAdd.val.toLocaleString() + "</span>" : "₩" + itemToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSelect = selItem;
  }
});

cartDisplay.addEventListener("click", event => {
  const tgt = event.target;
  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
      if (PRODUCT_LIST[prdIdx].id === prodId) {
        prod = PRODUCT_LIST[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector(".quantity-number");
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
      const qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

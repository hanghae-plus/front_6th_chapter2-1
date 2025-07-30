import GetProductListService from "../core/_service/get-product-list";
import DiscountRate from "../core/domain/vo/discount-rate";
import Quantity from "../core/domain/vo/quantity";
import InMemoryProductRepository from "../infrastructure/repositories/product/inmemory-product-repository";
import { sumMap } from "../utils/math";
import { createElementFromHTML } from "../utils/dom";

const productRepository = new InMemoryProductRepository();
const getProductListService = new GetProductListService(productRepository);
const prodList = getProductListService.execute();

// 상품 ID 상수
const PRODUCT_1 = "p1";
const PRODUCT_2 = "p2";
const PRODUCT_3 = "p3";
const PRODUCT_4 = "p4";
const PRODUCT_5 = "p5";

// 재고 관련 상수
const TOTAL_STOCK_WARNING_THRESHOLD = 50; // 총 재고 경고 임계값
const LOW_STOCK_THRESHOLD = 5; // 재고 부족 임계값

// 할인 관련 상수
const INDIVIDUAL_DISCOUNT_MIN_QUANTITY = 10; // 개별 할인 최소 수량
const BULK_20_MIN_QUANTITY = 20; // 20개 이상 보너스 최소 수량
const BULK_DISCOUNT_MIN_QUANTITY = 30; // 대량 할인 최소 수량

// 할인율 상수 (퍼센트)
const PRODUCT_1_DISCOUNT_RATE = 10;
const PRODUCT_2_DISCOUNT_RATE = 15;
const PRODUCT_3_DISCOUNT_RATE = 20;
const PRODUCT_4_DISCOUNT_RATE = 5;
const PRODUCT_5_DISCOUNT_RATE = 25;
const LIGHTNING_SALE_DISCOUNT_RATE = 20;
const SUGGESTION_DISCOUNT_RATE = 5;
const BULK_DISCOUNT_RATE = 25;
const TUESDAY_DISCOUNT_RATE = 10;

// 타이머 상수 (밀리초)
const LIGHTNING_SALE_MAX_DELAY = 10000; // 번개세일 최대 지연시간 (10초)
const LIGHTNING_SALE_INTERVAL = 30000; // 번개세일 간격 (30초)
const SUGGESTION_MAX_DELAY = 20000; // 추천할인 최대 지연시간 (20초)
const SUGGESTION_INTERVAL = 60000; // 추천할인 간격 (60초)

// 포인트 관련 상수
const POINTS_PER_THOUSAND = 1000; // 1000원당 1포인트
const KEYBOARD_MOUSE_BONUS_POINTS = 50; // 키보드+마우스 세트 보너스
const FULL_SET_BONUS_POINTS = 100; // 풀세트 보너스
const BULK_10_BONUS_POINTS = 20; // 10개 이상 구매 보너스
const BULK_20_BONUS_POINTS = 50; // 20개 이상 구매 보너스
const BULK_30_BONUS_POINTS = 100; // 30개 이상 구매 보너스

// 관심사별 상태 객체들
const uiElements = {
  addBtn: null,
  stockInfo: null,
  cartDisp: null,
};

const cartState = {
  totalAmt: 0,
  itemCnt: 0,
  bonusPts: 0,
  lastSelectedProductId: null,
};

const renderSelectOption = (product) => {
  // 품절 상품 처리
  if (product.quantity.equals(new Quantity(0))) {
    return createElementFromHTML(`
      <option value="${product.id}" disabled class="text-gray-400">
        ${product.name} - ${product.price.getAmount()}원 (품절)
      </option>
    `);
  }

  // 할인 상품 처리
  if (product.onSale && product.suggestSale) {
    return createElementFromHTML(`
      <option value="${product.id}" class="text-purple-600 font-bold">
        ⚡💝${product.name} - ${product.originalVal}원 → ${product.price.getAmount()}원 (${LIGHTNING_SALE_DISCOUNT_RATE + SUGGESTION_DISCOUNT_RATE}% SUPER SALE!)
      </option>
    `);
  }
  
  if (product.onSale) {
    return createElementFromHTML(`
      <option value="${product.id}" class="text-red-500 font-bold">
        ⚡${product.name} - ${product.originalVal}원 → ${product.price.getAmount()}원 (${LIGHTNING_SALE_DISCOUNT_RATE}% SALE!)
      </option>
    `);
  }
  
  if (product.suggestSale) {
    return createElementFromHTML(`
      <option value="${product.id}" class="text-blue-500 font-bold">
        💝${product.name} - ${product.originalVal}원 → ${product.price.getAmount()}원 (${SUGGESTION_DISCOUNT_RATE}% 추천할인!)
      </option>
    `);
  }

  // 일반 상품
  return createElementFromHTML(`
    <option value="${product.id}">
      ${product.name} - ${product.price.getAmount()}원
    </option>
  `);
};

let sel;
function updateSelectOptions() {
  sel.innerHTML = "";
  const totalStock = sumMap(prodList, (item) => item.quantity.getQuantity());
  for (let i = 0; i < prodList.length; i++) {
    const opt = renderSelectOption(prodList[i]);
    sel.appendChild(opt);
  }
  if (totalStock < TOTAL_STOCK_WARNING_THRESHOLD) {
    sel.style.borderColor = "orange";
  } else {
    sel.style.borderColor = "";
  }
}

function main() {
  let header;
  let gridContainer;
  let leftColumn;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;
  cartState.totalAmt = 0;
  cartState.itemCnt = 0;
  cartState.lastSelectedProductId = null;
  const root = document.getElementById("app");
  header = createElementFromHTML(`
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  `);

  // 상품 선택 select 컨테이너 생성
  const selectorContainer = createElementFromHTML(`
    <div class="mb-6 pb-6 border-b border-gray-200"></div>
  `);

  // 상품 선택 select 생성
  sel = createElementFromHTML(`
    <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
  `);

  // 상품 선택 select 추가
  selectorContainer.appendChild(sel);

  gridContainer = createElementFromHTML(`
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"></div>
  `);
  leftColumn = createElementFromHTML(`
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto"></div>
  `);
  uiElements.addBtn = createElementFromHTML(`
    <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
  `);
  uiElements.stockInfo = createElementFromHTML(`
    <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
  `);
  selectorContainer.appendChild(uiElements.addBtn);
  selectorContainer.appendChild(uiElements.stockInfo);
  leftColumn.appendChild(selectorContainer);
  uiElements.cartDisp = createElementFromHTML(`
    <div id="cart-items"></div>
  `);
  leftColumn.appendChild(uiElements.cartDisp);
  rightColumn = createElementFromHTML(`
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
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide">Tuesday Special ${TUESDAY_DISCOUNT_RATE}% Applied</span>
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
    </div>
  `);
  sum = rightColumn.querySelector("#cart-total");
  manualToggle = createElementFromHTML(`
    <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `);
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };
  manualOverlay = createElementFromHTML(`
    <div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"></div>
  `);
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };
  manualColumn = createElementFromHTML(`
    <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
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
    </div>
  `);
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  updateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * LIGHTNING_SALE_MAX_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (
        luckyItem.quantity.isGreaterThan(new Quantity(0)) &&
        !luckyItem.onSale
      ) {
        const discountRate = new DiscountRate.fromPercentage(
          LIGHTNING_SALE_DISCOUNT_RATE
        );
        luckyItem.price = luckyItem.price.applyDiscount(discountRate);
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${LIGHTNING_SALE_DISCOUNT_RATE}% 할인 중입니다!`
        );
        updateSelectOptions();
        doUpdatePricesInCart();
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (uiElements.cartDisp.children.length === 0) {
      }
      if (cartState.lastSelectedProductId) {
        let suggest = null;
        for (let k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== cartState.lastSelectedProductId) {
            if (
              prodList[k].quantity.isGreaterThan(new Quantity(0)) &&
              !prodList[k].suggestSale
            ) {
              suggest = prodList[k];
              break;
            }
          }
        }
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${SUGGESTION_DISCOUNT_RATE}% 추가 할인!`
          );
          const discountRate = new DiscountRate.fromPercentage(
            SUGGESTION_DISCOUNT_RATE
          );
          suggest.price = suggest.price.applyDiscount(discountRate);
          suggest.suggestSale = true;
          updateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, SUGGESTION_INTERVAL);
  }, Math.random() * SUGGESTION_MAX_DELAY);
}
let sum;

function handleCalculateCartStuff() {
  let cartItems;
  let subTot;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let bulkDisc;
  let itemDisc;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMsg;
  let pts;
  let loyaltyDiv;
  cartState.totalAmt = 0;
  cartState.itemCnt = 0;
  originalTotal = cartState.totalAmt;
  cartItems = uiElements.cartDisp.children;
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < prodList.length; idx++) {
    if (
      prodList[idx].quantity.isLessThan(new Quantity(LOW_STOCK_THRESHOLD)) &&
      prodList[idx].quantity.isGreaterThan(new Quantity(0))
    ) {
      lowStockItems.push(prodList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.price.getAmount() * q;
      disc = 0;
      cartState.itemCnt += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight =
            q >= INDIVIDUAL_DISCOUNT_MIN_QUANTITY ? "bold" : "normal";
        }
      });
      if (q >= INDIVIDUAL_DISCOUNT_MIN_QUANTITY) {
        if (curItem.id === PRODUCT_1) {
          disc = PRODUCT_1_DISCOUNT_RATE / 100;
        } else {
          if (curItem.id === PRODUCT_2) {
            disc = PRODUCT_2_DISCOUNT_RATE / 100;
          } else {
            if (curItem.id === PRODUCT_3) {
              disc = PRODUCT_3_DISCOUNT_RATE / 100;
            } else {
              if (curItem.id === PRODUCT_4) {
                disc = PRODUCT_4_DISCOUNT_RATE / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = PRODUCT_5_DISCOUNT_RATE / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      cartState.totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  originalTotal = subTot;
  if (cartState.itemCnt >= BULK_DISCOUNT_MIN_QUANTITY) {
    cartState.totalAmt = (subTot * (100 - BULK_DISCOUNT_RATE)) / 100;
    discRate = BULK_DISCOUNT_RATE / 100;
  } else {
    discRate = (subTot - cartState.totalAmt) / subTot;
  }
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (cartState.totalAmt > 0) {
      cartState.totalAmt =
        (cartState.totalAmt * (100 - TUESDAY_DISCOUNT_RATE)) / 100;
      discRate = 1 - cartState.totalAmt / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
  document.getElementById(
    "item-count"
  ).textContent = `🛍️ ${cartState.itemCnt} items in cart`;
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.price.getAmount() * q;
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
    if (cartState.itemCnt >= BULK_DISCOUNT_MIN_QUANTITY) {
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
      if (cartState.totalAmt > 0) {
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
  totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(
      cartState.totalAmt
    ).toLocaleString()}`;
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(cartState.totalAmt / POINTS_PER_THOUSAND);
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
  if (discRate > 0 && cartState.totalAmt > 0) {
    savedAmount = originalTotal - cartState.totalAmt;
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
    itemCountElement.textContent = `🛍️ ${cartState.itemCnt} items in cart`;
    if (previousCount !== cartState.itemCnt) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
  stockMsg = "";
  for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    const item = prodList[stockIdx];
    if (item.quantity.isLessThan(new Quantity(LOW_STOCK_THRESHOLD))) {
      if (item.quantity.isGreaterThan(new Quantity(0))) {
        stockMsg += `${
          item.name
        }: 재고 부족 (${item.quantity.getQuantity()}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  }
  uiElements.stockInfo.textContent = stockMsg;
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
  const nodes = uiElements.cartDisp.children;
  if (uiElements.cartDisp.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }
  basePoints = Math.floor(cartState.totalAmt / POINTS_PER_THOUSAND);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push("화요일 2배");
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === node.id) {
        product = prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + KEYBOARD_MOUSE_BONUS_POINTS;
    pointsDetail.push(`키보드+마우스 세트 +${KEYBOARD_MOUSE_BONUS_POINTS}p`);
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + FULL_SET_BONUS_POINTS;
    pointsDetail.push(`풀세트 구매 +${FULL_SET_BONUS_POINTS}p`);
  }
  if (cartState.itemCnt >= BULK_DISCOUNT_MIN_QUANTITY) {
    finalPoints = finalPoints + BULK_30_BONUS_POINTS;
    pointsDetail.push(
      `대량구매(${BULK_DISCOUNT_MIN_QUANTITY}개+) +${BULK_30_BONUS_POINTS}p`
    );
  } else {
    if (cartState.itemCnt >= BULK_20_MIN_QUANTITY) {
      finalPoints = finalPoints + BULK_20_BONUS_POINTS;
      pointsDetail.push(
        `대량구매(${BULK_20_MIN_QUANTITY}개+) +${BULK_20_BONUS_POINTS}p`
      );
    } else {
      if (cartState.itemCnt >= INDIVIDUAL_DISCOUNT_MIN_QUANTITY) {
        finalPoints = finalPoints + BULK_10_BONUS_POINTS;
        pointsDetail.push(
          `대량구매(${INDIVIDUAL_DISCOUNT_MIN_QUANTITY}개+) +${BULK_10_BONUS_POINTS}p`
        );
      }
    }
  }
  cartState.bonusPts = finalPoints;
  const ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (cartState.bonusPts > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${
          cartState.bonusPts
        }p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>
      `;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};
function onGetStockTotal() {
  let sum = 0;
  for (let i = 0; i < prodList.length; i++) {
    const currentProduct = prodList[i];
    sum += currentProduct.quantity.getQuantity();
  }
  return sum;
}

const handleStockInfoUpdate = function () {
  let infoMsg = "";
  const totalStock = onGetStockTotal();
  prodList.forEach(function (item) {
    if (item.quantity.isLessThan(new Quantity(LOW_STOCK_THRESHOLD))) {
      if (item.quantity.isGreaterThan(new Quantity(0))) {
        infoMsg += `${
          item.name
        }: 재고 부족 (${item.quantity.getQuantity()}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });
  uiElements.stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (uiElements.cartDisp.children[j]) {
    const qty =
      uiElements.cartDisp.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < uiElements.cartDisp.children.length; j++) {
    totalCount += parseInt(
      uiElements.cartDisp.children[j].querySelector(".quantity-number")
        .textContent
    );
  }
  cartItems = uiElements.cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector(".text-lg");
      const nameDiv = cartItems[i].querySelector("h3");
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-purple-600">₩${product.price
            .getAmount()
            .toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-red-500">₩${product.price
            .getAmount()
            .toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
          <span class="text-blue-500">₩${product.price
            .getAmount()
            .toLocaleString()}</span>
        `;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = product.price.format();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();
uiElements.addBtn.addEventListener("click", function () {
  const selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.quantity.isGreaterThan(new Quantity(0))) {
    const item = document.getElementById(itemToAdd["id"]);
    if (item) {
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem["textContent"]) + 1;
      if (
        newQty <=
        itemToAdd.quantity.getQuantity() + parseInt(qtyElem.textContent)
      ) {
        qtyElem.textContent = newQty;
        itemToAdd.quantity = itemToAdd.quantity.subtract(new Quantity(1));
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = createElementFromHTML(`
        <div id="${
          itemToAdd.id
        }" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
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
              ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${
                  itemToAdd.onSale && itemToAdd.suggestSale
                    ? "text-purple-600"
                    : itemToAdd.onSale
                    ? "text-red-500"
                    : "text-blue-500"
                }">₩${itemToAdd.price.getAmount().toLocaleString()}</span>`
              : itemToAdd.price.format()
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
              ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${
                  itemToAdd.onSale && itemToAdd.suggestSale
                    ? "text-purple-600"
                    : itemToAdd.onSale
                    ? "text-red-500"
                    : "text-blue-500"
                }">₩${itemToAdd.price.getAmount().toLocaleString()}</span>`
              : itemToAdd.price.format()
          }</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
            itemToAdd.id
          }">Remove</a>
        </div>
        </div>
      `);
      uiElements.cartDisp.appendChild(newItem);
      itemToAdd.quantity = itemToAdd.quantity.subtract(new Quantity(1));
    }
    handleCalculateCartStuff();
    cartState.lastSelectedProductId = selItem;
  }
});
uiElements.cartDisp.addEventListener("click", function (event) {
  const tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector(".quantity-number");
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.quantity.getQuantity() + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity = prod.quantity.subtract(
          new Quantity(Math.abs(qtyChange))
        );
      } else if (newQty <= 0) {
        prod.quantity = prod.quantity.add(new Quantity(currentQty));
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity = prod.quantity.add(new Quantity(remQty));
      itemElem.remove();
    }
    if (prod && prod.quantity.isLessThan(new Quantity(LOW_STOCK_THRESHOLD))) {
    }
    handleCalculateCartStuff();
    updateSelectOptions();
  }
});

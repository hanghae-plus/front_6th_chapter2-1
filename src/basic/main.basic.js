import { renderHeader } from "./ui/renderHeader";
import { initAddButtonEvent } from "./events/addBtnEventHandler";
import { initCartDOMEvent } from "./events/cartEventHandler";

import productStore, { productIds } from "./store/product";
import cartStore from "./store/cart";

import { calculateItemDiscount } from "./utils/cart/calculateItemDiscount";
import { extractCartData } from "./utils/cart/extractCartData";
import { calculateCartTotals } from "./utils/cart/calculateCartTotals";

import {
  startLightningSaleTimer,
  startRecommendationTimer,
} from "./utils/discountTimer";
import { updateSelectOptions } from "./utils/select/selectUtils";

import { renderCartSummary } from "./ui/render/renderCartSummary";
import { renderDiscountInfo } from "./ui/render/renderDiscountInfo";
import { renderLoyaltyPoints } from "./ui/render/renderLoyaltyPoints";
import { updateCartUI } from "./ui/update/updateCart";
import { updateCartItemStyles } from "./ui/update/updateCartItem";
import { updateBonusPoints } from "./ui/update/updateBonusPoints";
import { updateStockInfo } from "./ui/update/updateStockInfo";

// 비즈니스 서비스들
import {
  calculateAndUpdateCart,
  getCartState,
} from "./services/cartCalculationService";
import { calculateBonusPoints } from "./services/bonusPointsService";
import { getLowStockItems } from "./services/stockService";

// 전역 변수들
var bonusPts = 0;
var lastSel;

//DOM 관련 변수
var stockInfo;
var sel;
var addBtn;
var cartDisp;

function main() {
  var root;
  // var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  // var lightningDelay;
  // totalAmt = 0;
  // itemCnt = 0;
  lastSel = null;

  var root = document.getElementById("app");

  const header = renderHeader();
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
  // sum = rightColumn.querySelector("#cart-total");
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

  //TODO : 사용되지 않는 코드처럼 보임.. 일단 주석처리
  // var initStock = 0;
  // for (var i = 0; i < prodList.length; i++) {
  //   initStock += prodList[i].q;
  // }

  onUpdateSelectOptions();
  handleCalculateCartStuff();
  // lightningDelay = Math.random() * 10000;

  const prodList = productStore.getState().products;

  //TODO : 주석 꼭 풀어야함@@@@@
  // // 번개할인 타이머 시작
  // startLightningSaleTimer({
  //   prodList,
  //   onUpdateSelectOptions,
  //   doUpdatePricesInCart,
  // });

  // // 추천할인 타이머 시작
  // startRecommendationTimer({
  //   prodList,
  //   lastSel,
  //   onUpdateSelectOptions,
  //   doUpdatePricesInCart,
  // });
}
var sum;

//드롭다운 메뉴를 실시간으로 업데이트 하는 함수
/*
1. 재고 상태 반영 : 품절상품은 선택 불가능하게 처리
2. 할인 정보 표시 : 번개세일, 추천할인 상태를 시각적으로 표시
3. 가격 정보 업데이트 : 원가 -> 할인가 형태로 표시
4. 전체 재고 경고 : 재고가 부족하면 드롭다운 테두리 색상 변경
----
호출 시점
1. 상품이 장바구니에서 추가/제거될 때
2. 할인이 적용될 때
3. 재고가 변경될 때
*/
const onUpdateSelectOptions = () => {
  const prodList = productStore.getState().products;

  updateSelectOptions(sel, prodList);
};

/**
 * 장바구니 계산 및 렌더링을 담당하는 함수
 */
const handleCalculateCartStuff = () => {
  // 총 금액 계산 로직들
  const cartData = calculateAndUpdateCart();
  const lowStockItems = getLowStockItems();
  const cartState = getCartState();
  const bonusPointsData = calculateBonusPoints(cartState);

  // UI 업데이트
  updateCartItemStyles(cartData.items);
  updateCartUI(cartData);
  updateStockInfo(lowStockItems);
  updateBonusPoints(bonusPointsData);
};

function doUpdatePricesInCart() {
  var totalCount = 0,
    j = 0;
  var cartItems;
  const prodList = productStore.getState().products;
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

initAddButtonEvent(addBtn, sel, cartDisp, handleCalculateCartStuff);
initCartDOMEvent(cartDisp, handleCalculateCartStuff);

import { Header } from "./components/Header";
import { initAddButtonEvent } from "./events/addBtnEventHandler";
import { initCartDOMEvent } from "./events/cartEventHandler";

import productStore, { productIds } from "./store/product";

import { calculateItemDiscount } from "./utils/cart/calculateItemDiscount";

import {
  startLightningSaleTimer,
  startRecommendationTimer,
} from "./utils/discountTimer";
import { updateSelectOptions } from "./utils/select/selectUtils";

// const prodList = productStore.getAllProducts();
// const productIds = productStore.getState().productIds;
var bonusPts = 0;
var itemCnt;
var lastSel;
var totalAmt = 0;

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
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  var root = document.getElementById("app");

  const header = Header();
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
 * 장바구니 계산을 담당하는 함수
 * 1. 장바구니 아이템 계산
 *
 * 2. 할인 정책 적용
 *  - 개별 아이템 할인 적용 : 10개 이상 구매시
 *    - p1 : 10% 할인
 *    - p2 : 15% 할인
 *    - p3 : 20% 할인
 *    - p4 : 5% 할인
 *    - p5 : 25% 할인
 *  - 30개 이상 구매시 : 25% 할인
 *  - 화요일 구매시 특별 할인 : 10% 할인
 *
 * 3. UI 업데이트
 *  - 장바구니 아이템 수 표시
 *  - 상세 내역(summary-details) 업데이트
 *  - 총 금액 표시
 *  - 적립 포인트 계산 (1000원당 1포인트)
 *  - 할인 정보 표시
 *  - 재고 부족 알림
 *
 * 4. 재고 관리
 *  - 재고가 5개 미만인 상품을 찾아서 리스트에 저장하는 함수
 */
function handleCalculateCartStuff() {
  // ===== 1단계: 변수 초기화 =====
  var cartItems; // 장바구니 DOM 요소들
  var subTot; // 소계 (할인 적용 전 총액)
  var itemDiscounts; // 개별 상품 할인 정보 배열
  var lowStockItems; // 재고 부족 상품 리스트 (사용되지 않음)
  var idx; // 반복문 인덱스 (사용되지 않음)
  var originalTotal; // 원래 총액 (할인 계산용)
  var bulkDisc; // 대량구매 할인 (사용되지 않음)
  var itemDisc; // 개별 할인 (사용되지 않음)
  var savedAmount; // 절약된 금액
  var summaryDetails; // 요약 상세 DOM 요소
  var totalDiv; // 총액 표시 DOM 요소
  var loyaltyPointsDiv; // 포인트 표시 DOM 요소
  var points; // 계산된 포인트
  var discountInfoDiv; // 할인 정보 DOM 요소
  var itemCountElement; // 아이템 수 표시 DOM 요소
  var previousCount; // 이전 아이템 수 (변경 감지용)
  var stockMsg; // 재고 메시지 (사용되지 않음)
  var pts; // 포인트 (사용되지 않음)
  var hasP1; // 키보드 보유 여부 (사용되지 않음)
  var hasP2; // 마우스 보유 여부 (사용되지 않음)
  var loyaltyDiv; // 포인트 DOM (사용되지 않음)

  // 전역 변수 초기화
  totalAmt = 0; // 총 금액 (할인 적용 후)
  itemCnt = 0; // 총 아이템 수
  originalTotal = totalAmt; // 원래 총액 (현재는 0으로 초기화됨 - 버그 가능성)

  // DOM 요소들 가져오기
  cartItems = cartDisp.children; // 장바구니 내 모든 아이템 DOM 요소들
  subTot = 0; // 소계 초기화
  bulkDisc = subTot; // 대량구매 할인 초기화 (사용되지 않음)
  itemDiscounts = []; // 개별 할인 정보 배열 초기화

  // 상품 데이터 가져오기
  const prodList = productStore.getState().products;

  // ===== 2단계: 장바구니 아이템 순회하며 계산 =====
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i]; // 현재 장바구니 아이템 DOM
    const curItem = prodList.find((product) => product.id === cartItem.id); // 상품 정보 찾기
    if (!curItem) continue; // 상품 정보가 없으면 건너뛰기

    // 수량 정보 추출
    const qtyElem = cartItem.querySelector(".quantity-number"); // 수량 표시 DOM
    const q = parseInt(qtyElem.textContent); // 수량을 숫자로 변환
    const itemTot = curItem.val * q; // 현재 아이템 총액 (수량 × 단가)

    // ===== 전역 변수 업데이트 =====
    itemCnt += q; // 총 아이템 수에 현재 수량 추가
    subTot += itemTot; // 소계에 현재 아이템 총액 추가

    // ===== UI 스타일 업데이트 =====
    // 10개 이상 구매시 가격 텍스트를 굵게 표시
    const priceElems = cartItem.querySelectorAll(".text-lg");
    priceElems.forEach((elem) => {
      elem.style.fontWeight = q >= 10 ? "bold" : "normal";
    });

    // ===== 개별 상품 할인 계산 =====
    const disc = calculateItemDiscount(curItem.id, q); // 할인율 계산 (10개 이상시)
    if (disc > 0) {
      // 할인이 적용되면 할인 정보 배열에 추가
      itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
    }

    // ===== 최종 가격 계산 =====
    // 할인 적용된 가격을 총액에 추가
    totalAmt += itemTot * (1 - disc);
  }

  // ===== 3단계: 대량구매 할인 계산 =====
  let discRate = 0; // 총 할인율
  var originalTotal = subTot; // 원래 총액 (소계로 재설정)

  if (itemCnt >= 30) {
    // 30개 이상 구매시 25% 할인
    totalAmt = (subTot * 75) / 100; // 75%만 적용
    discRate = 25 / 100; // 할인율 25%
  } else {
    // 30개 미만시 개별 할인만 적용된 할인율 계산
    discRate = (subTot - totalAmt) / subTot;
  }

  // ===== 4단계: 화요일 특별 할인 계산 =====
  const today = new Date();
  var isTuesday = today.getDay() === 2; // 화요일인지 확인 (0=일요일, 2=화요일)
  var tuesdaySpecial = document.getElementById("tuesday-special"); // 화요일 할인 표시 DOM

  if (isTuesday) {
    if (totalAmt > 0) {
      // 화요일이고 총액이 있으면 10% 추가 할인
      totalAmt = (totalAmt * 90) / 100; // 90%만 적용
      discRate = 1 - totalAmt / originalTotal; // 총 할인율 재계산
      tuesdaySpecial.classList.remove("hidden"); // 화요일 할인 표시
    } else {
      tuesdaySpecial.classList.add("hidden"); // 총액이 없으면 숨김
    }
  } else {
    tuesdaySpecial.classList.add("hidden"); // 화요일이 아니면 숨김
  }

  // ===== 5단계: UI 업데이트 시작 =====

  // 아이템 수 표시 업데이트
  document.getElementById("item-count").textContent =
    "🛍️ " + itemCnt + " items in cart";

  // 요약 상세 영역 초기화
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";

  // ===== 6단계: 요약 상세 내용 렌더링 =====
  if (subTot > 0) {
    // 각 장바구니 아이템별 상세 정보 렌더링
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      // 상품 정보 찾기 (이중 반복문 - 비효율적)
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      // 아이템별 정보 추출
      var qtyElem = cartItems[i].querySelector(".quantity-number");
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;

      // 아이템별 상세 정보 HTML 추가
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 구분선과 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // ===== 할인 정보 렌더링 =====
    if (itemCnt >= 30) {
      // 대량구매 할인 표시
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      // 개별 상품 할인 표시
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

    // 배송비 정보 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // ===== 7단계: 총액 표시 업데이트 =====
  totalDiv = sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmt).toLocaleString();
  }

  // ===== 8단계: 포인트 정보 업데이트 =====
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000); // 1000원당 1포인트
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }

  // ===== 9단계: 할인 정보 상세 표시 =====
  discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt; // 절약된 금액 계산
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

  // ===== 10단계: 아이템 수 표시 업데이트 (중복) =====
  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0); // 이전 수량 추출
    itemCountElement.textContent = "🛍️ " + itemCnt + " items in cart"; // 새 수량 표시
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute("data-changed", "true"); // 변경 표시
    }
  }

  // ===== 11단계: 추가 업데이트 함수들 호출 =====
  handleStockInfoUpdate(); // 재고 정보 업데이트
  doRenderBonusPoints(); // 보너스 포인트 렌더링
}

var doRenderBonusPoints = function () {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  const prodList = productStore.getState().products;
  if (cartDisp.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }
  basePoints = Math.floor(totalAmt / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
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
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = null;
    for (var pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === node.id) {
        product = prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === productIds.p1) {
      hasKeyboard = true;
    } else if (product.id === productIds.p2) {
      hasMouse = true;
    } else if (product.id === productIds.p3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("풀세트 구매 +100p");
  }
  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push("대량구매(20개+) +50p");
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push("대량구매(10개+) +20p");
      }
    }
  }
  bonusPts = finalPoints;
  var ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
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

const handleStockInfoUpdate = () => {
  let infoMsg = "";

  const prodList = productStore.getState().products;

  prodList.forEach((product) => {
    const currentStock = product.q;

    // 조건 수정: 5개 미만이면 재고 부족 표시
    if (currentStock < 5) {
      if (currentStock > 0) {
        infoMsg =
          infoMsg +
          product.name +
          ": 재고 부족 (" +
          currentStock +
          "개 남음)\n";
      } else {
        infoMsg = infoMsg + product.name + ": 품절\n";
      }
    }
  });

  stockInfo.textContent = infoMsg;
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

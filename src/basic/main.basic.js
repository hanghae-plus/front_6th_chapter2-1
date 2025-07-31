import { AddButton } from "../components/AddButton";
import { CartDisplay } from "../components/CartDisplay";
import { GridContainer } from "../components/GridContainer";
import { Header } from "../components/Header";
import { LeftColumn } from "../components/LeftColumn";
import { ManualColumn } from "../components/ManualColumn";
import { ManualOverlay } from "../components/ManualOverlay";
import { ManualToggle } from "../components/ManualToggle";
import { ProductSelector } from "../components/ProductSelector";
import { RightColumn } from "../components/RightColumn";
import { SelectContainer } from "../components/SelectContainer";
import { StockInfo } from "../components/StockInfo";
import { initialProducts, PRODUCT_IDS } from "../features/product";
import { eventStore } from "./eventStore";

const state = {
  prodList: initialProducts,
  bonusPoint: 0,
  itemCount: 0,
  totalAmount: 0,
  lastSel: null,
};

const stockInfo = StockInfo();
const sel = ProductSelector();
const addBtn = AddButton();
const cartDisplay = CartDisplay();

function main() {
  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();
  const selectorContainer = SelectContainer();
  const rightColumn = RightColumn();
  const manualToggle = ManualToggle();
  const manualOverlay = ManualOverlay();
  const manualColumn = ManualColumn();
  const header = Header();

  const root = document.getElementById("app");

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  // 모든 요소가 DOM에 추가된 후 이벤트 설정
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 이벤트 스토어 초기화
  eventStore.initialize({
    addBtn,
    cartDisplay,
    sel,
    handleAddToCart,
    handleCartDispClick,
    handleManualToggle,
    handleManualOverlayClick,
  });

  const initStock = onGetStockTotal();
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      let luckyIdx = Math.floor(Math.random() * state.prodList.length);
      let luckyItem = state.prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplay.children.length === 0) {
      }
      if (state.lastSel) {
        let suggest = null;
        for (let k = 0; k < state.prodList.length; k++) {
          if (state.prodList[k].id !== state.lastSel) {
            if (state.prodList[k].q > 0) {
              if (!state.prodList[k].suggestSale) {
                suggest = state.prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            "💝 " +
              suggest.name +
              "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function onUpdateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;
  sel.innerHTML = "";
  totalStock = 0;
  for (let idx = 0; idx < state.prodList.length; idx++) {
    let _p = state.prodList[idx];
    totalStock = totalStock + _p.q;
  }
  for (let i = 0; i < state.prodList.length; i++) {
    (function () {
      let item = state.prodList[i];
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

// =================================================================
// 1. 리팩토링된 함수들 (state 객체에 맞게 수정)
// =================================================================

// 1. 장바구니 기본 계산 함수
function calculateCartBasics() {
  const cartItems = cartDisplay.children;
  let subTotal = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(cartItem.id);
    if (!product) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    itemCount += quantity;
    subTotal += itemTotal;

    // 수량별 할인 계산
    const discount = calculateItemDiscount(product, quantity);
    if (discount > 0) {
      itemDiscounts.push({
        name: product.name,
        discount: discount * 100,
        productId: product.id,
      });
    }

    // 수량에 따른 시각적 효과
    updateItemVisualEffects(cartItem, quantity);
  }

  return { subTotal, itemCount, itemDiscounts };
}

// 2. 개별 상품 할인율 계산
function calculateItemDiscount(product, quantity) {
  if (quantity < 10) return 0;

  const discountMap = {
    [PRODUCT_IDS.KEYBOARD]: 0.1, // 10%
    [PRODUCT_IDS.MOUSE]: 0.15, // 15%
    [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 20%
    [PRODUCT_IDS.LAPTOP_POUCH]: 0.05, // 5%
    [PRODUCT_IDS.SPEAKER]: 0.25, // 25%
  };

  return discountMap[product.id] || 0;
}

// 3. 전체 할인 적용 함수
function applyDiscounts(subTotal, itemCount, itemDiscounts) {
  let finalTotal = subTotal;
  let discountRate = 0;

  // 개별 상품 할인 적용
  for (let i = 0; i < cartDisplay.children.length; i++) {
    const cartItem = cartDisplay.children[i];
    const product = findProductById(cartItem.id);
    if (!product) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const discount = calculateItemDiscount(product, quantity);

    if (discount > 0) {
      const itemTotal = product.val * quantity;
      finalTotal -= itemTotal * discount;
    }
  }

  // 대량 구매 할인 (30개 이상 시 25% 할인)
  if (itemCount >= 30) {
    finalTotal = subTotal * 0.75;
    discountRate = 0.25;
  } else {
    discountRate = (subTotal - finalTotal) / subTotal;
  }

  // 화요일 특별 할인 (10% 추가)
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && finalTotal > 0) {
    finalTotal *= 0.9;
    discountRate = 1 - finalTotal / subTotal;
  }

  return { finalTotal, discountRate, isTuesday };
}

// 4. 장바구니 요약 UI 렌더링
function renderCartSummary(
  subTotal,
  itemCount,
  itemDiscounts,
  finalTotal,
  discountRate,
  isTuesday
) {
  const summaryDetails = getSummaryDetailsElement();
  if (!summaryDetails) return;

  summaryDetails.innerHTML = "";

  if (subTotal <= 0) return;

  // 개별 상품 라인 렌더링
  renderCartItemLines(summaryDetails);

  // 구분선 및 소계
  summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  // 할인 정보 렌더링
  renderDiscountInfo(summaryDetails, itemCount, itemDiscounts, isTuesday);

  // 배송비 정보
  summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// 5. 개별 상품 라인 렌더링
function renderCartItemLines(summaryDetails) {
  const cartItems = cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(cartItem.id);
    if (!product) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  }
}

// 6. 할인 정보 렌더링
function renderDiscountInfo(
  summaryDetails,
  itemCount,
  itemDiscounts,
  isTuesday
) {
  // 대량구매 할인
  if (itemCount >= 30) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else {
    // 개별 상품 할인
    itemDiscounts.forEach((item) => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  // 화요일 할인
  if (isTuesday) {
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }
}

// 7. 총액 및 포인트 업데이트
function updateTotalAndPoints(finalTotal, itemCount) {
  // 총액 업데이트
  const cartTotalElement = getCartTotalElement();
  if (cartTotalElement) {
    cartTotalElement.textContent =
      "₩" + Math.round(finalTotal).toLocaleString();
  }

  // 적립 포인트 업데이트 (기존 doRenderBonusPoints 함수 호출)
  updateLoyaltyPoints(finalTotal);

  // 아이템 카운트 업데이트
  updateItemCount(itemCount);
}

// 8. 적립 포인트 업데이트 (간단 버전 - 기존 doRenderBonusPoints 사용)
function updateLoyaltyPoints(finalTotal) {
  const loyaltyPointsDiv = getLoyaltyPointsElement();
  if (!loyaltyPointsDiv) return;

  const points = Math.floor(finalTotal / 1000);
  const pointsText = points > 0 ? `적립 포인트: ${points}p` : "적립 포인트: 0p";

  loyaltyPointsDiv.textContent = pointsText;
  loyaltyPointsDiv.style.display = "block";
}

// 9. 할인 정보 박스 업데이트
function updateDiscountInfoBox(subTotal, finalTotal, discountRate) {
  const discountInfoDiv = getDiscountInfoElement();
  if (!discountInfoDiv) return;

  discountInfoDiv.innerHTML = "";

  if (discountRate > 0 && finalTotal > 0) {
    const savedAmount = subTotal - finalTotal;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(
            discountRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

// 10. 아이템 카운트 업데이트
function updateItemCount(itemCount) {
  const itemCountElement = getItemCountElement();
  if (!itemCountElement) return;

  const previousCount = parseInt(
    itemCountElement.textContent.match(/\d+/) || 0
  );
  itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;

  if (previousCount !== itemCount) {
    itemCountElement.setAttribute("data-changed", "true");
  }
}

// 11. 시각적 효과 업데이트 (수량에 따른)
function updateItemVisualEffects(cartItem, quantity) {
  const priceElems = cartItem.querySelectorAll(".text-lg, .text-xs");
  priceElems.forEach((elem) => {
    if (elem.classList.contains("text-lg")) {
      elem.style.fontWeight = quantity >= 10 ? "bold" : "normal";
    }
  });
}

// 12. 화요일 특별 할인 UI 업데이트
function updateTuesdaySpecialUI(isTuesday, finalTotal) {
  const tuesdaySpecial = getTuesdaySpecialElement();
  if (!tuesdaySpecial) return;

  if (isTuesday && finalTotal > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
}

// 13. 상품 ID로 상품 찾기 헬퍼 함수
function findProductById(productId) {
  return state.prodList.find((product) => product.id === productId);
}

// 14. DOM 요소 가져오기 헬퍼 함수들
function getCartTotalElement() {
  return document.querySelector("#cart-total .text-2xl");
}

function getSummaryDetailsElement() {
  return document.getElementById("summary-details");
}

function getLoyaltyPointsElement() {
  return document.getElementById("loyalty-points");
}

function getDiscountInfoElement() {
  return document.getElementById("discount-info");
}

function getItemCountElement() {
  return document.getElementById("item-count");
}

function getTuesdaySpecialElement() {
  return document.getElementById("tuesday-special");
}

// 15. 메인 함수 - 기존 handleCalculateCartStuff 대체
function handleCalculateCartStuff() {
  // 전역 변수 초기화
  state.totalAmount = 0;
  state.itemCount = 0;

  // 1. 기본 계산
  const { subTotal, itemCount, itemDiscounts } = calculateCartBasics();

  // 2. 할인 적용
  const { finalTotal, discountRate, isTuesday } = applyDiscounts(
    subTotal,
    itemCount,
    itemDiscounts
  );

  // 3. 전역 변수 업데이트
  state.totalAmount = finalTotal;
  state.itemCount = itemCount;

  // 4. UI 업데이트
  renderCartSummary(
    subTotal,
    itemCount,
    itemDiscounts,
    finalTotal,
    discountRate,
    isTuesday
  );
  updateTotalAndPoints(finalTotal, itemCount);
  updateDiscountInfoBox(subTotal, finalTotal, discountRate);
  updateTuesdaySpecialUI(isTuesday, finalTotal);

  // 5. 재고 정보 및 보너스 포인트 업데이트 (기존 함수 사용)
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

let doRenderBonusPoints = function () {
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
  basePoints = Math.floor(state.totalAmount / 1000);
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
  nodes = cartDisplay.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < state.prodList.length; pIdx++) {
      if (state.prodList[pIdx].id === node.id) {
        product = state.prodList[pIdx];
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
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("풀세트 구매 +100p");
  }
  if (state.itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else {
    if (state.itemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push("대량구매(20개+) +50p");
    } else {
      if (state.itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push("대량구매(10개+) +20p");
      }
    }
  }
  state.bonusPoint = finalPoints;
  let ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (state.bonusPoint > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        state.bonusPoint +
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
  return state.prodList.reduce((total, product) => total + product.q, 0);
}
let handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
  }
  state.prodList.forEach(function (item) {
    if (item.q < 5) {
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
    let qty = cartDisplay.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(
      cartDisplay.children[j].querySelector(".quantity-number").textContent
    );
  }
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    let itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < state.prodList.length; productIdx++) {
      if (state.prodList[productIdx].id === itemId) {
        product = state.prodList[productIdx];
        break;
      }
    }
    if (product) {
      let priceDiv = cartItems[i].querySelector(".text-lg");
      let nameDiv = cartItems[i].querySelector("h3");
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

function handleManualToggle() {
  const manualOverlay = document.querySelector(".fixed.inset-0.bg-black\\/50");
  const manualColumn = document.querySelector(".fixed.right-0.top-0.h-full");

  if (manualOverlay && manualColumn) {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  }
}

function handleManualOverlayClick(e) {
  const manualColumn = document.querySelector(".fixed.right-0.top-0.h-full");

  if (e.target === e.currentTarget && manualColumn) {
    e.currentTarget.classList.add("hidden");
    manualColumn.classList.add("translate-x-full");
  }
}

function handleAddToCart() {
  let selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < state.prodList.length; idx++) {
    if (state.prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < state.prodList.length; j++) {
    if (state.prodList[j].id === selItem) {
      itemToAdd = state.prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd["id"]);
    if (item) {
      let qtyElem = item.querySelector(".quantity-number");
      let newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      let newItem = document.createElement("div");
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
      cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    state.lastSel = selItem;
  }
}

function handleCartDispClick(event) {
  let tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < state.prodList.length; prdIdx++) {
      if (state.prodList[prdIdx].id === prodId) {
        prod = state.prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      let qtyChange = parseInt(tgt.dataset.change);
      let qtyElem = itemElem.querySelector(".quantity-number");
      let currentQty = parseInt(qtyElem.textContent);
      let newQty = currentQty + qtyChange;
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
      let qtyElem = itemElem.querySelector(".quantity-number");
      let remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}

main();

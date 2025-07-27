// 컴포넌트 import
import { ShoppingCartHeader } from "./components/ShoppingCartHeader.js";
import { ProductDropdown } from "./components/ProductDropdown.js";
import { AddButton } from "./components/AddButton.js";
import { StockStatusDisplay } from "./components/StockStatusDisplay.js";
import { MainGrid } from "./components/MainGrid.js";
import { ProductPanel } from "./components/ProductPanel.js";
import { ProductSelector } from "./components/ProductSelector.js";
import { CartContainer } from "./components/CartContainer.js";
import { OrderSummary } from "./components/OrderSummary.js";
import { HelpButton } from "./components/HelpButton.js";
import { HelpModal } from "./components/HelpModal.js";
import { HelpPanel } from "./components/HelpPanel.js";
import { ProductOption } from "./components/ProductOption.js";
import { CartItem } from "./components/CartItem.js";

// ============================
// 상태 및 설정 관리 (State & Configuration Management)
// ============================

// 애플리케이션 전역 상태
let appState = {
  prodList: [],
  bonusPts: 0,
  itemCnt: 0,
  lastSel: null,
  totalAmt: 0,
};

// DOM 요소 참조 저장소
let domElements = {};

// 상품 식별자 상수
const PRODUCT_ONE = "p1";
const p2 = "p2";
const product_3 = "p3";
const p4 = "p4";
const PRODUCT_5 = `p5`;

// ============================
// 상품 도메인 로직 (Product Domain Logic)
// ============================

// 전체 재고 수량 계산
function calculateStockTotal(products) {
  return products.reduce((sum, product) => sum + product.q, 0);
}

// 개별 상품 할인율 계산 (10개 이상 구매 시)
function calculateItemDiscount(productId, quantity) {
  if (quantity < 10) return 0;

  const discountMap = {
    [PRODUCT_ONE]: 0.1,
    [p2]: 0.15,
    [product_3]: 0.2,
    [p4]: 0.05,
    [PRODUCT_5]: 0.25,
  };

  return discountMap[productId] || 0;
}

// 재고 부족 상품 메시지 생성
function generateStockStatusMessage(products) {
  return products
    .filter((item) => item.q < 5)
    .map((item) =>
      item.q > 0
        ? `${item.name}: 재고 부족 (${item.q}개 남음)`
        : `${item.name}: 품절`
    )
    .join("\n");
}

// 상품 선택 옵션 데이터 생성
function generateSelectOptionsData(products) {
  const totalStock = calculateStockTotal(products);
  const options = products.map((item) => {
    let discountText = "";
    if (item.onSale) discountText += " ⚡SALE";
    if (item.suggestSale) discountText += " 💝추천";

    const optionData = {
      value: item.id,
      disabled: item.q === 0,
      className: item.q === 0 ? "text-gray-400" : "",
    };

    if (item.q === 0) {
      optionData.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
    } else {
      if (item.onSale && item.suggestSale) {
        optionData.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
        optionData.className = "text-purple-600 font-bold";
      } else if (item.onSale) {
        optionData.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
        optionData.className = "text-red-500 font-bold";
      } else if (item.suggestSale) {
        optionData.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
        optionData.className = "text-blue-500 font-bold";
      } else {
        optionData.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
    }

    return optionData;
  });

  return { options, totalStock };
}

// ============================
// 장바구니 도메인 로직 (Cart Domain Logic)
// ============================

// 장바구니 전체 계산 (가격, 할인, 수량)
function calculateCartData(products, cartItems) {
  let subTotal = 0;
  let totalAmount = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  // 장바구니 각 아이템 처리
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    itemCount += quantity;
    subTotal += itemTotal;

    // 개별 상품 할인 적용
    const discount = calculateItemDiscount(product.id, quantity);
    if (discount > 0) {
      itemDiscounts.push({ name: product.name, discount: discount * 100 });
    }
    totalAmount += itemTotal * (1 - discount);
  }

  let discountRate = (subTotal - totalAmount) / subTotal;

  // 대량구매 할인 적용 (30개 이상)
  if (itemCount >= 30) {
    totalAmount = subTotal * 0.75;
    discountRate = 0.25;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && totalAmount > 0) {
    totalAmount = totalAmount * 0.9;
    discountRate = 1 - totalAmount / subTotal;
  }

  return {
    subTotal,
    totalAmount,
    itemCount,
    itemDiscounts,
    discountRate,
    isTuesday,
  };
}

// 적립 포인트 계산
function calculateBonusPoints(totalAmount, itemCount, cartItems, products) {
  if (itemCount === 0) return { points: 0, details: [] };

  let basePoints = Math.floor(totalAmount / 1000);
  let finalPoints = basePoints;
  const pointsDetail = [];

  if (basePoints > 0) {
    pointsDetail.push("기본: " + basePoints + "p");
  }

  // 화요일 2배
  if (new Date().getDay() === 2 && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push("화요일 2배");
  }

  // 상품 조합 확인
  const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_ONE);
  const hasMouse = cartItems.some((item) => item.id === p2);
  const hasMonitorArm = cartItems.some((item) => item.id === product_3);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push("풀세트 구매 +100p");
  }

  // 수량별 보너스
  if (itemCount >= 30) {
    finalPoints += 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else if (itemCount >= 20) {
    finalPoints += 50;
    pointsDetail.push("대량구매(20개+) +50p");
  } else if (itemCount >= 10) {
    finalPoints += 20;
    pointsDetail.push("대량구매(10개+) +20p");
  }

  return { points: finalPoints, details: pointsDetail };
}

// ============================
// 화면 렌더링 및 업데이트 (Screen Rendering & Updates)
// ============================

// 상품 선택 옵션 업데이트
function updateSelectOptions(selectElement, products) {
  const { options, totalStock } = generateSelectOptionsData(products);

  selectElement.innerHTML = "";

  options.forEach((optionData) => {
    const opt = ProductOption(optionData);
    selectElement.appendChild(opt);
  });

  if (totalStock < 50) {
    selectElement.style.borderColor = "orange";
  } else {
    selectElement.style.borderColor = "";
  }
}

// 재고 정보 표시 업데이트
function updateStockInfo(stockElement, products) {
  const message = generateStockStatusMessage(products);
  stockElement.textContent = message;
}

// 장바구니 아이템 가격 업데이트
function updateCartPrices(cartElement, products) {
  const cartItems = cartElement.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = products.find((p) => p.id === itemId);
    if (!product) continue;

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

// 적립 포인트 정보 렌더링
function renderBonusPoints(
  loyaltyElement,
  cartElement,
  totalAmount,
  itemCount,
  products
) {
  if (cartElement.children.length === 0) {
    loyaltyElement.style.display = "none";
    return;
  }

  const cartItems = Array.from(cartElement.children);
  const { points, details } = calculateBonusPoints(
    totalAmount,
    itemCount,
    cartItems,
    products
  );

  if (points > 0) {
    loyaltyElement.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      points +
      "p</span></div>" +
      '<div class="text-2xs opacity-70 mt-1">' +
      details.join(", ") +
      "</div>";
    loyaltyElement.style.display = "block";
  } else {
    loyaltyElement.textContent = "적립 포인트: 0p";
    loyaltyElement.style.display = "block";
  }

  return points;
}

// 장바구니 전체 계산 및 화면 렌더링
function calculateAndRenderCart(state, elements) {
  const cartData = calculateCartData(
    state.prodList,
    Array.from(elements.cartDisp.children)
  );

  // 상태 업데이트
  state.totalAmt = cartData.totalAmount;
  state.itemCnt = cartData.itemCount;

  // 아이템 카운트 업데이트
  document.getElementById(
    "item-count"
  ).textContent = `🛍️ ${state.itemCnt} items in cart`;

  // 요약 정보 렌더링
  const summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";

  if (cartData.subTotal > 0) {
    // 각 아이템 표시
    for (let i = 0; i < elements.cartDisp.children.length; i++) {
      const cartItem = elements.cartDisp.children[i];
      const product = state.prodList.find((p) => p.id === cartItem.id);
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

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${cartData.subTotal.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (state.itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (cartData.itemDiscounts.length > 0) {
      cartData.itemDiscounts.forEach((item) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (cartData.isTuesday && state.totalAmt > 0) {
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

  // 총액 업데이트
  const totalDiv = elements.sum.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(state.totalAmt).toLocaleString();
  }

  // 할인 정보 업데이트
  const discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (cartData.discountRate > 0 && state.totalAmt > 0) {
    const savedAmount = cartData.subTotal - state.totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(
            cartData.discountRate * 100
          ).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 화요일 특별 할인 배너
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (cartData.isTuesday && state.totalAmt > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  // 재고 정보 업데이트
  updateStockInfo(elements.stockInfo, state.prodList);

  // 포인트 정보 렌더링
  const loyaltyElement = document.getElementById("loyalty-points");
  state.bonusPts = renderBonusPoints(
    loyaltyElement,
    elements.cartDisp,
    state.totalAmt,
    state.itemCnt,
    state.prodList
  );
}

// ============================
// 사용자 상호작용 처리 (User Interaction Handling)
// ============================

// 장바구니 추가 처리
function handleAddToCart() {
  const selItem = domElements.sel.value;

  // 유효한 상품 선택 확인
  let hasItem = false;
  for (let idx = 0; idx < appState.prodList.length; idx++) {
    if (appState.prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  if (!selItem || !hasItem) {
    return;
  }

  // 선택된 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < appState.prodList.length; j++) {
    if (appState.prodList[j].id === selItem) {
      itemToAdd = appState.prodList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd["id"]);

    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector(".quantity-number");
      const newQty = parseInt(qtyElem["textContent"]) + 1;

      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      // 새 아이템 추가
      const newItem = CartItem(itemToAdd);
      domElements.cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }

    calculateAndRenderCart(appState, domElements);
    appState.lastSel = selItem;
  }
}

// 장바구니 아이템 조작 처리 (수량 변경, 삭제)
function handleCartItemAction(event) {
  const tgt = event.target;

  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);

    // 해당 상품 찾기
    let prod = null;
    for (let prdIdx = 0; prdIdx < appState.prodList.length; prdIdx++) {
      if (appState.prodList[prdIdx].id === prodId) {
        prod = appState.prodList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains("quantity-change")) {
      // 수량 변경
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
      // 아이템 제거
      const qtyElem = itemElem.querySelector(".quantity-number");
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }

    calculateAndRenderCart(appState, domElements);
    updateSelectOptions(domElements.sel, appState.prodList);
  }
}

// 도움말 모달 토글 처리
function handleHelpToggle() {
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const manualColumn = document.querySelector(".fixed.right-0");

  manualOverlay.classList.toggle("hidden");
  manualColumn.classList.toggle("translate-x-full");
}

// 도움말 모달 오버레이 클릭 처리
function handleHelpOverlayClick(e) {
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const manualColumn = document.querySelector(".fixed.right-0");

  if (e.target === manualOverlay) {
    manualOverlay.classList.add("hidden");
    manualColumn.classList.add("translate-x-full");
  }
}

// ============================
// 애플리케이션 초기화 및 실행 (Application Bootstrap)
// ============================

// 상품 데이터 초기화
function initializeProductData() {
  appState.totalAmt = 0;
  appState.itemCnt = 0;
  appState.lastSel = null;
  appState.prodList = [
    {
      id: PRODUCT_ONE,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p2,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: product_3,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p4,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}

// DOM 구조 생성
function createDOMStructure() {
  const root = document.getElementById("app");
  const header = ShoppingCartHeader();

  // 상품 선택 요소들
  domElements.sel = ProductDropdown();
  domElements.addBtn = AddButton();
  domElements.stockInfo = StockStatusDisplay();

  // 레이아웃 요소들
  const gridContainer = MainGrid();
  const leftColumn = ProductPanel();
  const selectorContainer = ProductSelector();

  // 요소들 조립
  selectorContainer.appendChild(domElements.sel);
  selectorContainer.appendChild(domElements.addBtn);
  selectorContainer.appendChild(domElements.stockInfo);
  leftColumn.appendChild(selectorContainer);

  domElements.cartDisp = CartContainer();
  leftColumn.appendChild(domElements.cartDisp);

  // 우측 요약 패널
  const rightColumn = OrderSummary();
  domElements.sum = rightColumn.querySelector("#cart-total");

  // 도움말 모달
  const manualToggle = HelpButton(handleHelpToggle);
  const manualOverlay = HelpModal(handleHelpOverlayClick);
  const manualColumn = HelpPanel();

  // DOM 트리 구성
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
}

// 이벤트 리스너 등록
function setupEventListeners() {
  // 장바구니 추가 버튼 이벤트
  domElements.addBtn.addEventListener("click", handleAddToCart);

  // 장바구니 아이템 조작 이벤트
  domElements.cartDisp.addEventListener("click", handleCartItemAction);
}

// 타이머 기반 이벤트 설정
function setupTimerEvents() {
  // 번개세일 타이머 설정
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * appState.prodList.length);
      const luckyItem = appState.prodList[luckyIdx];

      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");

        updateSelectOptions(domElements.sel, appState.prodList);
        updateCartPrices(domElements.cartDisp, appState.prodList);
        calculateAndRenderCart(appState, domElements);
      }
    }, 30000);
  }, lightningDelay);

  // 추천할인 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (domElements.cartDisp.children.length === 0) {
        return;
      }

      if (appState.lastSel) {
        let suggest = null;
        for (let k = 0; k < appState.prodList.length; k++) {
          if (appState.prodList[k].id !== appState.lastSel) {
            if (appState.prodList[k].q > 0) {
              if (!appState.prodList[k].suggestSale) {
                suggest = appState.prodList[k];
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

          updateSelectOptions(domElements.sel, appState.prodList);
          updateCartPrices(domElements.cartDisp, appState.prodList);
          calculateAndRenderCart(appState, domElements);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 메인 애플리케이션 실행
function main() {
  // 1. 데이터 초기화
  initializeProductData();

  // 2. DOM 구조 생성
  createDOMStructure();

  // 3. 이벤트 리스너 등록
  setupEventListeners();

  // 4. 초기 화면 렌더링
  updateSelectOptions(domElements.sel, appState.prodList);
  calculateAndRenderCart(appState, domElements);

  // 5. 타이머 기반 이벤트 설정
  setupTimerEvents();
}

// 애플리케이션 시작
main();

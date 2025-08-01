import { IProduct } from "./types";
import { SALE_INTERVALS, DISCOUNT_RULES } from "./constants";
import { useDOMManager } from "./utils/domManager";
import {
  validateAddToCartInput,
  calculateItemDisplayData,
  createCartItemHTML,
  parseCartClickEvent,
  calculateQuantityChange,
} from "./utils/eventHandlers";
import { updateCartDisplay, updateProductSelectOptions, updateCartItemPrices } from "./utils/uiUpdaters";

import { useProductData } from "./domains/products/productData";
import { useCartManager } from "./domains/cart/cartManager";

/**
 * 앱 상태 초기화
 * 책임: 전역 상태와 매니저 객체들 초기화
 */
function initializeAppState() {
  useDOMManager.setState("lastSelectedProductId", null);
  useCartManager.resetCart();
}

/**
 * 기본 레이아웃 DOM 요소 생성
 * 책임: 헤더, 그리드 컨테이너 생성
 */
function createMainLayoutElements() {
  const root = document.getElementById("app");
  if (!root) throw new Error("App root element not found");

  const header = document.createElement("div");
  header.className = "mb-8";
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";

  return { root, header, gridContainer };
}

/**
 * 좌측 컬럼 (상품 선택 영역) 생성
 * 책임: 상품 선택, 장바구니 추가 버튼, 재고 상태 영역
 */
function createLeftColumnElements() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";

  const selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  const productSelect = document.createElement("select");
  productSelect.id = "product-select";
  productSelect.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
  useDOMManager.setElement("productSelect", productSelect);

  const addToCartBtn = document.createElement("button");
  addToCartBtn.id = "add-to-cart";
  addToCartBtn.innerHTML = "Add to Cart";
  addToCartBtn.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  useDOMManager.setElement("addToCartButton", addToCartBtn);

  const stockStatus = document.createElement("div");
  stockStatus.id = "stock-status";
  stockStatus.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  useDOMManager.setElement("stockStatus", stockStatus);

  const cartDisplayElement = document.createElement("div");
  cartDisplayElement.id = "cart-items";
  useDOMManager.setElement("cartDisplay", cartDisplayElement);

  selectorContainer.appendChild(productSelect);
  selectorContainer.appendChild(addToCartBtn);
  selectorContainer.appendChild(stockStatus);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElement);

  return leftColumn;
}

/**
 * 우측 컬럼 (주문 요약 영역) 생성
 * 책임: 주문 요약, 할인 정보, 총액 표시 영역
 */
function createRightColumnElements() {
  const rightColumn = document.createElement("div");
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

  const cartSummaryElement = rightColumn.querySelector("#cart-total") as HTMLElement;
  useDOMManager.setElement("cartSummary", cartSummaryElement);

  return rightColumn;
}

/**
 * 수동 오버레이 (도움말) 요소 생성
 * 책임: 도움말 버튼, 오버레이, 사이드바 패널
 */
function createManualOverlayElements() {
  const manualToggle = document.createElement("button");
  manualToggle.className =
    "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualOverlay = document.createElement("div");
  manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";

  const manualColumn = document.createElement("div");
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

  manualToggle.onclick = function () {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };

  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };

  manualOverlay.appendChild(manualColumn);

  return { manualToggle, manualOverlay };
}

/**
 * 특별 세일 타이머 시작
 * 책임: 번개세일과 추천할인 타이머 설정
 */
function startSpecialSaleTimers() {
  const lightningDelay = Math.random() * SALE_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const products = useProductData.getProducts();
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      if (luckyItem && luckyItem.q > 0 && !luckyItem.onSale) {
        const discountedPrice = Math.round((luckyItem.originalVal * (100 - DISCOUNT_RULES.LIGHTNING_SALE_RATE)) / 100);
        useProductData.updateProductSaleStatus(luckyItem.id, {
          onSale: true,
          suggestSale: false,
        });

        alert(`⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RULES.LIGHTNING_SALE_RATE}% 할인 중입니다!`);
        updateProductSelectOptions();
        updateCartItemPrices();
      }
    }, SALE_INTERVALS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      const cartDisplay = useDOMManager.getElement("cartDisplay");
      const lastSelectedProductId = useDOMManager.getState("lastSelectedProductId");

      if (!cartDisplay || cartDisplay.children.length === 0 || !lastSelectedProductId) {
        return;
      }

      const products = useProductData.getProducts();
      const isNotLastSelected = (product: IProduct) => product.id !== lastSelectedProductId;
      const isInStock = (product: IProduct) => product.q > 0;
      const isNotSuggested = (product: IProduct) => !product.suggestSale;

      const suggest = products.find(
        (product) => isNotLastSelected(product) && isInStock(product) && isNotSuggested(product),
      );

      if (suggest) {
        alert(
          `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE}% 추가 할인!`,
        );
        useProductData.applyRecommendationDiscount(suggest.id, DISCOUNT_RULES.RECOMMENDATION_DISCOUNT_RATE);
        updateProductSelectOptions();
        updateCartItemPrices();
      }
    }, SALE_INTERVALS.RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
}

/**
 * 메인 앱 초기화 함수 (오케스트레이터)
 * 책임: 전체 앱 초기화 과정 조율
 */
function main() {
  initializeAppState();

  const { root, header, gridContainer } = createMainLayoutElements();
  const leftColumn = createLeftColumnElements();
  const rightColumn = createRightColumnElements();
  const { manualToggle, manualOverlay } = createManualOverlayElements();

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  updateProductSelectOptions();
  updateCartDisplay();

  startSpecialSaleTimers();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  const addToCartButton = useDOMManager.getElement("addToCartButton") as HTMLButtonElement;
  const productSelectElement = useDOMManager.getElement("productSelect") as HTMLSelectElement;
  const cartDisplayElement = useDOMManager.getElement("cartDisplay") as HTMLDivElement;

  if (!addToCartButton || !productSelectElement || !cartDisplayElement) {
    console.error("Required DOM elements not found");
    return;
  }

  addToCartButton.addEventListener("click", function () {
    const selItem = productSelectElement.value;
    const itemToAdd = useProductData.findProductById(selItem);

    const validation = validateAddToCartInput(selItem, itemToAdd);
    if (!validation.isValid) {
      return;
    }

    if (itemToAdd && itemToAdd.q > 0) {
      const item = document.getElementById(itemToAdd.id);
      if (item) {
        const qtyElem = item.querySelector(".quantity-number") as HTMLElement;
        if (qtyElem?.textContent) {
          const newQty = parseInt(qtyElem.textContent, 10) + 1;
          if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent, 10)) {
            qtyElem.textContent = newQty.toString();
            useProductData.updateProductStock(itemToAdd.id, -1);
          } else {
            alert("재고가 부족합니다.");
          }
        }
      } else {
        const newItem = document.createElement("div");
        newItem.id = itemToAdd.id;
        newItem.className =
          "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

        const itemDisplayData = calculateItemDisplayData(itemToAdd);

        newItem.innerHTML = createCartItemHTML(itemDisplayData);

        cartDisplayElement.appendChild(newItem);
        useProductData.updateProductStock(itemToAdd.id, -1);
      }
      updateCartDisplay();

      useDOMManager.setState("lastSelectedProductId", selItem);
    }
  });

  cartDisplayElement.addEventListener("click", function (event) {
    const eventInfo = parseCartClickEvent(event);
    if (!eventInfo.shouldHandle) return;

    const itemElem = document.getElementById(eventInfo.productId!);
    const prod = useProductData.findProductById(eventInfo.productId!);
    if (!prod || !itemElem) return;

    if (eventInfo.actionType === "QUANTITY_CHANGE") {
      const qtyElem = itemElem.querySelector(".quantity-number") as HTMLElement;
      if (!qtyElem?.textContent) return;

      const currentQty = parseInt(qtyElem.textContent, 10);

      const changeResult = calculateQuantityChange(currentQty, eventInfo.quantityChange!, prod.q);

      if (changeResult.isValid) {
        if (changeResult.action === "UPDATE_QUANTITY") {
          qtyElem.textContent = changeResult.newQuantity!.toString();
          useProductData.updateProductStock(prod.id, changeResult.stockChange);
        } else if (changeResult.action === "REMOVE_ITEM") {
          useProductData.updateProductStock(prod.id, changeResult.stockChange);
          itemElem.remove();
        }
      } else {
        alert(changeResult.message);
      }
    } else if (eventInfo.actionType === "REMOVE_ITEM") {
      const qtyElem = itemElem.querySelector(".quantity-number") as HTMLElement;
      if (!qtyElem?.textContent) return;

      const remQty = parseInt(qtyElem.textContent, 10);
      useProductData.updateProductStock(prod.id, remQty);
      itemElem.remove();
    }

    updateCartDisplay();
    updateProductSelectOptions();
  });
}

// 앱 시작
main();
setupEventListeners();

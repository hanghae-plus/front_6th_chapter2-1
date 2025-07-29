import { QUANTITY_THRESHOLDS } from "./constants/index.js";

// components
import { createHeader, updateHeaderItemCount } from "./components/Header.js";
import { createProductSelector } from "./components/ProductSelector.js";
import { updateCartItemPriceStyle } from "./components/CartItem.js";
import { createOrderSummary, updateOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";
import { createCartDisplay } from "./components/CartDisplay.js";

// data
import { PRODUCT_LIST } from "./data/product.js";

// services
import { CartService } from "./services/cartService.js";
import { TimerService } from "./services/timerService.js";
import { ProductService } from "./services/productService.js";
import { orderService } from "./services/orderService.js";
import { discountService } from "./services/discountService.js";

// utils
import { findProductById } from "./utils/productUtils.js";
import { generateStockWarningMessage } from "./utils/stockUtils.js";
import { getCartItemQuantity, extractNumberFromText } from "./utils/domUtils.js";

// events
import { uiEventBus } from "./core/eventBus.js";
import { CartEventListeners } from "./events/listeners/cartListeners.js";
import { ProductEventListeners } from "./events/listeners/productListeners.js";

// 전역 상태 관리 인스턴스
let productService; // 전역 ProductService 인스턴스
let cartService; // 전역 CartService 인스턴스

// 할인 정보 계산 함수들
function calculateProductDiscountInfo(product) {
  return {
    rate: discountService.calculateProductDiscountRate(product),
    status: discountService.getProductDiscountStatus(product),
  };
}

function calculateProductDiscountInfos(products) {
  return products.map(product => ({
    productId: product.id,
    rate: discountService.calculateProductDiscountRate(product),
    status: discountService.getProductDiscountStatus(product),
  }));
}

// Event Bus 이벤트 리스너 초기화
function initEventBusListeners() {
  // 각 컴포넌트별 이벤트 리스너 초기화
  new CartEventListeners(uiEventBus, cartService, discountService);
  new ProductEventListeners(uiEventBus, productService);
}

function main() {
  const root = document.getElementById("app");

  // ProductService 초기화
  productService = new ProductService();
  cartService = new CartService(productService);

  const header = createHeader({ itemCount: 0 });

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const selectorContainer = createProductSelector({
    products: productService.getProducts(),
    discountInfos: calculateProductDiscountInfos(productService.getProducts()),
    onAddToCart: () => {
      // Event Bus를 통해 장바구니 추가 요청
      uiEventBus.emit("cart:add:requested");
    },
  });

  const cartDisplay = createCartDisplay();

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  // OrderSummary 컴포넌트 생성
  const orderSummary = createOrderSummary();

  // OrderService 구독하여 OrderSummary 업데이트
  orderService.subscribeToChanges(orderState => {
    updateOrderSummary(orderSummary, orderState);
  });

  rightColumn.appendChild(orderSummary);

  // Manual 시스템 생성
  const manualSystem = createManualSystem();
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualSystem.toggle);
  root.appendChild(manualSystem.overlay);

  // Event Bus 이벤트 리스너 등록
  initEventBusListeners();

  handleProductOptionsUpdate();
  updateCartSummary(cartDisplay, selectorContainer);

  // 타이머 서비스 초기화 및 시작
  const timerService = new TimerService(productService, handleProductOptionsUpdate, handlePricesUpdate, cartDisplay);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}

// Product 옵션 업데이트 핸들러
function handleProductOptionsUpdate() {
  // 비즈니스 로직: 상품 데이터 가져오기
  const products = productService.getProducts();
  const discountInfos = calculateProductDiscountInfos(products);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:options:updated", {
    products,
    discountInfos,
    success: true,
  });
}

function updateCartItemStyles(cartItems) {
  for (let i = 0; i < cartItems.length; i++) {
    const q = getCartItemQuantity(cartItems[i]);
    const itemDiv = cartItems[i];

    const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
    priceElems.forEach(elem => {
      if (elem.classList.contains("text-lg")) {
        elem.style.fontWeight = q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? "bold" : "normal";
      }
    });
    updateCartItemPriceStyle(itemDiv, q);
  }
}

function updateOrderSummaryUI(cartItems, totalAmount, isTuesday, itemCount) {
  orderService.calculateOrderSummary(Array.from(cartItems), PRODUCT_LIST);
  orderService.calculatePoints(Array.from(cartItems), totalAmount, isTuesday, itemCount);
}

function updateItemCountDisplay(itemCnt) {
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    const previousCount = extractNumberFromText(itemCountElement.textContent);
    itemCountElement.textContent = "🛍️ " + itemCnt + " items in cart";
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
}

function updateStockDisplay() {
  const stockInfo = document.querySelector("#stock-status");
  const stockMsg = generateStockWarningMessage(PRODUCT_LIST);

  if (stockInfo) {
    stockInfo.textContent = stockMsg;
  }
}

// 재고 정보 업데이트 핸들러
function handleStockUpdate() {
  // 비즈니스 로직: 재고 정보 계산
  const products = productService.getProducts();
  const stockMessage = generateStockWarningMessage(products);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:stock:updated", {
    products,
    stockMessage,
    success: true,
  });
}

// 장바구니 내 가격 업데이트 핸들러
function handlePricesUpdate() {
  // 비즈니스 로직: 장바구니 아이템 정보 수집
  const cartDisplay = document.querySelector("#cart-items");
  const cartItems = Array.from(cartDisplay.children);

  const itemsToUpdate = cartItems
    .map(el => {
      const product = findProductById(el.id, PRODUCT_LIST);
      if (product) {
        const discountInfo = calculateProductDiscountInfo(product);
        return { element: el, product, discountInfo };
      }
      return null;
    })
    .filter(item => item !== null);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("product:prices:updated", {
    itemsToUpdate,
    success: true,
  });

  // 요약 업데이트도 함께
  uiEventBus.emit("cart:summary:updated");
}

function updateCartSummary() {
  const cartDisplay = document.querySelector("#cart-items");
  const cartItems = cartDisplay.children;

  // DiscountService를 사용하여 할인 계산
  const discountResult = discountService.applyAllDiscounts(Array.from(cartItems), PRODUCT_LIST);

  // UI 업데이트
  updateCartUI(cartItems, discountResult);
  handleStockUpdate();
}

function updateCartUI(cartItems, discountResult) {
  updateCartItemStyles(cartItems);
  updateHeaderItemCount(cartService.getItemCount());
  updateOrderSummaryUI(cartItems, discountResult.finalAmount, discountResult.tuesdayDiscount.applied, cartService.getItemCount());
  updateItemCountDisplay(cartService.getItemCount());
  updateStockDisplay();
}

main();

// components
import { createHeader } from "./components/Header.js";
import { createProductSelector } from "./components/ProductSelector.js";
import { createOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";
import { createCartDisplay } from "./components/CartDisplay.js";

// data
import { PRODUCT_LIST } from "./data/product.js";

// services
import { CartService } from "./services/cartService.js";
import { TimerService } from "./services/timerService.js";
import { ProductService } from "./services/productService.js";
import { OrderService } from "./services/orderService.js";
import { discountService } from "./services/discountService.js";

// utils
import { findProductById } from "./utils/productUtils.js";
import { generateStockWarningMessage } from "./utils/stockUtils.js";

// events
import { uiEventBus } from "./core/eventBus.js";
import { CartEventListeners } from "./events/listeners/cartListeners.js";
import { ProductEventListeners } from "./events/listeners/productListeners.js";
import { OrderEventListeners } from "./events/listeners/orderListeners.js";

// 전역 상태 관리 인스턴스
let orderService; // 전역 OrderService 인스턴스
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
  new OrderEventListeners(uiEventBus, orderService);

  // 장바구니 요약 계산 요청 이벤트 처리
  uiEventBus.on("cart:summary:calculation:requested", data => {
    if (data.success) {
      handleCartSummaryUpdate(data.cartItems);
    }
  });
}

function main() {
  const root = document.getElementById("app");

  // ProductService 초기화
  productService = new ProductService();
  cartService = new CartService();
  orderService = new OrderService();

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

  // 초기 장바구니 요약 업데이트 (빈 배열로 시작)
  handleCartSummaryUpdate([]);

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
function handlePricesUpdate(cartItems = []) {
  // 장바구니 아이템 정보 처리
  const itemsToUpdate = cartItems
    .map(cartItem => {
      const product = findProductById(cartItem.id, PRODUCT_LIST);
      if (product) {
        const discountInfo = calculateProductDiscountInfo(product);
        return { cartItem, product, discountInfo };
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

// 장바구니 요약 업데이트 핸들러 (Event Bus 기반)
function handleCartSummaryUpdate(cartItems = []) {
  // 순수 비즈니스 로직: 할인 계산
  const discountResult = discountService.applyAllDiscounts(cartItems, PRODUCT_LIST);

  // 이벤트 발송 (DOM 조작 없음)
  uiEventBus.emit("cart:summary:calculated", {
    cartItems,
    discountResult,
    itemCount: cartService.getItemCount(),
    success: true,
  });

  // 재고 정보 업데이트 요청 (이벤트 기반 통신)
  uiEventBus.emit("stock:update:requested");
}

main();

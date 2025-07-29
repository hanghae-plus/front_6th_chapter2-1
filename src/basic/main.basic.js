import { QUANTITY_THRESHOLDS } from "./constants/index.js";

// components
import { createHeader, updateHeaderItemCount } from "./components/Header.js";
import { createProductSelector, updateProductOptions, getSelectedProduct, updateStockInfo } from "./components/ProductSelector.js";
import { createCartItem, updateCartItemQuantity, updateCartItemPrice, updateCartItemPriceStyle } from "./components/CartItem.js";
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
import { getCartItemQuantity, setCartItemQuantity, extractNumberFromText } from "./utils/domUtils.js";

// patterns
import { uiEventBus } from "./patterns/uiEventBus.js";
import { CartEventListeners } from "./patterns/cartEventListeners.js";
import { ProductEventListeners } from "./patterns/productEventListeners.js";

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

// 장바구니 수량 변경
function handleQuantityChange(productId, quantityChange) {
  // 3단계: cartService의 수량 변경 로직 사용
  const success = cartService.updateCartItemQuantity(productId, quantityChange, PRODUCT_LIST);

  if (!success) {
    alert("재고가 부족합니다.");
    return;
  }

  const cartItemElement = document.getElementById(productId);
  if (!cartItemElement) return;

  const currentQuantity = getCartItemQuantity(cartItemElement);
  const newQuantity = currentQuantity + quantityChange;

  // Event Bus를 통해 이벤트 발송 (직접적인 UI 업데이트 제거)
  uiEventBus.emit("cart:quantity:changed", {
    productId,
    quantityChange,
    newQuantity,
    success,
  });

  // UI 업데이트도 Event Bus를 통해 처리
  uiEventBus.emit("cart:summary:updated");
  uiEventBus.emit("product:options:updated");
}

// 장바구니 아이템 제거
function handleRemoveItem(productId) {
  // 4단계: cartService의 아이템 제거 로직 사용
  const success = cartService.removeProductFromCart(productId, PRODUCT_LIST);

  // Event Bus를 통해 이벤트 발송 (직접적인 UI 업데이트 제거)
  uiEventBus.emit("cart:item:removed", {
    productId,
    success,
  });

  // UI 업데이트도 Event Bus를 통해 처리
  uiEventBus.emit("cart:summary:updated");
  uiEventBus.emit("product:options:updated");
}

// 상품을 장바구니에 추가
function handleAddToCart(productList) {
  const selectedProductId = getSelectedProduct();

  // 1단계: cartService의 검증 로직만 사용
  const targetProduct = cartService.validateSelectedProduct(selectedProductId, productList);

  if (!targetProduct) return;

  const existingCartItem = document.getElementById(targetProduct.id);

  if (existingCartItem) {
    // 2단계: cartService의 수량 증가 로직 사용
    const success = cartService.updateCartItemQuantity(targetProduct.id, 1, productList);
    if (success) {
      const currentQuantity = getCartItemQuantity(existingCartItem);
      const newQuantity = currentQuantity + 1;
      setCartItemQuantity(existingCartItem, newQuantity);
      updateCartItemPriceStyle(existingCartItem, newQuantity);
    } else {
      alert("재고가 부족합니다.");
      return;
    }
  } else {
    // 2단계: cartService의 새 아이템 추가 로직 사용
    const success = cartService.addProductToCart(targetProduct, 1);
    if (success) {
      const discountInfo = calculateProductDiscountInfo(targetProduct);
      const newCartItem = createCartItem({
        product: targetProduct,
        discountInfo,
        onQuantityChange: handleQuantityChange,
        onRemove: handleRemoveItem,
      });
      document.querySelector("#cart-items").appendChild(newCartItem);
    }
  }

  // Event Bus를 통해 이벤트 발송
  uiEventBus.emit("cart:item:added", {
    product: targetProduct,
    success: true,
  });

  // UI 업데이트도 Event Bus를 통해 처리
  uiEventBus.emit("cart:summary:updated");
}

// Event Bus 이벤트 리스너 초기화
function initEventBusListeners() {
  // 각 컴포넌트별 이벤트 리스너 초기화
  new CartEventListeners(uiEventBus, cartService);
  new ProductEventListeners(uiEventBus);
}

function main() {
  const root = document.getElementById("app");

  // ProductService 초기화
  productService = new ProductService();
  cartService = new CartService();

  const header = createHeader({ itemCount: 0 });

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const selectorContainer = createProductSelector({
    products: productService.getProducts(),
    discountInfos: calculateProductDiscountInfos(productService.getProducts()),
    onAddToCart: () => {
      handleAddToCart(productService.getProducts());
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

  onUpdateSelectOptions();
  updateCartSummary(cartDisplay, selectorContainer);

  // 타이머 서비스 초기화 및 시작
  const timerService = new TimerService(productService, onUpdateSelectOptions, doUpdatePricesInCart, cartDisplay);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}

function onUpdateSelectOptions() {
  // ProductSelector 컴포넌트 업데이트
  updateProductOptions(productService.getProducts(), calculateProductDiscountInfos(productService.getProducts()));
  updateStockInfo(productService.getProducts());
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

function handleStockInfoUpdate() {
  updateStockInfo(PRODUCT_LIST);
}

function doUpdatePricesInCart() {
  const cartDisplay = document.querySelector("#cart-items");
  const cartItems = cartDisplay.children;

  cartItems.forEach(el => {
    const product = findProductById(el.id, PRODUCT_LIST);
    if (product) {
      const discountInfo = calculateProductDiscountInfo(product);
      updateCartItemPrice(el, product, discountInfo);
    }
  });

  updateCartSummary();
}

function updateCartSummary() {
  const cartDisplay = document.querySelector("#cart-items");
  const cartItems = cartDisplay.children;

  // DiscountService를 사용하여 할인 계산
  const discountResult = discountService.applyAllDiscounts(Array.from(cartItems), PRODUCT_LIST);

  // UI 업데이트
  updateCartUI(cartItems, discountResult);
  handleStockInfoUpdate();
}

function updateCartUI(cartItems, discountResult) {
  updateCartItemStyles(cartItems);
  updateHeaderItemCount(cartService.getItemCount());
  updateOrderSummaryUI(cartItems, discountResult.finalAmount, discountResult.tuesdayDiscount.applied, cartService.getItemCount());
  updateItemCountDisplay(cartService.getItemCount());
  updateStockDisplay();
}

main();

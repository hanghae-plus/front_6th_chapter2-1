import { QUANTITY_THRESHOLDS } from "./constants/index.js";

// components
import { createHeader, updateHeaderItemCount } from "./components/Header.js";
import { createProductSelector, updateProductOptions, getSelectedProduct, updateStockInfo } from "./components/ProductSelector.js";
import { createCartItem, updateCartItemQuantity, updateCartItemPrice, updateCartItemPriceStyle } from "./components/CartItem.js";
import { createOrderSummary, updateOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";

// data
import { PRODUCT_LIST } from "./data/product.js";

// services
import { CartService } from "./services/cartService.js";
import { TimerService } from "./services/timerService.js";
import { ProductService } from "./services/productService.js";

// utils
import { findProductById } from "./utils/productUtils.js";
import { calculateCartTotals, applyBulkAndSpecialDiscounts } from "./utils/cartCalculations.js";
import { generateStockWarningMessage } from "./utils/stockUtils.js";
import { getCartItemQuantity, setCartItemQuantity, extractNumberFromText } from "./utils/domUtils.js";

// 전역 상태 관리 인스턴스
let productService; // 전역 ProductService 인스턴스
let cartService; // 전역 CartService 인스턴스

// 장바구니 수량 변경
function handleQuantityChange(productId, quantityChange, cartDisplay, selectorContainer) {
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

  if (newQuantity <= 0) {
    cartItemElement.remove();
  } else {
    updateCartItemQuantity(cartItemElement, newQuantity);
    updateCartItemPriceStyle(cartItemElement, newQuantity);
  }

  updateCartSummary(cartDisplay, selectorContainer);
  onUpdateSelectOptions(selectorContainer);
}

// 장바구니 아이템 제거
function handleRemoveItem(productId, cartDisplay, selectorContainer) {
  // 4단계: cartService의 아이템 제거 로직 사용
  const success = cartService.removeProductFromCart(productId, PRODUCT_LIST);

  if (success) {
    const cartItemElement = document.getElementById(productId);
    if (cartItemElement) {
      cartItemElement.remove();
    }
  }

  updateCartSummary(cartDisplay, selectorContainer);
  onUpdateSelectOptions(selectorContainer);
}

// 상품을 장바구니에 추가
function handleAddToCart(productList, cartDisplay, selectorContainer) {
  const selectedProductId = getSelectedProduct(selectorContainer);

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
      const newCartItem = createCartItem({
        product: targetProduct,
        onQuantityChange: (productId, change) => handleQuantityChange(productId, change, cartDisplay, selectorContainer),
        onRemove: productId => handleRemoveItem(productId, cartDisplay, selectorContainer),
      });
      cartDisplay.appendChild(newCartItem);
    }
  }

  updateCartSummary(cartDisplay, selectorContainer);
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
    onProductSelect: () => {
      console.log("select");
    },
    onAddToCart: () => {
      console.log("add");
      handleAddToCart(productService.getProducts(), cartDisplay, selectorContainer);
    },
  });

  const cartDisplay = document.createElement("div");
  cartDisplay.id = "cart-items";

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  // OrderSummary 컴포넌트 생성
  const orderSummary = createOrderSummary({
    cartItems: [],
    subtotal: 0,
    totalAmount: 0,
    itemDiscounts: [],
    isTuesday: new Date().getDay() === 2,
    onCheckout: () => {
      console.log("Proceed to checkout");
    },
  });

  rightColumn.appendChild(orderSummary);

  // Manual 시스템 생성
  const manualSystem = createManualSystem();
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualSystem.toggle);
  root.appendChild(manualSystem.overlay);

  onUpdateSelectOptions(selectorContainer);
  updateCartSummary(cartDisplay, header, selectorContainer);

  // 타이머 서비스 초기화 및 시작
  const timerService = new TimerService(productService, onUpdateSelectOptions, doUpdatePricesInCart, cartDisplay);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}
function onUpdateSelectOptions(selectorContainer) {
  const totalStock = productService.calculateTotalStock();

  // ProductSelector 컴포넌트 업데이트
  updateProductOptions(selectorContainer, productService.getProducts(), totalStock, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
  updateStockInfo(selectorContainer, productService.getProducts(), QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
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

function updateOrderSummaryUI(cartItems, subtotal, totalAmount, itemDiscounts, isTuesday, itemCount, discountRate, originalTotal) {
  const orderSummary = document.querySelector(".bg-black.text-white.p-8.flex.flex-col > div");
  if (orderSummary) {
    updateOrderSummary(orderSummary, {
      cartItems: Array.from(cartItems),
      subtotal,
      totalAmount,
      itemDiscounts,
      isTuesday,
      itemCount,
      discountRate,
      savedAmount: originalTotal - totalAmount,
    });
  }
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

const handleStockInfoUpdate = function (selectorContainer) {
  updateStockInfo(selectorContainer, PRODUCT_LIST, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
};

function doUpdatePricesInCart(cartDisplay, selectorContainer) {
  const cartItems = cartDisplay.children;

  // 장바구니 아이템들의 가격 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const product = findProductById(cartItems[i].id, PRODUCT_LIST);
    if (product) {
      updateCartItemPrice(cartItems[i], product);
    }
  }

  updateCartSummary(cartDisplay, selectorContainer);
}

function updateCartSummary(cartDisplay, selectorContainer) {
  const cartItems = cartDisplay.children;

  // 1. 장바구니 총계 계산
  const cartTotals = calculateCartTotals(cartItems, PRODUCT_LIST);

  // 2. 할인 적용
  const discountResult = applyBulkAndSpecialDiscounts(cartTotals.totalAmt, cartTotals.itemCnt, cartTotals.subtotal);

  // 4. UI 업데이트
  updateCartUI(cartItems, cartTotals, discountResult);
  handleStockInfoUpdate(selectorContainer);
}

function updateCartUI(cartItems, cartTotals, discountResult) {
  updateCartItemStyles(cartItems);
  updateHeaderItemCount(cartService.getItemCount());
  updateOrderSummaryUI(
    cartItems,
    cartTotals.subtotal,
    discountResult.totalAmt,
    cartTotals.itemDiscounts,
    discountResult.isTuesday,
    cartService.getItemCount(),
    discountResult.discRate,
    discountResult.originalTotal
  );
  updateItemCountDisplay(cartService.getItemCount());
  updateStockDisplay();
}
main();

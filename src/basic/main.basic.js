import { DISCOUNT_RATES, QUANTITY_THRESHOLDS, TIMERS } from "./constants/index.js";
import { createHeader, updateHeaderItemCount } from "./components/Header.js";
import { createProductSelector, updateProductOptions, getSelectedProduct, updateStockInfo } from "./components/ProductSelector.js";
import { createCartItem, updateCartItemQuantity, updateCartItemPrice, updateCartItemPriceStyle } from "./components/CartItem.js";
import { createOrderSummary, updateOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";
import { PRODUCT_LIST } from "./data/product.js";
import { cartService } from "./services/cartService.js";
import { findProductById } from "./utils/productUtils.js";
import { calculateCartTotals, applyBulkAndSpecialDiscounts } from "./utils/cartCalculations.js";
import { calculateTotalStock, generateStockWarningMessage } from "./utils/stockUtils.js";
import { getCartItemQuantity, setCartItemQuantity, extractNumberFromText } from "./utils/domUtils.js";
import { AppState } from "./store/AppState.js";

// 전역 상태 관리 인스턴스
const appState = new AppState();

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

  if (newQuantity <= 0) {
    cartItemElement.remove();
  } else {
    updateCartItemQuantity(cartItemElement, newQuantity);
    updateCartItemPriceStyle(cartItemElement, newQuantity);
  }

  updateCartSummary();
  onUpdateSelectOptions();
}

// 장바구니 아이템 제거
function handleRemoveItem(productId) {
  // 4단계: cartService의 아이템 제거 로직 사용
  const success = cartService.removeProductFromCart(productId, PRODUCT_LIST);

  if (success) {
    const cartItemElement = document.getElementById(productId);
    if (cartItemElement) {
      cartItemElement.remove();
    }
  }

  updateCartSummary();
  onUpdateSelectOptions();
}

// 상품을 장바구니에 추가
function handleAddToCart(productList, cartDisplay) {
  const selectedProductId = getSelectedProduct(appState.getSelectorContainer());

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
        onQuantityChange: (productId, change) => handleQuantityChange(productId, change, targetProduct),
        onRemove: productId => handleRemoveItem(productId, targetProduct),
      });
      cartDisplay.appendChild(newCartItem);
    }
  }

  updateCartSummary();
  appState.setLastSelectedProduct(selectedProductId);
}

function main() {
  const root = document.getElementById("app");
  appState.reset();

  const header = createHeader({ itemCount: 0 });
  appState.setHeader(header);

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const selectorContainer = createProductSelector({
    products: PRODUCT_LIST,
    onProductSelect: () => {
      console.log("select");
    },
    onAddToCart: () => {
      console.log("add");
      handleAddToCart(PRODUCT_LIST, appState.getCartDisplay());
    },
  });
  appState.setSelectorContainer(selectorContainer);

  // stockInfo 요소 설정
  const stockInfo = selectorContainer.querySelector("#stock-status");
  appState.setStockInfo(stockInfo);

  const cartDisplay = document.createElement("div");
  cartDisplay.id = "cart-items";
  appState.setCartDisplay(cartDisplay);

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

  onUpdateSelectOptions();
  updateCartSummary();
  const lightningDelay = Math.random() * TIMERS.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * PRODUCT_LIST.length);
      const luckyItem = PRODUCT_LIST[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.price = Math.round(luckyItem.originalPrice * DISCOUNT_RATES.LIGHTNING_SALE);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMERS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(() => {
    setInterval(() => {
      const cartDisplay = appState.getCartDisplay();
      if (cartDisplay.children.length === 0) {
        console.log("cartDisplay 길이가 0입니다.");
      }
      const lastSel = appState.getLastSelectedProduct();
      if (lastSel) {
        let suggest = null;

        for (let k = 0; k < PRODUCT_LIST.length; k++) {
          if (PRODUCT_LIST[k].id !== lastSel) {
            if (PRODUCT_LIST[k].quantity > 0) {
              if (!PRODUCT_LIST[k].suggestSale) {
                suggest = PRODUCT_LIST[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert("💝 " + suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");

          suggest.price = Math.round(suggest.price * DISCOUNT_RATES.SUGGEST_SALE);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIMERS.SUGGEST_SALE_DELAY);
}
function onUpdateSelectOptions() {
  const totalStock = calculateTotalStock(PRODUCT_LIST);

  // ProductSelector 컴포넌트 업데이트
  updateProductOptions(appState.getSelectorContainer(), PRODUCT_LIST, totalStock, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
  updateStockInfo(appState.getSelectorContainer(), PRODUCT_LIST, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
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
  const stockMsg = generateStockWarningMessage(PRODUCT_LIST);

  const stockInfo = appState.getStockInfo();
  if (stockInfo) {
    stockInfo.textContent = stockMsg;
  }
}

const handleStockInfoUpdate = function () {
  updateStockInfo(appState.getSelectorContainer(), PRODUCT_LIST, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
};
function doUpdatePricesInCart() {
  const cartDisplay = appState.getCartDisplay();
  const cartItems = cartDisplay.children;

  // 장바구니 아이템들의 가격 업데이트
  for (let i = 0; i < cartItems.length; i++) {
    const product = findProductById(cartItems[i].id, PRODUCT_LIST);
    if (product) {
      updateCartItemPrice(cartItems[i], product);
    }
  }

  updateCartSummary();
}

function updateCartSummary() {
  const cartItems = appState.getCartDisplay().children;

  // 1. 장바구니 총계 계산
  const cartTotals = calculateCartTotals(cartItems, PRODUCT_LIST);

  // 2. 할인 적용
  const discountResult = applyBulkAndSpecialDiscounts(cartTotals.totalAmt, cartTotals.itemCnt, cartTotals.subtotal);

  // 3. 상태 업데이트
  updateAppState(discountResult, cartTotals.itemCnt);

  // 4. UI 업데이트
  updateCartUI(cartItems, cartTotals, discountResult);

  handleStockInfoUpdate();
}

function updateAppState(discountResult, itemCount) {
  appState.setTotalAmount(discountResult.totalAmt);
  appState.setItemCount(itemCount);
}

function updateCartUI(cartItems, cartTotals, discountResult) {
  updateCartItemStyles(cartItems);
  updateHeaderItemCount(appState.getHeader(), appState.getItemCount());
  updateOrderSummaryUI(
    cartItems,
    cartTotals.subtotal,
    discountResult.totalAmt,
    cartTotals.itemDiscounts,
    discountResult.isTuesday,
    appState.getItemCount(),
    discountResult.discRate,
    discountResult.originalTotal
  );
  updateItemCountDisplay(appState.getItemCount());
  updateStockDisplay();
}
main();

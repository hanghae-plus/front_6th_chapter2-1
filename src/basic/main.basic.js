import { DISCOUNT_RATES, PRODUCT_DISCOUNTS, QUANTITY_THRESHOLDS, TIMERS } from "./constants/index.js";
import { createHeader, updateHeaderItemCount } from "./components/Header.js";
import { createProductSelector, updateProductOptions, getSelectedProduct, updateStockInfo } from "./components/ProductSelector.js";
import { createCartItem, updateCartItemQuantity, updateCartItemPrice, updateCartItemPriceStyle } from "./components/CartItem.js";
import { createOrderSummary, updateOrderSummary } from "./components/OrderSummary.js";
import { PRODUCT_LIST } from "./data/product.js";
import { cartService } from "./services/cartService.js";

let stockInfo;
let itemCnt;
let lastSel;
let totalAmt = 0;
let cartDisp;
let header;
let selectorContainer;

/**
 * 선택된 상품이 유효한지 검증합니다.
 *
 * @param {string} selectedProductId - 선택된 상품 ID
 * @param {Array} productList - 상품 목록
 * @returns {Object|null} 유효한 상품 객체 또는 null
 */
function validateSelectedItem(selectedProductId, productList) {
  if (!selectedProductId) return null;

  let isProductExists = false;
  for (let productIndex = 0; productIndex < productList.length; productIndex++) {
    if (productList[productIndex].id === selectedProductId) {
      isProductExists = true;
      break;
    }
  }
  if (!isProductExists) return null;

  let targetProduct = null;
  for (let productIndex = 0; productIndex < productList.length; productIndex++) {
    if (productList[productIndex].id === selectedProductId) {
      targetProduct = productList[productIndex];
      break;
    }
  }

  return targetProduct && targetProduct.quantity > 0 ? targetProduct : null;
}

/**
 * 기존 장바구니 아이템의 수량을 1개 증가시킵니다.
 *
 * @param {HTMLElement} cartItemElement - 장바구니 아이템 요소
 * @param {Object} targetProduct - 추가할 상품 객체
 * @returns {boolean} 성공 여부
 */
function incrementCartItemQuantity(cartItemElement, targetProduct) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= targetProduct.quantity + currentQuantity) {
    quantityElement.textContent = newQuantity;
    targetProduct.quantity--;
    return true;
  } else {
    alert("재고가 부족합니다.");
    return false;
  }
}

/**
 * 새로운 장바구니 아이템을 생성하고 추가합니다.
 *
 * @param {Object} targetProduct - 추가할 상품 객체
 * @param {HTMLElement} cartDisplay - 장바구니 컨테이너
 */
function createAndAddCartItem(targetProduct, cartDisplay) {
  const newCartItem = createCartItem({
    product: targetProduct,
    onQuantityChange: (productId, change) => handleQuantityChange(productId, change, targetProduct),
    onRemove: productId => handleRemoveItem(productId, targetProduct),
  });

  cartDisplay.appendChild(newCartItem);
  targetProduct.quantity--;
}

// 장바구니 수량 변경
function handleQuantityChange(productId, quantityChange, targetProduct) {
  // 3단계: cartService의 수량 변경 로직 사용
  const success = cartService.updateCartItemQuantity(productId, quantityChange, PRODUCT_LIST);

  if (!success) {
    alert("재고가 부족합니다.");
    return;
  }

  const cartItemElement = document.getElementById(productId);
  if (!cartItemElement) return;

  const quantityElement = cartItemElement.querySelector(".quantity-number");
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity <= 0) {
    cartItemElement.remove();
  } else {
    updateCartItemQuantity(cartItemElement, newQuantity);
    updateCartItemPriceStyle(cartItemElement, newQuantity);
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

// 장바구니 아이템 제거
function handleRemoveItem(productId, targetProduct) {
  // 4단계: cartService의 아이템 제거 로직 사용
  const success = cartService.removeProductFromCart(productId, PRODUCT_LIST);

  if (success) {
    const cartItemElement = document.getElementById(productId);
    if (cartItemElement) {
      cartItemElement.remove();
    }
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
}

// 상품을 장바구니에 추가
function handleAddToCart(productList, cartDisplay) {
  const selectedProductId = getSelectedProduct(selectorContainer);

  // 1단계: cartService의 검증 로직만 사용
  const targetProduct = cartService.validateSelectedProduct(selectedProductId, productList);

  if (!targetProduct) return;

  const existingCartItem = document.getElementById(targetProduct.id);

  if (existingCartItem) {
    // 2단계: cartService의 수량 증가 로직 사용
    const success = cartService.updateCartItemQuantity(targetProduct.id, 1, productList);
    if (success) {
      const quantityElement = existingCartItem.querySelector(".quantity-number");
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + 1;
      quantityElement.textContent = newQuantity;
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

  handleCalculateCartStuff();
  lastSel = selectedProductId;
}

function main() {
  const root = document.getElementById("app");
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  header = createHeader({ itemCount: 0 });

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";

  const leftColumn = document.createElement("div");
  leftColumn["className"] = "bg-white border border-gray-200 p-8 overflow-y-auto";

  // ProductSelector 컴포넌트 생성
  selectorContainer = createProductSelector({
    products: PRODUCT_LIST,
    onProductSelect: () => {
      console.log("select");
    },
    onAddToCart: () => {
      console.log("add");
      handleAddToCart(PRODUCT_LIST, cartDisp);
    },
  });

  cartDisp = document.createElement("div");
  cartDisp.id = "cart-items";
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisp);

  const rightColumn = document.createElement("div");
  rightColumn.className = "bg-black text-white p-8 flex flex-col";

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

  const manualToggle = document.createElement("button");
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };
  manualToggle.className = "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  const manualOverlay = document.createElement("div");
  manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };
  const manualColumn = document.createElement("div");
  manualColumn.className = "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
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

  onUpdateSelectOptions();
  handleCalculateCartStuff();
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
      if (cartDisp.children.length === 0) {
        console.log("cartDisplay 길이가 0입니다.");
      }
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
  let totalStock = 0;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    const _p = PRODUCT_LIST[idx];
    totalStock = totalStock + _p.quantity;
  }

  // ProductSelector 컴포넌트 업데이트
  updateProductOptions(selectorContainer, PRODUCT_LIST, totalStock, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
  updateStockInfo(selectorContainer, PRODUCT_LIST, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
}
function handleCalculateCartStuff() {
  const cartItems = cartDisp.children;
  let subTot;
  const itemDiscounts = [];
  const lowStockItems = [];
  let idx;
  let bulkDisc;
  let itemDisc;
  let savedAmount;
  const itemCountElement = document.getElementById("item-count");
  let previousCount;
  let stockMsg;
  totalAmt = 0;
  itemCnt = 0;
  subTot = 0;

  for (idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING && PRODUCT_LIST[idx].quantity > 0) {
      lowStockItems.push(PRODUCT_LIST[idx].name);
    }
  }

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.price * q;
      let disc;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(elem => {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
        }
      });
      updateCartItemPriceStyle(itemDiv, q);
      if (q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        if (curItem.id === "p1") {
          disc = PRODUCT_DISCOUNTS.KEYBOARD_10_PLUS;
        } else {
          if (curItem.id === "p2") {
            disc = PRODUCT_DISCOUNTS.MOUSE_10_PLUS;
          } else {
            if (curItem.id === "p3") {
              disc = PRODUCT_DISCOUNTS.MONITOR_ARM_10_PLUS;
            } else {
              if (curItem.id === "p4") {
                disc = PRODUCT_DISCOUNTS.LAPTOP_POUCH_10_PLUS;
              } else {
                if (curItem.id === "p5") {
                  disc = PRODUCT_DISCOUNTS.SPEAKER_10_PLUS;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }

  let discRate = 0;
  const originalTotal = subTot;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = subTot * DISCOUNT_RATES.BULK_PURCHASE;
    discRate = 1 - DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;

  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL;
      discRate = 1 - totalAmt / originalTotal;
    }
  }

  updateHeaderItemCount(header, itemCnt);

  // OrderSummary 컴포넌트 업데이트
  const orderSummary = document.querySelector(".bg-black.text-white.p-8.flex.flex-col > div");
  if (orderSummary) {
    updateOrderSummary(orderSummary, {
      cartItems: Array.from(cartItems),
      subtotal: subTot,
      totalAmount: totalAmt,
      itemDiscounts,
      isTuesday,
      itemCount: itemCnt,
      discountRate: discRate,
      savedAmount: originalTotal - totalAmt,
    });
  }

  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = "🛍️ " + itemCnt + " items in cart";
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }

  stockMsg = "";
  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const item = PRODUCT_LIST[stockIdx];
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg = stockMsg + item.name + ": 재고 부족 (" + item.quantity + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }

  if (stockInfo) {
    stockInfo.textContent = stockMsg;
  }

  handleStockInfoUpdate();
}

const handleStockInfoUpdate = function () {
  updateStockInfo(selectorContainer, PRODUCT_LIST, QUANTITY_THRESHOLDS.LOW_STOCK_WARNING);
};
function doUpdatePricesInCart() {
  let totalCount = 0,
    j = 0;
  while (cartDisp.children[j]) {
    const qty = cartDisp.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector(".quantity-number").textContent);
  }
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }
    if (product) {
      updateCartItemPrice(cartItems[i], product);
    }
  }
  handleCalculateCartStuff();
}
main();

import { renderProductSelector } from "./features/shopping-cart/utils/productSelector.js";
import { renderCartItem } from "./features/shopping-cart/utils/cartDisplay.js";
import { renderOrderSummary } from "./features/shopping-cart/utils/orderSummary.js";
import { Header } from "./features/shopping-cart/components/Header.js";
import { HelpModal } from "./features/shopping-cart/components/HelpModal.js";
import {
  handleCartClick,
  handleAddToCartClick,
  handleHelpModalClick,
} from "./features/shopping-cart/events/clickDelegates.js";

const PRODUCTS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
};

const BUSINESS_CONSTANTS = {
  DISCOUNT: {
    ITEM_DISCOUNT_MIN_QUANTITY: 10,
    BULK_DISCOUNT_THRESHOLD: 30,
    BULK_DISCOUNT_RATE: 0.25,
    TUESDAY_DISCOUNT_RATE: 0.1,
    SUGGEST_DISCOUNT_RATE: 0.05,
    FLASH_SALE_DISCOUNT_RATE: 0.2,
  },

  STOCK: {
    LOW_STOCK_THRESHOLD: 5,
    STOCK_WARNING_THRESHOLD: 50,
    STOCK_SHORTAGE_THRESHOLD: 30,
  },

  POINTS: {
    BASE_POINT_RATE: 1000,
    TUESDAY_MULTIPLIER: 2,
    KEYBOARD_MOUSE_BONUS: 50,
    FULL_SET_BONUS: 100,
    BULK_PURCHASE_BONUSES: {
      TIER_1: { threshold: 10, bonus: 20 },
      TIER_2: { threshold: 20, bonus: 50 },
      TIER_3: { threshold: 30, bonus: 100 },
    },
  },

  TIMERS: {
    FLASH_SALE_INTERVAL: 30000,
    SUGGEST_SALE_INTERVAL: 60000,
    MAX_DELAY: 20000,
    RANDOM_DELAY: 10000,
  },
};

const appState = {
  productList: [],

  totalAmount: 0,
  totalItemCount: 0,
  bonusPoints: 0,
  lastSelectedProductId: null,

  elements: {
    productSelector: null,
    addToCartButton: null,
    cartDisplayElement: null,
    stockInfoElement: null,
    summaryElement: null,
  },
};

let productList = [];
let bonusPoints = 0;
let stockInfoElement = null;
let totalItemCount = 0;
let lastSelectedProductId = null;
let productSelector = null;
let addToCartButton = null;
let totalAmount = 0;
let cartDisplayElement = null;
let summaryElement;

const stateActions = {
  initializeProducts: () => [
    {
      id: PRODUCTS.KEYBOARD,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.MOUSE,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.MONITOR_ARM,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.LAPTOP_POUCH,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCTS.SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ],

  updateState: (newState) => {
    Object.assign(appState, newState);
    productList = appState.productList;
    totalAmount = appState.totalAmount;
    totalItemCount = appState.totalItemCount;
    bonusPoints = appState.bonusPoints;
    lastSelectedProductId = appState.lastSelectedProductId;
  },
};

const businessLogic = {
  calculateItemDiscount: (productId, quantity) => {
    if (quantity < BUSINESS_CONSTANTS.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY)
      return 0;

    const discountRates = {
      [PRODUCTS.KEYBOARD]: 0.1,
      [PRODUCTS.MOUSE]: 0.15,
      [PRODUCTS.MONITOR_ARM]: 0.2,
      [PRODUCTS.LAPTOP_POUCH]: 0.05,
      [PRODUCTS.SPEAKER]: 0.25,
    };

    return discountRates[productId] || 0;
  },

  calculateTotalDiscount: (subtotal, totalItemCount, isTuesday) => {
    let discountRate = 0;

    if (totalItemCount >= BUSINESS_CONSTANTS.DISCOUNT.BULK_DISCOUNT_THRESHOLD) {
      discountRate = BUSINESS_CONSTANTS.DISCOUNT.BULK_DISCOUNT_RATE;
    }

    if (isTuesday) {
      const tuesdayRate = BUSINESS_CONSTANTS.DISCOUNT.TUESDAY_DISCOUNT_RATE;
      discountRate =
        discountRate > 0
          ? 1 - (1 - discountRate) * (1 - tuesdayRate)
          : tuesdayRate;
    }

    return discountRate;
  },

  calculatePoints: (finalAmount, isTuesday, cartItems, totalItemCount) => {
    let basePoints = Math.floor(
      finalAmount / BUSINESS_CONSTANTS.POINTS.BASE_POINT_RATE
    );
    let totalPoints = basePoints;
    const details = [];

    if (basePoints > 0) {
      details.push(`기본: ${basePoints}p`);

      if (isTuesday) {
        totalPoints = basePoints * BUSINESS_CONSTANTS.POINTS.TUESDAY_MULTIPLIER;
        details.push("화요일 2배");
      }
    }

    const hasKeyboard = cartItems.some((item) => item.id === PRODUCTS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.id === PRODUCTS.MOUSE);
    const hasMonitorArm = cartItems.some(
      (item) => item.id === PRODUCTS.MONITOR_ARM
    );

    if (hasKeyboard && hasMouse) {
      totalPoints += BUSINESS_CONSTANTS.POINTS.KEYBOARD_MOUSE_BONUS;
      details.push(
        `키보드+마우스 세트 +${BUSINESS_CONSTANTS.POINTS.KEYBOARD_MOUSE_BONUS}p`
      );
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      totalPoints += BUSINESS_CONSTANTS.POINTS.FULL_SET_BONUS;
      details.push(`풀세트 구매 +${BUSINESS_CONSTANTS.POINTS.FULL_SET_BONUS}p`);
    }

    const { TIER_1, TIER_2, TIER_3 } =
      BUSINESS_CONSTANTS.POINTS.BULK_PURCHASE_BONUSES;
    if (totalItemCount >= TIER_3.threshold) {
      totalPoints += TIER_3.bonus;
      details.push(`대량구매(${TIER_3.threshold}개+) +${TIER_3.bonus}p`);
    } else if (totalItemCount >= TIER_2.threshold) {
      totalPoints += TIER_2.bonus;
      details.push(`대량구매(${TIER_2.threshold}개+) +${TIER_2.bonus}p`);
    } else if (totalItemCount >= TIER_1.threshold) {
      totalPoints += TIER_1.bonus;
      details.push(`대량구매(${TIER_1.threshold}개+) +${TIER_1.bonus}p`);
    }

    return { points: totalPoints, details };
  },
};

function initializeProductData() {
  stateActions.updateState({
    totalAmount: 0,
    totalItemCount: 0,
    lastSelectedProductId: null,
    productList: stateActions.initializeProducts(),
  });
}

// TODO: createHeader function moved to HeaderComponent

function createLeftColumn() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";

  const selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  const productSelectorElement = document.createElement("select");
  productSelectorElement.id = "product-select";
  productSelectorElement.className =
    "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  const addToCartButtonElement = document.createElement("button");
  addToCartButtonElement.id = "add-to-cart";
  addToCartButtonElement.innerHTML = "Add to Cart";
  addToCartButtonElement.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

  const stockInfoElementCreated = document.createElement("div");
  stockInfoElementCreated.id = "stock-status";
  stockInfoElementCreated.className =
    "text-xs text-red-500 mt-3 whitespace-pre-line";

  const cartDisplayElementCreated = document.createElement("div");
  cartDisplayElementCreated.id = "cart-items";

  appState.elements.productSelector = productSelectorElement;
  appState.elements.addToCartButton = addToCartButtonElement;
  appState.elements.stockInfoElement = stockInfoElementCreated;
  appState.elements.cartDisplayElement = cartDisplayElementCreated;

  productSelector = productSelectorElement;
  addToCartButton = addToCartButtonElement;
  stockInfoElement = stockInfoElementCreated;
  cartDisplayElement = cartDisplayElementCreated;

  selectorContainer.appendChild(productSelectorElement);
  selectorContainer.appendChild(addToCartButtonElement);
  selectorContainer.appendChild(stockInfoElementCreated);
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplayElementCreated);

  return leftColumn;
}

function createRightColumn() {
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

  const summaryElementCreated = rightColumn.querySelector("#cart-total");
  appState.elements.summaryElement = summaryElementCreated;

  summaryElement = summaryElementCreated;

  return rightColumn;
}

function main() {
  initializeProductData();

  let gridContainer;
  let lightningDelay;

  const root = document.getElementById("app");
  const header = Header({ itemCount: totalItemCount });
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();
  const helpModal = HelpModal();

  gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(helpModal.toggleButton);
  root.appendChild(helpModal.overlay);
  let initStock = 0;
  for (let i = 0; i < productList.length; i++) {
    initStock += productList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  addToCartButton.addEventListener("click", (event) => {
    handleAddToCartClick(event, {
      onAddToCart: handleAddToCart,
    });
  });

  cartDisplayElement.addEventListener("click", (event) => {
    handleCartClick(event, {
      cartUtils,
      productUtils,
      onCalculate: handleCalculateCartStuff,
      onUpdateOptions: onUpdateSelectOptions,
    });
  });

  document.addEventListener("click", (event) => {
    handleHelpModalClick(event, {
      onToggle: helpModal.handleToggle,
      onClose: helpModal.handleClose,
    });
  });

  lightningDelay = Math.random() * BUSINESS_CONSTANTS.TIMERS.RANDOM_DELAY;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        const saleRate =
          1 - BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE;
        luckyItem.val = Math.round(luckyItem.originalVal * saleRate);
        luckyItem.onSale = true;
        const discountPercent =
          BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE * 100;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${discountPercent}% 할인 중입니다!`
        );
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, BUSINESS_CONSTANTS.TIMERS.FLASH_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplayElement.children.length === 0) {
      }
      if (lastSelectedProductId) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProductId) {
            if (productList[k].q > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          const discountPercent =
            BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE * 100;
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`
          );
          const saleRate =
            1 - BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE;
          suggest.val = Math.round(suggest.val * saleRate);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * BUSINESS_CONSTANTS.TIMERS.MAX_DELAY);
}

function onUpdateSelectOptions() {
  return renderProductSelector({
    products: productList,
    containerElement: productSelector,
    stockThreshold: BUSINESS_CONSTANTS.STOCK.STOCK_WARNING_THRESHOLD,
  });
}

function handleCalculateCartStuff() {
  let cartItems;
  let subtotal;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  let originalTotal;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMessage;

  totalAmount = 0;
  totalItemCount = 0;
  originalTotal = totalAmount;
  cartItems = cartDisplayElement.children;
  subtotal = 0;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < productList.length; idx++) {
    if (
      productList[idx].q < BUSINESS_CONSTANTS.STOCK.LOW_STOCK_THRESHOLD &&
      productList[idx].q > 0
    ) {
      lowStockItems.push(productList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector(".quantity-number");
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      let discount = 0;
      totalItemCount += q;
      subtotal += itemTotal;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight =
            q >= BUSINESS_CONSTANTS.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY
              ? "bold"
              : "normal";
        }
      });

      discount = businessLogic.calculateItemDiscount(curItem.id, q);
      if (discount > 0) {
        itemDiscounts.push({ name: curItem.name, discount: discount * 100 });
      }
      totalAmount += itemTotal * (1 - discount);
    })();
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  originalTotal = subtotal;

  if (totalItemCount >= 30) {
    totalAmount = (subtotal * 75) / 100;
  }

  if (isTuesday && totalAmount > 0) {
    totalAmount = (totalAmount * 90) / 100;
  }

  const discountRate = totalAmount > 0 ? 1 - totalAmount / originalTotal : 0;

  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }
  document.getElementById("item-count").textContent =
    "🛍️ " + totalItemCount + " items in cart";
  summaryDetails = document.getElementById("summary-details");
  renderOrderSummary({
    cartItems: Array.from(cartItems),
    products: productList,
    subtotal: subtotal,
    totalItemCount: totalItemCount,
    itemDiscounts: itemDiscounts,
    isTuesday: isTuesday,
    totalAmount: totalAmount,
    containerElement: summaryDetails,
    bulkDiscountThreshold: BUSINESS_CONSTANTS.DISCOUNT.BULK_DISCOUNT_THRESHOLD,
  });
  totalDiv = summaryElement.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmount).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(
      totalAmount / BUSINESS_CONSTANTS.POINTS.BASE_POINT_RATE
    );
    if (points > 0) {
      loyaltyPointsDiv.textContent = "적립 포인트: " + points + "p";
      loyaltyPointsDiv.style.display = "block";
    } else {
      loyaltyPointsDiv.textContent = "적립 포인트: 0p";
      loyaltyPointsDiv.style.display = "block";
    }
  }
  discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (discountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
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
  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = "🛍️ " + totalItemCount + " items in cart";
    if (previousCount !== totalItemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }
  stockMessage = "";
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMessage += item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMessage += item.name + ": 품절\n";
      }
    }
  }
  stockInfoElement.textContent = stockMessage;
  doRenderBonusPoints();
}
const doRenderBonusPoints = () => {
  if (cartDisplayElement.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }

  const cartItems = Array.from(cartDisplayElement.children)
    .map((node) => {
      for (let pIdx = 0; pIdx < productList.length; pIdx++) {
        if (productList[pIdx].id === node.id) {
          return productList[pIdx];
        }
      }
      return null;
    })
    .filter((item) => item !== null);

  const isTuesday = new Date().getDay() === 2;
  const pointsData = businessLogic.calculatePoints(
    totalAmount,
    isTuesday,
    cartItems,
    totalItemCount
  );

  bonusPoints = pointsData.points;
  var ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (bonusPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPoints +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsData.details.join(", ") +
        "</div>";
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};
function onGetStockTotal() {
  var stockSum = 0;
  var i;
  var currentProduct;
  for (i = 0; i < productList.length; i++) {
    currentProduct = productList[i];
    stockSum += currentProduct.q;
  }
  return stockSum;
}
const handleStockInfoUpdate = () => {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
  }
  productList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });
  stockInfoElement.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  let totalCount = 0;
  let j = 0;
  let cartItems;
  while (cartDisplayElement.children[j]) {
    const qty =
      cartDisplayElement.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplayElement.children.length; j++) {
    totalCount += parseInt(
      cartDisplayElement.children[j].querySelector(".quantity-number")
        .textContent
    );
  }
  cartItems = cartDisplayElement.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < productList.length; productIdx++) {
      if (productList[productIdx].id === itemId) {
        product = productList[productIdx];
        break;
      }
    }
    if (product) {
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
  handleCalculateCartStuff();
}

const productUtils = {
  findById: (productId, products = productList) => {
    return products.find((product) => product.id === productId) || null;
  },

  isValid: (productId, products = productList) => {
    if (!productId) return false;
    return products.some((product) => product.id === productId);
  },
};

const cartUtils = {
  updateItemQuantity: (product, existingItem) => {
    const qtyElement = existingItem.querySelector(".quantity-number");
    const currentQty = parseInt(qtyElement.textContent);
    const newQty = currentQty + 1;

    if (newQty <= product.q + currentQty) {
      qtyElement.textContent = newQty;
      product.q--;
      return true;
    } else {
      alert("재고가 부족합니다.");
      return false;
    }
  },

  addNewItem: (product, containerElement) => {
    renderCartItem({ product, quantity: 1, containerElement });
    product.q--;
  },

  changeItemQuantity: (product, itemElement, quantityChange) => {
    const qtyElement = itemElement.querySelector(".quantity-number");
    const currentQty = parseInt(qtyElement.textContent);
    const newQty = currentQty + quantityChange;

    if (newQty > 0 && newQty <= product.q + currentQty) {
      qtyElement.textContent = newQty;
      product.q -= quantityChange;
      return true;
    } else if (newQty <= 0) {
      product.q += currentQty;
      itemElement.remove();
      return true;
    } else {
      alert("재고가 부족합니다.");
      return false;
    }
  },

  removeItem: (product, itemElement) => {
    const qtyElement = itemElement.querySelector(".quantity-number");
    const removedQty = parseInt(qtyElement.textContent);
    product.q += removedQty;
    itemElement.remove();
  },
};

main();

const handleAddToCart = () => {
  const selectedProductId = productSelector.value;

  if (!productUtils.isValid(selectedProductId)) {
    return;
  }

  const productToAdd = productUtils.findById(selectedProductId);

  if (productToAdd && productToAdd.q > 0) {
    const existingCartItem = document.getElementById(productToAdd.id);

    if (existingCartItem) {
      cartUtils.updateItemQuantity(productToAdd, existingCartItem);
    } else {
      cartUtils.addNewItem(productToAdd, cartDisplayElement);
    }

    handleCalculateCartStuff();
    lastSelectedProductId = selectedProductId;
  }
};

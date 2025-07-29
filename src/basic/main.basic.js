import { Header } from "./shared/components/Header.js";
import { HelpModal } from "./shared/components/HelpModal.js";
import { ProductSelector } from "./features/product/components/ProductSelector.js";
import { renderCartItem } from "./features/cart/components/CartItem.js";
import { renderOrderSummaryDetails } from "./features/order/components/OrderSummaryDetails.js";
import { renderCartTotal } from "./features/cart/components/CartTotal.js";
import { ELEMENT_IDS } from "./shared/constants/element-ids.js";
import {
  handleCartClick,
  handleAddToCartClick,
  handleHelpModalClick,
} from "./shared/events/clickDelegates.js";

// Feature Business Logic
import CartCalculator from "./features/cart/service/CartCalculator.js";
import PointsCalculator from "./features/point/service/PointsCalculator.js";
import StockManager from "./features/product/service/StockManager.js";
import PriceUpdater from "./features/cart/service/PriceUpdater.js";

// Store Classes for State Management
import ProductStore from "./features/product/store/ProductStore.js";
import CartStore from "./features/cart/store/CartStore.js";

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

// Local State Stores - Replace global variables
let productStore;
let cartStore;

// Legacy variables for compatibility (TODO: Remove after full Store migration)
let totalAmount = 0;
let totalItemCount = 0;
let bonusPoints = 0;

// DOM Element References (not state)
let stockInfoElement = null;
let productSelector = null;
let addToCartButton = null;
let cartDisplayElement = null;
let summaryElement;

// Feature instances - moved to global scope for access
let cartCalculator;
let pointsCalculator;
let stockManager;
let priceUpdater;

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
};

function initializeProductData() {
  // Initialize Store instances
  productStore = ProductStore.createInstance();
  cartStore = CartStore.createInstance();

  // Set initial product data
  const initialProducts = stateActions.initializeProducts();
  productStore.setProducts(initialProducts);

  // Set initial state
  productStore.setAmount(0);
  productStore.setItemCount(0);
  productStore.setLastSelectedProduct(null);
}

// TODO: createHeader function moved to HeaderComponent

function createLeftColumn() {
  const leftColumn = document.createElement("div");
  leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";

  const selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  const productSelectorElement = ProductSelector({
    products: productStore.getProducts(),
    selectedProductId: productStore.getLastSelectedProduct(),
    onSelectionChange: (productId) => {
      productStore.setLastSelectedProduct(productId);
    },
  });

  const addToCartButtonElement = document.createElement("button");
  addToCartButtonElement.id = ELEMENT_IDS.ADD_TO_CART;
  addToCartButtonElement.innerHTML = "Add to Cart";
  addToCartButtonElement.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

  const stockInfoElementCreated = document.createElement("div");
  stockInfoElementCreated.id = ELEMENT_IDS.STOCK_STATUS;
  stockInfoElementCreated.className =
    "text-xs text-red-500 mt-3 whitespace-pre-line";

  const cartDisplayElementCreated = document.createElement("div");
  cartDisplayElementCreated.id = ELEMENT_IDS.CART_ITEMS;
  cartDisplayElementCreated.className = "space-y-3";

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

// Centralized calculation function (replaces handleCalculateCartStuff)
function calculateAndUpdateTotals() {
  const cartItems = cartDisplayElement.getItems
    ? cartDisplayElement.getItems()
    : [];

  // Update summary component
  if (summaryElement && summaryElement.updateCartItems) {
    summaryElement.updateCartItems(cartItems);
  }

  // Update header item count
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const headerItemCount = document.getElementById("item-count");
  if (headerItemCount) {
    headerItemCount.textContent = `🛍️ ${itemCount} items in cart`;
  }

  // Update global variables for legacy compatibility
  totalItemCount = itemCount;
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

  // Keep global reference for legacy compatibility
  summaryElement = summaryElementCreated;

  return rightColumn;
}

function main() {
  initializeProductData();

  // Initialize Feature instances with dependency injection
  cartCalculator = new CartCalculator(BUSINESS_CONSTANTS, PRODUCTS);
  pointsCalculator = new PointsCalculator(BUSINESS_CONSTANTS, PRODUCTS);
  stockManager = new StockManager(BUSINESS_CONSTANTS);
  priceUpdater = new PriceUpdater(BUSINESS_CONSTANTS, PRODUCTS);

  let gridContainer;
  let lightningDelay;

  const root = document.getElementById("app");
  const header = Header({ itemCount: productStore.getItemCount() });
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
  const products = productStore.getProducts();
  for (let i = 0; i < products.length; i++) {
    initStock += products[i].q;
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
      const products = productStore.getProducts();
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      // Use PriceUpdater for clean flash sale logic
      const saleApplied = priceUpdater.applyFlashSale(
        luckyItem.id,
        BUSINESS_CONSTANTS.DISCOUNT.FLASH_SALE_DISCOUNT_RATE
      );

      if (saleApplied) {
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
      const lastSelectedProductId = productStore.getLastSelectedProduct();
      if (lastSelectedProductId) {
        let suggest = null;
        const products = productStore.getProducts();
        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== lastSelectedProductId) {
            if (products[k].q > 0) {
              if (!products[k].suggestSale) {
                suggest = products[k];
                break;
              }
            }
          }
        }

        if (suggest) {
          // Use PriceUpdater for clean suggest sale logic
          const saleApplied = priceUpdater.applySuggestSale(
            suggest.id,
            BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE
          );

          if (saleApplied) {
            const discountPercent =
              BUSINESS_CONSTANTS.DISCOUNT.SUGGEST_DISCOUNT_RATE * 100;
            alert(
              `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${discountPercent}% 추가 할인!`
            );
            onUpdateSelectOptions();
            doUpdatePricesInCart();
          }
        }
      }
    }, BUSINESS_CONSTANTS.TIMERS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * BUSINESS_CONSTANTS.TIMERS.MAX_DELAY);
}

function onUpdateSelectOptions() {
  // Update ProductSelector with new products data
  if (productSelector && productSelector.updateProducts) {
    productSelector.updateProducts(
      productStore.getProducts(),
      productStore.getLastSelectedProduct()
    );
  }

  const totalStock = productStore
    .getProducts()
    .reduce((sum, p) => sum + p.q, 0);

  // Original logic: border color change based on stock
  if (totalStock < BUSINESS_CONSTANTS.STOCK.STOCK_WARNING_THRESHOLD) {
    if (productSelector && productSelector.style) {
      productSelector.style.borderColor = "orange";
    }
  } else {
    if (productSelector && productSelector.style) {
      productSelector.style.borderColor = "";
    }
  }

  return {
    totalStock,
    isLowStock: totalStock < BUSINESS_CONSTANTS.STOCK.STOCK_WARNING_THRESHOLD,
  };
}

function handleCalculateCartStuff() {
  // Feature-based cart calculation - much cleaner!
  const cartElements = cartDisplayElement.children;

  // 1. Calculate cart totals using CartCalculator
  const cartResults = cartCalculator.calculateCart(
    cartElements,
    productStore.getProducts()
  );

  // Update Store and legacy variables for compatibility
  productStore.setAmount(cartResults.totalAmount);
  productStore.setItemCount(cartResults.totalItemCount);

  // Legacy variables for compatibility (TODO: Remove after full Store migration)
  totalAmount = cartResults.totalAmount;
  totalItemCount = cartResults.totalItemCount;

  // 2. Update UI components with calculated data
  updateUIWithCalculation(cartResults);

  // 3. Calculate and render bonus points using PointsCalculator
  const pointsResults = pointsCalculator.calculateAndRender(
    cartResults.totalAmount,
    cartResults.totalItemCount,
    cartElements,
    productStore.getProducts()
  );

  // Update Store and legacy variables for compatibility
  productStore.setPoint(pointsResults.points);

  // Legacy variables for compatibility (TODO: Remove after full Store migration)
  bonusPoints = pointsResults.points;

  // 4. Render final cart total with points
  renderCartTotal({
    amount: cartResults.totalAmount,
    discountRate: cartResults.discountRate,
    point: pointsResults.points,
  });

  // 5. Update stock info (matching original logic)
  handleStockInfoUpdate();
}

// Helper function to update UI with calculation results
function updateUIWithCalculation(cartResults) {
  const {
    subtotal,
    totalAmount,
    totalItemCount,
    itemDiscounts,
    isTuesday,
    discountRate,
  } = cartResults;

  // Update Tuesday special banner
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove("hidden");
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  // Update item count in header
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${totalItemCount} items in cart`;
    if (previousCount !== totalItemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }

  // Prepare cart items data for Order Summary
  const cartItemsData = Array.from(cartDisplayElement.children)
    .map((cartItemElement) => {
      let product = null;
      const products = productStore.getProducts();
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItemElement.id) {
          product = products[j];
          break;
        }
      }
      const qtyElem = cartItemElement.querySelector(".quantity-number");
      const quantity = qtyElem ? parseInt(qtyElem.textContent) : 0;
      return { product, quantity };
    })
    .filter((item) => item.product);

  // Render Order Summary Details
  renderOrderSummaryDetails({
    cartItems: cartItemsData,
    subtotal: subtotal,
    totalItemCount: totalItemCount,
    itemDiscounts: itemDiscounts,
    isTuesday: isTuesday,
    totalAmount: totalAmount,
  });

  // Update discount info
  updateDiscountInfo(discountRate, subtotal, totalAmount);
}

// Helper function to update discount information display
function updateDiscountInfo(discountRate, originalTotal, totalAmount) {
  const discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
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
// doRenderBonusPoints() removed - replaced by PointsCalculator feature
function onGetStockTotal() {
  var stockSum = 0;
  var i;
  var currentProduct;
  const products = productStore.getProducts();
  for (i = 0; i < products.length; i++) {
    currentProduct = products[i];
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
  productStore.getProducts().forEach(function (item) {
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
  // Use PriceUpdater for clean price management
  priceUpdater.updatePricesInCart(
    cartDisplayElement,
    productStore.getProducts(),
    handleCalculateCartStuff
  );
}

const productUtils = {
  findById: (productId, products = productStore.getProducts()) => {
    return products.find((product) => product.id === productId) || null;
  },

  isValid: (productId, products = productStore.getProducts()) => {
    if (!productId) return false;
    return products.some((product) => product.id === productId);
  },
};

// Legacy renderOrderSummary function removed - now using OrderSummaryDetails component

// Legacy renderCartItem function removed - now using CartItem component

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
    renderCartItem(product, 1);
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
    productStore.setLastSelectedProduct(selectedProductId);
  }
};

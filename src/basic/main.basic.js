const PRODUCTS = {
  KEYBOARD: "p1",
  MOUSE: "p2",
  MONITOR_ARM: "p3",
  LAPTOP_POUCH: "p4",
  SPEAKER: "p5",
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
    if (quantity < 10) return 0;

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

    if (totalItemCount >= 30) {
      discountRate = 0.25;
    }

    if (isTuesday) {
      discountRate = discountRate > 0 ? 1 - (1 - discountRate) * 0.9 : 0.1;
    }

    return discountRate;
  },

  calculatePoints: (finalAmount, isTuesday, cartItems, totalItemCount) => {
    let basePoints = Math.floor(finalAmount / 1000);
    let totalPoints = basePoints;
    const details = [];

    if (basePoints > 0) {
      details.push(`기본: ${basePoints}p`);

      if (isTuesday) {
        totalPoints = basePoints * 2;
        details.push("화요일 2배");
      }
    }

    const hasKeyboard = cartItems.some((item) => item.id === PRODUCTS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.id === PRODUCTS.MOUSE);
    const hasMonitorArm = cartItems.some(
      (item) => item.id === PRODUCTS.MONITOR_ARM
    );

    if (hasKeyboard && hasMouse) {
      totalPoints += 50;
      details.push("키보드+마우스 세트 +50p");
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      totalPoints += 100;
      details.push("풀세트 구매 +100p");
    }

    if (totalItemCount >= 30) {
      totalPoints += 100;
      details.push("대량구매(30개+) +100p");
    } else if (totalItemCount >= 20) {
      totalPoints += 50;
      details.push("대량구매(20개+) +50p");
    } else if (totalItemCount >= 10) {
      totalPoints += 20;
      details.push("대량구매(10개+) +20p");
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

function createHeader() {
  const header = document.createElement("div");
  header.className = "mb-8";
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  return header;
}

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

  var gridContainer;
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  var lightningDelay;

  const root = document.getElementById("app");
  const header = createHeader();
  const leftColumn = createLeftColumn();
  const rightColumn = createRightColumn();

  gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  manualToggle = document.createElement("button");
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle("hidden");
    manualColumn.classList.toggle("translate-x-full");
  };
  manualToggle.className =
    "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  manualOverlay = document.createElement("div");
  manualOverlay.className =
    "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    }
  };
  manualColumn = document.createElement("div");
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
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  var initStock = 0;
  for (var i = 0; i < productList.length; i++) {
    initStock += productList[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * productList.length);
      var luckyItem = productList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert("⚡번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplayElement.children.length === 0) {
      }
      if (lastSelectedProductId) {
        var suggest = null;
        for (var k = 0; k < productList.length; k++) {
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
          alert(
            "💝 " +
              suggest.name +
              "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

const ProductSelector = {
  render: function (props) {
    const { products, containerElement } = props;
    let totalStock = 0;

    containerElement.innerHTML = "";

    for (let idx = 0; idx < products.length; idx++) {
      totalStock += products[idx].q;
    }

    products.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;

      let discountDisplay = "";
      if (item.onSale) discountDisplay += " ⚡SALE";
      if (item.suggestSale) discountDisplay += " 💝추천";

      if (item.q === 0) {
        option.textContent =
          item.name + " - " + item.val + "원 (품절)" + discountDisplay;
        option.disabled = true;
        option.className = "text-gray-400";
      } else {
        if (item.onSale && item.suggestSale) {
          option.textContent =
            "⚡💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (25% SUPER SALE!)";
          option.className = "text-purple-600 font-bold";
        } else if (item.onSale) {
          option.textContent =
            "⚡" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (20% SALE!)";
          option.className = "text-red-500 font-bold";
        } else if (item.suggestSale) {
          option.textContent =
            "💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (5% 추천할인!)";
          option.className = "text-blue-500 font-bold";
        } else {
          option.textContent =
            item.name + " - " + item.val + "원" + discountDisplay;
        }
      }

      containerElement.appendChild(option);
    });

    if (totalStock < 50) {
      containerElement.style.borderColor = "orange";
    } else {
      containerElement.style.borderColor = "";
    }

    return { totalStock };
  },
};

const CartDisplay = {
  renderCartItem: function (props) {
    const { product, quantity = 1 } = props;

    const itemElement = document.createElement("div");
    itemElement.id = product.id;
    itemElement.className =
      "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

    const getPriceDisplay = (product) => {
      if (product.onSale || product.suggestSale) {
        const colorClass =
          product.onSale && product.suggestSale
            ? "text-purple-600"
            : product.onSale
            ? "text-red-500"
            : "text-blue-500";

        return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${colorClass}">₩${product.val.toLocaleString()}</span>`;
      }
      return `₩${product.val.toLocaleString()}`;
    };

    const getProductNameDisplay = (product) => {
      let prefix = "";
      if (product.onSale && product.suggestSale) prefix = "⚡💝";
      else if (product.onSale) prefix = "⚡";
      else if (product.suggestSale) prefix = "💝";

      return prefix + product.name;
    };

    itemElement.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${getProductNameDisplay(
          product
        )}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${getPriceDisplay(product)}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            product.id
          }" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${
            product.id
          }" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${getPriceDisplay(
          product
        )}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${
          product.id
        }">Remove</a>
      </div>
    `;

    return itemElement;
  },

  addItem: function (props) {
    const { product, containerElement, onUpdate } = props;
    const existingItem = containerElement.querySelector(`#${product.id}`);

    if (existingItem) {
      const qtyElement = existingItem.querySelector(".quantity-number");
      const newQuantity = parseInt(qtyElement.textContent) + 1;
      qtyElement.textContent = newQuantity;
    } else {
      const newItem = this.renderCartItem({ product, quantity: 1 });
      containerElement.appendChild(newItem);
    }

    product.q--;
    if (onUpdate) onUpdate();
  },
};

const OrderSummary = {
  render: function (props) {
    const {
      cartItems,
      products,
      subtotal,
      totalItemCount,
      itemDiscounts,
      isTuesday,
      totalAmount,
      containerElement,
    } = props;

    containerElement.innerHTML = "";

    if (subtotal > 0) {
      cartItems.forEach((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id);
        if (!product) return;

        const qtyElement = cartItem.querySelector(".quantity-number");
        const quantity = parseInt(qtyElement.textContent);
        const itemTotal = product.val * quantity;

        containerElement.innerHTML += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${product.name} x ${quantity}</span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        `;
      });

      containerElement.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subtotal.toLocaleString()}</span>
        </div>
      `;

      this.renderDiscountInfo({
        containerElement,
        totalItemCount,
        itemDiscounts,
        isTuesday,
        totalAmount,
      });

      containerElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
    }
  },

  renderDiscountInfo: function (props) {
    const {
      containerElement,
      totalItemCount,
      itemDiscounts,
      isTuesday,
      totalAmount,
    } = props;

    if (totalItemCount >= 30) {
      containerElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        containerElement.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday && totalAmount > 0) {
      containerElement.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }
  },
};

function onUpdateSelectOptions() {
  ProductSelector.render({
    products: productList,
    containerElement: productSelector,
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
    if (productList[idx].q < 5 && productList[idx].q > 0) {
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
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
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
  OrderSummary.render({
    cartItems: Array.from(cartItems),
    products: productList,
    subtotal: subtotal,
    totalItemCount: totalItemCount,
    itemDiscounts: itemDiscounts,
    isTuesday: isTuesday,
    totalAmount: totalAmount,
    containerElement: summaryDetails,
  });
  totalDiv = summaryElement.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent = "₩" + Math.round(totalAmount).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000);
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
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function () {
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
var handleStockInfoUpdate = function () {
  var infoMsg;
  var totalStock;
  var messageOptimizer;
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
  var totalCount = 0,
    j = 0;
  var cartItems;
  while (cartDisplayElement.children[j]) {
    var qty = cartDisplayElement.children[j].querySelector(".quantity-number");
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
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;
    for (var productIdx = 0; productIdx < productList.length; productIdx++) {
      if (productList[productIdx].id === itemId) {
        product = productList[productIdx];
        break;
      }
    }
    if (product) {
      var priceDiv = cartItems[i].querySelector(".text-lg");
      var nameDiv = cartItems[i].querySelector("h3");
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
  findById: function (productId, products = productList) {
    return products.find((product) => product.id === productId) || null;
  },

  isValid: function (productId, products = productList) {
    if (!productId) return false;
    return products.some((product) => product.id === productId);
  },
};

const cartUtils = {
  updateItemQuantity: function (product, existingItem) {
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

  addNewItem: function (product, containerElement) {
    const newItem = CartDisplay.renderCartItem({
      product: product,
      quantity: 1,
    });
    containerElement.appendChild(newItem);
    product.q--;
  },

  changeItemQuantity: function (product, itemElement, quantityChange) {
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

  removeItem: function (product, itemElement) {
    const qtyElement = itemElement.querySelector(".quantity-number");
    const removedQty = parseInt(qtyElement.textContent);
    product.q += removedQty;
    itemElement.remove();
  },
};

main();

addToCartButton.addEventListener("click", function () {
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
});
cartDisplayElement.addEventListener("click", function (event) {
  const target = event.target;

  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);

    const product = productUtils.findById(productId);
    if (!product) return;

    if (target.classList.contains("quantity-change")) {
      const quantityChange = parseInt(target.dataset.change);
      cartUtils.changeItemQuantity(product, itemElement, quantityChange);
    } else if (target.classList.contains("remove-item")) {
      cartUtils.removeItem(product, itemElement);
    }

    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

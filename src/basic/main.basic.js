// 전역 변수들을 ShoppingCart 모듈로 캡슐화
const ShoppingCart = (() => {
  // Private state
  let state = {
    products: [],
    cart: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelected: null,
    bonusPoints: 0,
  };

  // DOM elements
  let domElements = {
    selector: null,
    addButton: null,
    cartDisplay: null,
    summary: null,
    stockInfo: null,
  };

  // Public API
  return {
    // State getters
    getProducts: () => state.products,
    getCart: () => state.cart,
    getTotalAmount: () => state.totalAmount,
    getItemCount: () => state.itemCount,
    getLastSelected: () => state.lastSelected,
    getBonusPoints: () => state.bonusPoints,

    // State setters
    setProducts: products => {
      state.products = products;
    },
    setCart: cart => {
      state.cart = cart;
    },
    setTotalAmount: amount => {
      state.totalAmount = amount;
    },
    setItemCount: count => {
      state.itemCount = count;
    },
    setLastSelected: selected => {
      state.lastSelected = selected;
    },
    setBonusPoints: points => {
      state.bonusPoints = points;
    },

    // DOM element setters
    setDOMElements: elements => {
      domElements = { ...domElements, ...elements };
    },
    getDOMElements: () => domElements,

    // Utility methods
    findProduct: id => state.products.find(p => p.id === id),
    updateProduct: (id, updates) => {
      const product = state.products.find(p => p.id === id);
      if (product) {
        Object.assign(product, updates);
      }
    },
  };
})();

// 기존 전역 변수들을 ShoppingCart 모듈의 메서드로 대체
var prodList = ShoppingCart.getProducts;
var bonusPts = ShoppingCart.getBonusPoints;
var stockInfo = null; // DOM 요소는 나중에 설정
var itemCnt = ShoppingCart.getItemCount;
var lastSel = ShoppingCart.getLastSelected;
var sel = null; // DOM 요소는 나중에 설정
var addBtn = null; // DOM 요소는 나중에 설정
var totalAmt = ShoppingCart.getTotalAmount;
var PRODUCT_ONE = "p1";
var p2 = "p2";
var product_3 = "p3";
var p4 = "p4";
var PRODUCT_5 = `p5`;
var cartDisp = null; // DOM 요소는 나중에 설정

function main() {
  var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  var lightningDelay;

  // ShoppingCart 모듈 초기화
  ShoppingCart.setTotalAmount(0);
  ShoppingCart.setItemCount(0);
  ShoppingCart.setLastSelected(null);

  const initialProducts = [
    {
      id: PRODUCT_ONE,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p2,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: product_3,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p4,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  ShoppingCart.setProducts(initialProducts);

  const root = document.getElementById("app");
  header = document.createElement("div");
  header.className = "mb-8";
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  sel = document.createElement("select");
  sel.id = "product-select";
  gridContainer = document.createElement("div");
  leftColumn = document.createElement("div");
  leftColumn["className"] =
    "bg-white border border-gray-200 p-8 overflow-y-auto";
  selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";
  sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
  gridContainer.className =
    "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
  addBtn = document.createElement("button");
  stockInfo = document.createElement("div");
  addBtn.id = "add-to-cart";
  stockInfo.id = "stock-status";
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  addBtn.innerHTML = "Add to Cart";
  addBtn.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisp = document.createElement("div");
  leftColumn.appendChild(cartDisp);
  cartDisp.id = "cart-items";
  rightColumn = document.createElement("div");
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
  sum = rightColumn.querySelector("#cart-total");
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

  // DOM 요소들을 ShoppingCart 모듈에 설정
  ShoppingCart.setDOMElements({
    selector: sel,
    addButton: addBtn,
    cartDisplay: cartDisp,
    summary: sum,
    stockInfo: stockInfo,
  });

  var initStock = 0;
  for (var i = 0; i < ShoppingCart.getProducts().length; i++) {
    initStock += ShoppingCart.getProducts()[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(
        Math.random() * ShoppingCart.getProducts().length
      );
      var luckyItem = ShoppingCart.getProducts()[luckyIdx];
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
      if (cartDisp.children.length === 0) {
        // 빈 장바구니 상태 처리
        return;
      }
      if (ShoppingCart.getLastSelected()) {
        var suggest = null;
        for (var k = 0; k < ShoppingCart.getProducts().length; k++) {
          if (
            ShoppingCart.getProducts()[k].id !== ShoppingCart.getLastSelected()
          ) {
            if (ShoppingCart.getProducts()[k].q > 0) {
              if (!ShoppingCart.getProducts()[k].suggestSale) {
                suggest = ShoppingCart.getProducts()[k];
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
var sum;
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  const domElements = ShoppingCart.getDOMElements();
  domElements.selector.innerHTML = "";
  totalStock = 0;
  for (var idx = 0; idx < ShoppingCart.getProducts().length; idx++) {
    var _p = ShoppingCart.getProducts()[idx];
    totalStock = totalStock + _p.q;
  }
  for (var i = 0; i < ShoppingCart.getProducts().length; i++) {
    (function () {
      var item = ShoppingCart.getProducts()[i];
      opt = document.createElement("option");
      opt.value = item.id;
      discountText = "";
      if (item.onSale) discountText += " ⚡SALE";
      if (item.suggestSale) discountText += " 💝추천";
      if (item.q === 0) {
        opt.textContent =
          item.name + " - " + item.val + "원 (품절)" + discountText;
        opt.disabled = true;
        opt.className = "text-gray-400";
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent =
            "⚡💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (25% SUPER SALE!)";
          opt.className = "text-purple-600 font-bold";
        } else if (item.onSale) {
          opt.textContent =
            "⚡" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (20% SALE!)";
          opt.className = "text-red-500 font-bold";
        } else if (item.suggestSale) {
          opt.textContent =
            "💝" +
            item.name +
            " - " +
            item.originalVal +
            "원 → " +
            item.val +
            "원 (5% 추천할인!)";
          opt.className = "text-blue-500 font-bold";
        } else {
          opt.textContent = item.name + " - " + item.val + "원" + discountText;
        }
      }
      domElements.selector.appendChild(opt);
    })();
  }
  if (totalStock < 50) {
    domElements.selector.style.borderColor = "orange";
  } else {
    domElements.selector.style.borderColor = "";
  }
}
function handleCalculateCartStuff() {
  var cartItems;
  var subTot;
  var itemDiscounts;
  var lowStockItems;
  var idx;
  var bulkDisc;
  var itemDisc;
  var savedAmount;
  var summaryDetails;
  var totalDiv;
  var loyaltyPointsDiv;
  var points;
  var discountInfoDiv;
  var itemCountElement;
  var previousCount;
  var stockMsg;
  var pts;
  var hasP1;
  var hasP2;
  var loyaltyDiv;

  // ShoppingCart 모듈 사용
  ShoppingCart.setTotalAmount(0);
  ShoppingCart.setItemCount(0);
  var originalTotal = ShoppingCart.getTotalAmount();

  const domElements = ShoppingCart.getDOMElements();
  cartItems = domElements.cartDisplay.children;
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];

  for (idx = 0; idx < ShoppingCart.getProducts().length; idx++) {
    if (
      ShoppingCart.getProducts()[idx].q < 5 &&
      ShoppingCart.getProducts()[idx].q > 0
    ) {
      lowStockItems.push(ShoppingCart.getProducts()[idx].name);
    }
  }

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < ShoppingCart.getProducts().length; j++) {
        if (ShoppingCart.getProducts()[j].id === cartItems[i].id) {
          curItem = ShoppingCart.getProducts()[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector(".quantity-number");
      var q;
      var itemTot;
      var disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      ShoppingCart.setItemCount(ShoppingCart.getItemCount() + q);
      subTot += itemTot;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");
      priceElems.forEach(function (elem) {
        if (elem.classList.contains("text-lg")) {
          elem.style.fontWeight = q >= 10 ? "bold" : "normal";
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_ONE) {
          disc = 10 / 100;
        } else {
          if (curItem.id === p2) {
            disc = 15 / 100;
          } else {
            if (curItem.id === product_3) {
              disc = 20 / 100;
            } else {
              if (curItem.id === p4) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      ShoppingCart.setTotalAmount(
        ShoppingCart.getTotalAmount() + itemTot * (1 - disc)
      );
    })();
  }

  let discRate = 0;
  originalTotal = subTot;
  if (ShoppingCart.getItemCount() >= 30) {
    ShoppingCart.setTotalAmount((subTot * 75) / 100);
    discRate = 25 / 100;
  } else {
    discRate = (subTot - ShoppingCart.getTotalAmount()) / subTot;
  }

  const today = new Date();
  var isTuesday = today.getDay() === 2;
  var tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (ShoppingCart.getTotalAmount() > 0) {
      ShoppingCart.setTotalAmount((ShoppingCart.getTotalAmount() * 90) / 100);
      discRate = 1 - ShoppingCart.getTotalAmount() / originalTotal;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  document.getElementById("item-count").textContent =
    "🛍️ " + ShoppingCart.getItemCount() + " items in cart";
  summaryDetails = document.getElementById("summary-details");
  summaryDetails.innerHTML = "";

  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (var j = 0; j < ShoppingCart.getProducts().length; j++) {
        if (ShoppingCart.getProducts()[j].id === cartItems[i].id) {
          curItem = ShoppingCart.getProducts()[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector(".quantity-number");
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;
    if (ShoppingCart.getItemCount() >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (ShoppingCart.getTotalAmount() > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  totalDiv = domElements.summary.querySelector(".text-2xl");
  if (totalDiv) {
    totalDiv.textContent =
      "₩" + Math.round(ShoppingCart.getTotalAmount()).toLocaleString();
  }

  loyaltyPointsDiv = document.getElementById("loyalty-points");
  if (loyaltyPointsDiv) {
    points = Math.floor(ShoppingCart.getTotalAmount() / 1000);
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
  if (discRate > 0 && ShoppingCart.getTotalAmount() > 0) {
    savedAmount = originalTotal - ShoppingCart.getTotalAmount();
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent =
      "🛍️ " + ShoppingCart.getItemCount() + " items in cart";
    if (previousCount !== ShoppingCart.getItemCount()) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }

  stockMsg = "";
  for (
    var stockIdx = 0;
    stockIdx < ShoppingCart.getProducts().length;
    stockIdx++
  ) {
    var item = ShoppingCart.getProducts()[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg =
          stockMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        stockMsg = stockMsg + item.name + ": 품절\n";
      }
    }
  }
  domElements.stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

var doRenderBonusPoints = function () {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;

  const domElements = ShoppingCart.getDOMElements();
  if (domElements.cartDisplay.children.length === 0) {
    document.getElementById("loyalty-points").style.display = "none";
    return;
  }

  basePoints = Math.floor(ShoppingCart.getTotalAmount() / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push("기본: " + basePoints + "p");
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push("화요일 2배");
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = domElements.cartDisplay.children;
  for (const node of nodes) {
    var product = null;
    for (var pIdx = 0; pIdx < ShoppingCart.getProducts().length; pIdx++) {
      if (ShoppingCart.getProducts()[pIdx].id === node.id) {
        product = ShoppingCart.getProducts()[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push("키보드+마우스 세트 +50p");
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("풀세트 구매 +100p");
  }
  if (ShoppingCart.getItemCount() >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push("대량구매(30개+) +100p");
  } else {
    if (ShoppingCart.getItemCount() >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push("대량구매(20개+) +50p");
    } else {
      if (ShoppingCart.getItemCount() >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push("대량구매(10개+) +20p");
      }
    }
  }
  ShoppingCart.setBonusPoints(finalPoints);
  var ptsTag = document.getElementById("loyalty-points");
  if (ptsTag) {
    if (ShoppingCart.getBonusPoints() > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        ShoppingCart.getBonusPoints() +
        "p</span></div>" +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(", ") +
        "</div>";
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }
};

function onGetStockTotal() {
  var sum;
  var i;
  var currentProduct;
  sum = 0;
  for (i = 0; i < ShoppingCart.getProducts().length; i++) {
    currentProduct = ShoppingCart.getProducts()[i];
    sum += currentProduct.q;
  }
  return sum;
}

var handleStockInfoUpdate = function () {
  var infoMsg;
  var totalStock;
  var messageOptimizer;
  infoMsg = "";
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
    // 재고 부족 시 추가 처리 로직
    console.log("전체 재고가 부족합니다");
  }
  ShoppingCart.getProducts().forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ": 재고 부족 (" + item.q + "개 남음)\n";
      } else {
        infoMsg = infoMsg + item.name + ": 품절\n";
      }
    }
  });
  const domElements = ShoppingCart.getDOMElements();
  domElements.stockInfo.textContent = infoMsg;
};

function doUpdatePricesInCart() {
  var totalCount = 0,
    j = 0;
  var cartItems;
  const domElements = ShoppingCart.getDOMElements();
  while (domElements.cartDisplay.children[j]) {
    var qty =
      domElements.cartDisplay.children[j].querySelector(".quantity-number");
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < domElements.cartDisplay.children.length; j++) {
    totalCount += parseInt(
      domElements.cartDisplay.children[j].querySelector(".quantity-number")
        .textContent
    );
  }
  cartItems = domElements.cartDisplay.children;
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;
    for (
      var productIdx = 0;
      productIdx < ShoppingCart.getProducts().length;
      productIdx++
    ) {
      if (ShoppingCart.getProducts()[productIdx].id === itemId) {
        product = ShoppingCart.getProducts()[productIdx];
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

main();
addBtn.addEventListener("click", function () {
  var selItem = sel.value;
  var hasItem = false;
  for (var idx = 0; idx < ShoppingCart.getProducts().length; idx++) {
    if (ShoppingCart.getProducts()[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  var itemToAdd = null;
  for (var j = 0; j < ShoppingCart.getProducts().length; j++) {
    if (ShoppingCart.getProducts()[j].id === selItem) {
      itemToAdd = ShoppingCart.getProducts()[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const domElements = ShoppingCart.getDOMElements();
    var item = document.getElementById(itemToAdd["id"]);
    if (item) {
      var qtyElem = item.querySelector(".quantity-number");
      var newQty = parseInt(qtyElem["textContent"]) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd["q"]--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className =
        "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? "⚡💝" : itemToAdd.onSale ? "⚡" : itemToAdd.suggestSale ? "💝" : ""}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500") + '">₩' + itemToAdd.val.toLocaleString() + "</span>" : "₩" + itemToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500") + '">₩' + itemToAdd.val.toLocaleString() + "</span>" : "₩" + itemToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      domElements.cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    ShoppingCart.setLastSelected(selItem);
  }
});

cartDisp.addEventListener("click", function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains("quantity-change") ||
    tgt.classList.contains("remove-item")
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = null;
    for (var prdIdx = 0; prdIdx < ShoppingCart.getProducts().length; prdIdx++) {
      if (ShoppingCart.getProducts()[prdIdx].id === prodId) {
        prod = ShoppingCart.getProducts()[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains("quantity-change")) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector(".quantity-number");
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      var removeQtyElem = itemElem.querySelector(".quantity-number");
      var remQty = parseInt(removeQtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
      // 재고 부족 시 추가 처리
      console.log(`${prod.name}의 재고가 부족합니다`);
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

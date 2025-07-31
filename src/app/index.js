// Application bootstrap (refactored architecture)
import Product from "../domain/Product.js";
import Cart from "../domain/Cart.js";
import CartPresenter from "../presenters/CartPresenter.js";
import ProductSelectorPresenter from "../presenters/ProductSelectorPresenter.js";
import SummaryPresenter from "../presenters/SummaryPresenter.js";
import AlertService from "../infra/AlertService.js";
import PromoScheduler from "../infra/PromoScheduler.js";

// ---------- Data ----------
const products = [
  new Product({
    id: "p1",
    name: "버그 없애는 키보드",
    price: 10000,
    stock: 50,
  }),
  new Product({
    id: "p2",
    name: "생산성 폭발 마우스",
    price: 20000,
    stock: 30,
  }),
  new Product({
    id: "p3",
    name: "거북목 탈출 모니터암",
    price: 30000,
    stock: 20,
  }),
  new Product({
    id: "p4",
    name: "에러 방지 노트북 파우치",
    price: 15000,
    stock: 0,
  }),
  new Product({
    id: "p5",
    name: "코딩할 때 듣는 Lo-Fi 스피커",
    price: 25000,
    stock: 10,
  }),
];

let lastSelectedId = null;

// ---------- DOM skeleton ----------
const root = document.getElementById("app");
root.innerHTML = "";

// Header
root.innerHTML += `
  <div class="mb-8">
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  </div>`;

// Grid container
const gridContainer = document.createElement("div");
gridContainer.className =
  "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
root.appendChild(gridContainer);

// Left column (selector + cart)
const leftColumn = document.createElement("div");
leftColumn.className = "bg-white border border-gray-200 p-8 overflow-y-auto";

gridContainer.appendChild(leftColumn);

// Selector section
const selectorContainer = document.createElement("div");
selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";
leftColumn.appendChild(selectorContainer);

// Select element
const sel = document.createElement("select");
sel.id = "product-select";
sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";
selectorContainer.appendChild(sel);

// Add button
const addBtn = document.createElement("button");
addBtn.id = "add-to-cart";
addBtn.innerHTML = "Add to Cart";
addBtn.className =
  "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
selectorContainer.appendChild(addBtn);

// Stock info
const stockInfo = document.createElement("div");
stockInfo.id = "stock-status";
stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
selectorContainer.appendChild(stockInfo);

// Cart items container
const cartDisp = document.createElement("div");
cartDisp.id = "cart-items";
leftColumn.appendChild(cartDisp);

// Right column (order summary)
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
        <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right" style="display:none"></div>
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
  </p>`;

gridContainer.appendChild(rightColumn);

// ---------- Domain & Presenters ----------
const cart = new Cart();

const productSelector = new ProductSelectorPresenter(sel, products);

const summaryPresenter = new SummaryPresenter(cart, {
  container: rightColumn.querySelector("#summary-details"),
  discountInfo: rightColumn.querySelector("#discount-info"),
  totalDiv: rightColumn.querySelector("#cart-total .text-2xl"),
  loyaltyDiv: rightColumn.querySelector("#loyalty-points"),
  tuesdayBanner: rightColumn.querySelector("#tuesday-special"),
});

function updateAll() {
  productSelector.render();
  summaryPresenter.render();
}

const cartPresenter = new CartPresenter(
  cart,
  {
    root: cartDisp,
    stockInfo,
    itemCount: document.getElementById("item-count"),
  },
  updateAll,
  products
);

// Add to cart handler
addBtn.addEventListener("click", () => {
  const selectedId = sel.value;
  const product = products.find((p) => p.id === selectedId);
  if (!product) return;
  if (product.stock === 0) return;
  if (!cart.addProduct(product, 1)) {
    window.alert("재고가 부족합니다.");
    return;
  }
  lastSelectedId = selectedId;
  cartPresenter.render();
  summaryPresenter.render();
  productSelector.render();
});

// ---------- Promo scheduler ----------
const alertSvc = new AlertService();
const scheduler = new PromoScheduler(
  products,
  alertSvc,
  () => lastSelectedId,
  () => {
    // 가격 변동 시 UI 재렌더
    productSelector.render();
    cartPresenter.render();
    summaryPresenter.render();
  }
);

afterInitialRender();
function afterInitialRender() {
  scheduler.start();
}

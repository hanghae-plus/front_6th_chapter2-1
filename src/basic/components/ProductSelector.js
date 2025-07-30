import { QUANTITY_THRESHOLDS } from "../constants/index.js";

// 매직 넘버 상수
const PERCENT_MULTIPLIER = 100;
const DEFAULT_DISCOUNT_RATE = 0;
const DEFAULT_DISCOUNT_PERCENT = 0;
const ZERO_QUANTITY = 0;
const DEFAULT_REDUCE_INITIAL_VALUE = 0;

// 상품 옵션을 생성합니다.
function createProductOption(product, discountInfo) {
  const option = document.createElement("option");
  option.value = product.id;
  option.textContent = getOptionText(product, discountInfo);
  option.className = getOptionClass(product, discountInfo);
  if (product.quantity === ZERO_QUANTITY) option.disabled = true;
  return option;
}

// 옵션 텍스트를 생성합니다.
function getOptionText(product, discountInfo) {
  if (product.quantity === ZERO_QUANTITY) {
    return `${product.name} - ${product.price}원 (품절)`;
  }

  const discountRate = discountInfo?.rate || DEFAULT_DISCOUNT_RATE;
  const discountPercent = discountRate > DEFAULT_DISCOUNT_RATE ? (discountRate * PERCENT_MULTIPLIER).toFixed(0) : DEFAULT_DISCOUNT_PERCENT;
  const discountStatus = discountInfo?.status || "";

  if (discountStatus === "SUPER SALE") {
    return `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  if (discountStatus === "SALE") {
    return `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  if (discountStatus === "추천할인") {
    return `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  return `${product.name} - ${product.price}원`;
}

// 옵션의 CSS 클래스를 생성합니다.
function getOptionClass(product, discountInfo) {
  if (product.quantity === ZERO_QUANTITY) return "text-gray-400";

  const discountStatus = discountInfo?.status || "";
  if (discountStatus === "SUPER SALE") return "text-purple-600 font-bold";
  if (discountStatus === "SALE") return "text-red-500 font-bold";
  if (discountStatus === "추천할인") return "text-blue-500 font-bold";
  return "";
}

// 버튼 상태를 토글합니다.
function toggleButtonState(button, disabled) {
  button.disabled = disabled;
  button.className = disabled
    ? "w-full py-3 bg-gray-400 text-white text-sm font-medium uppercase tracking-wider cursor-not-allowed"
    : "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
}

// 장바구니 추가버튼을 생성합니다.
function createAddButton() {
  const button = document.createElement("button");
  button.id = "add-to-cart";
  button.textContent = "Add to Cart";
  toggleButtonState(button, false); // 초기 상태: 활성화
  return button;
}

// 재고 상태를 표시하는 요소를 생성합니다.
function createStockStatus() {
  const div = document.createElement("div");
  div.id = "stock-status";
  div.className = "text-xs text-red-500 mt-3 whitespace-pre-line";
  return div;
}

// 상품 선택을 드롭다운으로 생성하는 컴포넌트입니다.
function createProductSelect(products, discountInfos) {
  const select = document.createElement("select");
  select.id = "product-select";
  select.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  products.forEach(product => {
    const discountInfo = discountInfos?.find(discount => discount.productId === product.id);
    const option = createProductOption(product, discountInfo);
    select.appendChild(option);
  });

  const totalStock = products.reduce((stockSum, product) => stockSum + product.quantity, DEFAULT_REDUCE_INITIAL_VALUE);
  if (totalStock < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
    select.style.borderColor = "orange";
  }

  return select;
}

// ProductSelector 컴포넌트를 생성합니다.
export function createProductSelector({ products, discountInfos, onAddToCart }) {
  const container = document.createElement("div");
  container.id = "product-selector";
  container.className = "mb-6 pb-6 border-b border-gray-200";

  const select = createProductSelect(products, discountInfos);
  const button = createAddButton();
  const stockInfo = createStockStatus();

  if (onAddToCart) button.addEventListener("click", onAddToCart);

  container.appendChild(select);
  container.appendChild(button);
  container.appendChild(stockInfo);

  updateProductOptions(products, discountInfos);
  updateStockInfo(products);

  return container;
}

// 상품 옵션을 갱신합니다.
export function updateProductOptions(products, discountInfos) {
  const productSelect = document.querySelector("#product-select");
  if (!productSelect) return;

  productSelect.innerHTML = "";

  products.forEach(product => {
    const discountInfo = discountInfos?.find(discount => discount.productId === product.id);
    const option = createProductOption(product, discountInfo);
    productSelect.appendChild(option);
  });

  const totalStock = products.reduce((stockSum, product) => stockSum + product.quantity, DEFAULT_REDUCE_INITIAL_VALUE);
  productSelect.style.borderColor = totalStock < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING ? "orange" : "";
}

// 재고 부족 여부를 체크합니다.
function isLowStock(product, threshold = QUANTITY_THRESHOLDS.LOW_STOCK_WARNING) {
  return product.quantity < threshold;
}
// 재고 정보를 갱신합니다.
export function updateStockInfo(products) {
  const stockStatus = document.querySelector("#stock-status");
  if (!stockStatus) return;

  const messages = products
    .filter(product => isLowStock(product))
    .map(product => (product.quantity > ZERO_QUANTITY ? `${product.name}: 재고 부족 (${product.quantity}개 남음)` : `${product.name}: 품절`));

  stockStatus.textContent = messages.join("\n");
}

// 선택된 상품 ID를 가져옵니다.
export function getSelectedProduct() {
  const productSelect = document.querySelector("#product-select");
  return productSelect ? productSelect.value : null;
}

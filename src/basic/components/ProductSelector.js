import { STOCK_WARNING_THRESHOLD, LOW_STOCK_THRESHOLD } from "../constants/index.js";
import { calculateDiscountRate, getDiscountStatus } from "../utils/productDisplay.js";

// 옵션 텍스트를 생성합니다.
function getOptionText(item) {
  if (item.quantity === 0) {
    return `${item.name} - ${item.price}원 (품절)`;
  }

  const discountRate = calculateDiscountRate(item);
  const discountPercent = discountRate > 0 ? (discountRate * 100).toFixed(0) : 0;
  const discountStatus = getDiscountStatus(item);

  if (discountStatus === "SUPER SALE") {
    return `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  if (discountStatus === "SALE") {
    return `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  if (discountStatus === "추천할인") {
    return `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (-${discountPercent}% ${discountStatus}!)`;
  }
  return `${item.name} - ${item.price}원`;
}

// 옵션의 CSS 클래스를 생성합니다.
function getOptionClass(item) {
  if (item.quantity === 0) return "text-gray-400";

  const discountStatus = getDiscountStatus(item);
  if (discountStatus === "SUPER SALE") return "text-purple-600 font-bold";
  if (discountStatus === "SALE") return "text-red-500 font-bold";
  if (discountStatus === "추천할인") return "text-blue-500 font-bold";
  return "";
}

// 재고 부족 여부를 체크합니다.
function isLowStock(item, threshold = LOW_STOCK_THRESHOLD) {
  return item.quantity < threshold;
}

// 버튼 상태를 토글합니다.
function toggleButtonState(button, disabled) {
  button.disabled = disabled;
  button.className = disabled
    ? "w-full py-3 bg-gray-400 text-white text-sm font-medium uppercase tracking-wider cursor-not-allowed"
    : "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
}

// 상품 선택을 드롭다운으로 생성하는 컴포넌트입니다.
function createProductSelect(products) {
  const select = document.createElement("select");
  select.id = "product-select";
  select.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  products.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = getOptionText(item);
    option.className = getOptionClass(item);
    if (item.quantity === 0) option.disabled = true;
    select.appendChild(option);
  });

  const totalStock = products.reduce((sum, item) => sum + item.quantity, 0);
  if (totalStock < STOCK_WARNING_THRESHOLD) {
    select.style.borderColor = "orange";
  }

  return select;
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

// ProductSelector 컴포넌트를 생성합니다.
export function createProductSelector({ products, onProductSelect, onAddToCart }) {
  const container = document.createElement("div");
  container.id = "product-selector";
  container.className = "mb-6 pb-6 border-b border-gray-200";

  const select = createProductSelect(products);
  const button = createAddButton();
  const stockInfo = createStockStatus();

  if (onProductSelect) select.addEventListener("change", onProductSelect);
  if (onAddToCart) button.addEventListener("click", onAddToCart);

  container.appendChild(select);
  container.appendChild(button);
  container.appendChild(stockInfo);

  updateProductOptions(products);
  updateStockInfo(products);

  return container;
}

// 상품 옵션을 갱신합니다.
export function updateProductOptions(products) {
  const productSelect = document.querySelector("#product-select");
  if (!productSelect) return;

  productSelect.innerHTML = "";

  products.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = getOptionText(item);
    option.className = getOptionClass(item);
    if (item.quantity === 0) option.disabled = true;
    productSelect.appendChild(option);
  });

  const totalStock = products.reduce((sum, item) => sum + item.quantity, 0);
  productSelect.style.borderColor = totalStock < STOCK_WARNING_THRESHOLD ? "orange" : "";
}

// 재고 정보를 갱신합니다.
export function updateStockInfo(products) {
  const stockStatus = document.querySelector("#stock-status");
  if (!stockStatus) return;

  const messages = products.filter(item => isLowStock(item)).map(item => (item.quantity > 0 ? `${item.name}: 재고 부족 (${item.quantity}개 남음)` : `${item.name}: 품절`));

  stockStatus.textContent = messages.join("\n");
}

// 선택된 상품 ID를 가져옵니다.
export function getSelectedProduct() {
  const productSelect = document.querySelector("#product-select");
  return productSelect ? productSelect.value : null;
}

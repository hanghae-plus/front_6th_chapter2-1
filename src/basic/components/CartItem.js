import { getProductDisplayName, getPriceDisplayHTML } from "../utils/productDisplay.js";

// CartItem 컴포넌트 생성
export function createCartItem({ product, discountInfo, onQuantityChange, onRemove }) {
  const cartItem = document.createElement("div");
  cartItem.id = product.id;
  cartItem.className = "cart-item grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";

  const discountRate = discountInfo?.rate || 0;
  const discountStatus = discountInfo?.status || "";
  const discountDisplay = discountRate > 0 ? `<span class="text-xs text-red-500 font-medium">-${(discountRate * 100).toFixed(0)}% ${discountStatus}</span>` : "";

  cartItem.innerHTML = /* HTML */ `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${getProductDisplayName(product)}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${getPriceDisplayHTML(product)} ${discountDisplay}</p>
      <div class="flex items-center gap-4">
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.id}"
          data-change="-1"
        >
          −
        </button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.id}"
          data-change="1"
        >
          +
        </button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${getPriceDisplayHTML(product)}</div>
      <a
        class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id="${product.id}"
        >Remove</a
      >
    </div>
  `;

  // 이벤트 리스너 등록
  if (onQuantityChange) {
    const decreaseButton = cartItem.querySelector("[data-change='-1']");
    const increaseButton = cartItem.querySelector("[data-change='1']");

    decreaseButton.addEventListener("click", () => onQuantityChange(product.id, -1));
    increaseButton.addEventListener("click", () => onQuantityChange(product.id, 1));
  }

  if (onRemove) {
    const removeButton = cartItem.querySelector(".remove-item");
    removeButton.addEventListener("click", () => onRemove(product.id));
  }

  return cartItem;
}

// CartItem의 수량을 업데이트합니다.
export function updateCartItemQuantity(cartItemElement, newQuantity) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  if (quantityElement) {
    quantityElement.textContent = newQuantity.toString();
  }
}

// CartItem의 가격을 업데이트합니다.
export function updateCartItemPrice(cartItemElement, product, discountInfo) {
  const priceElements = cartItemElement.querySelectorAll(".text-lg, .text-xs");
  const nameElement = cartItemElement.querySelector("h3");

  if (nameElement) {
    nameElement.textContent = getProductDisplayName(product);
  }

  const discountRate = discountInfo?.rate || 0;
  const discountStatus = discountInfo?.status || "";
  const discountDisplay = discountRate > 0 ? `<span class="text-xs text-red-500 font-medium">-${(discountRate * 100).toFixed(0)}% ${discountStatus}</span>` : "";

  priceElements.forEach(element => {
    if (element.classList.contains("text-lg")) {
      element.innerHTML = getPriceDisplayHTML(product);
    } else if (element.classList.contains("text-xs") && element.textContent.includes("₩")) {
      element.innerHTML = getPriceDisplayHTML(product) + " " + discountDisplay;
    }
  });
}

// CartItem의 수량에 따라 가격 표시 스타일을 업데이트합니다.
export function updateCartItemPriceStyle(cartItemElement, quantity) {
  const priceElements = cartItemElement.querySelectorAll(".text-lg");
  priceElements.forEach(element => {
    element.style.fontWeight = quantity >= 10 ? "bold" : "normal";
  });
}

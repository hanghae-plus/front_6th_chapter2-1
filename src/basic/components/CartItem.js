/**
 * CartItem 컴포넌트
 * 장바구니 아이템 카드를 렌더링합니다.
 *
 * @param {Object} props
 * @param {Object} props.product - 상품 정보
 * @param {Function} props.onQuantityChange - 수량 변경 시 호출되는 콜백
 * @param {Function} props.onRemove - 제거 시 호출되는 콜백
 * @param {string} [props.containerClassName="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"] - 컨테이너 클래스
 * @returns {HTMLElement} CartItem DOM 요소
 */
export function createCartItem(props) {
  const {
    product,
    onQuantityChange,
    onRemove,
    containerClassName = "grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0",
  } = props;

  const cartItem = document.createElement("div");
  cartItem.id = product.id;
  cartItem.className = containerClassName;

  // 상품 이미지
  const imageContainer = document.createElement("div");
  imageContainer.className =
    "w-20 h-20 bg-gradient-black relative overflow-hidden";
  imageContainer.innerHTML = `
    <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
  `;

  // 상품 정보 컨테이너
  const infoContainer = document.createElement("div");

  // 상품명
  const productName = document.createElement("h3");
  productName.className = "text-base font-normal mb-1 tracking-tight";
  productName.textContent = getProductDisplayName(product);

  // 상품 라벨
  const productLabel = document.createElement("p");
  productLabel.className = "text-xs text-gray-500 mb-0.5 tracking-wide";
  productLabel.textContent = "PRODUCT";

  // 가격 정보
  const priceInfo = document.createElement("p");
  priceInfo.className = "text-xs text-black mb-3";
  priceInfo.innerHTML = getPriceDisplayHTML(product);

  // 수량 조절 컨테이너
  const quantityContainer = document.createElement("div");
  quantityContainer.className = "flex items-center gap-4";

  // 수량 감소 버튼
  const decreaseButton = document.createElement("button");
  decreaseButton.className =
    "quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white";
  decreaseButton.setAttribute("data-product-id", product.id);
  decreaseButton.setAttribute("data-change", "-1");
  decreaseButton.textContent = "−";

  // 수량 표시
  const quantityDisplay = document.createElement("span");
  quantityDisplay.className =
    "quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums";
  quantityDisplay.textContent = "1";

  // 수량 증가 버튼
  const increaseButton = document.createElement("button");
  increaseButton.className =
    "quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white";
  increaseButton.setAttribute("data-product-id", product.id);
  increaseButton.setAttribute("data-change", "1");
  increaseButton.textContent = "+";

  // 수량 조절 버튼들을 컨테이너에 추가
  quantityContainer.appendChild(decreaseButton);
  quantityContainer.appendChild(quantityDisplay);
  quantityContainer.appendChild(increaseButton);

  // 정보 컨테이너에 요소들 추가
  infoContainer.appendChild(productName);
  infoContainer.appendChild(productLabel);
  infoContainer.appendChild(priceInfo);
  infoContainer.appendChild(quantityContainer);

  // 우측 컨테이너 (가격 + 제거 버튼)
  const rightContainer = document.createElement("div");
  rightContainer.className = "text-right";

  // 가격 표시
  const priceDisplay = document.createElement("div");
  priceDisplay.className = "text-lg mb-2 tracking-tight tabular-nums";
  priceDisplay.innerHTML = getPriceDisplayHTML(product);

  // 제거 버튼
  const removeButton = document.createElement("a");
  removeButton.className =
    "remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black";
  removeButton.setAttribute("data-product-id", product.id);
  removeButton.textContent = "Remove";

  // 우측 컨테이너에 요소들 추가
  rightContainer.appendChild(priceDisplay);
  rightContainer.appendChild(removeButton);

  // 메인 컨테이너에 모든 요소들 추가
  cartItem.appendChild(imageContainer);
  cartItem.appendChild(infoContainer);
  cartItem.appendChild(rightContainer);

  // 이벤트 리스너 등록
  if (onQuantityChange) {
    decreaseButton.addEventListener("click", () =>
      onQuantityChange(product.id, -1)
    );
    increaseButton.addEventListener("click", () =>
      onQuantityChange(product.id, 1)
    );
  }

  if (onRemove) {
    removeButton.addEventListener("click", () => onRemove(product.id));
  }

  return cartItem;
}

/**
 * 상품의 표시 이름을 생성합니다.
 *
 * @param {Object} product - 상품 정보
 * @returns {string} 표시할 상품명
 */
function getProductDisplayName(product) {
  let prefix = "";
  if (product.onSale && product.suggestSale) {
    prefix = "⚡💝";
  } else if (product.onSale) {
    prefix = "⚡";
  } else if (product.suggestSale) {
    prefix = "💝";
  }
  return prefix + product.name;
}

/**
 * 상품의 가격 표시 HTML을 생성합니다.
 *
 * @param {Object} product - 상품 정보
 * @returns {string} 가격 표시 HTML
 */
function getPriceDisplayHTML(product) {
  if (product.onSale || product.suggestSale) {
    let colorClass = "";
    if (product.onSale && product.suggestSale) {
      colorClass = "text-purple-600";
    } else if (product.onSale) {
      colorClass = "text-red-500";
    } else if (product.suggestSale) {
      colorClass = "text-blue-500";
    }

    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${colorClass}">₩${product.val.toLocaleString()}</span>`;
  } else {
    return `₩${product.val.toLocaleString()}`;
  }
}

/**
 * CartItem의 수량을 업데이트합니다.
 *
 * @param {HTMLElement} cartItemElement - CartItem DOM 요소
 * @param {number} newQuantity - 새로운 수량
 */
export function updateCartItemQuantity(cartItemElement, newQuantity) {
  const quantityElement = cartItemElement.querySelector(".quantity-number");
  if (quantityElement) {
    quantityElement.textContent = newQuantity.toString();
  }
}

/**
 * CartItem의 가격을 업데이트합니다.
 *
 * @param {HTMLElement} cartItemElement - CartItem DOM 요소
 * @param {Object} product - 업데이트된 상품 정보
 */
export function updateCartItemPrice(cartItemElement, product) {
  const priceElements = cartItemElement.querySelectorAll(".text-lg, .text-xs");
  const nameElement = cartItemElement.querySelector("h3");

  if (nameElement) {
    nameElement.textContent = getProductDisplayName(product);
  }

  priceElements.forEach(element => {
    if (element.classList.contains("text-lg")) {
      element.innerHTML = getPriceDisplayHTML(product);
    } else if (
      element.classList.contains("text-xs") &&
      element.textContent.includes("₩")
    ) {
      element.innerHTML = getPriceDisplayHTML(product);
    }
  });
}

/**
 * CartItem의 수량에 따라 가격 표시 스타일을 업데이트합니다.
 *
 * @param {HTMLElement} cartItemElement - CartItem DOM 요소
 * @param {number} quantity - 현재 수량
 */
export function updateCartItemPriceStyle(cartItemElement, quantity) {
  const priceElements = cartItemElement.querySelectorAll(".text-lg");
  priceElements.forEach(element => {
    element.style.fontWeight = quantity >= 10 ? "bold" : "normal";
  });
}

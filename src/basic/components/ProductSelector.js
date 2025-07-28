// 상수 정의
const STOCK_WARNING_THRESHOLD = 50;
const LOW_STOCK_THRESHOLD = 5;

/**
 * ProductSelector 컴포넌트
 * 상품 선택 드롭다운과 장바구니 추가 버튼을 렌더링합니다.
 *
 * @param {Array} products - 상품 목록
 * @param {Function} onProductSelect - 상품 선택 시 호출되는 콜백
 * @param {Function} onAddToCart - 장바구니 추가 시 호출되는 콜백
 * @returns {HTMLElement} ProductSelector DOM 요소
 */
export function createProductSelector({ products, onProductSelect, onAddToCart }) {
  const selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  // 상품 선택 드롭다운
  const select = document.createElement("select");
  select.id = "product-select";
  select.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  // 장바구니 추가 버튼
  const addButton = document.createElement("button");
  addButton.id = "add-to-cart";
  addButton.innerHTML = "Add to Cart";
  addButton.className = "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

  // 재고 정보 표시
  const stockInfo = document.createElement("div");
  stockInfo.id = "stock-status";
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";

  // 이벤트 리스너 등록
  if (onProductSelect) {
    select.addEventListener("change", onProductSelect);
  }

  if (onAddToCart) {
    addButton.addEventListener("click", onAddToCart);
  }

  // 컴포넌트 요소들을 컨테이너에 추가
  selectorContainer.appendChild(select);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);

  // 초기 상품 옵션 생성 (products가 제공된 경우)
  if (products && products.length > 0) {
    let totalStock = 0;
    for (let idx = 0; idx < products.length; idx++) {
      totalStock += products[idx].quantity;
    }

    updateProductOptions(selectorContainer, products, totalStock, LOW_STOCK_THRESHOLD);
    updateStockInfo(selectorContainer, products, LOW_STOCK_THRESHOLD);
  }

  return selectorContainer;
}

/**
 * 상품 옵션의 텍스트를 생성합니다.
 *
 * @param {Object} item - 상품 정보
 * @returns {string} 옵션 텍스트
 */
function createOptionText(item) {
  const discountText = createDiscountText(item);

  if (item.quantity === 0) {
    return `${item.name} - ${item.price}원 (품절)${discountText}`;
  }

  if (item.onSale && item.suggestSale) {
    return `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (25% SUPER SALE!)`;
  } else if (item.onSale) {
    return `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (20% SALE!)`;
  } else if (item.suggestSale) {
    return `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (5% 추천할인!)`;
  } else {
    return `${item.name} - ${item.price}원${discountText}`;
  }
}

/**
 * 할인 텍스트를 생성합니다.
 *
 * @param {Object} item - 상품 정보
 * @returns {string} 할인 텍스트
 */
function createDiscountText(item) {
  let discountText = "";
  if (item.onSale) discountText += " ⚡SALE";
  if (item.suggestSale) discountText += " 💝추천";
  return discountText;
}

/**
 * 옵션의 CSS 클래스를 결정합니다.
 *
 * @param {Object} item - 상품 정보
 * @returns {string} CSS 클래스
 */
function getOptionClassName(item) {
  if (item.quantity === 0) {
    return "text-gray-400";
  }

  if (item.onSale && item.suggestSale) {
    return "text-purple-600 font-bold";
  } else if (item.onSale) {
    return "text-red-500 font-bold";
  } else if (item.suggestSale) {
    return "text-blue-500 font-bold";
  }

  return "";
}

/**
 * ProductSelector의 상품 옵션을 업데이트합니다.
 *
 * @param {HTMLElement} selectorElement - ProductSelector DOM 요소
 * @param {Array} products - 상품 목록
 * @param {number} totalStock - 전체 재고 수량
 */
export function updateProductOptions(selectorElement, products, totalStock) {
  const select = selectorElement.querySelector("#product-select");
  if (!select) return;

  // innerHTML을 사용하여 한 번에 모든 옵션 생성
  const optionsHTML = products
    .map(item => {
      const optionText = createOptionText(item);
      const className = getOptionClassName(item);
      const disabled = item.quantity === 0 ? "disabled" : "";

      return `<option value="${item.id}" class="${className}" ${disabled}>${optionText}</option>`;
    })
    .join("");

  select.innerHTML = optionsHTML;

  // 전체 재고가 부족할 때 드롭다운 테두리 색상 변경
  updateSelectBorderColor(select, totalStock);
}

/**
 * 드롭다운의 테두리 색상을 업데이트합니다.
 *
 * @param {HTMLElement} select - select 요소
 * @param {number} totalStock - 전체 재고 수량
 */
function updateSelectBorderColor(select, totalStock) {
  if (totalStock < STOCK_WARNING_THRESHOLD) {
    select.style.borderColor = "orange";
  } else {
    select.style.borderColor = "";
  }
}

/**
 * ProductSelector의 재고 정보를 업데이트합니다.
 *
 * @param {HTMLElement} selectorElement - ProductSelector DOM 요소
 * @param {Array} products - 상품 목록
 * @param {number} lowStockThreshold - 재고 부족 임계값
 */
export function updateStockInfo(selectorElement, products, lowStockThreshold = LOW_STOCK_THRESHOLD) {
  const stockInfo = selectorElement.querySelector("#stock-status");
  if (!stockInfo) return;

  const stockMessages = products
    .filter(item => item.quantity < lowStockThreshold)
    .map(item => {
      if (item.quantity > 0) {
        return `${item.name}: 재고 부족 (${item.quantity}개 남음)`;
      } else {
        return `${item.name}: 품절`;
      }
    });

  stockInfo.textContent = stockMessages.join("\n");
}

/**
 * ProductSelector의 선택된 상품을 가져옵니다.
 *
 * @param {HTMLElement} selectorElement - ProductSelector DOM 요소
 * @returns {string|null} 선택된 상품 ID
 */
export function getSelectedProduct(selectorElement) {
  const select = selectorElement.querySelector("#product-select");
  return select ? select.value : null;
}

/**
 * ProductSelector의 버튼을 활성화/비활성화합니다.
 *
 * @param {HTMLElement} selectorElement - ProductSelector DOM 요소
 * @param {boolean} disabled - 버튼 비활성화 여부
 */
export function setAddButtonState(selectorElement, disabled) {
  const addButton = selectorElement.querySelector("#add-to-cart");
  if (addButton) {
    addButton.disabled = disabled;
    addButton.className = disabled
      ? "w-full py-3 bg-gray-400 text-white text-sm font-medium uppercase tracking-wider cursor-not-allowed"
      : "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";
  }
}

/**
 * ProductSelector 컴포넌트
 * 상품 선택 드롭다운과 장바구니 추가 버튼을 렌더링합니다.
 *
 * @param {Object} props
 * @param {Array} props.products - 상품 목록
 * @param {Function} props.onProductSelect - 상품 선택 시 호출되는 콜백
 * @param {Function} props.onAddToCart - 장바구니 추가 시 호출되는 콜백
 * @param {string} [props.containerClassName="mb-6 pb-6 border-b border-gray-200"] - 컨테이너 클래스
 * @returns {HTMLElement} ProductSelector DOM 요소
 */
export function createProductSelector(props) {
  const { products, onProductSelect, onAddToCart, containerClassName = "mb-6 pb-6 border-b border-gray-200" } = props;

  const selectorContainer = document.createElement("div");
  selectorContainer.className = containerClassName;

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

    updateProductOptions(selectorContainer, products, totalStock, 5);
    updateStockInfo(selectorContainer, products, 5);
  }

  return selectorContainer;
}

/**
 * ProductSelector의 상품 옵션을 업데이트합니다.
 *
 * @param {HTMLElement} selectorElement - ProductSelector DOM 요소
 * @param {Array} products - 상품 목록
 * @param {number} totalStock - 전체 재고 수량
 * @param {number} lowStockThreshold - 재고 부족 임계값
 */
export function updateProductOptions(selectorElement, products, totalStock, lowStockThreshold = 5) {
  const select = selectorElement.querySelector("#product-select");
  if (!select) return;

  select.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const option = document.createElement("option");
    option.value = item.id;

    let discountText = "";
    if (item.onSale) discountText += " ⚡SALE";
    if (item.suggestSale) discountText += " 💝추천";

    if (item.quantity === 0) {
      option.textContent = `${item.name} - ${item.price}원 (품절)${discountText}`;
      option.disabled = true;
      option.className = "text-gray-400";
    } else {
      if (item.onSale && item.suggestSale) {
        option.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (25% SUPER SALE!)`;
        option.className = "text-purple-600 font-bold";
      } else if (item.onSale) {
        option.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (20% SALE!)`;
        option.className = "text-red-500 font-bold";
      } else if (item.suggestSale) {
        option.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (5% 추천할인!)`;
        option.className = "text-blue-500 font-bold";
      } else {
        option.textContent = `${item.name} - ${item.price}원${discountText}`;
      }
    }

    select.appendChild(option);
  }

  // 전체 재고가 부족할 때 드롭다운 테두리 색상 변경
  if (totalStock < 50) {
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
export function updateStockInfo(selectorElement, products, lowStockThreshold = 5) {
  const stockInfo = selectorElement.querySelector("#stock-status");
  if (!stockInfo) return;

  let stockMessage = "";

  for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
    const item = products[stockIdx];
    if (item.quantity < lowStockThreshold) {
      if (item.quantity > 0) {
        stockMessage += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMessage += `${item.name}: 품절\n`;
      }
    }
  }

  stockInfo.textContent = stockMessage;
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

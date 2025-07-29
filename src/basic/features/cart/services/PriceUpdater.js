/**
 * Price Update Utilities
 * 리액트 친화적인 순수 함수들로 구성
 */

/**
 * 장바구니의 모든 가격 업데이트 (메인 함수)
 * @param {HTMLElement} cartDisplayElement - Cart display container
 * @param {Array} productList - Product list
 * @param {Function} onCalculate - Callback for recalculation
 */
export const updatePricesInCart = (
  cartDisplayElement,
  productList,
  onCalculate
) => {
  if (!cartDisplayElement || !cartDisplayElement.children) {
    return;
  }

  const cartItems = Array.from(cartDisplayElement.children);

  // 각 장바구니 아이템의 가격 디스플레이 업데이트
  cartItems.forEach((cartItem) => {
    updateCartItemPrice(cartItem, productList);
  });

  // 재계산 트리거
  if (onCalculate) {
    onCalculate();
  }
};

/**
 * 개별 장바구니 아이템 가격 디스플레이 업데이트
 * @param {HTMLElement} cartItem - Cart item element
 * @param {Array} productList - Product list
 */
const updateCartItemPrice = (cartItem, productList) => {
  const itemId = cartItem.id;
  const product = findProductById(itemId, productList);

  if (!product) return;

  const priceDiv = cartItem.querySelector(".text-lg");
  const nameDiv = cartItem.querySelector("h3");

  if (!priceDiv || !nameDiv) return;

  // 가격 디스플레이 업데이트
  updatePriceDisplay(priceDiv, product);

  // 이름에 세일 인디케이터 업데이트
  updateNameDisplay(nameDiv, product);
};

/**
 * 세일 포맷팅으로 가격 디스플레이 업데이트
 * @param {HTMLElement} priceDiv - Price display element
 * @param {Object} product - Product data
 */
const updatePriceDisplay = (priceDiv, product) => {
  if (product.onSale && product.suggestSale) {
    // 번개세일 + 추천세일
    priceDiv.innerHTML =
      `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
      `<span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
  } else if (product.onSale) {
    // 번개세일만
    priceDiv.innerHTML =
      `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
      `<span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
  } else if (product.suggestSale) {
    // 추천세일만
    priceDiv.innerHTML =
      `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> ` +
      `<span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
  } else {
    // 일반 가격
    priceDiv.textContent = `₩${product.val.toLocaleString()}`;
  }
};

/**
 * 세일 인디케이터로 이름 디스플레이 업데이트
 * @param {HTMLElement} nameDiv - Name display element
 * @param {Object} product - Product data
 */
const updateNameDisplay = (nameDiv, product) => {
  let displayName = product.name;

  if (product.onSale && product.suggestSale) {
    displayName = `⚡💝${product.name}`;
  } else if (product.onSale) {
    displayName = `⚡${product.name}`;
  } else if (product.suggestSale) {
    displayName = `💝${product.name}`;
  }

  nameDiv.textContent = displayName;
};

/**
 * 상품에 번개세일 적용
 * @param {string} productId - Product ID
 * @param {number} discountRate - Discount rate (0-1)
 * @param {Array} productList - Product list
 * @returns {boolean} Whether sale was applied successfully
 */
export const applyFlashSale = (productId, discountRate, productList) => {
  const product = findProductById(productId, productList);

  if (!product || product.q <= 0 || product.onSale) {
    return false;
  }

  const saleRate = 1 - discountRate;
  product.val = Math.round(product.originalVal * saleRate);
  product.onSale = true;

  return true;
};

/**
 * 상품에 추천세일 적용
 * @param {string} productId - Product ID
 * @param {number} discountRate - Discount rate (0-1)
 * @param {Array} productList - Product list
 * @returns {boolean} Whether sale was applied successfully
 */
export const applySuggestSale = (productId, discountRate, productList) => {
  const product = findProductById(productId, productList);

  if (!product || product.q <= 0 || product.suggestSale) {
    return false;
  }

  const saleRate = 1 - discountRate;
  product.val = Math.round(product.val * saleRate);
  product.suggestSale = true;

  return true;
};

/**
 * 모든 상품의 세일 리셋
 * @param {Array} productList - Product list
 */
export const resetAllSales = (productList) => {
  productList.forEach((product) => {
    product.val = product.originalVal;
    product.onSale = false;
    product.suggestSale = false;
  });
};

/**
 * 현재 세일 상태 가져오기
 * @param {Array} productList - Product list
 * @returns {Object} Sale status information
 */
export const getSaleStatus = (productList) => {
  const flashSaleProducts = productList.filter((p) => p.onSale);
  const suggestSaleProducts = productList.filter((p) => p.suggestSale);
  const comboSaleProducts = productList.filter(
    (p) => p.onSale && p.suggestSale
  );

  return {
    flashSaleProducts,
    suggestSaleProducts,
    comboSaleProducts,
    totalSaleProducts: flashSaleProducts.length + suggestSaleProducts.length,
  };
};

/**
 * 상품 찾기 헬퍼
 * @param {string} productId - Product ID
 * @param {Array} productList - Product list
 * @returns {Object|undefined} Product or undefined
 */
const findProductById = (productId, productList) => {
  return productList.find((p) => p.id === productId);
};

/**
 * 장바구니 렌더링 관련 함수들
 */

/**
 * 장바구니 내 상품 가격/이름 갱신 및 전체 금액 재계산
 */
export function updateCartPrices(cartDisplayElement, productList, calculateCartSummary) {
  const cartItems = cartDisplayElement.children;

  const productMap = productList.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});

  // 각 카트 아이템을 순회하며 가격/이름 업데이트 (productMap 사용)
  for (const cartItem of cartItems) {
    const product = productMap[cartItem.id];

    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      renderProductPrice(product, priceDiv, nameDiv);
    }
  }

  calculateCartSummary();
}

/**
 * 상품 가격 렌더링 로직 분리
 */
function renderProductPrice(product, priceDiv, nameDiv) {
  if (product.onSale && product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `⚡💝${product.name}`;
  } else if (product.onSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `⚡${product.name}`;
  } else if (product.suggestSale) {
    priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
    nameDiv.textContent = `💝${product.name}`;
  } else {
    priceDiv.textContent = `₩${product.price.toLocaleString()}`;
    nameDiv.textContent = product.name;
  }
}

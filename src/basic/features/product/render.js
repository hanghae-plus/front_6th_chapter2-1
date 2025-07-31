import {
  getDiscountIcon,
  getDiscountStatus,
  getProductOptionStyle,
  getSalesInfoText,
  getStockInfo,
  getTotalStock,
  isOutOfStock,
} from './service';

/**
 * @description 상품 셀렉 요소의 옵션을 렌더링
 * @param {HTMLSelectElement} selector - select 요소
 * @param {Product} products - 상품목록
 */
export const renderProductSelectOptions = (selector, products) => {
  // 함수 재호출 시 셀렉 옵션 초기화
  // 초기화하지 않을 시 옵션이 계속해서 추가됨
  selector.innerHTML = '';

  const totalStock = getTotalStock(products);
  selector.style.borderColor = totalStock < 50 ? 'orange' : '';

  const options = products.map((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = getSalesInfoText(product);
    option.className = getProductOptionStyle(product);
    option.disabled = isOutOfStock(product);

    return option;
  });

  selector.append(...options);
};

/**
 * @description 재고 정보 렌더링
 * @param {HTMLSelectElement} target - 재고 정보를 업데이트할 요소
 * @param {Product} products - 상품목록
 */
export const renderStockInfo = (target, products) => {
  target.textContent = products.map(getStockInfo).join('\n');
};

/**
 * @description 장바구니 상품 렌더링
 * @param {{target: HTMLDivElement, cartProduct: Product}}
 */
export const renderCartProduct = (target, cartProduct) => {
  const priceDiv = target.querySelector('.text-lg');
  const nameDiv = target.querySelector('h3');

  const status = getDiscountStatus(cartProduct);
  const icon = getDiscountIcon(cartProduct);

  if (status === 'NO_SALE') {
    priceDiv.textContent = `₩${cartProduct.value.toLocaleString()}`;
    nameDiv.textContent = cartProduct.name;
  } else {
    priceDiv.innerHTML = `
      <span class="line-through text-gray-400">₩${cartProduct.originalValue.toLocaleString()}</span>
      <span class="text-purple-600">₩${cartProduct.value.toLocaleString()}</span>
    `;
    nameDiv.textContent = `${icon}${cartProduct.name}`;
  }
};

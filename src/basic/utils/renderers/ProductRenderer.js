/**
 * 상품 렌더링 관련 함수들
 */
import { UI_CONSTANTS } from '../../constants/UIConstants.js';

/**
 * 상품 옵션 렌더링 컴포넌트
 * 상품 선택 드롭다운의 옵션들을 렌더링합니다.
 */
export function renderProductOptions(productSelector, productList) {
  productSelector.innerHTML = '';

  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const opt = document.createElement('option');
    opt.value = item.id;
    let discountText = '';

    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.quantity === 0) {
      opt.textContent = `${item.name} - ${item.price}원 (품절)${discountText}`;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (25% SUPER SALE!)`;
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.price}원 (20% SALE!)`;
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.price}원 (5% 추천할인!)`;
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = `${item.name} - ${item.price}원${discountText}`;
      }
    }
    productSelector.appendChild(opt);
  }
}

/**
 * 상품 가격 렌더링 로직 분리
 * 상품의 가격과 이름을 렌더링합니다.
 */
export function renderProductPrice(product, priceDiv, nameDiv) {
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

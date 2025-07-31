// src/services/PriceUpdateService.js
import { findProductById } from '../utils/product.js';

/**
 * 장바구니 내 가격을 업데이트합니다.
 * @param {Object} params - 업데이트에 필요한 파라미터들
 * @param {Array} params.productList - 상품 목록
 * @param {HTMLElement} params.cartDisp - 장바구니 표시 요소
 * @param {Function} params.handleCalculateCartStuff - 장바구니 재계산 함수
 */
export function updatePricesInCart(params) {
  const { productList, cartDisp, handleCalculateCartStuff } = params;
  const cartItems = cartDisp.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(productList, itemId);

    if (product) {
      updateProductDisplay(cartItems[i], product);
    }
  }

  // 가격 업데이트 후 장바구니 재계산
  handleCalculateCartStuff();
}

/**
 * 상품 표시를 업데이트합니다.
 * @param {HTMLElement} cartItem - 장바구니 아이템 요소
 * @param {Object} product - 상품 정보
 */
function updateProductDisplay(cartItem, product) {
  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');

  if (!priceDiv || !nameDiv) return;

  // 할인 상태에 따른 가격과 이름 업데이트
  if (product.onSale && product.suggestSale) {
    updateSuperSaleDisplay(priceDiv, nameDiv, product);
  } else if (product.onSale) {
    updateLightningSaleDisplay(priceDiv, nameDiv, product);
  } else if (product.suggestSale) {
    updateSuggestSaleDisplay(priceDiv, nameDiv, product);
  } else {
    updateNormalDisplay(priceDiv, nameDiv, product);
  }
}

/**
 * 슈퍼세일(번개세일 + 추천할인) 표시를 업데이트합니다.
 * @param {HTMLElement} priceDiv - 가격 표시 요소
 * @param {HTMLElement} nameDiv - 이름 표시 요소
 * @param {Object} product - 상품 정보
 */
function updateSuperSaleDisplay(priceDiv, nameDiv, product) {
  priceDiv.innerHTML = `
    <span class="line-through text-gray-400">
      ₩${product.originalVal.toLocaleString()}
    </span>
    <span class="text-purple-600">
      ₩${product.val.toLocaleString()}
    </span>
  `;
  nameDiv.textContent = `⚡💝${product.name}`;
}

/**
 * 번개세일 표시를 업데이트합니다.
 * @param {HTMLElement} priceDiv - 가격 표시 요소
 * @param {HTMLElement} nameDiv - 이름 표시 요소
 * @param {Object} product - 상품 정보
 */
function updateLightningSaleDisplay(priceDiv, nameDiv, product) {
  priceDiv.innerHTML = `
    <span class="line-through text-gray-400">
      ₩${product.originalVal.toLocaleString()}
    </span>
    <span class="text-red-500">
      ₩${product.val.toLocaleString()}
    </span>
  `;
  nameDiv.textContent = `⚡${product.name}`;
}

/**
 * 추천할인 표시를 업데이트합니다.
 * @param {HTMLElement} priceDiv - 가격 표시 요소
 * @param {HTMLElement} nameDiv - 이름 표시 요소
 * @param {Object} product - 상품 정보
 */
function updateSuggestSaleDisplay(priceDiv, nameDiv, product) {
  priceDiv.innerHTML = `
    <span class="line-through text-gray-400">
      ₩${product.originalVal.toLocaleString()}
    </span>
    <span class="text-blue-500">
      ₩${product.val.toLocaleString()}
    </span>
  `;
  nameDiv.textContent = `💝${product.name}`;
}

/**
 * 일반 표시를 업데이트합니다.
 * @param {HTMLElement} priceDiv - 가격 표시 요소
 * @param {HTMLElement} nameDiv - 이름 표시 요소
 * @param {Object} product - 상품 정보
 */
function updateNormalDisplay(priceDiv, nameDiv, product) {
  priceDiv.textContent = `₩${product.val.toLocaleString()}`;
  nameDiv.textContent = product.name;
}

/**
 * 가격 업데이트 서비스를 생성합니다.
 * @param {Array} productList - 상품 목록
 * @param {HTMLElement} cartDisp - 장바구니 표시 요소
 * @param {Function} handleCalculateCartStuff - 장바구니 재계산 함수
 * @returns {Object} 가격 업데이트 서비스 객체
 */
export function createPriceUpdateService(productList, cartDisp, handleCalculateCartStuff) {
  return {
    updatePricesInCart: () =>
      updatePricesInCart({
        productList,
        cartDisp,
        handleCalculateCartStuff,
      }),
  };
}

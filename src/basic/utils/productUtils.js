import { STOCK_THRESHOLDS } from '../constants.js';

// 상품 선택 옵션 업데이트
export function updateProductSelectOptions(productList, productSelect) {
  let totalStock = 0;

  productSelect.innerHTML = '';

  // 총 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.q;
  }

  // 상품 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const opt = document.createElement('option');
    opt.value = item.id;
    let discountText = '';

    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.q === 0) {
      opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
      }
    }
    productSelect.appendChild(opt);
  }

  // 재고 부족 시 경고 표시
  if (totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}

// ===== 상품 관련 공통 함수들 =====

/**
 * 상품 ID로 상품을 찾는 함수
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export function findProductById(productList, productId) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === productId) {
      return productList[i];
    }
  }
  return null;
}

/**
 * 상품의 재고가 있는지 확인하는 함수
 * @param {Object} product - 상품 객체
 * @returns {boolean} 재고 여부
 */
export function hasStock(product) {
  return product && product.q > 0;
}

/**
 * 상품이 할인 중인지 확인하는 함수
 * @param {Object} product - 상품 객체
 * @returns {boolean} 할인 여부
 */
export function isOnSale(product) {
  return product && (product.onSale || product.suggestSale);
}

/**
 * 상품의 할인 상태에 따른 이름 접두사 반환
 * @param {Object} product - 상품 객체
 * @returns {string} 이름 접두사
 */
export function getProductNamePrefix(product) {
  if (product.onSale && product.suggestSale) {
    return '⚡💝';
  } else if (product.onSale) {
    return '⚡';
  } else if (product.suggestSale) {
    return '💝';
  }
  return '';
}

/**
 * 상품의 할인 상태에 따른 가격 색상 클래스 반환
 * @param {Object} product - 상품 객체
 * @returns {string} CSS 클래스명
 */
export function getPriceColorClass(product) {
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600';
  } else if (product.onSale) {
    return 'text-red-500';
  } else if (product.suggestSale) {
    return 'text-blue-500';
  }
  return '';
}

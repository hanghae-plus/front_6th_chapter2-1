/**
 * 상품 서비스
 * 순수 함수 중심으로 데이터 변환에 집중
 */

import { getProductState } from '@/basic/features/product/store/productStore.js';
import {
  getTotalStock,
  generateStockStatusMessage,
} from '@/basic/features/product/utils/productUtils.js';

/**
 * 상품 옵션 데이터 생성
 */
const createProductOptions = products => {
  return products.map(product => {
    let text = `${product.name} - ${product.val}원`;

    if (product.q === 0) {
      text += ' (품절)';
    } else if (product.q < 5) {
      text += ` (재고부족: ${product.q}개)`;
    }

    return {
      value: product.id,
      text,
      disabled: product.q === 0,
    };
  });
};

/**
 * 상품 선택기 업데이트
 */
export const updateProductSelector = () => {
  const selector = document.getElementById('product-select');
  if (!selector) return;

  const currentValue = selector.value;
  const products = getProductState().products;

  selector.innerHTML = '';

  createProductOptions(products).forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    optionElement.disabled = option.disabled;
    selector.appendChild(optionElement);
  });

  if (currentValue) {
    selector.value = currentValue;
  }

  const totalStock = getTotalStock(products);
  if (totalStock < 50) {
    selector.style.borderColor = 'orange';
  } else {
    selector.style.borderColor = '';
  }
};

/**
 * 재고 정보 메시지 계산
 */
const getStockStatusMessage = () => {
  const products = getProductState().products;
  return generateStockStatusMessage(products, 5);
};

/**
 * 재고 정보 업데이트
 */
export const updateStockInfo = () => {
  const element = document.getElementById('stock-status');
  if (element) {
    element.textContent = getStockStatusMessage();
  }
};

export { createProductOptions, getStockStatusMessage };

// ==========================================
// 🎯 상품 선택 컴포넌트
// ==========================================

import { THRESHOLDS } from '../constant/index.js';
import { hasBothDiscounts } from '../main.basic.js';

/**
 * 🤖 [AI-REFACTORED] 상품 선택 옵션 업데이트 (React 패턴 네이밍)
 *
 * @description 제품 목록을 기반으로 선택 드롭다운의 옵션들을 동적으로 생성/업데이트
 * - 재고 상태에 따른 옵션 표시 (품절, 할인 등)
 * - 세일 및 추천 상품 표시 (⚡, 💝 아이콘)
 * - 재고 부족시 드롭다운 테두리 색상 변경 (주황색)
 *
 * 🎯 네이밍 개선: onUpdateSelectOptions → updateProductSelectUI
 * - React 패턴: update + 대상 + UI
 * - 의미 명확화: 상품 선택 UI 업데이트
 *
 * @sideEffects
 * - productSelect 요소의 innerHTML 수정
 * - productSelect 요소의 style.borderColor 수정
 */
export function updateProductSelectUI() {
  const productSelect = document.getElementById('product-select');
  if (!productSelect) {
    return;
  }

  productSelect.innerHTML = '';

  // 🎯 for문 → reduce() 메서드로 현대화 (의미없는 변수명도 개선)
  const totalStock = getTotalStock();

  // 🎯 for문 + IIFE → forEach() 메서드로 현대화
  getProducts().forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;

    let discountText = '';
    if (product.onSale) {
      discountText += ' ⚡SALE';
    }
    if (product.suggestSale) {
      discountText += ' 💝추천';
    }

    if (product.quantity === 0) {
      option.textContent = `${product.name} - ${product.val}원 (품절)${discountText}`;
      option.disabled = true;
      option.className = 'text-gray-400';
    } else {
      // 🧠 복잡한 조건 → 의미있는 함수로 개선
      if (hasBothDiscounts(product)) {
        option.textContent = `⚡💝${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (25% SUPER SALE!)`;
        option.className = 'text-purple-600 font-bold';
      } else if (product.onSale) {
        option.textContent = `⚡${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (20% SALE!)`;
        option.className = 'text-red-500 font-bold';
      } else if (product.suggestSale) {
        option.textContent = `💝${product.name} - ${product.originalVal}원 → ${
          product.val
        }원 (5% 추천할인!)`;
        option.className = 'text-blue-500 font-bold';
      } else {
        option.textContent = `${product.name} - ${product.val}원${discountText}`;
      }
    }

    productSelect.appendChild(option);
  });

  if (totalStock < THRESHOLDS.STOCK_ALERT_THRESHOLD) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}

/**
 * 전체 재고 수량 계산 (유틸리티 함수)
 *
 * @returns {number} 전체 재고 수량의 합계
 */
const getTotalStock = () => {
  const products = getProducts();
  return products.reduce(
    (totalStock, product) => totalStock + product.quantity,
    0,
  );
};

/**
 * 상품 목록 조회 (유틸리티 함수)
 *
 * @returns {Array} 상품 목록
 */
const getProducts = () => {
  // 전역 appState에 접근하기 위해 window 객체 사용
  const appState = window.appState || {};
  return appState.products || [];
};

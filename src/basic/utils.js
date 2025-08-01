/**
 * 유틸리티 함수들
 * 애플리케이션에서 공통으로 사용되는 헬퍼 함수들을 관리
 */

import { QUANTITY_THRESHOLDS } from './constants.js';

// 화요일 체크 캐시
const tuesdayCache = new Map();

/**
 * 캐시된 화요일 체크 함수
 * @returns {boolean} 오늘이 화요일인지 여부
 */
const getCachedTuesdayCheck = () => {
  const today = new Date().toDateString();

  if (tuesdayCache.has(today)) {
    return tuesdayCache.get(today);
  }

  const isTuesdayToday = new Date().getDay() === 2;
  tuesdayCache.set(today, isTuesdayToday);

  return isTuesdayToday;
};

/**
 * 화요일인지 확인하는 유틸리티 함수
 * @returns {boolean} 오늘이 화요일인지 여부
 */
export const isTuesdayDay = () => getCachedTuesdayCheck();

/**
 * 상품 ID로 상품 찾기
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export const findProductById = (productList, productId) =>
  productList.find((product) => product.id === productId);

/**
 * 총 재고 계산
 * @param {Array} productList - 상품 목록
 * @returns {number} 총 재고 수량
 */
export const getTotalStock = (productList) =>
  productList.reduce((total, product) => total + product.quantity, 0);

/**
 * 재고 상태 메시지 생성
 * @param {Array} productList - 상품 목록
 * @returns {string} 재고 상태 메시지
 */
export const getStockStatusMessage = (productList) => {
  let message = '';

  productList.forEach((product) => {
    if (product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (product.quantity > 0) {
        message += `${product.name}: 재고 부족 (${product.quantity}개 남음)\n`;
      } else {
        message += `${product.name}: 품절\n`;
      }
    }
  });

  return message;
};

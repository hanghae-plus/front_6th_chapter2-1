/**
 * 장바구니 서비스 모듈
 * 원본 main.original.js의 계산 로직을 100% 유지
 */
import {
  calculateBonusPoints as calculateBonusPointsUtil,
  calculateCartTotals,
  extractCartItemInfo as extractCartItemInfoUtil,
} from "../utils/businessLogic.js";

/**
 * 장바구니 총액 계산 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @returns {Object} 계산 결과
 */
export function calculateCartTotal(cartItems, productList, appState) {
  return calculateCartTotals(cartItems, productList, appState);
}

/**
 * 보너스 포인트 계산 및 반환 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 * @param {number} totalAmount - 총액
 * @returns {Object} 포인트 계산 결과 { finalPoints, pointsDetail }
 */
export function calculateBonusPoints(cartItems, productList, appState, totalAmount) {
  return calculateBonusPointsUtil(cartItems, productList, appState, totalAmount);
}

/**
 * 장바구니 아이템 정보 추출 - 원본과 동일
 * @param {Array} cartItems - 장바구니 아이템들
 * @returns {Object} 추출된 정보
 */
export function extractCartItemInfo(cartItems) {
  return extractCartItemInfoUtil(cartItems);
}

/**
 * 재고 총합 계산
 * @param {Array} productList - 상품 목록
 * @returns {number} 재고 총합
 */
export function getStockTotal(productList) {
  return productList.reduce((total, product) => total + product.q, 0);
}

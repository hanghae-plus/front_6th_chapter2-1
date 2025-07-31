/**
 * 상품 관련 서비스 함수들
 * 상품 목록 관리, 검색, 유효성 검사 등의 기능을 제공
 */
import {
  PRODUCT_FIVE,
  PRODUCT_FOUR,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
} from "../constants/productConstants.js";

/**
 * 상품 목록 초기화
 * @returns {Array} 초기화된 상품 목록
 */
export function initializeProductList() {
  return [
    {
      id: PRODUCT_ONE,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_TWO,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_THREE,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FOUR,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FIVE,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
}

/**
 * ID로 상품 찾기
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export function findProductById(productList, productId) {
  return productList.find((product) => product.id === productId) || null;
}

/**
 * 유효한 상품인지 확인
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 확인할 상품 ID
 * @returns {boolean} 유효한 상품인지 여부
 */
export function isValidProduct(productList, productId) {
  return productList.some((product) => product.id === productId);
}

/**
 * 기존 아이템 수량 업데이트
 * @param {Object} product - 상품 객체
 * @param {number} quantity - 추가할 수량
 * @returns {boolean} 업데이트 성공 여부
 */
export function updateExistingItemQuantity(product, quantity) {
  if (product.q >= quantity) {
    product.q -= quantity;
    return true;
  }
  return false;
}

/**
 * 새 아이템을 장바구니에 추가
 * @param {Object} product - 추가할 상품
 * @param {number} quantity - 추가할 수량
 * @returns {boolean} 추가 성공 여부
 */
export function addNewItemToCart(product, quantity) {
  if (product.q >= quantity) {
    product.q -= quantity;
    return true;
  }
  return false;
}

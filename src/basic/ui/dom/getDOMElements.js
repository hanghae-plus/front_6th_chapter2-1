/**
 * DOM 요소들을 가져오는 함수들
 */

/**
 * 상품 선택 dropdown 요소 가져오기
 * @returns {HTMLSelectElement} 상품 선택 dropdown
 */
export const getProductSelect = () => {
  return document.getElementById("product-select");
};

/**
 * 장바구니 추가 버튼 요소 가져오기
 * @returns {HTMLButtonElement} 장바구니 추가 버튼
 */
export const getAddToCartButton = () => {
  return document.getElementById("add-to-cart");
};

/**
 * 장바구니 아이템 컨테이너 요소 가져오기
 * @returns {HTMLDivElement} 장바구니 아이템 컨테이너
 */
export const getCartContainer = () => {
  return document.getElementById("cart-items");
};

/**
 * 재고 정보 표시 요소 가져오기
 * @returns {HTMLDivElement} 재고 정보 표시 div
 */
export const getStockInfo = () => {
  return document.getElementById("stock-status");
};

/**
 * 매뉴얼 토글 버튼 요소 가져오기
 * @returns {HTMLButtonElement} 매뉴얼 토글 버튼
 */
export const getManualToggle = () => {
  return document.getElementById("manual-toggle");
};

/**
 * 매뉴얼 오버레이 요소 가져오기
 * @returns {HTMLDivElement} 매뉴얼 오버레이
 */
export const getManualOverlay = () => {
  return document.getElementById("manual-overlay");
};

/**
 * 매뉴얼 컬럼 요소 가져오기
 * @returns {HTMLDivElement} 매뉴얼 컬럼
 */
export const getManualColumn = () => {
  return document.getElementById("manual-column");
};

/**
 * 매뉴얼 닫기 버튼 요소 가져오기
 * @returns {HTMLButtonElement} 매뉴얼 닫기 버튼
 */
export const getManualClose = () => {
  return document.getElementById("manual-close");
};

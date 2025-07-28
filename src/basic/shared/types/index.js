// 애플리케이션 상태 타입 정의 (JSDoc 스타일)

/**
 * @typedef {Object} Product
 * @property {string} id - 상품 ID
 * @property {string} name - 상품명
 * @property {number} val - 현재 가격
 * @property {number} originalVal - 원래 가격
 * @property {number} q - 재고 수량
 * @property {boolean} onSale - 세일 여부
 * @property {boolean} suggestSale - 추천 세일 여부
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId - 상품 ID
 * @property {number} quantity - 수량
 * @property {number} price - 단가
 * @property {number} discount - 할인율
 */

/**
 * @typedef {Object} DiscountInfo
 * @property {number} discountRate - 총 할인율
 * @property {number} originalTotal - 원래 총액
 * @property {boolean} isTuesday - 화요일 여부
 */

/**
 * @typedef {Object} AppState
 * @property {Product[]} products - 상품 목록
 * @property {number} bonusPoints - 보너스 포인트
 * @property {number} itemCount - 장바구니 아이템 수
 * @property {string|null} lastSelection - 마지막 선택 상품
 * @property {number} totalAmount - 총 금액
 * @property {Object} elements - DOM 요소 참조
 */

export {}; // ES 모듈로 만들기 위한 export
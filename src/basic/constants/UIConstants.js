/**
 * UI 메시지 및 템플릿 상수 정의
 * 모든 UI 관련 메시지와 템플릿을 중앙집중적으로 관리합니다.
 */

/**
 * @typedef {Object} MessageTemplate
 * @property {string} template - 메시지 템플릿
 * @property {string[]} variables - 템플릿 변수들
 */

/**
 * 포인트 관련 UI 메시지
 */
export const POINTS_UI = {
  EARNED_POINTS: '적립 포인트: {points}p',
  BASE_POINTS: '기본: {points}p',
  TUESDAY_DOUBLE: '화요일 2배',
  SET_BONUS: '키보드+마우스 세트 +{points}p',
  FULL_SET_BONUS: '풀세트 구매 +{points}p',
  BULK_BONUS: '대량구매({threshold}개+) +{points}p',
  NO_POINTS: '적립 포인트: 0p'
};

/**
 * 할인 관련 UI 메시지
 */
export const DISCOUNT_UI = {
  BULK_PURCHASE: '🎉 대량구매 할인 ({threshold}개 이상)',
  TUESDAY_SPECIAL: '🌟 화요일 추가 할인',
  INDIVIDUAL_DISCOUNT: '{productName} ({threshold}개↑)',
  FLASH_SALE: '⚡ 번개세일',
  RECOMMENDATION: '💝 추천할인',
  SUPER_SALE: 'SUPER SALE'
};

/**
 * 재고 관련 UI 메시지
 */
export const STOCK_UI = {
  LOW_STOCK: '재고 부족 ({count}개 남음)',
  OUT_OF_STOCK: '품절',
  STOCK_WARNING: '{productName}: 재고 부족 ({count}개 남음)\n',
  OUT_OF_STOCK_WARNING: '{productName}: 품절\n'
};

/**
 * 장바구니 관련 UI 메시지
 */
export const CART_UI = {
  ITEM_COUNT: '🛍️ {count} items in cart',
  EMPTY_CART: '장바구니가 비어있습니다',
  ADD_TO_CART: '장바구니에 추가',
  REMOVE_FROM_CART: '제거',
  QUANTITY_PLUS: '+',
  QUANTITY_MINUS: '-'
};

/**
 * 알림 관련 UI 메시지
 */
export const ALERT_UI = {
  STOCK_EXCEEDED: '재고가 부족합니다.',
  INVALID_QUANTITY: '올바른 수량을 입력해주세요.',
  ITEM_ADDED: '상품이 장바구니에 추가되었습니다.',
  ITEM_REMOVED: '상품이 장바구니에서 제거되었습니다.'
};

/**
 * 일반 UI 레이블
 */
export const GENERAL_UI = {
  TOTAL_AMOUNT: '총액',
  SUBTOTAL: '소계',
  DISCOUNT: '할인',
  FINAL_TOTAL: '최종 금액',
  PRICE: '가격',
  QUANTITY: '수량',
  PRODUCT_NAME: '상품명'
};

/**
 * 아이콘 및 이모지 상수
 */
export const UI_ICONS = {
  FLASH_SALE: '⚡',
  RECOMMENDATION: '💝',
  CART: '🛍️',
  CELEBRATION: '🎉',
  STAR: '🌟',
  GIFT: '🎁',
  TIP: '💡',
  MANUAL: '📖'
};

/**
 * CSS 클래스 상수
 */
export const UI_CLASSES = {
  DISCOUNT_TEXT: 'text-green-400',
  POINTS_TEXT: 'text-blue-400',
  WARNING_TEXT: 'text-red-400',
  SUCCESS_TEXT: 'text-green-500',
  DISABLED: 'opacity-50 cursor-not-allowed',
  HIDDEN: 'hidden',
  HIGHLIGHT: 'bg-yellow-100 border-yellow-300'
};

/**
 * 수치 포매팅 관련 상수
 */
export const FORMAT_CONFIG = {
  CURRENCY_UNIT: '원',
  POINTS_UNIT: 'p',
  PERCENTAGE_UNIT: '%',
  QUANTITY_UNIT: '개',
  DECIMAL_PLACES: 0
};

/**
 * 메시지 템플릿 변수 치환 함수
 * @param {string} template - 치환할 템플릿
 * @param {Object} variables - 치환 변수 객체
 * @returns {string} 치환된 메시지
 */
export function formatMessage(template, variables = {}) {
  let message = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    message = message.replace(regex, variables[key]);
  });
  return message;
}

/**
 * 숫자를 천 단위 콤마 포함 문자열로 변환
 * @param {number} number - 변환할 숫자
 * @param {string} unit - 단위 (기본: 원)
 * @returns {string} 포매팅된 문자열
 */
export function formatCurrency(number, unit = FORMAT_CONFIG.CURRENCY_UNIT) {
  return `${number.toLocaleString()}${unit}`;
}

/**
 * 포인트를 포매팅된 문자열로 변환
 * @param {number} points - 포인트
 * @returns {string} 포매팅된 포인트 문자열
 */
export function formatPoints(points) {
  return `${points}${FORMAT_CONFIG.POINTS_UNIT}`;
}

/**
 * 할인율을 포매팅된 문자열로 변환
 * @param {number} rate - 할인율 (0.1 = 10%)
 * @returns {string} 포매팅된 할인율 문자열
 */
export function formatDiscountRate(rate) {
  return `${Math.round(rate * 100)}${FORMAT_CONFIG.PERCENTAGE_UNIT}`;
}

/**
 * 재고 메시지 생성
 * @param {string} productName - 상품명
 * @param {number} stock - 재고 수량
 * @returns {string} 재고 상태 메시지
 */
export function getStockMessage(productName, stock) {
  if (stock === 0) {
    return formatMessage(STOCK_UI.OUT_OF_STOCK_WARNING, { productName });
  } else if (stock < 5) {
    return formatMessage(STOCK_UI.STOCK_WARNING, { productName, count: stock });
  }
  return '';
}

/**
 * 장바구니 아이템 수 메시지 생성
 * @param {number} count - 아이템 수
 * @returns {string} 장바구니 메시지
 */
export function getCartCountMessage(count) {
  return formatMessage(CART_UI.ITEM_COUNT, { count });
}

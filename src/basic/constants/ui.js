// UI 관련 상수
export const CURRENCY_SYMBOL = '₩';
export const SOLD_OUT_TEXT = '품절';
export const ORANGE_COLOR = 'orange';
export const EMPTY_STRING = '';

// CSS 클래스명
export const CSS_CLASSES = {
  PURPLE_BOLD: 'text-purple-600 font-bold',
  RED_BOLD: 'text-red-500 font-bold', 
  BLUE_BOLD: 'text-blue-500 font-bold',
  GRAY: 'text-gray-400',
  LINE_THROUGH: 'line-through text-gray-400'
};

// 에러 메시지
export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_SELECT_NOT_FOUND: 'Product select element not found',
  CART_ITEMS_NOT_FOUND: 'Cart items container not found',
  CART_TOTAL_NOT_FOUND: 'Cart total display not found',
  SELECTED_PRODUCT_NOT_FOUND: 'Selected product not found'
};

// 콘솔 메시지
export const CONSOLE_MESSAGES = {
  STOCK_WARNING: (productName, stockQuantity) => 
    `⚠️ ${productName}의 재고가 부족합니다. (${stockQuantity}개 남음)`,
  STOCK_CRITICAL: (productName) => 
    `🚨 ${productName}의 재고가 거의 소진되었습니다!`
}; 
// DOM 관련 상수
export const DOM_IDS = {
  APP: "app",
  PRODUCT_SELECT: "product-select",
  ADD_TO_CART: "add-to-cart",
  STOCK_STATUS: "stock-status",
  CART_ITEMS: "cart-items",
  SUMMARY_DETAILS: "summary-details",
  CART_TOTAL: "cart-total",
  LOYALTY_POINTS: "loyalty-points",
  DISCOUNT_INFO: "discount-info",
  TUESDAY_SPECIAL: "tuesday-special",
  ITEM_COUNT: "item-count",
};

// CSS 선택자
export const CSS_SELECTORS = {
  QUANTITY_NUMBER: ".quantity-number",
  PRICE_ELEMENTS: ".text-lg, .text-xs",
  TEXT_LG: ".text-lg",
  QUANTITY_CHANGE: ".quantity-change",
  REMOVE_ITEM: ".remove-item",
};

// CSS 클래스명 (클래스명만)
export const CSS_CLASS_NAMES = {
  QUANTITY_CHANGE: "quantity-change",
  REMOVE_ITEM: "remove-item",
  TEXT_LG: "text-lg",
};

// 매직 넘버들
export const MAGIC_NUMBERS = {
  STOCK_WARNING_THRESHOLD: 50, // 전체 재고 경고 임계값
  TUESDAY_DAY_INDEX: 2, // 화요일 인덱스
};

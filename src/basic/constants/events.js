// Product 관련 이벤트
export const PRODUCT_OPTIONS_UPDATED = "product:options:updated"; // 상품 옵션 업데이트
export const PRODUCT_STOCK_UPDATED = "product:stock:updated";
export const PRODUCT_PRICES_UPDATED = "product:prices:updated";
export const PRODUCT_REFRESH_REQUESTED = "product:refresh:requested";

// Cart 관련 이벤트
export const CART_ADD_REQUESTED = "cart:add:requested"; // 장바구니 추가 요청
export const CART_ITEM_ADDED = "cart:item:added"; // 장바구니 아이템 추가
export const CART_QUANTITY_CHANGE_REQUESTED = "cart:quantity:change:requested"; // 장바구니 아이템 수량 변경 요청
export const CART_ITEM_REMOVE_REQUESTED = "cart:item:remove:requested"; // 장바구니 아이템 삭제 요청
export const CART_QUANTITY_CHANGED = "cart:quantity:changed"; // 장바구니 아이템 수량 변경
export const CART_ITEM_REMOVED = "cart:item:removed"; // 장바구니 아이템 삭제
export const CART_SUMMARY_UPDATED = "cart:summary:updated"; // 장바구니 요약 업데이트
export const CART_SUMMARY_CALCULATION_REQUESTED = "cart:summary:calculation:requested"; // 장바구니 요약 계산 요청
export const CART_SUMMARY_CALCULATED = "cart:summary:calculated"; // 장바구니 요약 계산
export const CART_ITEM_STYLES_UPDATED = "cart:item:styles:updated"; // 장바구니 아이템 스타일 업데이트

// Order 관련 이벤트
export const ORDER_SUMMARY_UPDATED = "order:summary:updated"; // 주문 요약 업데이트
export const ORDER_SUMMARY_CALCULATED = "order:summary:calculated"; // 주문 요약 계산
export const ORDER_CALCULATION_REQUESTED = "order:calculation:requested"; // 주문 계산 요청
export const ORDER_UI_UPDATED = "order:ui:updated"; // 주문 UI 업데이트

// Header 관련 이벤트
export const HEADER_ITEM_COUNT_UPDATED = "header:item:count:updated"; // 헤더 아이템 수 업데이트

// Stock 관련 이벤트
export const STOCK_UPDATE_REQUESTED = "stock:update:requested"; // 재고 업데이트 요청

// Item Count 관련 이벤트
export const ITEM_COUNT_DISPLAY_UPDATED = "item:count:display:updated"; // 아이템 수 표시 업데이트

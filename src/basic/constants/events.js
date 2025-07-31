// Product 관련 이벤트
export const PRODUCT_OPTIONS_UPDATE_REQUESTED = "product:options:update:requested"; // 상품 옵션 업데이트 요청
export const PRODUCT_OPTIONS_UPDATED = "product:options:updated"; // 상품 옵션 업데이트 완료
export const PRODUCT_STOCK_UPDATE_REQUESTED = "product:stock:update:requested"; // 재고 업데이트 요청
export const PRODUCT_STOCK_UPDATED = "product:stock:updated"; // 재고 업데이트 완료
export const PRODUCT_PRICES_UPDATE_REQUESTED = "product:prices:update:requested"; // 가격 업데이트 요청
export const PRODUCT_PRICES_UPDATED = "product:prices:updated"; // 가격 업데이트 완료
export const PRODUCT_REFRESH_REQUESTED = "product:refresh:requested"; // 상품 정보 새로고침 요청

// Cart 관련 이벤트
export const CART_ADD_REQUESTED = "cart:add:requested"; // 장바구니 추가 요청
export const CART_ITEM_ADDED = "cart:item:added"; // 장바구니 아이템 추가 완료
export const CART_QUANTITY_CHANGE_REQUESTED = "cart:quantity:change:requested"; // 수량 변경 요청
export const CART_QUANTITY_CHANGED = "cart:quantity:changed"; // 수량 변경 완료
export const CART_ITEM_REMOVE_REQUESTED = "cart:item:remove:requested"; // 아이템 삭제 요청
export const CART_ITEM_REMOVED = "cart:item:removed"; // 아이템 삭제 완료
export const CART_SUMMARY_CALCULATION_REQUESTED = "cart:summary:calculation:requested"; // 요약 계산 요청
export const CART_SUMMARY_CALCULATED = "cart:summary:calculated"; // 요약 계산 완료
export const CART_SUMMARY_UPDATED = "cart:summary:updated"; // 요약 UI 업데이트 완료
export const CART_ITEM_STYLES_UPDATE_REQUESTED = "cart:item:styles:update:requested"; // 아이템 스타일 업데이트 요청
export const CART_ITEM_STYLES_UPDATED = "cart:item:styles:updated"; // 아이템 스타일 업데이트 완료
export const CART_PRICES_UPDATE_REQUESTED = "cart:prices:update:requested"; // 가격 업데이트 요청
export const CART_PRICES_UPDATED = "cart:prices:updated"; // 가격 업데이트 완료

// Order 관련 이벤트
export const ORDER_CALCULATION_REQUESTED = "order:calculation:requested"; // 주문 계산 요청
export const ORDER_SUMMARY_CALCULATED = "order:summary:calculated"; // 주문 요약 계산 완료
export const ORDER_SUMMARY_UPDATED = "order:summary:updated"; // 주문 요약 UI 업데이트 완료
export const ORDER_UI_UPDATE_REQUESTED = "order:ui:update:requested"; // 주문 UI 업데이트 요청
export const ORDER_UI_UPDATED = "order:ui:updated"; // 주문 UI 업데이트 완료

// Header 관련 이벤트
export const HEADER_ITEM_COUNT_UPDATE_REQUESTED = "header:item:count:update:requested"; // 헤더 아이템 수 업데이트 요청
export const HEADER_ITEM_COUNT_UPDATED = "header:item:count:updated"; // 헤더 아이템 수 업데이트 완료

// Stock 관련 이벤트
export const STOCK_UPDATE_REQUESTED = "stock:update:requested"; // 재고 업데이트 요청
export const STOCK_UPDATED = "stock:updated"; // 재고 업데이트 완료

// Item Count 관련 이벤트
export const ITEM_COUNT_DISPLAY_UPDATE_REQUESTED = "item:count:display:update:requested"; // 아이템 수 표시 업데이트 요청
export const ITEM_COUNT_DISPLAY_UPDATED = "item:count:display:updated"; // 아이템 수 표시 업데이트 완료

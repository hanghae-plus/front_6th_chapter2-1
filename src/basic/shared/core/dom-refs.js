/** DOM 요소 참조 저장소 */
export const domRefs = {
  stockInfo: null,
  productSelect: null,
  addButton: null,
  cartDisplay: null,
  totalDisplay: null,
  helpToggle: null,
  helpOverlay: null,
  helpColumn: null,
  itemCount: null,
  discountInfo: null,
  loyaltyPoints: null,
  tuesdaySpecial: null,
};

/** DOM 요소 참조 초기화 */
export function initializeDOMReferences() {
  domRefs.stockInfo = document.getElementById('stock-status');
  domRefs.productSelect = document.getElementById('product-select');
  domRefs.addButton = document.getElementById('add-to-cart');
  domRefs.cartDisplay = document.getElementById('cart-items');
  domRefs.totalDisplay = document.getElementById('cart-total');
  domRefs.helpToggle = document.getElementById('help-toggle');
  domRefs.helpOverlay = document.getElementById('help-overlay');
  domRefs.helpColumn = document.getElementById('help-column');
  domRefs.itemCount = document.getElementById('item-count');
  domRefs.discountInfo = document.getElementById('discount-info');
  domRefs.loyaltyPoints = document.getElementById('loyalty-points');
  domRefs.tuesdaySpecial = document.getElementById('tuesday-special');
}

/** DOM 요소 참조 접근자 함수들 */
export function getStockInfoElement() {
  return domRefs.stockInfo;
}

export function getProductSelectElement() {
  return domRefs.productSelect;
}

export function getAddButtonElement() {
  return domRefs.addButton;
}

export function getCartDisplayElement() {
  return domRefs.cartDisplay;
}

export function getTotalDisplayElement() {
  return domRefs.totalDisplay;
}

export function getHelpToggleElement() {
  return domRefs.helpToggle;
}

export function getHelpOverlayElement() {
  return domRefs.helpOverlay;
}

export function getHelpColumnElement() {
  return domRefs.helpColumn;
}

export function getItemCountElement() {
  return domRefs.itemCount;
}

export function getDiscountInfoElement() {
  return domRefs.discountInfo;
}

export function getLoyaltyPointsElement() {
  return domRefs.loyaltyPoints;
}

export function getTuesdaySpecialElement() {
  return domRefs.tuesdaySpecial;
}

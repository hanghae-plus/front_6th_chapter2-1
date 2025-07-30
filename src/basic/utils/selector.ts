type HTML_ELEMENT_ID =
  | 'cart-items'
  | 'product-select'
  | 'stock-status'
  | 'summary-details'
  | 'item-count'
  | 'loyalty-points'
  | 'discount-info'
  | 'cart-total'
  | 'tuesday-special'
  | 'add-to-cart'
  | 'points-notice'
  | 'manual-overlay'
  | 'manual-column';

export const CART_ITEMS_ID: HTML_ELEMENT_ID = 'cart-items';

export const PRODUCT_SELECT_ID: HTML_ELEMENT_ID = 'product-select';

export const STOCK_STATUS_ID: HTML_ELEMENT_ID = 'stock-status';

export const SUMMARY_DETAILS_ID: HTML_ELEMENT_ID = 'summary-details';

export const HEADER_ITEM_COUNT_ID: HTML_ELEMENT_ID = 'item-count';

export const LOYALTY_POINTS_ID: HTML_ELEMENT_ID = 'loyalty-points';

export const DISCOUNT_INFO_ID: HTML_ELEMENT_ID = 'discount-info';

export const CART_TOTAL_ID: HTML_ELEMENT_ID = 'cart-total';

export const TUESDAY_SPECIAL_ID: HTML_ELEMENT_ID = 'tuesday-special';

export const ADD_TO_CART_BUTTON_ID: HTML_ELEMENT_ID = 'add-to-cart';

export const POINTS_NOTICE_ID: HTML_ELEMENT_ID = 'points-notice';

export const MANUAL_OVERLAY_ID: HTML_ELEMENT_ID = 'manual-overlay';

export const MANUAL_COLUMN_ID: HTML_ELEMENT_ID = 'manual-column';

export function selectById(id: HTML_ELEMENT_ID) {
  return document.getElementById(id) ?? null;
}

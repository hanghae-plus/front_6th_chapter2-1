import { ELEMENT_IDS } from "../constants/element-ids.js";

// DOM Element Getters
export const getAppElement = () => document.getElementById(ELEMENT_IDS.APP);
export const getProductSelectElement = () =>
  document.getElementById(ELEMENT_IDS.PRODUCT_SELECT);
export const getAddToCartElement = () =>
  document.getElementById(ELEMENT_IDS.ADD_TO_CART);
export const getStockStatusElement = () =>
  document.getElementById(ELEMENT_IDS.STOCK_STATUS);
export const getCartItemsElement = () =>
  document.getElementById(ELEMENT_IDS.CART_ITEMS);
export const getCartTotalElement = () =>
  document.getElementById(ELEMENT_IDS.CART_TOTAL);
export const getSummaryDetailsElement = () =>
  document.getElementById(ELEMENT_IDS.SUMMARY_DETAILS);
export const getDiscountInfoElement = () =>
  document.getElementById(ELEMENT_IDS.DISCOUNT_INFO);
export const getLoyaltyPointsElement = () =>
  document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);
export const getItemCountElement = () =>
  document.getElementById(ELEMENT_IDS.ITEM_COUNT);
export const getTuesdaySpecialElement = () =>
  document.getElementById(ELEMENT_IDS.TUESDAY_SPECIAL);

// Product Item Getter (by ID)
export const getProductItemElement = (productId) =>
  document.getElementById(productId);

// DOM Creation Utilities
export const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);

  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.innerHTML) element.innerHTML = options.innerHTML;

  return element;
};

// HTML String to Element Converter
export const htmlToElement = (html) => {
  const container = document.createElement("div");
  container.innerHTML = html.trim();
  return container.firstElementChild;
};

// Replace Element Utility
export const replaceElement = (oldElement, newHtml) => {
  const newElement = htmlToElement(newHtml);
  oldElement.replaceWith(newElement);
  return newElement;
};

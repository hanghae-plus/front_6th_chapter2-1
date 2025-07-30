/**
 * DOM Utility functions
 */

/**
 * Convert HTML string to DOM element
 * @param {string} html - HTML string
 * @returns {HTMLElement} DOM element
 */
export const htmlToElement = html => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

/**
 * Get cart total element
 * @returns {HTMLElement|null} Cart total element
 */
export const getCartTotalElement = () => {
  return document.getElementById('cart-total');
};

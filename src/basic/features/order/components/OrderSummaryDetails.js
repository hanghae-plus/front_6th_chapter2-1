import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';
import { setInnerHTML } from '@/basic/shared/core/domUtils.js';

/**
 * OrderSummaryDetails Component - Pure HTML Template
 * @param {Array} cartItems - Array of cart items
 */
const OrderSummaryDetails = (cartItems = []) => {
  if (!cartItems.length) {
    return /* html */ `
      <div class="text-center text-sm text-gray-400 py-8">
        Empty Cart
      </div>
    `;
  }

  return cartItems
    .map(
      item => /* html */ `
        <div class="flex justify-between text-sm">
          <span class="text-gray-200">${item.name} × ${item.quantity}</span>
          <span class="text-white">₩${(
            item.price * item.quantity
          ).toLocaleString()}</span>
        </div>
      `,
    )
    .join('');
};

export default OrderSummaryDetails;

/**
 * Extract cart items from DOM for rendering
 * @returns {Array} Array of cart item objects
 */
const getCartItemsFromDOM = () => {
  const cartContainer = document.getElementById(ELEMENT_IDS.CART_ITEMS);
  const cartElements = cartContainer.querySelectorAll('article[id]');

  return Array.from(cartElements).map(element => {
    const productId = element.id;
    const nameElement = element.querySelector('h3');
    const quantityElement = element.querySelector('.quantity-number');
    const priceElement = element.querySelector('.text-lg');

    // Extract product name (remove icons)
    const fullName = nameElement?.textContent || '';
    const name = fullName.replace(/^[⚡💝]+/u, '').trim();

    // Extract quantity
    const quantity = parseInt(quantityElement?.textContent || '0');

    // Extract price from the right column
    let price = 0;
    if (priceElement) {
      const priceText = priceElement.textContent;
      const match = priceText.match(/₩([\d,]+)/);
      if (match) {
        price = parseInt(match[1].replace(/,/g, ''));
      }
    }

    return {
      id: productId,
      name,
      quantity,
      price: Math.round(price / quantity) || 0,
    };
  });
};

/**
 * Render OrderSummaryDetails to DOM (선언적)
 */
export const renderOrderSummaryDetails = () => {
  const cartItems = getCartItemsFromDOM();
  const orderSummaryHtml = OrderSummaryDetails(cartItems);

  const summaryDetailsContainer = document.getElementById(
    ELEMENT_IDS.SUMMARY_DETAILS,
  );
  setInnerHTML(summaryDetailsContainer, orderSummaryHtml);
};

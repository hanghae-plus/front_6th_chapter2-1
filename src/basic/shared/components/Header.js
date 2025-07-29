import { htmlToElement } from "../utils/dom.js";

/**
 * Pure Header Component - JSX-like Template
 * @param {Object} props - Component props
 * @param {number} props.itemCount - Current item count in cart
 * @returns {HTMLElement} Header element
 */
const Header = ({ itemCount = 0 }) => {
  const headerHTML = /* html */ `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
    </div>
  `;

  return htmlToElement(headerHTML);
};

export { Header };

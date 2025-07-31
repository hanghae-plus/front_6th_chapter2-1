import { htmlToElement } from '@/basic/shared/utils/dom.js';

/**
 * CartItem Component - Pure HTML Template
 * @param {object} props - Component props
 * @param {string} props.id - Product ID
 * @param {string} props.name - Product name
 * @param {number} props.val - Product price
 * @param {number} props.originalVal - Original price
 * @param {number} props.quantity - Item quantity
 * @param {boolean} props.onSale - Flash sale status
 * @param {boolean} props.suggestSale - Suggest sale status
 */
const CartItem = ({
  id,
  name,
  val,
  originalVal,
  quantity,
  onSale = false,
  suggestSale = false,
}) => {
  return /* html */ `
    <article 
      id="${id}" 
      class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${
          onSale && suggestSale
            ? '⚡💝'
            : onSale
              ? '⚡'
              : suggestSale
                ? '💝'
                : ''
        }${name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${
          onSale || suggestSale
            ? `<span class="line-through text-gray-400">₩${originalVal.toLocaleString()}</span> <span class="${
                onSale && suggestSale
                  ? 'text-purple-600'
                  : onSale
                    ? 'text-red-500'
                    : 'text-blue-500'
              }">₩${val.toLocaleString()}</span>`
            : `₩${val.toLocaleString()}`
        }</p>
        <div class="flex items-center gap-4">
          <button 
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" 
            data-product-id="${id}" 
            data-change="-1"
          >−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
          <button 
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" 
            data-product-id="${id}" 
            data-change="1"
          >+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${
          onSale || suggestSale
            ? `<span class="line-through text-gray-400">₩${(
                originalVal * quantity
              ).toLocaleString()}</span> <span class="${
                onSale && suggestSale
                  ? 'text-purple-600'
                  : onSale
                    ? 'text-red-500'
                    : 'text-blue-500'
              }">₩${(val * quantity).toLocaleString()}</span>`
            : `₩${(val * quantity).toLocaleString()}`
        }</div>
        <a 
          class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" 
          data-product-id="${id}"
        >Remove</a>
      </div>
    </article>
  `;
};

export default CartItem;

/**
 * Render CartItem to DOM
 * @param {object} props - Product data with all required properties
 */
export const renderCartItem = props => {
  const cartItemHtml = CartItem(props);
  const cartItemElement = htmlToElement(cartItemHtml);
  return cartItemElement;
};

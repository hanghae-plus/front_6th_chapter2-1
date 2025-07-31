import { calculateTotalItemCount } from '../data/index.js';

import { UI_CONSTANTS } from "./constants.js";

export const Header = /*html*/ `
  <div class="mb-8">
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm ${UI_CONSTANTS.COLORS.GRAY_TEXT} font-normal mt-3">${UI_CONSTANTS.ICONS.CART} 0 items in cart</p>
  </div>
`;

// 헤더의 장바구니 아이템 수량 업데이트
export const updateHeaderItemCount = () => {
  const itemCountElement = document.getElementById('item-count');
  if (!itemCountElement) return;

  const totalItemCount = calculateTotalItemCount();
  const itemText = totalItemCount === 1 ? 'item' : 'items';
  itemCountElement.textContent = `🛍️ ${totalItemCount} ${itemText} in cart`;
};
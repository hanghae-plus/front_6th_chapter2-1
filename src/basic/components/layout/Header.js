import { createItemCount, updateItemCount } from '../product/ItemCount.js';

export const createHeader = ({ cartItemCount = 0 }) => {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  `;

  //아이템 수량
  const itemCount = createItemCount();
  updateItemCount(itemCount, cartItemCount);
  header.appendChild(itemCount);

  return header;
};

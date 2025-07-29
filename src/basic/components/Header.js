import { createItemCount, updateItemCount } from './ItemCount.js';

export const createHeader = ({ cartItemCount = 0 }) => {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  `;

  // ItemCount 컴포넌트 생성 및 추가
  const itemCount = createItemCount();
  updateItemCount(itemCount, cartItemCount);
  header.appendChild(itemCount);

  return header;
};

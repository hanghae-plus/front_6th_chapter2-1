import { createDiscountPolicy } from './DiscountPolicy.js';
import { createPoints } from './Point.js';
import { createTip } from './Tip.js';

export function createManualColumn() {
  const column = document.createElement('div');
  column.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';

  // 닫기 버튼
  const closeButton = document.createElement('button');
  closeButton.className =
    'absolute top-4 right-4 text-gray-500 hover:text-black';
  closeButton.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;
  closeButton.id = 'manual-close-button';

  // 제목
  const title = document.createElement('h2');
  title.className = 'text-xl font-bold mb-4';
  title.textContent = '📖 이용 안내';

  // 섹션들 추가
  column.appendChild(closeButton);
  column.appendChild(title);
  column.appendChild(createDiscountPolicy());
  column.appendChild(createPoints());
  column.appendChild(createTip());

  return column;
}

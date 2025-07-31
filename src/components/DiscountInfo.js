import { formatPrice } from '../utils/global/index.js';

export function createDiscountInfo({
  discRate = 0,
  total = 0,
  originalTotal = 0,
}) {
  const container = document.createElement('div');
  if (!(discRate > 0 && total > 0)) return container;

  const savedAmount = originalTotal - total;
  container.innerHTML = `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">${formatPrice(savedAmount)} 할인되었습니다</div>
    </div>
  `;
  return container;
}

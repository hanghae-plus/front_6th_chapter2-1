import { formatPrice } from '../../utils/global/index.js';
import { POINT_RATES } from '../../constants/shopPolicy.js';

export function createCartTotal({ total = 0 }) {
  const container = document.createElement('div');
  const loyaltyPoints = Math.floor(total * POINT_RATES.BASE_RATE);

  container.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="text-lg font-bold">Total</span>
      <span class="text-2xl font-bold">${formatPrice(total)}</span>
    </div>
    <div id="loyalty-points" class="text-sm text-gray-400 mt-2" style="display: ${loyaltyPoints > 0 ? 'block' : 'none'}">
      적립 포인트: ${loyaltyPoints}p
    </div>
  `;

  return container;
}

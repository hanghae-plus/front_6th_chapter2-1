import { html } from '../utils/html';
import { DISCOUNT_INFO_ID, selectById } from '../utils/selector';

interface Props {
  discountRate: number;
  totalPrice: number;
  finalTotalPrice: number;
}

export function renderDiscountInfo({
  discountRate,
  totalPrice,
  finalTotalPrice,
}: Props) {
  const discountInfo = selectById(DISCOUNT_INFO_ID);
  const savedAmount = totalPrice - finalTotalPrice;

  if (discountRate > 0) {
    discountInfo.innerHTML = html`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400"
            >총 할인율</span
          >
          <span class="text-sm font-medium text-green-400"
            >${(discountRate * 100).toFixed(1)}%</span
          >
        </div>
        <div class="text-2xs text-gray-300">
          ₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다
        </div>
      </div>
    `;
  } else {
    discountInfo.innerHTML = '';
  }
}

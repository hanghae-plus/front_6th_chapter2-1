import { formatPrice } from '../../utils/formatUtils';

export const createDiscountInfo = () => {
  const discountInfo = document.createElement('div');
  discountInfo.id = 'discount-info';
  discountInfo.className = 'mb-4';

  return discountInfo;
};

// 할인 정보 업데이트
export const updateDiscountInfo = (discountInfoElement, discountRate, totalAmount, originalTotal) => {
  discountInfoElement.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    // 할인 금액 계산
    const savedAmount = originalTotal - totalAmount;

    discountInfoElement.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${formatPrice(savedAmount)} 할인되었습니다</div>
      </div>
    `;
  }
};

// import { formatCurrency, formatPercentage } from '../../utils';

export const OrderSummaryDiscountInfo = () => {
  const discountInfoDiv = document.createElement('div');
  discountInfoDiv.id = 'discount-info';
  discountInfoDiv.className = 'mb-4';

  // 할인 정보를 업데이트하는 함수
  const updateDiscountInfo = (savedAmount, overallDiscountRate, totalAmount) => {
    // 할인 금액이 있고 최종 금액이 0보다 큰 경우에만 표시
    if (overallDiscountRate > 0 && totalAmount > 0) {
      discountInfoDiv.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(overallDiscountRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">${savedAmount}원 할인되었습니다</div>
        </div>
      `;
    } else {
      discountInfoDiv.innerHTML = ''; // 할인 없으면 내용 비우기
    }
  };

  return { element: discountInfoDiv, updateDiscountInfo };
};

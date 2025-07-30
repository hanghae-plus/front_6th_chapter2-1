/**
 * 할인 정보 렌더링 함수
 * @param {Object} totals - 계산된 총계 정보
 * @returns {string} 렌더링된 HTML
 */
export const renderDiscountInfo = (totals) => {
  const { totalDiscountRate, savedAmount, totalAmount } = totals;

  if (totalDiscountRate > 0 && totalAmount > 0) {
    return /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400"
            >총 할인율</span
          >
          <span class="text-sm font-medium text-green-400"
            >${totalDiscountRate.toFixed(1)}%</span
          >
        </div>
        <div class="text-2xs text-gray-300">
          ₩${savedAmount.toLocaleString()} 할인되었습니다
        </div>
      </div>
    `;
  }

  return "";
};

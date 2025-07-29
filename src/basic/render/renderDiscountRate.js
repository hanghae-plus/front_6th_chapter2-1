// 총 할인율 + 총 할인 가격
export const renderDiscountRate = (appState) => {
  const { totalAfterDiscount, totalDiscountedRate, totalBeforeDiscount } = appState;

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (totalDiscountedRate > 0 && totalAfterDiscount > 0) {
    // 최종 할인된 가격
    const savedPrice = totalBeforeDiscount - totalAfterDiscount;

    discountInfoDiv.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(totalDiscountedRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedPrice).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
};

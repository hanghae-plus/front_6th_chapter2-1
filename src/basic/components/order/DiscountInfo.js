/**
 * 할인 정보 렌더링 컴포넌트
 * 할인 정보를 표시하는 컴포넌트입니다.
 */
export function renderDiscountInfo(discRate, originalTotal, totalAmount) {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  discountInfoDiv.innerHTML = '';

  if (discRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount,
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

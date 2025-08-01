export const DiscountInfo = ({
  totalOriginalPrice,
  totalDiscountRate,
  totalDiscountedPrice,
}) => {
  let discountInfoDiv = document.getElementById("discount-info");
  discountInfoDiv.innerHTML = "";
  if (totalDiscountRate > 0 && totalDiscountedPrice > 0) {
    let savedAmount = totalOriginalPrice - totalDiscountedPrice;
    discountInfoDiv.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(totalDiscountRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
  }
};

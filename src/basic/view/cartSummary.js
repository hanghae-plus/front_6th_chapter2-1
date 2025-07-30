import { globalElements } from './globalElements';

export const renderDiscountInfo = ({ finalDiscountRate, originalTotal, totalAmount }) => {
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';

  if (finalDiscountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(finalDiscountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
};

export const renderLoyaltyPoints = ({ totalAmount }) => {
  const totalDiv = globalElements.cartSummary.querySelector('.text-2xl');
  if (totalDiv) totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / 1000);
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  }
};

export const renderItemTotalCount = ({ totalCount }) => {
  const itemCountElement = document.getElementById('item-count');

  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + totalCount + ' items in cart';

    if (previousCount !== totalCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
};

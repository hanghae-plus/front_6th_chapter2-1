import { CART_TOTAL_DISCOUNT_THRESHOLD, PER_ITEM_DISCOUNT_THRESHOLD } from '../const/discount';
import { isTuesday } from '../utils/dateUtil';
import { globalElements } from './globalElements';

export const updateAppliedPerItemDiscount = ({ getQuantityById }) => {
  const cartItems = globalElements.cartDisplay.children;

  for (const itemElement of cartItems) {
    const priceElems = itemElement.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = getQuantityById(itemElement.id) >= PER_ITEM_DISCOUNT_THRESHOLD ? 'bold' : 'normal';
      }
    });
  }
};

export const updateTuesdaySpecialStyle = () => {
  document.getElementById('tuesday-special').classList.toggle('hidden', !isTuesday());
};

export const renderSummaryDetails = ({ getProductById, getTotalItem, subTotal, appliedItemDiscounts, totalAmount }) => {
  const cartItems = globalElements.cartDisplay.children;

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  try {
    for (let i = 0; i < cartItems.length; i++) {
      console.log('이것.. 안도나요??', cartItems[i].id);
      const curItem = getProductById(cartItems[i].id);

      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElement.textContent);
      const itemTotal = curItem.discountValue * currentQuantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${currentQuantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
  } catch (e) {
    console.error(e.message);
    return;
  }

  summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTotal.toLocaleString()}</span>
      </div>
    `;

  if (getTotalItem() >= CART_TOTAL_DISCOUNT_THRESHOLD) {
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
  } else if (appliedItemDiscounts.length > 0) {
    appliedItemDiscounts.forEach(function (item) {
      summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
    });
  }

  if (isTuesday()) {
    if (totalAmount > 0) {
      summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
    }
  }

  summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
};

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

export const renderFinalPrice = ({ finalPrice }) => {
  const totalPriceContainer = globalElements.cartSummary.querySelector('.text-2xl');

  if (totalPriceContainer) {
    totalPriceContainer.textContent = '₩' + Math.round(finalPrice).toLocaleString();
  }
};

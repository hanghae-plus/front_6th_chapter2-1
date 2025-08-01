import { formatPrice } from '../price';
import { getProductById } from '../product';

export const updateCartItemBoldIfNeeded = (cartElement, quantity) => {
  const priceElems = cartElement.querySelectorAll('.text-lg, .text-xs');
  priceElems.forEach((elem) => {
    if (elem.classList.contains('text-lg')) {
      elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
    }
  });
};

export const updateCartUI = ({
  cartElements,
  productList,
  itemDiscounts,
  totalItemCount,
  subTotalBeforeDiscount,
  subTotalAfterDiscount,
  discountRate,
  isTuesday,
}) => {
  updateTuesdayBadge(isTuesday, subTotalAfterDiscount);
  updateCartSummaryDetails({
    cartElements,
    productList,
    itemDiscounts,
    totalItemCount,
    subTotalBeforeDiscount,
    subTotalAfterDiscount,
    isTuesday,
  });
  updateTotalPriceDisplay(subTotalAfterDiscount);
  updateLoyaltyPointsDisplay(subTotalAfterDiscount);
  updateDiscountInfo(discountRate, subTotalBeforeDiscount, subTotalAfterDiscount);
  updateCartItemCount(totalItemCount);
  updateStockStatus(productList);
};

const updateTuesdayBadge = (isTuesday, subTotalAfterDiscount) => {
  const tuesdaySpecialElement = document.getElementById('tuesday-special');
  if (isTuesday && subTotalAfterDiscount > 0) {
    tuesdaySpecialElement.classList.remove('hidden');
  } else {
    tuesdaySpecialElement.classList.add('hidden');
  }
};

const updateCartSummaryDetails = ({
  cartElements,
  productList,
  totalItemCount,
  subTotalBeforeDiscount,
  subTotalAfterDiscount,
  itemDiscounts,
  isTuesday,
}) => {
  const summaryDetailsElement = document.getElementById('summary-details');
  if (!summaryDetailsElement) return;

  const fragments = [];

  cartElements.forEach((element) => {
    const itemId = element.id;
    const product = getProductById(productList, itemId);
    if (!product) return;

    const quantity = parseInt(element.querySelector('.quantity-number')?.textContent || '0');
    const total = product.price * quantity;

    updateCartItemBoldIfNeeded(element, quantity);

    fragments.push(`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${quantity}</span>
          <span>${formatPrice(total)}</span>
        </div>
      `);
  });

  fragments.push(`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatPrice(subTotalBeforeDiscount)}</span>
      </div>
    `);

  if (totalItemCount >= 30) {
    fragments.push(`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `);
  } else {
    itemDiscounts.forEach(({ name, discount }) => {
      fragments.push(`
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${name} (10개↑)</span>
            <span class="text-xs">-${discount}%</span>
          </div>
        `);
    });
  }

  if (isTuesday && subTotalAfterDiscount > 0) {
    fragments.push(`
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `);
  }

  fragments.push(`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `);

  summaryDetailsElement.innerHTML = fragments.join('');
};

const updateTotalPriceDisplay = (subTotalAfterDiscount) => {
  const el = document.querySelector('#cart-total .text-2xl');
  if (el) {
    el.textContent = formatPrice(Math.round(subTotalAfterDiscount));
  }
};

const updateLoyaltyPointsDisplay = (subTotalAfterDiscount) => {
  const el = document.getElementById('loyalty-points');
  if (!el) return;

  const points = Math.floor(subTotalAfterDiscount / 1000);
  el.textContent = `적립 포인트: ${points > 0 ? points : 0}p`;
  el.style.display = 'block';
};

const updateDiscountInfo = (discountRate, subTotalBefore, subTotalAfter) => {
  const el = document.getElementById('discount-info');
  if (!el || discountRate <= 0) return;

  const discountAmount = subTotalBefore - subTotalAfter;
  el.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">${formatPrice(Math.round(discountAmount))} 할인되었습니다</div>
      </div>
    `;
};

const updateCartItemCount = (totalItemCount) => {
  const itemCountElement = document.getElementById('item-count');
  if (!itemCountElement) return;

  const countMatch = itemCountElement.textContent.match(/\d+/);
  const previousItemCount = countMatch ? parseInt(countMatch[0], 10) : 0;

  itemCountElement.textContent = `🛍️ ${totalItemCount} items in cart`;

  if (previousItemCount !== totalItemCount) {
    itemCountElement.setAttribute('data-changed', 'true');
  }
};

const updateStockStatus = (productList) => {
  const el = document.getElementById('stock-status');
  if (!el) return;

  el.textContent = productList
    .filter((item) => item.quantity < 5)
    .map((item) =>
      item.quantity > 0
        ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
        : `${item.name}: 품절`,
    )
    .join('\n');
};

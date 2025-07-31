import { formatPrice } from '../../utils/formatUtils';

// 카트 초기 금액
const INITIAL_CART_AMOUNT = 0;

/** 카트 합산 금액 */
export const createCartTotal = () => {
  const cartTotal = document.createElement('div');
  cartTotal.id = 'cart-total';
  cartTotal.className = 'pt-5 border-t border-white/10';
  cartTotal.innerHTML = `
    <div class="flex justify-between items-baseline">
      <span class="text-sm uppercase tracking-wider">Total</span>
      <div class="text-2xl tracking-tight">${formatPrice(INITIAL_CART_AMOUNT)}</div>
    </div>
  `;

  return cartTotal;
};

/**
 * 카트 합산 금액 업데이트
 * @param {HTMLElement} cartTotalElement - 합산 금액 표시 DOM 요소
 * @param {number} totalAmount - 업데이트할 합산 금액
 */
export const updateCartTotal = (cartTotalElement, totalAmount) => {
  const totalDiv = cartTotalElement.querySelector('.text-2xl');
  if (totalDiv) {
    // 소수점 버림
    const roundedAmount = Math.round(totalAmount);
    totalDiv.textContent = formatPrice(roundedAmount);
  }
};

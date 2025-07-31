import { DISCOUNT_POLICY } from '../../data/policy';
import { formatPrice } from '../../utils/formatUtils';
import { findProductById } from '../../utils/productUtils';

/** 주문 아이템 템플릿
 * @param {Object} product - 상품
 * @param {number} quantity - 수량
 * @param {number} itemTotal - 아이템 총 금액
 */
const createOrderItemTemplate = (product, quantity, itemTotal) => {
  return `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${product.name} x ${quantity}</span>
      <span>${formatPrice(itemTotal)}</span>
    </div>
  `;
};

/** 할인 템플릿
 * @param {string} name - 할인 이름
 * @param {number} discountRate - 할인율
 * @param {boolean} isSpecial - 특별 할인 여부
 */
const createDiscountTemplate = (name, discountRate, isSpecial = false) => {
  const colorClass = isSpecial ? 'text-purple-400' : 'text-green-400';
  return `
    <div class="flex justify-between text-sm tracking-wide ${colorClass}">
      <span class="text-xs">${name}</span>
      <span class="text-xs">-${discountRate}%</span>
    </div>
  `;
};

/** 주문 요약 */
export const createOrderSummary = () => {
  const orderSummary = document.createElement('div');
  orderSummary.id = 'summary-details';
  orderSummary.className = 'space-y-3';
  return orderSummary;
};

/** 주문 요약 업데이트
 * @param {Element} element - 주문 요약 요소
 * @param {Array} cartItems - 카트 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} subtotal - 총 금액
 * @param {number} itemCount - 카트 아이템 수
 * @param {Array} itemDiscounts - 개별 할인 목록
 * @param {boolean} isTuesdayDiscount - 화요일 할인 여부
 */
export const updateOrderSummary = (
  element,
  cartItems,
  productList,
  subtotal,
  itemCount,
  itemDiscounts,
  isTuesdayDiscount
) => {
  element.innerHTML = '';

  // 총 금액이 0이면 업데이트 종료
  if (subtotal <= 0) return;

  // 주문 아이템 목록 생성
  const orderItemsHtml = cartItems
    .map((cartItem) => {
      const product = findProductById(productList, cartItem.id);
      if (!product) return '';

      const quantityElement = cartItem.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
      const itemTotal = product.price * quantity;

      return createOrderItemTemplate(product, quantity, itemTotal);
    })
    .join('');

  // 할인 정보 생성
  let discountHtml = '';

  // 대량구매 할인 (30개 이상)
  if (itemCount >= DISCOUNT_POLICY.BULK_PURCHASE_MIN) {
    discountHtml += createDiscountTemplate('🌟 대량구매 할인 (30개 이상)', 25);
  }

  // 개별 상품 할인 (10개 이상)
  else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      discountHtml += createDiscountTemplate(`${item.name} (10개↑)`, item.discount);
    });
  }

  // 화요일 추가 할인
  if (isTuesdayDiscount) {
    discountHtml += createDiscountTemplate('🌟 화요일 추가 할인', 10, true);
  }

  element.innerHTML = `
    ${orderItemsHtml}
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    ${discountHtml}
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
};

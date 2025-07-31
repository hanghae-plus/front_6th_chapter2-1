import { TUESDAY_DAY_OF_WEEK } from '../data/date.data.js';
import { calculateTotalQuantity, getCartItemsArray } from '../utils/cart.util.js';
import { isBulkDiscountEligible } from '../utils/discount.util.js';

/**
 * 할인 관련 비즈니스 로직을 관리하는 hook
 */
export const useDiscount = cartItemsContainer => {
  if (!cartItemsContainer) {
    return {
      isBulkDiscount: false,
      isTuesday: false,
      basicDiscountedProducts: [],
      getTotalQuantity: () => 0,
      totalQuantity: 0,
    };
  }

  // 장바구니 총 수량 계산 (공통 함수 사용)
  const getTotalQuantity = () => calculateTotalQuantity(cartItemsContainer);
  const totalQuantity = getTotalQuantity();

  // 대량구매 할인 여부
  const isBulkDiscount = isBulkDiscountEligible(totalQuantity);

  // 화요일 여부
  const isTuesday = new Date().getDay() === TUESDAY_DAY_OF_WEEK;

  // 개별 상품 할인 대상 상품들
  const getBasicDiscountedProducts = () => {
    const cartItems = getCartItemsArray(cartItemsContainer);
    return cartItems
      .filter(cartItem => {
        const quantityElement = cartItem.querySelector('.quantity-number');
        const quantity = parseInt(quantityElement?.textContent) || 0;
        return quantity >= 10; // 10개 이상 구매 시 개별 할인
      })
      .map(cartItem => cartItem.id);
  };

  const basicDiscountedProducts = getBasicDiscountedProducts();

  return {
    isBulkDiscount,
    isTuesday,
    basicDiscountedProducts,
    getTotalQuantity,
    totalQuantity,
  };
};

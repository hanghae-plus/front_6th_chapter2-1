import { getCartItems } from '../components/cart/CartDisplay.js';
import { createCartPriceUpdater } from '../services/CartPriceUpdater.js';
import {
  getProductList,
  updateCartDiscount,
  updateCartItemCount,
  updateCartItems,
  updateCartTotal,
} from '../state/appState.js';

/** 카트 업데이트
 * @param {Element} cartDisplay - 카트 디스플레이
 * @param {Function} calculateTotalDiscount - 할인 계산 함수
 * @param {Object} uiUpdater - UI 업데이트 객체
 */
export function useCartUpdater(cartDisplay, calculateTotalDiscount, uiUpdater) {
  /** 공통 카트 업데이트 로직 */
  const updateCartState = (shouldUpdatePrices = false) => {
    if (!calculateTotalDiscount || !uiUpdater) return;

    const cartItems = getCartItems(cartDisplay);

    // 필요시 가격 업데이트
    if (shouldUpdatePrices) {
      const { updatePriceList } = createCartPriceUpdater(getProductList());
      updatePriceList(cartItems);
    }

    // 할인 및 총액 계산
    const calculationResult = calculateTotalDiscount(cartItems, getProductList());

    // 상태 업데이트
    updateCartItems(cartItems);
    updateCartItemCount(calculationResult.itemCount);
    updateCartTotal(calculationResult.totalAmount);
    updateCartDiscount(calculationResult.discountAmount);

    // UI 업데이트
    uiUpdater.updateAllUI(calculationResult);

    return calculationResult;
  };

  return {
    calculateCart: () => updateCartState(false),
    updatePricesAndCalculate: () => updateCartState(true),
  };
}

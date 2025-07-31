import { updateProductOptions } from '../components/product/ProductSelector.js';
import { getProductList } from '../state/appState.js';
import { useCartUpdater } from './useCart.js';

/** UI 렌더링 및 이벤트 설정 */
export function useSetupUIAndEvents() {
  function initializeRendering(productSelector, cartDisplay, discountCalculator, uiUpdater) {
    // 상품 옵션 업데이트
    updateProductOptions(productSelector, getProductList());

    // 초기 카트 계산 및 UI 업데이트
    const { calculateCart } = useCartUpdater(cartDisplay, discountCalculator, uiUpdater);
    calculateCart();
  }

  // 이벤트 핸들러 등록
  function attachEventHandlers(cartEventHandler, addToCartButton) {
    if (cartEventHandler && addToCartButton) {
      cartEventHandler.attachCartEvents(addToCartButton);
    }
  }

  return { initializeRendering, attachEventHandlers };
}

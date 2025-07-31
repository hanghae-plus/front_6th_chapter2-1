import { PRODUCT_LIST } from '../data/products';
import { setProductList, subscribeApp, updateCartItemCount } from '../state/appState.js';

/** 앱 초기화 */
export function useAppInitialization() {
  /** 애플리케이션 초기 상태 설정 */
  function initializeAppState() {
    updateCartItemCount(0);
    setProductList(PRODUCT_LIST);
  }

  /** 앱 상태 변경 시 UI 업데이트 구독 설정 */
  function subscribeToState() {
    subscribeApp((newAppState) => {
      const itemCountElement = document.getElementById('cart-item-count');
      if (itemCountElement) {
        // header 카트 아이템 개수 업데이트
        itemCountElement.textContent = newAppState.cart.totalItemCount;
      }
    });
  }

  return { initializeAppState, subscribeToState };
}

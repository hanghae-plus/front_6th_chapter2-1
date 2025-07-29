import { findAvailableProductExcept } from '../../shared/utils/index.js';

/**
 * 프로모션 기능
 */

/**
 * 프로모션 타이머 설정
 * @param {Object} appState - AppState 인스턴스
 */
export function setupPromotionTimers(appState) {
  var lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * appState.prodList.length);
      var luckyItem = appState.prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        // UI 업데이트 함수 호출 (레거시 호환성)
        if (typeof window.onUpdateSelectOptions === 'function') {
          window.onUpdateSelectOptions();
        }
        if (typeof window.doUpdatePricesInCart === 'function') {
          window.doUpdatePricesInCart();
        }
      }
    }, 30000);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (appState.elements.cartDisplay.children.length === 0) {
        return;
      }
      if (appState.lastSel) {
        var suggest = findAvailableProductExcept(appState.products, appState.lastSel);
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          // UI 업데이트 함수 호출 (레거시 호환성)
          if (typeof window.onUpdateSelectOptions === 'function') {
            window.onUpdateSelectOptions();
          }
          if (typeof window.doUpdatePricesInCart === 'function') {
            window.doUpdatePricesInCart();
          }
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 사용 가능한 상품 찾기 (내부 함수)
 * @param {Array} products - 상품 배열
 * @param {string} excludeId - 제외할 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
function findAvailableProductExcept(products, excludeId) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (product.id !== excludeId && product.q > 0 && !product.suggestSale) {
      return product;
    }
  }
  return null;
}

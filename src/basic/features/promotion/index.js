import { findAvailableProductExcept } from '../../shared/utils/product-utils.js';

/**
 * 프로모션 기능
 */

/**
 * 번개세일 할인 적용
 * @param {Object} product - 상품 객체
 */
function applyLightningSale(product) {
  product.val = Math.round((product.originalVal * 80) / 100);
  product.onSale = true;
  alert('⚡번개세일! ' + product.name + '이(가) 20% 할인 중입니다!');
}

/**
 * 추천할인 적용
 * @param {Object} product - 상품 객체
 */
function applySuggestedSale(product) {
  alert('💝 ' + product.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  product.val = Math.round((product.val * (100 - 5)) / 100);
  product.suggestSale = true;
}

/**
 * UI 업데이트 함수 호출 (레거시 호환성)
 */
function updateUI() {
  if (typeof window.onUpdateSelectOptions === 'function') {
    window.onUpdateSelectOptions();
  }
  if (typeof window.doUpdatePricesInCart === 'function') {
    window.doUpdatePricesInCart();
  }
}

/**
 * 번개세일 타이머 설정
 * @param {Object} appState - AppState 인스턴스
 */
function setupLightningSaleTimer(appState) {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * appState.prodList.length);
      const luckyItem = appState.prodList[luckyIdx];

      if (luckyItem.q > 0 && !luckyItem.onSale) {
        applyLightningSale(luckyItem);
        updateUI();
      }
    }, 30000);
  }, lightningDelay);
}

/**
 * 추천할인 타이머 설정
 * @param {Object} appState - AppState 인스턴스
 */
function setupSuggestedSaleTimer(appState) {
  const suggestDelay = Math.random() * 20000;

  setTimeout(function () {
    setInterval(function () {
      if (appState.elements.cartDisplay.children.length === 0) {
        return;
      }

      if (appState.lastSel) {
        const suggest = findAvailableProductExcept(appState.products, appState.lastSel);
        if (suggest) {
          applySuggestedSale(suggest);
          updateUI();
        }
      }
    }, 60000);
  }, suggestDelay);
}

/**
 * 프로모션 타이머 설정
 * @param {Object} appState - AppState 인스턴스
 */
export function setupPromotionTimers(appState) {
  setupLightningSaleTimer(appState);
  setupSuggestedSaleTimer(appState);
}

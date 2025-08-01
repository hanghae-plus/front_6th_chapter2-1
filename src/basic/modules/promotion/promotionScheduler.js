// =============================================================================
// PROMOTION SCHEDULER MODULE
// =============================================================================

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

const TIMING_CONFIG = {
  LIGHTNING_SALE_INTERVAL: 30000,
  LIGHTNING_SALE_DELAY: 10000,
  RECOMMENDATION_INTERVAL: 60000,
  RECOMMENDATION_DELAY: 20000,
};

const DISCOUNT_RATES = {
  LIGHTNING_SALE_DISCOUNT: 20,
  RECOMMENDATION_DISCOUNT: 5,
};

// =============================================================================
// TIMER STATE MANAGEMENT
// =============================================================================

// 모듈 내부에서만 접근 가능한 타이머 ID들
let lightningSaleTimer = null;
let recommendationTimer = null;

// =============================================================================
// LIGHTNING SALE TIMER FUNCTIONS
// =============================================================================

// 타이머 시작 함수들
function startLightningSaleTimer(
  productList,
  updateSelectOptions,
  updatePricesInCart
) {
  // 기존 타이머가 있다면 정리
  if (lightningSaleTimer) {
    clearInterval(lightningSaleTimer);
  }

  // 고정된 지연 시간 사용 (테스트 가능성 향상)
  const lightningDelay = TIMING_CONFIG.LIGHTNING_SALE_DELAY;

  setTimeout(() => {
    lightningSaleTimer = setInterval(() => {
      const availableProducts = productList.filter(
        (product) => product.stockQuantity > 0 && !product.isFlashSale
      );

      if (availableProducts.length > 0) {
        const luckyItem = availableProducts[0]; // 첫 번째 사용 가능한 상품 선택
        luckyItem.price = Math.round(
          (luckyItem.originalPrice *
            (100 - DISCOUNT_RATES.LIGHTNING_SALE_DISCOUNT)) /
            100
        );
        luckyItem.isFlashSale = true;
        alert(
          '⚡번개세일! ' +
            luckyItem.name +
            '이(가) ' +
            DISCOUNT_RATES.LIGHTNING_SALE_DISCOUNT +
            '% 할인 중입니다!'
        );

        // UI 업데이트는 한 번만 호출
        updateSelectOptions();
        updatePricesInCart();
      }
    }, TIMING_CONFIG.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

// =============================================================================
// RECOMMENDATION TIMER FUNCTIONS
// =============================================================================

function startRecommendationTimer(
  productList,
  getLastSelectedProductId,
  updateSelectOptions,
  updatePricesInCart
) {
  // 기존 타이머가 있다면 정리
  if (recommendationTimer) {
    clearInterval(recommendationTimer);
  }

  // 고정된 지연 시간 사용 (테스트 가능성 향상)
  const recommendationDelay = TIMING_CONFIG.RECOMMENDATION_DELAY;

  setTimeout(() => {
    recommendationTimer = setInterval(() => {
      const lastSelectedId = getLastSelectedProductId();
      if (lastSelectedId) {
        const availableProducts = productList.filter(
          (product) =>
            product.id !== lastSelectedId &&
            product.stockQuantity > 0 &&
            !product.isRecommended
        );

        if (availableProducts.length > 0) {
          const suggest = availableProducts[0]; // 첫 번째 사용 가능한 상품 선택
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 ' +
              DISCOUNT_RATES.RECOMMENDATION_DISCOUNT +
              '% 추가 할인!'
          );
          suggest.price = Math.round(
            (suggest.price * (100 - DISCOUNT_RATES.RECOMMENDATION_DISCOUNT)) /
              100
          );
          suggest.isRecommended = true;

          // UI 업데이트는 한 번만 호출
          updateSelectOptions();
          updatePricesInCart();
        }
      }
    }, TIMING_CONFIG.RECOMMENDATION_INTERVAL);
  }, recommendationDelay);
}

// =============================================================================
// TIMER CLEANUP FUNCTIONS
// =============================================================================

function stopAllTimers() {
  if (lightningSaleTimer) {
    clearInterval(lightningSaleTimer);
    lightningSaleTimer = null;
  }
  if (recommendationTimer) {
    clearInterval(recommendationTimer);
    recommendationTimer = null;
  }
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

export { startLightningSaleTimer, startRecommendationTimer, stopAllTimers };

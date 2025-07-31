// 타이머 관련 상수
const TIMER_DELAYS = {
  LIGHTNING_SALE_MIN: 0,
  LIGHTNING_SALE_MAX: 10000, // 10초
  RECOMMENDATION_MIN: 0,
  RECOMMENDATION_MAX: 20000, // 20초
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
};

const DISCOUNT_PERCENTAGES = {
  LIGHTNING_SALE: 80, // 20% 할인
  RECOMMENDATION: 95, // 5% 할인
};

export function createTimerService(productList, updateProductOptions) {
  let lastSelectedProductId = null;

  // 추천 상품 찾기
  const findRecommendationProduct = () => {
    if (!lastSelectedProductId) return null;

    for (const product of productList) {
      if (product.productId !== lastSelectedProductId && product.stock > 0 && !product.isRecommended) {
        return product;
      }
    }
    return null;
  };

  // 번개 세일 시작
  const startLightningSale = () => {
    const luckyItem = findRecommendationProduct();
    if (luckyItem && luckyItem.stock > 0) {
      luckyItem.isOnSale = true;
      luckyItem.price = Math.round((luckyItem.originalPrice * DISCOUNT_PERCENTAGES.LIGHTNING_SALE) / 100);
      updateProductOptions();
      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    }

    setTimeout(() => {
      startLightningSale();
    }, TIMER_DELAYS.LIGHTNING_SALE_INTERVAL);
  };

  // 추천 상품 표시
  const showRecommendation = () => {
    const recommendationProduct = findRecommendationProduct();
    if (recommendationProduct && recommendationProduct.stock > 0 && !recommendationProduct.isRecommended) {
      recommendationProduct.isRecommended = true;
      updateProductOptions();
      alert(' ' + recommendationProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      recommendationProduct.price = Math.round(
        (recommendationProduct.price * DISCOUNT_PERCENTAGES.RECOMMENDATION) / 100
      );
    }

    setTimeout(() => {
      showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);
  };

  // 번개 세일 타이머 시작
  const startLightningSaleTimer = () => {
    setTimeout(() => {
      startLightningSale();
    }, Math.random() * TIMER_DELAYS.LIGHTNING_SALE_MAX);
  };

  // 추천 상품 타이머 시작
  const startRecommendationTimer = () => {
    setTimeout(() => {
      showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);
  };

  // 타이머 서비스 시작
  const startTimers = () => {
    startLightningSaleTimer();
    startRecommendationTimer();
  };

  // 마지막 선택된 상품 설정
  const setLastSelectedProduct = (productId) => {
    lastSelectedProductId = productId;
  };

  return {
    startTimers,
    setLastSelectedProduct,
  };
}

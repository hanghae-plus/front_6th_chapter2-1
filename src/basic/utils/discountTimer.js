// 할인 관련 상수들
const DISCOUNT_CONFIG = {
  LIGHTNING: {
    INTERVAL: 30000,
    DISCOUNT_RATE: 20,
    ALERT_MESSAGE: `⚡번개세일! {name}이(가) 20% 할인 중입니다!`, // 백틱 사용
    delay: Math.random() * 10000,
  },
  RECOMMENDATION: {
    INTERVAL: 60000,
    DISCOUNT_RATE: 5,
    ALERT_MESSAGE: ` {name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`, // 백틱 사용
    delay: Math.random() * 20000,
  },
};

// 공통 타이머 설정 로직
const createTimer = (callback, interval, delay) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, delay);
};

// 번개세일 로직
const lightningSaleCallback = (
  prodList,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  config = DISCOUNT_CONFIG.LIGHTNING // 기본값 추가
) => {
  const luckyIndex = Math.floor(Math.random() * prodList.length);
  const luckyItem = prodList[luckyIndex];

  if (luckyItem.q > 0 && !luckyItem.onSale) {
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100; // 설정값 사용
    luckyItem.val = Math.round(luckyItem.originalVal * discountMultiplier);
    luckyItem.onSale = true;
    alert(config.ALERT_MESSAGE.replace("{name}", luckyItem.name)); // 설정된 메시지 사용
    onUpdateSelectOptions();
    doUpdatePricesInCart();
  }
};

// 추천할인 로직
const recommendationCallback = (
  prodList,
  lastSel,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  config = DISCOUNT_CONFIG.RECOMMENDATION // 기본값 추가
) => {
  if (!lastSel) return;

  const suggest = prodList.find(
    (item) => item.id !== lastSel && item.q > 0 && !item.suggestSale
  );

  if (suggest) {
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100; // 설정값 사용
    alert(config.ALERT_MESSAGE.replace("{name}", suggest.name)); // 설정된 메시지 사용
    suggest.val = Math.round(suggest.val * discountMultiplier);
    suggest.suggestSale = true;
    onUpdateSelectOptions();
    doUpdatePricesInCart();
  }
};

// 번개세일 타이머
export const startLightningSaleTimer = ({
  prodList,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  delay = Math.random() * 10000,
  config = DISCOUNT_CONFIG.LIGHTNING, // 기본값 추가
}) => {
  createTimer(
    () =>
      lightningSaleCallback(
        prodList,
        onUpdateSelectOptions,
        doUpdatePricesInCart,
        config // config 전달
      ),
    config.INTERVAL, // 설정된 간격 사용
    delay
  );
};

// 추천할인 타이머
export const startRecommendationTimer = ({
  prodList,
  lastSel,
  onUpdateSelectOptions,
  doUpdatePricesInCart,
  delay = Math.random() * 20000,
  config = DISCOUNT_CONFIG.RECOMMENDATION, // 기본값 추가
}) => {
  createTimer(
    () =>
      recommendationCallback(
        prodList,
        lastSel,
        onUpdateSelectOptions,
        doUpdatePricesInCart,
        config // config 전달
      ),
    config.INTERVAL, // 설정된 간격 사용
    delay
  );
};

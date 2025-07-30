import {
  DISCOUNT_CONFIG,
  ITEM_DISCOUNT,
} from "../../constants/discount.constant";

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
  updateCartPricesAndRefresh,
  config = DISCOUNT_CONFIG.LIGHTNING // 기본값 추가
) => {
  const luckyIndex = Math.floor(Math.random() * prodList.length);
  const luckyItem = prodList[luckyIndex];

  if (luckyItem.quantity > 0 && !luckyItem.onSale) {
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100; // 설정값 사용
    luckyItem.val = Math.round(luckyItem.originalVal * discountMultiplier);
    luckyItem.onSale = true;
    alert(config.ALERT_MESSAGE.replace("{name}", luckyItem.name)); // 설정된 메시지 사용
    onUpdateSelectOptions();
    updateCartPricesAndRefresh();
  }
};

// 추천할인 로직
const recommendationCallback = (
  prodList,
  onUpdateSelectOptions,
  updateCartPricesAndRefresh,
  config = DISCOUNT_CONFIG.RECOMMENDATION // 기본값 추가
) => {
  const availableItems = prodList.filter(
    (item) => item.quantity > 0 && !item.suggestSale
  );

  if (availableItems.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableItems.length);
  const suggest = availableItems[randomIndex];

  if (suggest) {
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100; // 설정값 사용
    alert(config.ALERT_MESSAGE.replace("{name}", suggest.name)); // 설정된 메시지 사용
    suggest.val = Math.round(suggest.val * discountMultiplier);
    suggest.suggestSale = true;
    onUpdateSelectOptions();
    updateCartPricesAndRefresh();
  }
};

// 번개세일 타이머
export const startLightningSaleTimer = ({
  prodList,
  onUpdateSelectOptions,
  updateCartPricesAndRefresh,
  delay = Math.random() * 10000,
  config = DISCOUNT_CONFIG.LIGHTNING, // 기본값 추가
}) => {
  createTimer(
    () =>
      lightningSaleCallback(
        prodList,
        onUpdateSelectOptions,
        updateCartPricesAndRefresh,
        config // config 전달
      ),
    config.INTERVAL, // 설정된 간격 사용
    delay
  );
};

// 추천할인 타이머
export const startRecommendationTimer = ({
  prodList,
  onUpdateSelectOptions,
  updateCartPricesAndRefresh,
  delay = Math.random() * 20000,
  config = DISCOUNT_CONFIG.RECOMMENDATION, // 기본값 추가
}) => {
  createTimer(
    () =>
      recommendationCallback(
        prodList,
        onUpdateSelectOptions,
        updateCartPricesAndRefresh,
        config // config 전달
      ),
    config.INTERVAL, // 설정된 간격 사용
    delay
  );
};

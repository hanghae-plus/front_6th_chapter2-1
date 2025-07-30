import {
  DISCOUNT_CONFIG,
  ITEM_DISCOUNT,
} from "../../constants/discount.constant";

/**
 * 타이머 생성
 * @param {Function} callback - 타이머 콜백
 * @param {number} interval - 타이머 간격
 * @param {number} delay - 타이머 지연
 */
const createTimer = (callback, interval, delay) => {
  setTimeout(() => {
    setInterval(callback, interval);
  }, delay);
};

/**
 * 번개세일 로직
 * @param {Array} prodList - 상품 리스트
 * @param {Function} onUpdateSelectOptions - 상품 선택 옵션 업데이트 콜백
 * @param {Function} updateCartPricesAndRefresh - 장바구니 가격 업데이트 콜백
 * @param {Object} config - 설정 정보
 */
const lightningSaleCallback = (
  prodList,
  onUpdateSelectOptions,
  updateCartPricesAndRefresh,
  config = DISCOUNT_CONFIG.LIGHTNING // 기본값 추가
) => {
  // 랜덤 인덱스 생성
  const luckyIndex = Math.floor(Math.random() * prodList.length);
  const luckyItem = prodList[luckyIndex];

  // 상품 존재 체크
  if (luckyItem.quantity > 0 && !luckyItem.onSale) {
    // 할인 계산
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100;
    luckyItem.val = Math.round(luckyItem.originalVal * discountMultiplier);

    // 번개할인 설정
    luckyItem.onSale = true;

    // 알림 메시지 표시
    alert(config.ALERT_MESSAGE.replace("{name}", luckyItem.name));

    // 상품 선택 옵션 업데이트
    onUpdateSelectOptions();

    // 장바구니 가격 업데이트
    updateCartPricesAndRefresh();
  }
};

/**
 * 추천할인 로직
 * @param {Array} prodList - 상품 리스트
 * @param {Function} onUpdateSelectOptions - 상품 선택 옵션 업데이트 콜백
 * @param {Function} updateCartPricesAndRefresh - 장바구니 가격 업데이트 콜백
 * @param {Object} config - 설정 정보
 */
const recommendationCallback = (
  prodList,
  onUpdateSelectOptions,
  updateCartPricesAndRefresh,
  config = DISCOUNT_CONFIG.RECOMMENDATION // 기본값 추가
) => {
  // 추천할인 가능 상품 필터링
  const availableItems = prodList.filter(
    (item) => item.quantity > 0 && !item.suggestSale
  );

  // 추천할인 가능 상품이 없으면 종료
  if (availableItems.length === 0) return;

  // 랜덤 인덱스 생성
  const randomIndex = Math.floor(Math.random() * availableItems.length);
  const suggest = availableItems[randomIndex];

  // 추천할인 가능 상품 체크
  if (suggest) {
    // 할인 계산
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100;

    // 알림 메시지 표시
    alert(config.ALERT_MESSAGE.replace("{name}", suggest.name));

    // 추천할인 설정
    suggest.val = Math.round(suggest.val * discountMultiplier);
    suggest.suggestSale = true;

    // 상품 선택 옵션 업데이트
    onUpdateSelectOptions();

    // 장바구니 가격 업데이트
    updateCartPricesAndRefresh();
  }
};

/**
 * 번개세일 타이머
 * @param {Object} config - 설정 정보
 */
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

/**
 * 추천할인 타이머
 * @param {Object} config - 설정 정보
 */
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

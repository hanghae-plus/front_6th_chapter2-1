import { DISCOUNT_CONFIG } from "../constants/discount.constant";
import type { Product } from "../constants/product.constant";

// 전역 타이머 ID 저장소
let lightningIntervalId: number | null = null;
let recommendationIntervalId: number | null = null;

/**
 * 타이머 생성 함수
 * @param callback - 타이머 콜백
 * @param interval - 타이머 간격
 * @param delay - 타이머 지연
 * @param type - 타이머 타입
 */
const createTimer = (
  callback: () => void,
  interval: number,
  delay: number,
  type: "lightning" | "recommendation"
) => {
  setTimeout(() => {
    const intervalId = setInterval(callback, interval);
    if (type === "lightning") {
      lightningIntervalId = intervalId;
    } else {
      recommendationIntervalId = intervalId;
    }
  }, delay);
};

/**
 * 번개세일 콜백 함수
 * @param products - 상품 리스트
 * @param onProductUpdate - 상품 업데이트 콜백
 * @param config - 설정 정보
 */
const lightningSaleCallback = (
  products: Product[],
  onProductUpdate: () => void,
  config = DISCOUNT_CONFIG.LIGHTNING
) => {
  // 랜덤 인덱스 생성
  const luckyIndex = Math.floor(Math.random() * products.length);
  const luckyItem = products[luckyIndex];

  // 상품 존재 체크
  if (luckyItem && luckyItem.quantity > 0 && !luckyItem.onSale) {
    // 할인 계산
    const discountMultiplier = (100 - config.DISCOUNT_RATE) / 100;
    luckyItem.val = Math.round(luckyItem.originalVal * discountMultiplier);

    // 번개할인 설정
    luckyItem.onSale = true;

    // 알림 메시지 표시
    alert(config.ALERT_MESSAGE.replace("{name}", luckyItem.name));

    // 상품 업데이트 콜백 호출
    onProductUpdate();
  }
};

/**
 * 추천할인 콜백 함수
 * @param products - 상품 리스트
 * @param onProductUpdate - 상품 업데이트 콜백
 * @param config - 설정 정보
 */
const recommendationCallback = (
  products: Product[],
  onProductUpdate: () => void,
  config = DISCOUNT_CONFIG.RECOMMENDATION
) => {
  // 추천할인 가능 상품 필터링
  const availableItems = products.filter(
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

    // 상품 업데이트 콜백 호출
    onProductUpdate();
  }
};

/**
 * 번개세일 타이머 시작
 * @param products - 상품 리스트
 * @param onProductUpdate - 상품 업데이트 콜백
 * @param delay - 지연 시간
 * @param config - 설정 정보
 */
export const startLightningSaleTimer = ({
  products,
  onProductUpdate,
  delay = DISCOUNT_CONFIG.LIGHTNING.delay,
  config = DISCOUNT_CONFIG.LIGHTNING,
}: {
  products: Product[];
  onProductUpdate: () => void;
  delay?: number;
  config?: typeof DISCOUNT_CONFIG.LIGHTNING;
}) => {
  createTimer(
    () => lightningSaleCallback(products, onProductUpdate, config),
    config.INTERVAL,
    delay,
    "lightning"
  );
};

/**
 * 추천할인 타이머 시작
 * @param products - 상품 리스트
 * @param onProductUpdate - 상품 업데이트 콜백
 * @param delay - 지연 시간
 * @param config - 설정 정보
 */
export const startRecommendationTimer = ({
  products,
  onProductUpdate,
  delay = DISCOUNT_CONFIG.RECOMMENDATION.delay,
  config = DISCOUNT_CONFIG.RECOMMENDATION,
}: {
  products: Product[];
  onProductUpdate: () => void;
  delay?: number;
  config?: typeof DISCOUNT_CONFIG.RECOMMENDATION;
}) => {
  createTimer(
    () => recommendationCallback(products, onProductUpdate, config),
    config.INTERVAL,
    delay,
    "recommendation"
  );
};

/**
 * 재고 부족 알럿
 * @param message - 알럿 메시지
 */
export const showStockAlert = (
  message: string = "재고가 부족하거나 잘못된 상품입니다."
) => {
  alert(message);
};

/**
 * 모든 타이머 정리
 */
export const clearAllTimers = () => {
  if (lightningIntervalId) {
    clearInterval(lightningIntervalId);
    lightningIntervalId = null;
  }
  if (recommendationIntervalId) {
    clearInterval(recommendationIntervalId);
    recommendationIntervalId = null;
  }
};

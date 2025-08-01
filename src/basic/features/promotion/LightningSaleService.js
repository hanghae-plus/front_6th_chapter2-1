import { DISCOUNT_RATES, TIMER_DELAYS } from '../../shared/constants/index.js';

// ==================== 번개세일 자동 프로모션 서비스 ====================
// 랜덤 상품을 선택해서 자동으로 20% 할인을 적용하고 해제하는 시스템

/**
 * 번개세일 적용 가능한 상품 찾기
 * @param {Array} products - 상품 목록
 * @returns {Object|null} 세일 대상 상품 또는 null
 */
export function findLightningSaleTarget(products) {
  const availableProducts = products.filter(
    (product) => product.stock > 0 && !product.isOnSale
  );

  if (availableProducts.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableProducts.length);
  return availableProducts[randomIndex];
}

/**
 * 번개세일 적용
 * @param {Object} product - 대상 상품
 * @returns {Object} 세일 정보 { product, message }
 */
export function applyLightningSale(product) {
  product.price = Math.round(
    product.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING)
  );
  product.isOnSale = true;

  return {
    product,
    message: `⚡ 번개세일! ${product.name}이 ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`,
    discountRate: DISCOUNT_RATES.LIGHTNING,
  };
}

/**
 * 번개세일 해제
 * @param {Object} product - 대상 상품
 * @returns {Object} 해제 정보
 */
export function removeLightningSale(product) {
  product.price = product.originalPrice;
  product.isOnSale = false;

  return {
    product,
    message: `번개세일이 종료되었습니다: ${product.name}`,
  };
}

/**
 * 번개세일 시스템 시작
 * @param {Function} getProducts - 상품 목록 조회 함수
 * @param {Function} updateCallback - UI 업데이트 콜백
 * @returns {Function} 정리 함수
 */
export function startLightningSaleSystem(getProducts, updateCallback) {
  const lightningInterval = setInterval(() => {
    const products = getProducts();
    const targetProduct = findLightningSaleTarget(products);

    if (targetProduct) {
      const saleInfo = applyLightningSale(targetProduct);
      alert(saleInfo.message);
      updateCallback();

      // 일정 시간 후 세일 해제
      setTimeout(() => {
        removeLightningSale(targetProduct);
        updateCallback();
      }, TIMER_DELAYS.LIGHTNING.DELAY_MAX);
    }
  }, TIMER_DELAYS.LIGHTNING.INTERVAL);

  // 정리 함수 반환
  return () => clearInterval(lightningInterval);
}

/**
 * 번개세일 활성 상품 확인
 * @param {Array} products - 상품 목록
 * @returns {Array} 번개세일 중인 상품들
 */
export function getActiveLightningSales(products) {
  return products.filter((product) => product.isOnSale);
}

/**
 * 번개세일 가능 여부 확인
 * @param {Array} products - 상품 목록
 * @returns {boolean} 번개세일 가능 여부
 */
export function canStartLightningSale(products) {
  return products.some((product) => product.stock > 0 && !product.isOnSale);
}

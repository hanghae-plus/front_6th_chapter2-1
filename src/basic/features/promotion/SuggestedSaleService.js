import { DISCOUNT_RATES, TIMER_DELAYS } from '../../shared/constants/index.js';

// ==================== 추천할인 자동 프로모션 서비스 ====================
// 사용자가 마지막으로 선택한 상품에 5% 추천할인을 자동 적용하는 시스템

/**
 * 추천할인 적용 가능한 상품 찾기 (마지막 선택 상품 기준)
 * @param {Array} products - 상품 목록
 * @param {string} lastSelectedProductId - 마지막 선택 상품 ID
 * @returns {Object|null} 추천할인 대상 상품 또는 null
 */
export function findSuggestedSaleTarget(products, lastSelectedProductId) {
  if (!lastSelectedProductId) return null;

  const targetProduct = products.find(
    (product) =>
      product.id === lastSelectedProductId &&
      product.stock > 0 &&
      !product.isSuggestedSale
  );

  return targetProduct || null;
}

/**
 * 추천할인 적용
 * @param {Object} product - 대상 상품
 * @returns {Object} 추천할인 정보 { product, message }
 */
export function applySuggestedSale(product) {
  // 원래 가격이 없으면 현재 가격을 원래 가격으로 설정
  if (!product.originalPrice) {
    product.originalPrice = product.price;
  }

  product.price = Math.round(
    product.originalPrice * (1 - DISCOUNT_RATES.SUGGEST)
  );
  product.isSuggestedSale = true;

  return {
    product,
    message: `💝 ${product.name}이 추천 상품으로 ${DISCOUNT_RATES.SUGGEST * 100}% 할인 중입니다!`,
    discountRate: DISCOUNT_RATES.SUGGEST,
  };
}

/**
 * 추천할인 해제
 * @param {Object} product - 대상 상품
 * @returns {Object} 해제 정보
 */
export function removeSuggestedSale(product) {
  product.price = product.originalPrice;
  product.isSuggestedSale = false;

  return {
    product,
    message: `추천할인이 종료되었습니다: ${product.name}`,
  };
}

/**
 * 추천할인 시스템 시작
 * @param {Function} getProducts - 상품 목록 조회 함수
 * @param {Function} getLastSelectedProductId - 마지막 선택 상품 ID 조회 함수
 * @param {Function} updateCallback - UI 업데이트 콜백
 * @returns {Function} 정리 함수
 */
export function startSuggestedSaleSystem(
  getProducts,
  getLastSelectedProductId,
  updateCallback
) {
  const suggestInterval = setInterval(() => {
    const products = getProducts();
    const lastSelectedId = getLastSelectedProductId();
    const targetProduct = findSuggestedSaleTarget(products, lastSelectedId);

    if (targetProduct) {
      const saleInfo = applySuggestedSale(targetProduct);
      alert(saleInfo.message);
      updateCallback();

      // 일정 시간 후 추천할인 해제
      setTimeout(() => {
        removeSuggestedSale(targetProduct);
        updateCallback();
      }, TIMER_DELAYS.SUGGEST.DELAY_MAX);
    }
  }, TIMER_DELAYS.SUGGEST.INTERVAL);

  // 정리 함수 반환
  return () => clearInterval(suggestInterval);
}

/**
 * 추천할인 활성 상품 확인
 * @param {Array} products - 상품 목록
 * @returns {Array} 추천할인 중인 상품들
 */
export function getActiveSuggestedSales(products) {
  return products.filter((product) => product.isSuggestedSale);
}

/**
 * 추천할인 가능 여부 확인
 * @param {Array} products - 상품 목록
 * @param {string} lastSelectedProductId - 마지막 선택 상품 ID
 * @returns {boolean} 추천할인 가능 여부
 */
export function canStartSuggestedSale(products, lastSelectedProductId) {
  return findSuggestedSaleTarget(products, lastSelectedProductId) !== null;
}

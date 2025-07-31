// 할인 집계 유틸 함수 (순수 함수)
// 입력: 개별 할인 배열, 대량구매 할인율/적용여부, 화요일 할인율/적용여부
// 출력: { totalDiscountRate, discountTypes, hasAnyDiscount }

export function calcTotalDiscount(individualDiscounts, bulkDiscountRate, bulkDiscountApplied, tuesdayDiscountRate, tuesdayDiscountApplied) {
  let totalRate = 0;
  const discountTypes = [];

  if (individualDiscounts.length > 0) {
    totalRate += individualDiscounts.reduce((sum, discount) => sum + discount.rate, 0);
    discountTypes.push("individual");
  }
  if (bulkDiscountApplied) {
    totalRate += bulkDiscountRate;
    discountTypes.push("bulk");
  }
  if (tuesdayDiscountApplied) {
    totalRate += tuesdayDiscountRate;
    discountTypes.push("tuesday");
  }

  return {
    totalDiscountRate: totalRate,
    discountTypes,
    hasAnyDiscount: totalRate > 0,
  };
}

/**
 * 상품들의 할인 정보를 계산하는 순수 함수
 *
 * @param {Array} products - 상품 배열
 * @param {Object} discountService - 할인 서비스 객체
 * @returns {Array} 할인 정보 배열
 */
export function calculateProductDiscountInfos(products, discountService) {
  if (!Array.isArray(products) || !discountService) {
    return [];
  }

  return products
    .map(product => {
      if (!product || !product.id) {
        return null;
      }

      return {
        productId: product.id,
        rate: product.discountRate || discountService.calculateProductDiscountRate(product),
        status: product.discountStatus || discountService.getProductDiscountStatus(product),
      };
    })
    .filter(Boolean); // null 값 제거
}

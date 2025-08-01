export function calcTotalDiscount(individualDiscounts, bulkDiscountRate, bulkDiscountApplied, tuesdayDiscountRate, tuesdayDiscountApplied) {
  // 할인 조건들을 배열로 정의
  const discountConditions = [
    {
      condition: individualDiscounts.length > 0,
      rate: individualDiscounts.reduce((sum, discount) => sum + discount.rate, 0),
      type: "individual",
    },
    {
      condition: bulkDiscountApplied,
      rate: bulkDiscountRate,
      type: "bulk",
    },
    {
      condition: tuesdayDiscountApplied,
      rate: tuesdayDiscountRate,
      type: "tuesday",
    },
  ];

  // 조건에 맞는 할인들만 필터링하고 계산
  const activeDiscounts = discountConditions.filter(discount => discount.condition);

  // 총 할인율과 할인 타입들을 계산
  const totalRate = activeDiscounts.reduce((sum, discount) => sum + discount.rate, 0);
  const discountTypes = activeDiscounts.map(discount => discount.type);

  return {
    totalDiscountRate: totalRate,
    discountTypes,
    hasAnyDiscount: totalRate > 0,
  };
}

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

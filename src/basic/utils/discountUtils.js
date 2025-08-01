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

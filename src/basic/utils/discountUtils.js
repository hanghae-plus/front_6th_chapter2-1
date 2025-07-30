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

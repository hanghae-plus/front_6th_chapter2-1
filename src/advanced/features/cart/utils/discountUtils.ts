/**
 * Cart Utils - 실제 cartCalculator에서 사용중인 순수 함수들
 */

interface BusinessConstants {
  DISCOUNT: {
    ITEM_DISCOUNT_MIN_QUANTITY: number;
  };
}

interface ProductIds {
  KEYBOARD: string;
  MOUSE: string;
  MONITOR_ARM: string;
  LAPTOP_POUCH: string;
  SPEAKER: string;
}

/**
 * 개별 상품 할인율 계산 (cartCalculator.calculateItemDiscount 기반)
 */
export const calculateItemDiscountRate = (
  productId: string,
  quantity: number,
  constants: BusinessConstants,
  productIds: ProductIds,
): number => {
  if (quantity < constants.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY) {
    return 0;
  }

  const discountRates: Record<string, number> = {
    [productIds.KEYBOARD]: 0.1,
    [productIds.MOUSE]: 0.15,
    [productIds.MONITOR_ARM]: 0.2,
    [productIds.LAPTOP_POUCH]: 0.05,
    [productIds.SPEAKER]: 0.25,
  };

  return discountRates[productId] || 0;
};

export type { BusinessConstants, ProductIds };

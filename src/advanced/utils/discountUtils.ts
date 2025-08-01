import { CartItem, ItemDiscount } from '../types';
import { DISCOUNT_PERCENTAGES } from '../constants';

// 할인 타입 정의
export type DiscountType =
  | 'flash_sale'
  | 'recommendation'
  | 'bulk'
  | 'tuesday'
  | 'super_sale';

/**
 * 상품의 할인 타입을 확인하는 유틸리티 함수
 * @param productId - 상품 ID
 * @param flashSaleProductId - 번개세일 상품 ID
 * @param recommendationProductId - 추천할인 상품 ID
 * @returns 할인 타입 또는 null
 */
export const getDiscountType = (
  productId: string,
  flashSaleProductId: string | null,
  recommendationProductId: string | null
): DiscountType | null => {
  // SUPER SALE (번개세일 + 추천할인 동시 적용)
  if (
    flashSaleProductId === productId &&
    recommendationProductId === productId
  ) {
    return 'super_sale';
  }

  // 번개세일
  if (flashSaleProductId === productId) {
    return 'flash_sale';
  }

  // 추천할인
  if (recommendationProductId === productId) {
    return 'recommendation';
  }

  return null;
};

// 할인 계산 팩토리 함수
export const createDiscountCalculator = (
  discountType: DiscountType,
  discountPercentage: number
) => {
  return (items: ReadonlyArray<CartItem>): ItemDiscount[] => {
    return items.map((item) => ({
      productId: item.product.id,
      discountAmount: item.itemTotal * (discountPercentage / 100),
      discountRate: discountPercentage / 100,
      discountType,
    }));
  };
};

// 조건부 할인 계산 함수
export const calculateConditionalDiscount = (
  items: ReadonlyArray<CartItem>,
  condition: boolean,
  discountType: DiscountType,
  discountPercentage: number
): ItemDiscount[] => {
  if (!condition) return [];

  return createDiscountCalculator(discountType, discountPercentage)(items);
};

// 특정 상품 필터링 후 할인 계산
export const calculateProductSpecificDiscount = (
  items: ReadonlyArray<CartItem>,
  targetProductId: string | null,
  discountType: DiscountType,
  discountPercentage: number
): ItemDiscount[] => {
  if (!targetProductId) return [];

  const filteredItems = items.filter(
    (item) => item.product.id === targetProductId
  );
  return createDiscountCalculator(
    discountType,
    discountPercentage
  )(filteredItems);
};

// 할인 타입별 기본 계산기들
export const discountCalculators = {
  bulk: createDiscountCalculator('bulk', DISCOUNT_PERCENTAGES.BULK),
  tuesday: createDiscountCalculator('tuesday', DISCOUNT_PERCENTAGES.TUESDAY),
  flashSale: createDiscountCalculator(
    'flash_sale',
    DISCOUNT_PERCENTAGES.FLASH_SALE
  ),
  recommendation: createDiscountCalculator(
    'recommendation',
    DISCOUNT_PERCENTAGES.RECOMMENDATION
  ),
} as const;

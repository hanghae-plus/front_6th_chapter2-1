import { CartItem, DiscountData, ItemDiscount } from '../types';
import { DISCOUNT_PERCENTAGES } from '../constants';
import {
  DISCOUNT_THRESHOLDS,
  PRODUCT_DISCOUNT_MAP,
  DAYS_OF_WEEK,
} from '../constants/businessRules';
import {
  calculateConditionalDiscount,
  calculateProductSpecificDiscount,
  discountCalculators,
} from '../utils/discountUtils';

export const calculateIndividualDiscount = (item: CartItem): ItemDiscount => {
  const { product, quantity } = item;

  if (quantity < DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN_QUANTITY) {
    return {
      productId: product.id,
      discountAmount: 0,
      discountRate: 0,
      discountType: 'flash_sale',
    };
  }

  const discountRate =
    PRODUCT_DISCOUNT_MAP[product.id as keyof typeof PRODUCT_DISCOUNT_MAP] || 0;

  const discountAmount = item.itemTotal * discountRate;

  return {
    productId: product.id,
    discountAmount,
    discountRate,
    discountType: 'flash_sale',
  };
};

export const calculateBulkDiscount = (
  items: ReadonlyArray<CartItem>
): ItemDiscount[] => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const isBulkEligible =
    totalQuantity >= DISCOUNT_THRESHOLDS.BULK_DISCOUNT_MIN_QUANTITY;

  return calculateConditionalDiscount(
    items,
    isBulkEligible,
    'bulk',
    DISCOUNT_PERCENTAGES.BULK
  );
};

export const calculateTuesdayDiscount = (
  items: ReadonlyArray<CartItem>
): ItemDiscount[] => {
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;

  return calculateConditionalDiscount(
    items,
    isTuesday,
    'tuesday',
    DISCOUNT_PERCENTAGES.TUESDAY
  );
};

export const calculateFlashSaleDiscount = (
  items: ReadonlyArray<CartItem>,
  flashSaleProductId: string | null
): ItemDiscount[] => {
  return calculateProductSpecificDiscount(
    items,
    flashSaleProductId,
    'flash_sale',
    DISCOUNT_PERCENTAGES.FLASH_SALE
  );
};

export const calculateRecommendationDiscount = (
  items: ReadonlyArray<CartItem>,
  recommendationProductId: string | null
): ItemDiscount[] => {
  return calculateProductSpecificDiscount(
    items,
    recommendationProductId,
    'recommendation',
    DISCOUNT_PERCENTAGES.RECOMMENDATION
  );
};

export const calculateSuperSaleDiscount = (
  items: ReadonlyArray<CartItem>,
  flashSaleProductId: string | null,
  recommendationProductId: string | null
): ItemDiscount[] => {
  if (!flashSaleProductId || !recommendationProductId) return [];

  if (flashSaleProductId === recommendationProductId) {
    return items
      .filter((item) => item.product.id === flashSaleProductId)
      .map((item) => ({
        productId: item.product.id,
        discountAmount:
          item.itemTotal * (DISCOUNT_PERCENTAGES.SUPER_SALE / 100),
        discountRate: DISCOUNT_PERCENTAGES.SUPER_SALE / 100,
        discountType: 'super_sale',
      }));
  }

  return [];
};

export const mergeDiscounts = (
  allDiscounts: ReadonlyArray<ReadonlyArray<ItemDiscount>>
): ItemDiscount[] => {
  const discountMap = new Map<string, ItemDiscount>();

  allDiscounts.flat().forEach((discount) => {
    const existing = discountMap.get(discount.productId);

    if (!existing || discount.discountRate > existing.discountRate) {
      discountMap.set(discount.productId, discount);
    }
  });

  return Array.from(discountMap.values());
};

const createEmptyDiscountData = (): DiscountData => ({
  totalAmount: 0,
  itemDiscounts: [],
  discountRate: 0,
});

const calculateAllDiscountTypes = (
  items: ReadonlyArray<CartItem>,
  flashSaleProductId: string | null,
  recommendationProductId: string | null
): ReadonlyArray<ReadonlyArray<ItemDiscount>> => {
  const individualDiscounts = items.map(calculateIndividualDiscount);
  const bulkDiscounts = calculateBulkDiscount(items);
  const tuesdayDiscounts = calculateTuesdayDiscount(items);
  const flashSaleDiscounts = calculateFlashSaleDiscount(
    items,
    flashSaleProductId
  );
  const recommendationDiscounts = calculateRecommendationDiscount(
    items,
    recommendationProductId
  );
  const superSaleDiscounts = calculateSuperSaleDiscount(
    items,
    flashSaleProductId,
    recommendationProductId
  );

  return [
    individualDiscounts,
    bulkDiscounts,
    tuesdayDiscounts,
    flashSaleDiscounts,
    recommendationDiscounts,
    superSaleDiscounts,
  ];
};

const calculateFinalDiscountAmount = (
  finalDiscounts: ReadonlyArray<ItemDiscount>,
  subtotal: number
) => {
  const totalDiscountAmount = finalDiscounts.reduce(
    (sum, discount) => sum + discount.discountAmount,
    0
  );
  const totalAmount = subtotal - totalDiscountAmount;
  const discountRate =
    subtotal > 0 ? (totalDiscountAmount / subtotal) * 100 : 0;

  return { totalAmount, totalDiscountAmount, discountRate };
};

export const calculateDiscounts = (
  items: ReadonlyArray<CartItem>,
  flashSaleProductId: string | null = null,
  recommendationProductId: string | null = null
): DiscountData => {
  if (items.length === 0) {
    return createEmptyDiscountData();
  }

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const allDiscounts = calculateAllDiscountTypes(
    items,
    flashSaleProductId,
    recommendationProductId
  );
  const finalDiscounts = mergeDiscounts(allDiscounts);
  const { totalAmount, discountRate } = calculateFinalDiscountAmount(
    finalDiscounts,
    subtotal
  );

  return {
    totalAmount,
    itemDiscounts: finalDiscounts,
    discountRate,
  };
};

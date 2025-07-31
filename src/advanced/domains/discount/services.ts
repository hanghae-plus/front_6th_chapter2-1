import { Product, ProductId } from '../product/types';
import {
  Discount,
  DiscountType,
  DiscountResult,
  createDiscountId,
  createDiscountRate,
  createDiscountPeriod,
} from './types';

// 순수 함수로 구현된 할인 비즈니스 로직
export class DiscountService {
  static createLightningSaleDiscount(targetProductId: ProductId): Discount {
    return {
      id: createDiscountId(`lightning-${Date.now()}`),
      type: DiscountType.LIGHTNING_SALE,
      rate: createDiscountRate(20),
      period: createDiscountPeriod(
        new Date(),
        new Date(Date.now() + 30 * 60 * 1000)
      ), // 30분간
      targetProductId,
    };
  }

  static createSuggestionDiscount(targetProductId: ProductId): Discount {
    return {
      id: createDiscountId(`suggestion-${Date.now()}`),
      type: DiscountType.SUGGESTION,
      rate: createDiscountRate(5),
      period: createDiscountPeriod(
        new Date(),
        new Date(Date.now() + 10 * 60 * 1000)
      ), // 10분간
      targetProductId,
    };
  }

  static createTuesdaySpecialDiscount(): Discount {
    return {
      id: createDiscountId(`tuesday-${Date.now()}`),
      type: DiscountType.TUESDAY_SPECIAL,
      rate: createDiscountRate(10),
      period: createDiscountPeriod(new Date()),
    };
  }

  static createBulkPurchaseDiscount(
    minimumQuantity: number,
    discountRate: number
  ): Discount {
    return {
      id: createDiscountId(`bulk-${Date.now()}`),
      type: DiscountType.BULK_PURCHASE,
      rate: createDiscountRate(discountRate),
      period: createDiscountPeriod(new Date()),
      minimumQuantity,
    };
  }

  static isDiscountApplicable(
    discount: Discount,
    context: {
      productId?: ProductId;
      quantity?: number;
      currentTime?: Date;
    }
  ): boolean {
    const { productId, quantity, currentTime = new Date() } = context;

    // 기간 체크
    if (discount.period.endTime && currentTime > discount.period.endTime) {
      return false;
    }

    // 타겟 상품 체크
    if (discount.targetProductId && productId) {
      if (discount.targetProductId.value !== productId.value) {
        return false;
      }
    }

    // 최소 수량 체크
    if (discount.minimumQuantity && quantity !== undefined) {
      if (quantity < discount.minimumQuantity) {
        return false;
      }
    }

    return true;
  }

  static calculateDiscountAmount(
    originalAmount: number,
    discounts: readonly Discount[]
  ): DiscountResult {
    const totalDiscountRate = discounts.reduce((total, discount) => {
      return total + discount.rate.percentage / 100;
    }, 0);

    // 최대 할인율 제한 (90%)
    const finalDiscountRate = Math.min(totalDiscountRate, 0.9);
    const discountedAmount = originalAmount * (1 - finalDiscountRate);
    const savedAmount = originalAmount - discountedAmount;

    return {
      originalAmount,
      discountedAmount: Math.round(discountedAmount),
      savedAmount: Math.round(savedAmount),
      appliedDiscounts: discounts,
    };
  }

  static findEligibleProductsForLightningSale(
    products: readonly Product[]
  ): readonly Product[] {
    return products.filter(
      (product) => product.stock.isAvailable && !product.discount.isOnSale
    );
  }

  static findEligibleProductsForSuggestion(
    products: readonly Product[],
    excludeProductId: ProductId
  ): readonly Product[] {
    return products.filter(
      (product) =>
        product.stock.isAvailable &&
        !product.discount.isSuggested &&
        product.id.value !== excludeProductId.value
    );
  }

  static isTuesday(date: Date = new Date()): boolean {
    return date.getDay() === 2; // 2 = Tuesday
  }
}

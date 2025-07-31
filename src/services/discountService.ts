import { PRODUCT_IDS } from '../data/products';

// 할인 타입 정의
const DISCOUNT_TYPES = {
  INDIVIDUAL: 'individual',
  BULK: 'bulk',
  TUESDAY: 'tuesday',
} as const;

type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

interface DiscountRule {
  condition: (...args: any[]) => boolean;
  calculate: (...args: any[]) => { rate: number; amount: number };
  getName: (...args: any[]) => string;
}

interface DiscountInfo {
  type: DiscountType;
  name: string;
  rate: number;
  amount: number;
}

// 할인 규칙 정의
const DISCOUNT_RULES: Record<DiscountType, DiscountRule> = {
  [DISCOUNT_TYPES.INDIVIDUAL]: {
    condition: (_productId: string, quantity: number) => quantity >= 10,
    calculate: (productId: string, quantity: number, price: number) => {
      const discountRates: Record<string, number> = {
        [PRODUCT_IDS.KEYBOARD]: 0.1,
        [PRODUCT_IDS.MOUSE]: 0.15,
        [PRODUCT_IDS.MONITOR_ARM]: 0.2,
        [PRODUCT_IDS.LAPTOP_POUCH]: 0.05,
        [PRODUCT_IDS.SPEAKER]: 0.25,
      };
      const rate = discountRates[productId] || 0;
      return { rate, amount: price * quantity * rate };
    },
    getName: (productName: string) => `${productName} 개별 할인`,
  },
  [DISCOUNT_TYPES.BULK]: {
    condition: (totalQuantity: number) => totalQuantity >= 30,
    calculate: (subtotal: number) => {
      const rate = 0.25;
      return { rate, amount: subtotal * rate };
    },
    getName: () => '대량구매 할인 (30개 이상)',
  },
  [DISCOUNT_TYPES.TUESDAY]: {
    condition: () => new Date().getDay() === 2,
    calculate: (subtotal: number, appliedDiscounts: DiscountInfo[]) => {
      const rate = 0.1;
      const amountAfterBulkDiscount = appliedDiscounts.reduce((sum, discount) => sum - discount.amount, subtotal);
      return { rate, amount: amountAfterBulkDiscount * rate };
    },
    getName: () => '화요일 추가 할인',
  },
};

// 개별 상품 할인율 계산 (기존 호환성을 위해 유지)
export function calculateIndividualDiscount(productId: string, quantity: number): number {
  if (quantity < 10) return 0;

  const discountRates: Record<string, number> = {
    [PRODUCT_IDS.KEYBOARD]: 0.1,
    [PRODUCT_IDS.MOUSE]: 0.15,
    [PRODUCT_IDS.MONITOR_ARM]: 0.2,
    [PRODUCT_IDS.LAPTOP_POUCH]: 0.05,
    [PRODUCT_IDS.SPEAKER]: 0.25,
  };

  return discountRates[productId] || 0;
}

// 대량구매 할인율 계산 (기존 호환성을 위해 유지)
export function calculateBulkDiscount(totalQuantity: number): number {
  return totalQuantity >= 30 ? 0.25 : 0;
}

// 화요일 특별 할인율 계산 (기존 호환성을 위해 유지)
export function calculateTuesdayDiscount(): number {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  return isTuesday ? 0.1 : 0;
}

// 모든 할인 정보를 계산하고 반환하는 통합 함수
export function calculateAllDiscounts(
  itemDiscounts: Array<{ name: string; discountRate: number; discountAmount: number }>,
  totalQuantity: number,
  subtotal: number
): DiscountInfo[] {
  if (!itemDiscounts || !Array.isArray(itemDiscounts) || totalQuantity <= 0 || subtotal <= 0) {
    return [];
  }

  const allDiscounts: DiscountInfo[] = [];

  // 개별 상품 할인 정보 추가
  itemDiscounts.forEach((item) => {
    if (item.discountAmount > 0) {
      allDiscounts.push({
        type: DISCOUNT_TYPES.INDIVIDUAL,
        name: DISCOUNT_RULES[DISCOUNT_TYPES.INDIVIDUAL].getName(item.name),
        rate: item.discountRate * 100,
        amount: item.discountAmount,
      });
    }
  });

  // 할인 규칙을 순차적으로 적용
  const discountTypesToApply: DiscountType[] = [DISCOUNT_TYPES.BULK, DISCOUNT_TYPES.TUESDAY];

  discountTypesToApply.forEach((discountType) => {
    const rule = DISCOUNT_RULES[discountType];

    // 조건을 만족하지 않으면 early return (continue)
    if (!rule.condition(totalQuantity)) {
      return;
    }

    // 각 할인 타입에 맞는 파라미터 전달
    const calculateParams = discountType === DISCOUNT_TYPES.TUESDAY ? [subtotal, allDiscounts] : [subtotal];

    const { rate, amount } = rule.calculate(...calculateParams);
    allDiscounts.push({
      type: discountType,
      name: rule.getName(),
      rate: rate * 100,
      amount,
    });
  });

  return allDiscounts;
}

// 총 할인율 계산
export function calculateTotalDiscountRate(
  itemDiscounts: Array<{ name: string; discountRate: number; discountAmount: number }>,
  totalQuantity: number,
  subtotal: number
): number {
  const allDiscounts = calculateAllDiscounts(itemDiscounts, totalQuantity, subtotal);
  const totalDiscountAmount = allDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

  return subtotal > 0 ? totalDiscountAmount / subtotal : 0;
}

// 할인 정보 생성
export function generateDiscountInfo(
  itemDiscounts: Array<{ name: string; discountRate: number; discountAmount: number }>,
  totalQuantity: number,
  subtotal: number
): DiscountInfo[] {
  return calculateAllDiscounts(itemDiscounts, totalQuantity, subtotal);
}

/**
 * 비즈니스 로직 순수 함수들
 * DOM 조작과 분리하여 테스트 가능성 향상
 * 성능 최적화를 위한 메모이제이션 포함
 */
import {
  BASE_POINTS_RATE,
  BULK_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  CALCULATION_CONSTANTS,
  DAYS_OF_WEEK,
  DISCOUNT_RATES,
  FULL_SET_BONUS_POINTS,
  PRODUCT_ONE,
  PRODUCT_THREE,
  PRODUCT_TWO,
  QUANTITY_BONUS_POINTS,
  SET_BONUS_POINTS,
  TUESDAY_DISCOUNT_RATE,
  TUESDAY_POINTS_MULTIPLIER,
} from "../constants";
import type { CalculationResult, CartItem, Product } from "../types";

// 메모이제이션 캐시
const calculationCache = new Map<string, CalculationResult>();

/**
 * 캐시 키 생성
 */
const generateCacheKey = (cartItems: CartItem[], productList: Product[]): string => {
  const itemsKey = cartItems.map((item) => `${item.id}:${item.quantity}`).join("|");
  const productsKey = productList.map((p) => `${p.id}:${p.q}`).join("|");
  return `${itemsKey}|${productsKey}`;
};

/**
 * 상품 가격 계산
 */
export const calculateProductPrice = (product: Product, quantity: number): number => {
  if (!product || quantity < 0) {
    throw new Error("Invalid product or quantity");
  }
  return product.val * quantity;
};

/**
 * 할인율 계산
 */
export const calculateDiscountRate = (
  product: Product,
  quantity: number,
  discountRates: Record<string, number>,
): number => {
  if (!product || quantity < 0 || !discountRates) {
    return 0;
  }
  return quantity >= 10 && discountRates[product.id] ? discountRates[product.id] : 0;
};

/**
 * 할인된 가격 계산
 */
export const calculateDiscountedPrice = (originalPrice: number, discountRate: number): number =>
  originalPrice * (1 - discountRate);

/**
 * 대량구매 할인 적용
 */
export const applyBulkDiscount = (
  totalAmount: number,
  totalQuantity: number,
  threshold: number,
  discountRate: number,
): { discountedAmount: number; appliedDiscount: number } => {
  const shouldApplyBulkDiscount = totalQuantity >= threshold;

  return {
    discountedAmount: shouldApplyBulkDiscount ? totalAmount * (1 - discountRate) : totalAmount,
    appliedDiscount: shouldApplyBulkDiscount ? discountRate : 0,
  };
};

/**
 * 화요일 할인 적용
 */
export const applyTuesdayDiscount = (
  amount: number,
  discountRate: number,
): { discountedAmount: number; isTuesday: boolean } => {
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;
  const shouldApplyTuesdayDiscount = isTuesday && amount > 0;

  return {
    discountedAmount: shouldApplyTuesdayDiscount ? amount * (1 - discountRate) : amount,
    isTuesday,
  };
};

/**
 * 포인트 계산
 */
export const calculateBasePoints = (
  totalAmount: number,
  baseRate: number = BASE_POINTS_RATE,
  isTuesday: boolean = false,
  tuesdayMultiplier: number = TUESDAY_POINTS_MULTIPLIER,
): number => {
  const basePoints = Math.floor(totalAmount * baseRate);
  return isTuesday ? basePoints * tuesdayMultiplier : basePoints;
};

/**
 * 세트 보너스 포인트 계산
 */
export const calculateSetBonusPoints = (
  cartItems: CartItem[],
  setBonuses: Record<string, number>,
): number => {
  const itemIds = cartItems.map((item) => item.id);

  const checkSetCondition = (requiredProducts: string[]): boolean =>
    requiredProducts.every((productId) => itemIds.includes(productId));

  let totalBonus = 0;

  // 키보드+마우스 세트
  if (checkSetCondition([PRODUCT_ONE, PRODUCT_TWO])) {
    totalBonus += setBonuses["keyboard-mouse"] || SET_BONUS_POINTS;
  }

  // 풀세트 (키보드+마우스+모니터암)
  if (checkSetCondition([PRODUCT_ONE, PRODUCT_TWO, PRODUCT_THREE])) {
    totalBonus += setBonuses["full-set"] || FULL_SET_BONUS_POINTS;
  }

  return totalBonus;
};

/**
 * 수량 보너스 포인트 계산
 */
export const calculateQuantityBonusPoints = (
  totalQuantity: number,
  quantityBonuses: Record<number, number> = QUANTITY_BONUS_POINTS,
): number => {
  let bonus = 0;

  // 높은 수량부터 확인하여 최대 보너스 적용
  const sortedThresholds = Object.keys(quantityBonuses)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of sortedThresholds) {
    if (totalQuantity >= threshold) {
      bonus = quantityBonuses[threshold];
      break;
    }
  }

  return bonus;
};

/**
 * 총 포인트 계산
 */
export const calculateTotalPoints = (
  basePoints: number,
  setBonus: number,
  quantityBonus: number,
): number => basePoints + setBonus + quantityBonus;

/**
 * 장바구니 아이템 정보 추출
 */
export const extractCartItemInfo = (cartItems: CartItem[]) =>
  Array.from(cartItems).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    originalPrice: item.originalPrice,
  }));

/**
 * 상품 재고 업데이트
 */
export const updateProductStock = (
  productList: Product[],
  productId: string,
  quantity: number,
): Product[] => {
  return productList.map((product) =>
    product.id === productId ? { ...product, q: Math.max(0, product.q - quantity) } : product,
  );
};

/**
 * 장바구니 총액 계산
 */
export const calculateCartTotals = (
  cartItems: CartItem[],
  productList: Product[],
  options: {
    discountRates?: Record<string, number>;
    bulkThreshold?: number;
    bulkDiscountRate?: number;
    tuesdayDiscountRate?: number;
  } = {},
): CalculationResult => {
  const {
    discountRates = DISCOUNT_RATES,
    bulkThreshold = BULK_DISCOUNT_THRESHOLD,
    bulkDiscountRate = BULK_DISCOUNT_RATE,
    tuesdayDiscountRate = TUESDAY_DISCOUNT_RATE,
  } = options;

  // 캐시 키 생성
  const cacheKey = generateCacheKey(cartItems, productList);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }

  if (cartItems.length === 0) {
    const emptyResult: CalculationResult = {
      subtotal: 0,
      totalAmount: 0,
      itemCount: 0,
      discountRate: 0,
      itemDiscounts: [],
      isTuesday: false,
      points: {
        base: 0,
        setBonus: 0,
        quantityBonus: 0,
        total: 0,
      },
    };
    calculationCache.set(cacheKey, emptyResult);
    return emptyResult;
  }

  // 각 아이템별 계산
  const itemCalculations = cartItems
    .map((cartItem) => {
      const product = productList.find((p) => p.id === cartItem.id);
      if (!product) return null;

      const quantity = cartItem.quantity;
      const itemTotal = calculateProductPrice(product, quantity);
      const discountRate = calculateDiscountRate(
        product,
        quantity,
        discountRates as Record<string, number>,
      );
      const discountedItemTotal = calculateDiscountedPrice(itemTotal, discountRate);

      return {
        product,
        quantity,
        itemTotal,
        discountRate,
        discountedItemTotal,
      };
    })
    .filter(Boolean);

  // 합계 계산
  const subtotal = itemCalculations.reduce((sum, item) => sum + item!.itemTotal, 0); // 원래 가격 합계
  const totalAfterIndividualDiscounts = itemCalculations.reduce(
    (sum, item) => sum + item!.discountedItemTotal,
    0,
  ); // 개별 할인 적용 후 합계
  const itemCount = itemCalculations.reduce((sum, item) => sum + item!.quantity, 0);

  let currentAmountForOverallDiscounts = subtotal; // 대량구매 할인을 위한 기준 금액

  // 1. 대량구매 할인 적용 (개별 할인보다 우선)
  const isBulkDiscountApplied = itemCount >= bulkThreshold;
  let bulkDiscountAmount = 0;
  if (isBulkDiscountApplied) {
    bulkDiscountAmount = subtotal * bulkDiscountRate;
    currentAmountForOverallDiscounts = subtotal - bulkDiscountAmount;
  } else {
    // 대량구매 할인이 없으면 개별 할인 적용 후 금액을 기준으로 함
    currentAmountForOverallDiscounts = totalAfterIndividualDiscounts;
  }

  // 2. 화요일 할인 적용 (대량구매 또는 개별 할인 후)
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;
  let tuesdayDiscountAmount = 0;
  if (isTuesday && currentAmountForOverallDiscounts > 0) {
    tuesdayDiscountAmount = currentAmountForOverallDiscounts * tuesdayDiscountRate;
    currentAmountForOverallDiscounts -= tuesdayDiscountAmount;
  }

  const finalAmount = currentAmountForOverallDiscounts;

  // 최종 할인율 계산
  const finalDiscountRate = subtotal > 0 ? ((subtotal - finalAmount) / subtotal) * 100 : 0;

  // 포인트 계산
  const basePoints = calculateBasePoints(
    finalAmount,
    BASE_POINTS_RATE,
    isTuesday,
    TUESDAY_POINTS_MULTIPLIER,
  );
  const setBonus = calculateSetBonusPoints(cartItems, {
    "keyboard-mouse": SET_BONUS_POINTS,
    "full-set": FULL_SET_BONUS_POINTS,
  });
  const quantityBonus = calculateQuantityBonusPoints(itemCount, QUANTITY_BONUS_POINTS);
  const totalPoints = calculateTotalPoints(basePoints, setBonus, quantityBonus);

  const result: CalculationResult = {
    subtotal,
    totalAmount: finalAmount,
    itemCount,
    discountRate: finalDiscountRate,
    itemDiscounts: itemCalculations
      .filter((item) => item!.discountRate > 0)
      .map((item) => ({
        productId: item!.product.id,
        discountRate: item!.discountRate,
        savedAmount: item!.itemTotal - item!.discountedItemTotal,
      })),
    isTuesday,
    points: {
      base: basePoints,
      setBonus,
      quantityBonus,
      total: totalPoints,
    },
  };

  calculationCache.set(cacheKey, result);
  return result;
};

/**
 * 포인트 상세 정보 계산
 */
export const calculatePointsDetails = (cartItems: CartItem[], totalAmount: number): string[] => {
  const details: string[] = [];
  const today = new Date();
  const isTuesday = today.getDay() === DAYS_OF_WEEK.TUESDAY;

  // 기본 포인트
  const basePoints = Math.floor(totalAmount * BASE_POINTS_RATE);
  details.push(`기본: ${basePoints}${CALCULATION_CONSTANTS.POINTS_SUFFIX}`);

  // 화요일 배수
  if (isTuesday) {
    details.push("화요일 2배");
  }

  // 세트 보너스
  const itemIds = cartItems.map((item) => item.id);
  const hasKeyboard = itemIds.includes(PRODUCT_ONE);
  const hasMouse = itemIds.includes(PRODUCT_TWO);
  const hasMonitorArm = itemIds.includes(PRODUCT_THREE);

  if (hasKeyboard && hasMouse) {
    details.push("키보드+마우스 세트");
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    details.push("풀세트 구매");
  }

  // 수량 보너스
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity >= 30) {
    details.push("대량구매(30개+)");
  } else if (totalQuantity >= 20) {
    details.push("대량구매(20개+)");
  } else if (totalQuantity >= 10) {
    details.push("대량구매(10개+)");
  }

  return details;
};

/**
 * 계산 캐시 클리어
 */
export const clearCalculationCache = (cacheKey?: string): void => {
  if (cacheKey) {
    calculationCache.delete(cacheKey);
  } else {
    calculationCache.clear();
  }
};

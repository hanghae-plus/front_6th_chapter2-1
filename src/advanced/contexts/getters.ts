import {
  BULK_DISCOUNT_THRESHOLD,
  BULK_POINTS_THRESHOLDS,
  DISCOUNT_RATES,
  LOW_STOCK_THRESHOLD,
  POINTS,
  PRODUCT_IDS,
} from '../constant';
import { CartDetail, DiscountDetail, State } from '../types';

export const getIsTuesday = () => new Date().getDay() === 2;

export const getProducts = (state: State) => state.products;
export const getCartList = (state: State) => state.cartList;
export const getNotifications = (state: State) => state.notifications;

export const getLowStockProducts = (state: State) => {
  const products = getProducts(state);
  return products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD);
};

export const getCartDetails = (state: State) => {
  const products = getProducts(state);
  const cartList = getCartList(state);
  return cartList.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    return {
      ...cartItem,
      product,
      itemTotal: (product?.price ?? 0) * cartItem.quantity,
    };
  });
};

export const getTotalQuantity = (state: State) => {
  const cartDetails = getCartDetails(state);
  return cartDetails.reduce((sum, item) => sum + item.quantity, 0);
};

export const getSubtotal = (state: State) => {
  const cartDetails = getCartDetails(state);
  return cartDetails.reduce((sum, item) => sum + item.itemTotal, 0);
};

const calculateIndividualDiscounts = (
  cartDetails: CartDetail[],
): {
  total: number;
  details: DiscountDetail[];
} => {
  const details: DiscountDetail[] = [];
  const total = cartDetails.reduce((acc, item) => {
    let itemDiscountRate = 0;
    const individualDiscount = DISCOUNT_RATES.INDIVIDUAL[item.productId];
    if (item.quantity >= 10 && individualDiscount) {
      itemDiscountRate = individualDiscount;
      details.push({
        reason: `${item.product?.name} (10개↑)`,
        amount: `${itemDiscountRate * 100}%`,
      });
    }
    return acc + item.itemTotal * (1 - itemDiscountRate);
  }, 0);
  return { total, details };
};

export const getDiscountResult = (state: State) => {
  const subtotal = getSubtotal(state);
  const totalQuantity = getTotalQuantity(state);
  const isTuesday = getIsTuesday();

  const baseDiscountRules = [
    {
      condition: totalQuantity >= BULK_DISCOUNT_THRESHOLD,
      apply: () => ({
        total: subtotal * (1 - DISCOUNT_RATES.BULK),
        details: [{ reason: '🎉 대량구매 할인 (30개 이상)', amount: '25%' }],
      }),
    },
    {
      condition: true,
      apply: () => calculateIndividualDiscounts(getCartDetails(state)),
    },
  ];

  const baseDiscount = baseDiscountRules.find((rule) => rule.condition)?.apply();

  const finalDiscountRules = [
    {
      condition: isTuesday,
      apply: (currentTotal: number) => currentTotal * (1 - DISCOUNT_RATES.TUESDAY),
      detail: { reason: '🌟 화요일 추가 할인', amount: '10%' },
    },
  ];

  if (!baseDiscount) {
    return { finalTotal: subtotal, discounts: [] };
  }

  const finalTotal = finalDiscountRules
    .filter((rule) => rule.condition && baseDiscount.total > 0)
    .reduce((total, rule) => rule.apply(total), baseDiscount.total);

  const finalDiscounts = [
    ...baseDiscount.details,
    ...finalDiscountRules
      .filter((rule) => rule.condition && baseDiscount.total > 0)
      .map((rule) => rule.detail),
  ];

  return { finalTotal, discounts: finalDiscounts };
};

export const getBonusPoints = (state: State) => {
  const isTuesday = getIsTuesday();
  const totalQuantity = getTotalQuantity(state);
  if (totalQuantity === 0) return { bonusPoints: 0, pointsDetail: [] };

  const { finalTotal } = getDiscountResult(state);
  const basePoints = Math.floor(finalTotal / 1000);

  const has = (productId: string) =>
    getCartList(state).some((item) => item.productId === productId);
  const hasKeyboard = has(PRODUCT_IDS.P1);
  const hasMouse = has(PRODUCT_IDS.P2);
  const hasMonitorArm = has(PRODUCT_IDS.P3);

  const cumulativeRules = [
    {
      condition: isTuesday && basePoints > 0,
      points: basePoints,
      detail: '화요일 2배',
    },
    {
      condition: hasKeyboard && hasMouse,
      points: POINTS.COMBO_KEYBOARD_MOUSE,
      detail: `키보드+마우스 세트 +${POINTS.COMBO_KEYBOARD_MOUSE}p`,
    },
    {
      condition: hasKeyboard && hasMouse && hasMonitorArm,
      points: POINTS.FULL_SET,
      detail: `풀세트 구매 +${POINTS.FULL_SET}p`,
    },
  ];

  const exclusiveRules = [
    {
      condition: totalQuantity >= BULK_POINTS_THRESHOLDS.LEVEL_3,
      points: POINTS.BULK_L3,
      detail: `대량구매(${BULK_POINTS_THRESHOLDS.LEVEL_3}개+) +${POINTS.BULK_L3}p`,
    },
    {
      condition: totalQuantity >= BULK_POINTS_THRESHOLDS.LEVEL_2,
      points: POINTS.BULK_L2,
      detail: `대량구매(${BULK_POINTS_THRESHOLDS.LEVEL_2}개+) +${POINTS.BULK_L2}p`,
    },
    {
      condition: totalQuantity >= BULK_POINTS_THRESHOLDS.LEVEL_1,
      points: POINTS.BULK_L1,
      detail: `대량구매(${BULK_POINTS_THRESHOLDS.LEVEL_1}개+) +${POINTS.BULK_L1}p`,
    },
  ];

  const activeCumulativeBonuses = cumulativeRules.filter((rule) => rule.condition);
  const activeExclusiveBonus = exclusiveRules.find((rule) => rule.condition);

  const allActiveBonuses = [
    ...activeCumulativeBonuses,
    ...(activeExclusiveBonus ? [activeExclusiveBonus] : []),
  ];

  const totalBonusPoints = allActiveBonuses.reduce((sum, rule) => sum + rule.points, basePoints);

  const pointsDetail = [
    ...(basePoints > 0 ? [`기본: ${basePoints}p`] : []),
    ...allActiveBonuses.map((rule) => rule.detail),
  ];

  return { bonusPoints: totalBonusPoints, pointsDetail };
};

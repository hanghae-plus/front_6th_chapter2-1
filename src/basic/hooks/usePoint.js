import {
  POINT_BONUS_FULL_SET,
  POINT_BONUS_KEYBOARD_MOUSE_SET,
  POINT_BONUS_QUANTITY_TIER1,
  POINT_BONUS_QUANTITY_TIER2,
  POINT_BONUS_QUANTITY_TIER3,
  POINT_MULTIPLIER_TUESDAY,
} from '../data/point.data.js';
import { PRODUCT_1, PRODUCT_2, PRODUCT_3 } from '../data/product.data.js';
import {
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from '../data/quantity.data.js';
import { getCartItemsArray } from '../utils/cart.util.js';
import { calculateBasePoints } from '../utils/point.util.js';
import { useDiscount } from './useDiscount.js';
import { useOrderSummary } from './useOrderSummary.js';

/**
 * 포인트 계산 관련 비즈니스 로직을 관리하는 hook
 */
export const usePoint = cartItemsContainer => {
  if (!cartItemsContainer || cartItemsContainer.children.length === 0) {
    return {
      totalPoint: 0,
      applicablePolicies: [],
      defaultPoint: 0,
      pointsDetail: [],
      shouldShowPoints: false,
    };
  }

  const { totalPrice } = useOrderSummary(cartItemsContainer);
  const { isTuesday, totalQuantity } = useDiscount(cartItemsContainer);

  // 기본 포인트 계산 (0.1%)
  const defaultPoint = calculateBasePoints(totalPrice);

  // 상품 세트 확인 (공통 함수 사용)
  const checkProductSet = () => {
    const cartItems = getCartItemsArray(cartItemsContainer);
    const productIds = cartItems.map(item => item.id);

    return {
      hasKeyboard: productIds.includes(PRODUCT_1),
      hasMouse: productIds.includes(PRODUCT_2),
      hasMonitorArm: productIds.includes(PRODUCT_3),
    };
  };

  const { hasKeyboard, hasMouse, hasMonitorArm } = checkProductSet();

  // 보너스 포인트 계산
  const calculateBonusPoints = () => {
    let bonusPoints = 0;
    const bonusDetails = [];

    // 세트 보너스
    if (hasKeyboard && hasMouse) {
      bonusPoints += POINT_BONUS_KEYBOARD_MOUSE_SET;
      bonusDetails.push(`키보드+마우스 세트 +${POINT_BONUS_KEYBOARD_MOUSE_SET}p`);
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      bonusPoints += POINT_BONUS_FULL_SET;
      bonusDetails.push(`풀세트 구매 +${POINT_BONUS_FULL_SET}p`);
    }

    // 수량별 보너스
    const quantityBonusTiers = [
      { threshold: MIN_QUANTITY_FOR_POINT_BONUS_TIER3, bonus: POINT_BONUS_QUANTITY_TIER3 },
      { threshold: MIN_QUANTITY_FOR_POINT_BONUS_TIER2, bonus: POINT_BONUS_QUANTITY_TIER2 },
      { threshold: MIN_QUANTITY_FOR_POINT_BONUS_TIER1, bonus: POINT_BONUS_QUANTITY_TIER1 },
    ];

    const applicableTier = quantityBonusTiers.find(tier => totalQuantity >= tier.threshold);
    if (applicableTier) {
      bonusPoints += applicableTier.bonus;
      bonusDetails.push(`대량구매(${applicableTier.threshold}개+) +${applicableTier.bonus}p`);
    }

    return { bonusPoints, bonusDetails };
  };

  const { bonusPoints, bonusDetails } = calculateBonusPoints();

  // 최종 포인트 계산
  let finalPoints = defaultPoint;
  const pointsDetail = [];

  if (defaultPoint > 0) {
    pointsDetail.push(`기본: ${defaultPoint}p`);
  }

  // 화요일 포인트 배수 적용
  if (isTuesday && defaultPoint > 0) {
    finalPoints = defaultPoint * POINT_MULTIPLIER_TUESDAY;
    pointsDetail.push('화요일 2배');
  }

  // 보너스 포인트 추가
  finalPoints += bonusPoints;
  pointsDetail.push(...bonusDetails);

  // 적용 가능한 정책들
  const applicablePolicies = [];

  if (isTuesday) {
    applicablePolicies.push('TUESDAY');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    applicablePolicies.push('FULL_SET');
  } else if (hasKeyboard && hasMouse) {
    applicablePolicies.push('KEYBOARD_SET');
  }

  if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    applicablePolicies.push('BULK_BONUS_30');
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
    applicablePolicies.push('BULK_BONUS_20');
  } else if (totalQuantity >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
    applicablePolicies.push('BULK_BONUS_10');
  }

  return {
    totalPoint: finalPoints,
    applicablePolicies,
    defaultPoint,
    pointsDetail,
    shouldShowPoints: true,
  };
};

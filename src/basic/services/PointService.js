import { POINT_POLICIES, PRODUCT_IDS } from "../constants.js";

export class PointService {
  // 기본 포인트 계산
  static calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount * POINT_POLICIES.BASE_RATE);
  }

  // 화요일 포인트 배수 적용
  static applyTuesdayMultiplier(basePoints) {
    const today = new Date();
    const isTuesday = today.getDay() === 2;
    return isTuesday
      ? basePoints * POINT_POLICIES.TUESDAY.POINT_MULTIPLIER
      : basePoints;
  }

  // 세트 구매 보너스 포인트 계산
  static calculateSetBonus(cartItems) {
    let bonus = 0;
    const productIds = cartItems.map((item) => item.productId);

    // 키보드 + 마우스 세트
    if (
      productIds.includes(PRODUCT_IDS.KEYBOARD) &&
      productIds.includes(PRODUCT_IDS.MOUSE)
    ) {
      bonus += POINT_POLICIES.BONUS.KEYBOARD_MOUSE_SET;
    }

    // 풀세트 (키보드 + 마우스 + 모니터암)
    if (
      productIds.includes(PRODUCT_IDS.KEYBOARD) &&
      productIds.includes(PRODUCT_IDS.MOUSE) &&
      productIds.includes(PRODUCT_IDS.MONITOR_ARM)
    ) {
      bonus += POINT_POLICIES.BONUS.FULL_SET;
    }

    return bonus;
  }

  // 수량 보너스 포인트 계산
  static calculateQuantityBonus(totalQuantity) {
    if (totalQuantity >= 30) {
      return POINT_POLICIES.BONUS.QUANTITY_30;
    } else if (totalQuantity >= 20) {
      return POINT_POLICIES.BONUS.QUANTITY_20;
    } else if (totalQuantity >= 10) {
      return POINT_POLICIES.BONUS.QUANTITY_10;
    }
    return 0;
  }

  // 총 포인트 계산
  static calculateTotalPoints(totalAmount, cartItems, totalQuantity) {
    let totalPoints = 0;

    // 기본 포인트
    const basePoints = this.calculateBasePoints(totalAmount);
    if (basePoints > 0) {
      totalPoints = this.applyTuesdayMultiplier(basePoints);
    }

    // 세트 보너스
    totalPoints += this.calculateSetBonus(cartItems);

    // 수량 보너스
    totalPoints += this.calculateQuantityBonus(totalQuantity);

    return totalPoints;
  }

  // 포인트 상세 정보 생성
  static getPointDetails(totalAmount, cartItems, totalQuantity) {
    const details = [];

    const basePoints = this.calculateBasePoints(totalAmount);
    if (basePoints > 0) {
      details.push(`기본: ${basePoints}p`);

      const today = new Date();
      const isTuesday = today.getDay() === 2;
      if (isTuesday) {
        details.push("화요일 2배");
      }
    }

    const setBonus = this.calculateSetBonus(cartItems);
    if (setBonus > 0) {
      const productIds = cartItems.map((item) => item.productId);
      if (
        productIds.includes(PRODUCT_IDS.KEYBOARD) &&
        productIds.includes(PRODUCT_IDS.MOUSE)
      ) {
        details.push("키보드+마우스 세트 +50p");
      }
      if (
        productIds.includes(PRODUCT_IDS.KEYBOARD) &&
        productIds.includes(PRODUCT_IDS.MOUSE) &&
        productIds.includes(PRODUCT_IDS.MONITOR_ARM)
      ) {
        details.push("풀세트 구매 +100p");
      }
    }

    const quantityBonus = this.calculateQuantityBonus(totalQuantity);
    if (quantityBonus > 0) {
      if (totalQuantity >= 30) {
        details.push("대량구매(30개+) +100p");
      } else if (totalQuantity >= 20) {
        details.push("대량구매(20개+) +50p");
      } else if (totalQuantity >= 10) {
        details.push("대량구매(10개+) +20p");
      }
    }

    return details;
  }
}

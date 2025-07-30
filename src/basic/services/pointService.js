import { POINTS, POINTS_QUANTITY_THRESHOLDS, QUANTITY_BONUS_POINTS, PRODUCT_IDS } from "../constants/index.js";

export class PointService {
  constructor() {
    // 순수 계산 로직만 담당하는 서비스
  }

  /**
   * 포인트를 계산합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템들
   * @param {number} totalAmount - 총 구매액
   * @param {boolean} isTuesday - 화요일 여부
   * @param {number} itemCount - 총 아이템 개수
   * @returns {Object} 포인트 계산 결과
   */
  calculatePoints(cartItems, totalAmount, isTuesday, itemCount) {
    if (cartItems.length === 0) {
      return { totalPoints: 0, details: [] };
    }

    const basePoints = Math.floor(totalAmount / POINTS.BASE_RATE);
    let finalPoints = 0;
    const pointsDetail = [];

    if (basePoints > 0) {
      finalPoints = basePoints;
      pointsDetail.push(`기본: ${basePoints}p`);
    }

    // 화요일 2배
    if (isTuesday && basePoints > 0) {
      finalPoints = basePoints * POINTS.TUESDAY_MULTIPLIER;
      pointsDetail.push("화요일 2배");
    }

    // 세트 구매 보너스
    const hasKeyboard = cartItems.some(item => item.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some(item => item.id === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some(item => item.id === PRODUCT_IDS.MONITOR_ARM);

    if (hasKeyboard && hasMouse) {
      finalPoints += POINTS.KEYBOARD_MOUSE_SET;
      pointsDetail.push("키보드+마우스 세트 +50p");
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      finalPoints += POINTS.FULL_SET;
      pointsDetail.push("풀세트 구매 +100p");
    }

    // 수량 보너스
    if (itemCount >= POINTS_QUANTITY_THRESHOLDS.LARGE_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.LARGE_BULK;
      pointsDetail.push("대량구매(30개+) +100p");
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.MEDIUM_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.MEDIUM_BULK;
      pointsDetail.push("대량구매(20개+) +50p");
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.SMALL_BULK) {
      finalPoints += QUANTITY_BONUS_POINTS.SMALL_BULK;
      pointsDetail.push("대량구매(10개+) +20p");
    }

    return { totalPoints: finalPoints, details: pointsDetail };
  }

  /**
   * 기본 포인트를 계산합니다.
   *
   * @param {number} totalAmount - 총 구매액
   * @returns {number} 기본 포인트
   */
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount / POINTS.BASE_RATE);
  }

  /**
   * 화요일 보너스 포인트를 계산합니다.
   *
   * @param {number} basePoints - 기본 포인트
   * @param {boolean} isTuesday - 화요일 여부
   * @returns {number} 화요일 보너스 포인트
   */
  calculateTuesdayBonus(basePoints, isTuesday) {
    if (isTuesday && basePoints > 0) {
      return basePoints * (POINTS.TUESDAY_MULTIPLIER - 1);
    }
    return 0;
  }

  /**
   * 세트 구매 보너스 포인트를 계산합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템들
   * @returns {number} 세트 구매 보너스 포인트
   */
  calculateSetBonus(cartItems) {
    const hasKeyboard = cartItems.some(item => item.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some(item => item.id === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some(item => item.id === PRODUCT_IDS.MONITOR_ARM);

    let bonus = 0;
    if (hasKeyboard && hasMouse) {
      bonus += POINTS.KEYBOARD_MOUSE_SET;
    }
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      bonus += POINTS.FULL_SET;
    }
    return bonus;
  }

  /**
   * 수량 보너스 포인트를 계산합니다.
   *
   * @param {number} itemCount - 총 아이템 개수
   * @returns {number} 수량 보너스 포인트
   */
  calculateQuantityBonus(itemCount) {
    if (itemCount >= POINTS_QUANTITY_THRESHOLDS.LARGE_BULK) {
      return QUANTITY_BONUS_POINTS.LARGE_BULK;
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.MEDIUM_BULK) {
      return QUANTITY_BONUS_POINTS.MEDIUM_BULK;
    } else if (itemCount >= POINTS_QUANTITY_THRESHOLDS.SMALL_BULK) {
      return QUANTITY_BONUS_POINTS.SMALL_BULK;
    }
    return 0;
  }
}

export const pointService = new PointService();

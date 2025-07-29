import {
  POINT_RATES,
  POINT_BONUS,
  POINT_CONDITIONS,
  PRODUCT_IDS,
} from '../../constants/PointConstants.js';
import { isTuesday } from '../../utils/DateUtils.js';

/**
 * 포인트 계산기
 */
export class PointCalculator {
  /**
   * 기본 포인트 계산
   * @param {number} totalAmount - 총 구매액
   * @returns {number} 기본 포인트
   */
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount * POINT_RATES.BASE_RATE);
  }

  /**
   * 화요일 2배 포인트 적용
   * @param {number} basePoints - 기본 포인트
   * @returns {number} 화요일 적용 포인트
   */
  calculateTuesdayBonus(basePoints) {
    return isTuesday() ? basePoints * POINT_RATES.TUESDAY_MULTIPLIER : basePoints;
  }

  /**
   * 세트 보너스 포인트 계산
   * @param {Array} cartItems - 장바구니 아이템 목록
   * @returns {number} 세트 보너스 포인트
   */
  calculateSetBonus(cartItems) {
    const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_IDS.KEYBOARD);
    const hasMouse = cartItems.some((item) => item.id === PRODUCT_IDS.MOUSE);
    const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_IDS.MONITOR_ARM);

    let bonus = 0;

    // 키보드+마우스 세트 보너스
    if (hasKeyboard && hasMouse) {
      bonus += POINT_BONUS.SET_BONUS;
    }

    // 풀세트 보너스 (키보드+마우스+모니터암)
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      bonus += POINT_BONUS.FULL_SET_BONUS;
    }

    return bonus;
  }

  /**
   * 수량 보너스 포인트 계산
   * @param {number} totalQuantity - 총 수량
   * @returns {number} 수량 보너스 포인트
   */
  calculateQuantityBonus(totalQuantity) {
    if (totalQuantity >= 30) {
      return POINT_BONUS.QUANTITY_BONUS_30;
    } else if (totalQuantity >= 20) {
      return POINT_BONUS.QUANTITY_BONUS_20;
    } else if (totalQuantity >= POINT_CONDITIONS.MIN_QUANTITY_FOR_BONUS) {
      return POINT_BONUS.QUANTITY_BONUS_10;
    }
    return 0;
  }

  /**
   * 총 포인트 계산
   * @param {number} totalAmount - 총 구매액
   * @param {Array} cartItems - 장바구니 아이템 목록
   * @returns {Object} 포인트 정보
   */
  calculateTotalPoints(totalAmount, cartItems) {
    const basePoints = this.calculateBasePoints(totalAmount);
    const tuesdayPoints = this.calculateTuesdayBonus(basePoints);
    const setBonus = this.calculateSetBonus(cartItems);
    const quantityBonus = this.calculateQuantityBonus(cartItems.length);

    const totalPoints = tuesdayPoints + setBonus + quantityBonus;

    return {
      basePoints,
      tuesdayPoints,
      setBonus,
      quantityBonus,
      totalPoints,
      isTuesday: isTuesday(),
    };
  }

  /**
   * 포인트 상세 내역 생성
   * @param {Object} pointInfo - 포인트 정보
   * @returns {Array} 포인트 상세 내역
   */
  generatePointDetails(pointInfo) {
    const details = [];

    if (pointInfo.basePoints > 0) {
      details.push(`기본: ${pointInfo.basePoints}p`);
    }

    if (pointInfo.isTuesday && pointInfo.basePoints > 0) {
      details.push('화요일 2배');
    }

    if (pointInfo.setBonus > 0) {
      if (pointInfo.setBonus >= POINT_BONUS.FULL_SET_BONUS) {
        details.push('풀세트 구매 +100p');
      } else {
        details.push('키보드+마우스 세트 +50p');
      }
    }

    if (pointInfo.quantityBonus > 0) {
      if (pointInfo.quantityBonus >= POINT_BONUS.QUANTITY_BONUS_30) {
        details.push('대량구매(30개+) +100p');
      } else if (pointInfo.quantityBonus >= POINT_BONUS.QUANTITY_BONUS_20) {
        details.push('대량구매(20개+) +50p');
      } else {
        details.push('대량구매(10개+) +20p');
      }
    }

    return details;
  }
}

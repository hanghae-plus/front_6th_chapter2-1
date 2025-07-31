import { POINTS, POINTS_QUANTITY_THRESHOLDS, QUANTITY_BONUS_POINTS, PRODUCT_IDS } from "../constants/index.js";

/**
 * 포인트 계산 관련 비즈니스 로직을 처리하는 서비스 클래스
 *
 * 주문에 따른 포인트 적립을 계산하는 기능을 제공합니다.
 * 기본 포인트, 화요일 보너스, 세트 구매 보너스, 수량 보너스 등을 계산합니다.
 *
 * 포인트 계산 규칙:
 * - 기본: 구매액의 0.1% (1000원당 1포인트)
 * - 화요일: 기본 포인트 2배
 * - 키보드+마우스 세트: +50포인트
 * - 풀세트(키보드+마우스+모니터암): +100포인트
 * - 수량 보너스: 10개+ 20p, 20개+ 50p, 30개+ 100p
 */
export class PointService {
  /**
   * PointService 인스턴스를 생성합니다.
   *
   * 순수 계산 로직만 담당하는 서비스로, 외부 의존성이 없습니다.
   */
  constructor() {
    // 순수 계산 로직만 담당하는 서비스
  }

  /**
   * 포인트를 계산합니다.
   *
   * 장바구니 아이템, 총 구매액, 화요일 여부, 아이템 개수를 기반으로
   * 모든 포인트 적립 규칙을 적용하여 총 적립 포인트를 계산합니다.
   *
   * @param {Array} cartItems - 장바구니 아이템들
   * @param {number} totalAmount - 총 구매액
   * @param {boolean} isTuesday - 화요일 여부
   * @param {number} itemCount - 총 아이템 개수
   * @returns {Object} 포인트 계산 결과
   * @returns {number} returns.totalPoints - 총 적립 포인트
   * @returns {Array} returns.details - 포인트 적립 상세 내역 (문자열 배열)
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
   * 총 구매액을 기반으로 기본 적립 포인트를 계산합니다.
   * 구매액의 0.1%를 적립하되, 소수점은 버림합니다.
   *
   * @param {number} totalAmount - 총 구매액
   * @returns {number} 기본 포인트 (소수점 버림)
   */
  calculateBasePoints(totalAmount) {
    return Math.floor(totalAmount / POINTS.BASE_RATE);
  }

  /**
   * 화요일 보너스 포인트를 계산합니다.
   *
   * 화요일인 경우 기본 포인트에 추가로 동일한 포인트를 보너스로 제공합니다.
   * 화요일이 아니거나 기본 포인트가 0인 경우 0을 반환합니다.
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
   * 장바구니에 포함된 상품 조합에 따라 세트 구매 보너스를 계산합니다.
   * 키보드+마우스 세트: +50포인트
   * 풀세트(키보드+마우스+모니터암): +100포인트 (기존 세트 보너스 포함)
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
   * 총 아이템 개수에 따라 수량 보너스 포인트를 계산합니다.
   * 10개 이상: +20포인트
   * 20개 이상: +50포인트
   * 30개 이상: +100포인트
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

/**
 * PointService의 싱글톤 인스턴스
 *
 * 애플리케이션 전체에서 공통으로 사용할 수 있는 PointService 인스턴스입니다.
 * 순수 계산 로직만 담당하므로 상태가 없어 안전하게 공유할 수 있습니다.
 *
 * @type {PointService}
 */
export const pointService = new PointService();

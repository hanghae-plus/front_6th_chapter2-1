/**
 * @fileoverview 포인트 계산 시스템
 * 장바구니의 모든 포인트 계산 로직을 담당하는 순수 함수 모듈
 *
 * 기존 doRenderBonusPoints 함수의 계산 로직을 분리하여
 * 테스트 가능하고 재사용 가능한 순수 함수로 구현
 */

import {
  BONUS_POINTS,
  calculateBasePoints as calculateBasePts,
  calculateBulkBonus,
  calculateTuesdayPoints as calculateTuesdayPts,
  POINTS_RATES
} from '../constants/PointsPolicies.js';

/**
 * @typedef {Object} CartItem
 * @property {string} id - 상품 ID
 * @property {number} quantity - 수량
 * @property {number} price - 가격
 * @property {Object} product - 상품 정보
 */

/**
 * @typedef {Object} PointsContext
 * @property {Date} date - 계산 기준 날짜
 * @property {string} [userTier] - 사용자 등급 (향후 확장용)
 * @property {Array} [specialEvents] - 특별 이벤트 (향후 확장용)
 */

/**
 * @typedef {Object} BasePointsResult
 * @property {number} points - 기본 포인트
 * @property {number} rate - 포인트 적립률 (1000원당 1포인트)
 * @property {string} calculation - 계산 과정
 */

/**
 * @typedef {Object} TuesdayPointsResult
 * @property {number} points - 화요일 적용 후 포인트
 * @property {number} multiplier - 배수 (화요일: 2, 평일: 1)
 * @property {boolean} isTuesday - 화요일 여부
 * @property {string} calculation - 계산 과정
 */

/**
 * @typedef {Object} SetBonusResult
 * @property {number} points - 세트 보너스 포인트
 * @property {Array<Object>} details - 세트별 상세 내역
 * @property {string} calculation - 계산 과정
 */

/**
 * @typedef {Object} QuantityBonusResult
 * @property {number} points - 수량 보너스 포인트
 * @property {string} threshold - 적용 기준
 * @property {string} calculation - 계산 과정
 */

/**
 * @typedef {Object} BonusPointsResult
 * @property {number} total - 총 보너스 포인트
 * @property {SetBonusResult} setBonus - 세트 보너스
 * @property {QuantityBonusResult} quantityBonus - 수량 보너스
 */

/**
 * @typedef {Object} TotalPointsResult
 * @property {number} total - 총 포인트
 * @property {Object} breakdown - 상세 내역
 * @property {BasePointsResult} breakdown.base - 기본 포인트
 * @property {TuesdayPointsResult} breakdown.tuesday - 화요일 보너스
 * @property {SetBonusResult} breakdown.setBonus - 세트 보너스
 * @property {QuantityBonusResult} breakdown.quantityBonus - 수량 보너스
 * @property {Array<string>} messages - 표시용 메시지 목록
 */

// 포인트 타입 상수
export const POINTS_TYPES = {
  BASE: 'base',
  TUESDAY: 'tuesday',
  SET_BONUS: 'set_bonus',
  QUANTITY_BONUS: 'quantity_bonus'
};

/**
 * 포인트 계산 시스템 클래스
 * 모든 포인트 계산 로직을 순수 함수로 제공합니다.
 */
export class PointsCalculator {
  /**
   * 통합 포인트 계산 엔진
   * @param {Array<CartItem>} cart - 장바구니 아이템들
   * @param {number} finalAmount - 최종 결제 금액
   * @param {PointsContext} context - 계산 컨텍스트
   * @returns {TotalPointsResult} 총 포인트 계산 결과
   */
  static getTotalPoints(cart, finalAmount, context = {}) {
    const { date = new Date() } = context;

    // 1. 기본 포인트 계산
    const baseResult = this.calculateBasePoints(finalAmount);

    // 2. 화요일 포인트 배수 적용
    const tuesdayResult = this.calculateTuesdayMultiplier(
      baseResult.points,
      date
    );

    // 3. 보너스 포인트 계산
    const bonusResult = this.calculateBonusPoints(cart, context);

    // 4. 총 포인트 합산
    const total = tuesdayResult.points + bonusResult.total;

    // 5. 표시용 메시지 생성
    const messages = [];

    if (baseResult.points > 0) {
      if (tuesdayResult.isTuesday) {
        messages.push(`기본: ${baseResult.points}p`);
        messages.push('화요일 2배');
      } else {
        messages.push(`기본: ${baseResult.points}p`);
      }
    }

    // 세트 보너스 메시지 추가
    if (bonusResult.setBonus.points > 0) {
      bonusResult.setBonus.details.forEach(detail => {
        if (detail.type === 'keyboard_mouse') {
          messages.push('키보드+마우스 세트 +50p');
        } else if (detail.type === 'full_set') {
          messages.push('풀세트 구매 +100p');
        }
      });
    }

    // 수량 보너스 메시지 추가
    if (bonusResult.quantityBonus.points > 0) {
      const quantityMsg =
        bonusResult.quantityBonus.calculation.split(' → ')[1] ||
        bonusResult.quantityBonus.calculation;
      messages.push(quantityMsg);
    }

    return {
      total,
      breakdown: {
        base: baseResult,
        tuesday: tuesdayResult,
        setBonus: bonusResult.setBonus,
        quantityBonus: bonusResult.quantityBonus
      },
      messages
    };
  }

  /**
   * 기본 포인트 계산
   * @param {number} finalAmount - 최종 결제 금액
   * @returns {BasePointsResult} 기본 포인트 계산 결과
   */
  static calculateBasePoints(finalAmount) {
    if (!finalAmount || finalAmount <= 0) {
      return {
        points: 0,
        rate: POINTS_RATES.BASE_RATE,
        calculation: '결제 금액이 없습니다'
      };
    }

    const points = calculateBasePts(finalAmount);

    return {
      points,
      rate: POINTS_RATES.BASE_RATE,
      calculation: `₩${finalAmount.toLocaleString()} × ${(POINTS_RATES.BASE_RATE * 100).toFixed(1)}% = ${points}p`
    };
  }

  /**
   * 화요일 포인트 배수 계산
   * @param {number} basePoints - 기본 포인트
   * @param {Date} date - 계산 기준 날짜
   * @returns {TuesdayPointsResult} 화요일 포인트 계산 결과
   */
  static calculateTuesdayMultiplier(basePoints, date = new Date()) {
    if (!basePoints || basePoints <= 0) {
      return {
        points: 0,
        multiplier: 1,
        isTuesday: false,
        calculation: '기본 포인트가 없습니다'
      };
    }

    const isTuesday = date.getDay() === 2;
    const multiplier = isTuesday ? POINTS_RATES.TUESDAY_MULTIPLIER : 1;
    const points = calculateTuesdayPts(basePoints, date);

    const calculation = isTuesday
      ? `화요일 2배: ${basePoints}p → ${points}p`
      : `평일: ${basePoints}p (변동 없음)`;

    return {
      points,
      multiplier,
      isTuesday,
      calculation
    };
  }

  /**
   * 세트 구매 보너스 계산
   * @param {Array<CartItem>} cartItems - 장바구니 아이템들
   * @returns {SetBonusResult} 세트 보너스 계산 결과
   */
  static calculateSetBonus(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      return {
        points: 0,
        details: [],
        calculation: '장바구니가 비어있습니다'
      };
    }

    // 제품별 존재 여부 확인
    const hasKeyboard = cartItems.some(
      item => item.id === 'p1' && item.quantity > 0
    );
    const hasMouse = cartItems.some(
      item => item.id === 'p2' && item.quantity > 0
    );
    const hasMonitorArm = cartItems.some(
      item => item.id === 'p3' && item.quantity > 0
    );

    let totalPoints = 0;
    const details = [];
    const calculations = [];

    // 기존 중복 적용 로직 보존 (키보드+마우스 세트)
    if (hasKeyboard && hasMouse) {
      const keyboardMouseBonus = BONUS_POINTS.KEYBOARD_MOUSE_SET.points;
      totalPoints += keyboardMouseBonus;
      details.push({
        type: 'keyboard_mouse',
        points: keyboardMouseBonus,
        description: BONUS_POINTS.KEYBOARD_MOUSE_SET.description
      });
      calculations.push(`키보드+마우스 세트: +${keyboardMouseBonus}p`);
    }

    // 기존 중복 적용 로직 보존 (풀세트)
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      const fullSetBonus = BONUS_POINTS.FULL_SET.points;
      totalPoints += fullSetBonus;
      details.push({
        type: 'full_set',
        points: fullSetBonus,
        description: BONUS_POINTS.FULL_SET.description
      });
      calculations.push(`풀세트 구매: +${fullSetBonus}p`);
    }

    return {
      points: totalPoints,
      details,
      calculation:
        calculations.length > 0
          ? calculations.join(', ')
          : '적용 가능한 세트 보너스가 없습니다'
    };
  }

  /**
   * 수량 보너스 계산
   * @param {number} totalQuantity - 총 구매 수량
   * @returns {QuantityBonusResult} 수량 보너스 계산 결과
   */
  static calculateQuantityBonus(totalQuantity) {
    if (!totalQuantity || totalQuantity <= 0) {
      return {
        points: 0,
        threshold: '',
        calculation: '구매 수량이 없습니다'
      };
    }

    // PointsPolicies.js의 calculateBulkBonus 활용
    const bulkBonus = calculateBulkBonus(totalQuantity);

    if (bulkBonus.points > 0) {
      return {
        points: bulkBonus.points,
        threshold:
          bulkBonus.description.match(/\((\d+개\+)\)/)?.[1] ||
          bulkBonus.threshold,
        calculation: `${totalQuantity}개 구매 → ${bulkBonus.description}`
      };
    }

    return {
      points: 0,
      threshold: '10개 미만',
      calculation: `${totalQuantity}개 구매 (대량구매 보너스 미적용)`
    };
  }

  /**
   * 보너스 포인트 통합 계산
   * @param {Array<CartItem>} cart - 장바구니 아이템들
   * @param {PointsContext} context - 계산 컨텍스트
   * @returns {BonusPointsResult} 보너스 포인트 계산 결과
   */
  static calculateBonusPoints(cart, context = {}) {
    if (!cart || cart.length === 0) {
      return {
        total: 0,
        setBonus: {
          points: 0,
          details: [],
          calculation: '장바구니가 비어있습니다'
        },
        quantityBonus: {
          points: 0,
          threshold: '',
          calculation: '장바구니가 비어있습니다'
        }
      };
    }

    // 세트 보너스 계산
    const setBonus = this.calculateSetBonus(cart);

    // 총 수량 계산
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    // 수량 보너스 계산
    const quantityBonus = this.calculateQuantityBonus(totalQuantity);

    // 총 보너스 포인트 계산
    const total = setBonus.points + quantityBonus.points;

    return {
      total,
      setBonus,
      quantityBonus
    };
  }
}

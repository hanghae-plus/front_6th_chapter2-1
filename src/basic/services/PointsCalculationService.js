import {
  BASE_POINTS_RATE,
  TUESDAY_POINTS_MULTIPLIER,
  BONUS_POINTS,
  BONUS_POINTS_THRESHOLDS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
} from '../constants.js';
import { isTuesday } from '../utils/date.js';
import { findProductById } from '../utils/product.js';

export class PointsCalculationService {
  constructor(productList, cartDisp, cartState) {
    this.productList = productList;
    this.cartDisp = cartDisp;
    this.cartState = cartState;
  }

  calculateBonusPoints() {
    if (this.cartDisp.children.length === 0) {
      this.hideLoyaltyPoints();
      return { bonusPoints: 0, pointsDetail: [] };
    }

    const basePoints = Math.floor(this.cartState.total / BASE_POINTS_RATE);
    const pointsDetail = [];
    let finalPoints = 0;

    // 기본 포인트 계산
    if (basePoints > 0) {
      finalPoints = basePoints;
      pointsDetail.push(`기본: ${basePoints}p`);
    }

    // 화요일 보너스
    if (isTuesday() && basePoints > 0) {
      finalPoints = basePoints * TUESDAY_POINTS_MULTIPLIER;
      pointsDetail.push('화요일 2배');
    }

    // 세트 보너스 계산
    const setBonus = this.calculateSetBonus();
    finalPoints += setBonus.points;
    pointsDetail.push(...setBonus.details);

    // 대량구매 보너스 계산
    const bulkBonus = this.calculateBulkPurchaseBonus();
    finalPoints += bulkBonus.points;
    pointsDetail.push(...bulkBonus.details);

    return {
      bonusPoints: finalPoints,
      pointsDetail,
    };
  }

  calculateSetBonus() {
    let points = 0;
    const details = [];

    const { hasKeyboard, hasMouse, hasMonitorArm } = this.getProductFlags();

    // 키보드+마우스 세트 보너스
    if (hasKeyboard && hasMouse) {
      points += BONUS_POINTS.KEYBOARD_MOUSE_SET;
      details.push(`키보드+마우스 세트 +${BONUS_POINTS.KEYBOARD_MOUSE_SET}p`);
    }

    // 풀세트 보너스
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      points += BONUS_POINTS.FULL_SET;
      details.push(`풀세트 구매 +${BONUS_POINTS.FULL_SET}p`);
    }

    return { points, details };
  }

  calculateBulkPurchaseBonus() {
    let points = 0;
    const details = [];

    if (this.cartState.itemCount >= BONUS_POINTS_THRESHOLDS.LARGE) {
      points += BONUS_POINTS.BULK_PURCHASE.LARGE;
      details.push(
        `대량구매(${BONUS_POINTS_THRESHOLDS.LARGE}개+) +${BONUS_POINTS.BULK_PURCHASE.LARGE}p`
      );
    } else if (this.cartState.itemCount >= BONUS_POINTS_THRESHOLDS.MEDIUM) {
      points += BONUS_POINTS.BULK_PURCHASE.MEDIUM;
      details.push(
        `대량구매(${BONUS_POINTS_THRESHOLDS.MEDIUM}개+) +${BONUS_POINTS.BULK_PURCHASE.MEDIUM}p`
      );
    } else if (this.cartState.itemCount >= BONUS_POINTS_THRESHOLDS.SMALL) {
      points += BONUS_POINTS.BULK_PURCHASE.SMALL;
      details.push(
        `대량구매(${BONUS_POINTS_THRESHOLDS.SMALL}개+) +${BONUS_POINTS.BULK_PURCHASE.SMALL}p`
      );
    }

    return { points, details };
  }

  getProductFlags() {
    let hasKeyboard = false;
    let hasMouse = false;
    let hasMonitorArm = false;

    const nodes = this.cartDisp.children;

    for (const node of nodes) {
      const product = findProductById(this.productList, node.id);
      if (!product) continue;

      if (product.id === KEYBOARD) {
        hasKeyboard = true;
      } else if (product.id === MOUSE) {
        hasMouse = true;
      } else if (product.id === MONITOR_ARM) {
        hasMonitorArm = true;
      }
    }

    return { hasKeyboard, hasMouse, hasMonitorArm };
  }

  updateLoyaltyPointsDisplay(bonusPoints, pointsDetail) {
    const loyaltyPoints = document.getElementById('loyalty-points');
    if (loyaltyPoints) {
      loyaltyPoints.innerHTML = this.createLoyaltyPointsTag(bonusPoints, pointsDetail);
      loyaltyPoints.style.display = 'block';
    }
  }

  hideLoyaltyPoints() {
    const loyaltyPoints = document.getElementById('loyalty-points');
    if (loyaltyPoints) {
      loyaltyPoints.style.display = 'none';
    }
  }

  createLoyaltyPointsTag(bonusPoints, pointsDetail) {
    if (bonusPoints === 0) {
      return '적립 포인트: 0p';
    }

    return `
      <div>적립 포인트: <span class="font-bold">${bonusPoints}p</span></div>
      ${
        pointsDetail.length > 0
          ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
          : ''
      }
    `;
  }
}

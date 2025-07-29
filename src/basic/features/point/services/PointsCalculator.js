/**
 * Points Calculation Feature
 * Handles loyalty points calculation and rendering
 */

import { ELEMENT_IDS } from "../../../shared/constants/element-ids.js";

export class PointsCalculator {
  constructor(constants = {}, products = {}) {
    this.totalAmount = 0;
    this.totalItemCount = 0;
    this.cartElements = [];
    this.productList = [];
    this.finalPoints = 0;
    this.pointsDetail = [];
    this.constants = constants;
    this.products = products;
  }

  /**
   * Calculate and render bonus points
   * @param {number} totalAmount - Total cart amount
   * @param {number} totalItemCount - Total item count
   * @param {HTMLCollection} cartElements - DOM cart elements
   * @param {Array} productList - Product list
   * @returns {Object} Points calculation result
   */
  calculateAndRender(totalAmount, totalItemCount, cartElements, productList) {
    this.totalAmount = totalAmount;
    this.totalItemCount = totalItemCount;
    this.cartElements = Array.from(cartElements);
    this.productList = productList;

    // Reset calculation
    this.reset();

    // Check if cart is empty
    if (this.cartElements.length === 0) {
      this.hidePointsDisplay();
      return { points: 0, details: [] };
    }

    // Calculate base points
    this.calculateBasePoints();

    // Apply Tuesday multiplier
    this.applyTuesdayMultiplier();

    // Calculate set bonuses
    this.calculateSetBonuses();

    // Calculate bulk purchase bonuses
    this.calculateBulkBonuses();

    // Render to DOM
    this.renderPoints();

    return {
      points: this.finalPoints,
      details: this.pointsDetail,
    };
  }

  reset() {
    this.finalPoints = 0;
    this.pointsDetail = [];
  }

  calculateBasePoints() {
    const basePoints = Math.floor(this.totalAmount / 1000);

    if (basePoints > 0) {
      this.finalPoints = basePoints;
      this.pointsDetail.push(`기본: ${basePoints}p`);
    }
  }

  applyTuesdayMultiplier() {
    const isTuesday = new Date().getDay() === 2;

    if (isTuesday && this.finalPoints > 0) {
      const basePoints = Math.floor(this.totalAmount / 1000);
      this.finalPoints = basePoints * 2;
      this.pointsDetail.push("화요일 2배");
    }
  }

  calculateSetBonuses() {
    // Check for keyboard, mouse, monitor arm in cart
    const productIds = this.getProductIdsInCart();

    const hasKeyboard = productIds.includes(this.products.KEYBOARD);
    const hasMouse = productIds.includes(this.products.MOUSE);
    const hasMonitorArm = productIds.includes(this.products.MONITOR_ARM);

    // Keyboard + Mouse set bonus
    if (hasKeyboard && hasMouse) {
      this.finalPoints += this.constants.POINTS.KEYBOARD_MOUSE_BONUS;
      this.pointsDetail.push(
        `키보드+마우스 세트 +${this.constants.POINTS.KEYBOARD_MOUSE_BONUS}p`
      );
    }

    // Full set bonus (Keyboard + Mouse + Monitor Arm)
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      this.finalPoints += this.constants.POINTS.FULL_SET_BONUS;
      this.pointsDetail.push(
        `풀세트 구매 +${this.constants.POINTS.FULL_SET_BONUS}p`
      );
    }
  }

  calculateBulkBonuses() {
    const { TIER_1, TIER_2, TIER_3 } =
      this.constants.POINTS.BULK_PURCHASE_BONUSES;

    if (this.totalItemCount >= TIER_3.threshold) {
      this.finalPoints += TIER_3.bonus;
      this.pointsDetail.push(
        `대량구매(${TIER_3.threshold}개+) +${TIER_3.bonus}p`
      );
    } else if (this.totalItemCount >= TIER_2.threshold) {
      this.finalPoints += TIER_2.bonus;
      this.pointsDetail.push(
        `대량구매(${TIER_2.threshold}개+) +${TIER_2.bonus}p`
      );
    } else if (this.totalItemCount >= TIER_1.threshold) {
      this.finalPoints += TIER_1.bonus;
      this.pointsDetail.push(
        `대량구매(${TIER_1.threshold}개+) +${TIER_1.bonus}p`
      );
    }
  }

  getProductIdsInCart() {
    const productIds = [];

    for (const cartElement of this.cartElements) {
      const product = this.findProductById(cartElement.id);
      if (product) {
        productIds.push(product.id);
      }
    }

    return productIds;
  }

  findProductById(productId) {
    return this.productList.find((p) => p.id === productId);
  }

  renderPoints() {
    const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);

    if (!ptsTag) return;

    if (this.finalPoints > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${
          this.finalPoints
        }p</span></div>
        <div class="text-2xs opacity-70 mt-1">${this.pointsDetail.join(
          ", "
        )}</div>
      `;
      ptsTag.style.display = "block";
    } else {
      ptsTag.textContent = "적립 포인트: 0p";
      ptsTag.style.display = "block";
    }
  }

  hidePointsDisplay() {
    const ptsTag = document.getElementById(ELEMENT_IDS.LOYALTY_POINTS);
    if (ptsTag) {
      ptsTag.style.display = "none";
    }
  }

  getPoints() {
    return this.finalPoints;
  }
}

export default PointsCalculator;

import { IBonusPointsResult } from "../../types";
import { POINTS_RULES, PRODUCT_IDS } from "../../constants";
import { useProductData } from "../products/productData";
import { isSpecialPointsDay, getKoreanDayName } from "../../utils/dateUtils";

export const useBonusPointsManager = {
  bonusPoints: 0,

  /**
   * 현재 보너스 포인트 반환
   * @returns {number} 보너스 포인트
   */
  getBonusPoints() {
    return this.bonusPoints;
  },

  /**
   * 보너스 포인트 설정
   * @param {number} points - 설정할 포인트
   */
  setBonusPoints(points: number) {
    this.bonusPoints = points;
  },

  /**
   * 보너스 포인트 초기화
   */
  resetBonusPoints() {
    this.bonusPoints = 0;
  },

  /**
   * 기본 포인트 계산 (구매액 기준)
   * @param {number} totalAmount - 총 구매액
   * @returns {number} 기본 포인트
   */
  calculateBasePoints(totalAmount: number) {
    return Math.floor(totalAmount / POINTS_RULES.BASE_CALCULATION_UNIT);
  },

  /**
   * 특별 포인트 날짜 보너스 계산
   * @param {number} basePoints - 기본 포인트
   * @returns {Object} {points, isSpecialDay, detail}
   */
  calculateSpecialDayBonus(basePoints: number) {
    const isSpecialDay = isSpecialPointsDay();

    if (isSpecialDay && basePoints > 0) {
      const bonusPoints = basePoints * POINTS_RULES.SPECIAL_POINTS_MULTIPLIER;
      const detail = `${POINTS_RULES.SPECIAL_POINTS_DAYS.map(getKoreanDayName).join(", ")} ${POINTS_RULES.SPECIAL_POINTS_MULTIPLIER}배`;

      return {
        points: bonusPoints,
        isSpecialDay: true,
        detail,
      };
    }

    return {
      points: basePoints,
      isSpecialDay: false,
      detail: basePoints > 0 ? `기본: ${basePoints}p` : "",
    };
  },

  /**
   * 장바구니 아이템들로부터 콤보 보너스 계산
   * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
   * @returns {Object} {bonusPoints, details}
   */
  calculateComboBonus(cartItems: HTMLCollection) {
    let bonusPoints = 0;
    const details: string[] = [];

    let hasKeyboard = false;
    let hasMouse = false;
    let hasMonitorArm = false;

    Array.from(cartItems).forEach((node) => {
      const element = node as HTMLElement;
      const product = useProductData.findProductById(element.id);
      if (product) {
        if (product.id === PRODUCT_IDS.KEYBOARD) {
          hasKeyboard = true;
        } else if (product.id === PRODUCT_IDS.MOUSE) {
          hasMouse = true;
        } else if (product.id === PRODUCT_IDS.MONITOR_ARM) {
          hasMonitorArm = true;
        }
      }
    });

    if (hasKeyboard && hasMouse) {
      bonusPoints += POINTS_RULES.COMBO_BONUS.KEYBOARD_MOUSE;
      details.push(`키보드+마우스 세트 +${POINTS_RULES.COMBO_BONUS.KEYBOARD_MOUSE}p`);
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      bonusPoints += POINTS_RULES.COMBO_BONUS.FULL_SET;
      details.push(`풀세트 구매 +${POINTS_RULES.COMBO_BONUS.FULL_SET}p`);
    }

    return {
      bonusPoints,
      details,
    };
  },

  /**
   * 수량별 보너스 포인트 계산
   * @param {number} totalItemCount - 총 상품 개수
   * @returns {Object} {bonusPoints, detail}
   */
  calculateQuantityBonus(totalItemCount: number) {
    let bonusPoints = 0;
    let detail = "";

    if (totalItemCount >= POINTS_RULES.QUANTITY_BONUS.TIER_3.threshold) {
      bonusPoints = POINTS_RULES.QUANTITY_BONUS.TIER_3.bonus;
      detail = `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_3.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_3.bonus}p`;
    } else if (totalItemCount >= POINTS_RULES.QUANTITY_BONUS.TIER_2.threshold) {
      bonusPoints = POINTS_RULES.QUANTITY_BONUS.TIER_2.bonus;
      detail = `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_2.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_2.bonus}p`;
    } else if (totalItemCount >= POINTS_RULES.QUANTITY_BONUS.TIER_1.threshold) {
      bonusPoints = POINTS_RULES.QUANTITY_BONUS.TIER_1.bonus;
      detail = `대량구매(${POINTS_RULES.QUANTITY_BONUS.TIER_1.threshold}개+) +${POINTS_RULES.QUANTITY_BONUS.TIER_1.bonus}p`;
    }

    return {
      bonusPoints,
      detail,
    };
  },

  /**
   * 전체 보너스 포인트 계산 및 업데이트
   * @param {number} totalAmount - 총 구매액
   * @param {number} totalItemCount - 총 상품 개수
   * @param {HTMLCollection} cartItems - 장바구니 DOM 아이템들
   * @returns {Object} 계산 결과 및 상세 정보
   */
  calculateAndUpdateBonusPoints(
    totalAmount: number,
    totalItemCount: number,
    cartItems: HTMLCollection,
  ): IBonusPointsResult {
    const details: string[] = [];

    const basePoints = this.calculateBasePoints(totalAmount);

    const specialDayResult = this.calculateSpecialDayBonus(basePoints);
    let finalPoints = specialDayResult.points;
    if (specialDayResult.detail) {
      details.push(specialDayResult.detail);
    }

    const comboResult = this.calculateComboBonus(cartItems);
    finalPoints += comboResult.bonusPoints;
    details.push(...comboResult.details);

    const quantityResult = this.calculateQuantityBonus(totalItemCount);
    finalPoints += quantityResult.bonusPoints;
    if (quantityResult.detail) {
      details.push(quantityResult.detail);
    }

    this.setBonusPoints(finalPoints);

    return {
      totalPoints: finalPoints,
      details,
      breakdown: {
        base: basePoints,
        specialDay: specialDayResult,
        combo: comboResult,
        quantity: quantityResult,
      },
    };
  },
};

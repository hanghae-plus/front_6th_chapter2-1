import { useMemo } from "react";
import { POINTS_SYSTEM } from "../constants";
import type { CartItem } from "../types";

interface PointsResult {
  totalPoints: number;
  pointsDetails: string[];
}

export function usePointsService(
  totalAmount: number,
  cartItems: CartItem[],
  itemCount: number,
  isTuesday: boolean = false
) {
  const pointsResult = useMemo((): PointsResult => {
    let points = Math.floor(totalAmount * POINTS_SYSTEM.BASE_RATE);
    const details: string[] = [
      `기본 ${Math.floor(totalAmount * POINTS_SYSTEM.BASE_RATE)}p`,
    ];

    // 화요일 2배 적립
    if (isTuesday) {
      points *= POINTS_SYSTEM.TUESDAY_MULTIPLIER;
      details.push("화요일 2배");
    }

    // 콤보 보너스
    const hasKeyboard = cartItems.some((item) => item.product.id === "p1");
    const hasMouse = cartItems.some((item) => item.product.id === "p2");
    const hasMonitorArm = cartItems.some((item) => item.product.id === "p3");

    if (hasKeyboard && hasMouse) {
      points += POINTS_SYSTEM.COMBO_BONUS.KEYBOARD_MOUSE;
      details.push(
        `키보드+마우스 세트 +${POINTS_SYSTEM.COMBO_BONUS.KEYBOARD_MOUSE}p`
      );
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      points += POINTS_SYSTEM.COMBO_BONUS.FULL_SET;
      details.push(`풀세트 구매 +${POINTS_SYSTEM.COMBO_BONUS.FULL_SET}p`);
    }

    // 수량별 보너스
    if (itemCount >= POINTS_SYSTEM.QUANTITY_BONUS.TIER_3.threshold) {
      points += POINTS_SYSTEM.QUANTITY_BONUS.TIER_3.points;
      details.push(
        `대량구매(${POINTS_SYSTEM.QUANTITY_BONUS.TIER_3.threshold}개+) +${POINTS_SYSTEM.QUANTITY_BONUS.TIER_3.points}p`
      );
    } else if (itemCount >= POINTS_SYSTEM.QUANTITY_BONUS.TIER_2.threshold) {
      points += POINTS_SYSTEM.QUANTITY_BONUS.TIER_2.points;
      details.push(
        `대량구매(${POINTS_SYSTEM.QUANTITY_BONUS.TIER_2.threshold}개+) +${POINTS_SYSTEM.QUANTITY_BONUS.TIER_2.points}p`
      );
    } else if (itemCount >= POINTS_SYSTEM.QUANTITY_BONUS.TIER_1.threshold) {
      points += POINTS_SYSTEM.QUANTITY_BONUS.TIER_1.points;
      details.push(
        `대량구매(${POINTS_SYSTEM.QUANTITY_BONUS.TIER_1.threshold}개+) +${POINTS_SYSTEM.QUANTITY_BONUS.TIER_1.points}p`
      );
    }

    return { totalPoints: points, pointsDetails: details };
  }, [totalAmount, cartItems, itemCount, isTuesday]);

  return pointsResult;
}

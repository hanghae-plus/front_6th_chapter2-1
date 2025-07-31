import { updateCartItemStyles } from "./updateCartItem";
import { updateCartUI } from "./updateCart";
import { updateStockInfo } from "./updateStockInfo";
import { updateBonusPoints } from "./updateBonusPoints";

/**
 * 계산 후 모든 카트 UI 컴포넌트를 업데이트하는 함수
 * @param {HTMLElement} cartContainer - 카트 컨테이너 DOM 요소
 * @param {Object} businessData - 계산된 비즈니스 데이터
 */
export const updateCartUIAfterCalculation = (cartContainer, businessData) => {
  const { cartData, lowStockItems, bonusPointsData } = businessData;

  // 각 UI 컴포넌트 업데이트
  updateCartItemStyles(cartData.items);
  updateCartUI(cartData);
  updateStockInfo(lowStockItems);
  updateBonusPoints(bonusPointsData);
};

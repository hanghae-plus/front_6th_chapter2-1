import { renderBonusPoints } from '../render/renderBonusPoint';
import { renderBonusPoints } from '../render/renderBonusPoint';
import { renderCartSummaryDetail } from '../render/renderCartSummaryDetail';
import { renderCartTotalPrice } from '../render/renderCartTotalPrice';
import { renderDiscountRate } from '../render/renderDiscountRate';
import { renderTotalProductCount } from '../render/renderTotalProductCount';
import { renderTuesdaySpecial } from '../render/renderTuesdaySpecial';
import { renderStockMessage } from '../render/renderStockMessage';
import { renderCartProductList } from '../render/renderCartProducList';

import { calculateBonusPoint } from '../services/calculateBonusPoint';
import { calculateCartSummary } from '../services/calculateCartSummary';

export const updateUI = ({ state, appState }) => {
  renderTuesdaySpecial(appState);
  renderCartSummaryDetail({ state, appState });
  renderCartTotalPrice(appState);
  renderDiscountRate(appState);
  renderTotalProductCount(appState);
  renderBonusPoints(appState);
  renderStockMessage(state);
  renderCartProductList(state);
};

// 장바구니 가격 계산 + 출력 함수
export const updateCartStatus = ({ state, appState }) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, totalDiscountedRate, discountedProductList } =
    calculateCartSummary(state);

  appState.totalProductCount = totalProductCount;

  appState.totalAfterDiscount = totalAfterDiscount;
  appState.totalBeforeDiscount = totalBeforeDiscount;

  appState.totalDiscountedRate = totalDiscountedRate;
  appState.discountedProductList = discountedProductList;

  const { totalPoints, pointsDetail } = calculateBonusPoint({ state, appState });

  appState.totalPoints = totalPoints;
  appState.pointsDetail = pointsDetail;

  updateUI({ state, appState });
};

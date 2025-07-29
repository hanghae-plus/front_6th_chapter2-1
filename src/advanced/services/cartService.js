// ==========================================
// 카트 서비스
// ==========================================

import { calculateCartSubtotal } from './calculationService.js';
import { generateStockWarningMessage } from '../utils/stockUtils.js';
import { updateStockInfoUI } from '../components/StockInfo.js';
import { renderBonusPoints } from './pointService.js';

/**
 * 🤖 [AI-REFACTORED] 장바구니 계산 오케스트레이션 (메인 계산 함수)
 *
 * @description 장바구니의 모든 계산과 UI 업데이트를 조율하는 메인 함수
 *

 * - 단일 책임: 오케스트레이션만 담당
 * - 함수 분리: 각 단계별로 별도 함수 호출
 * - 순수 함수: 부작용 최소화
 *
 * @param {Object} appState - 애플리케이션 상태
 * @param {Object} uiElements - UI 요소들
 * @param {Object} domElements - DOM 요소들
 * @param {Function} getCartItemQuantity - 수량 조회 함수
 * @param {Function} getTotalStock - 전체 재고 조회 함수
 * @param {Function} calculateFinalDiscounts - 최종 할인 계산 함수
 * @param {Function} updateOrderSummaryUI - 주문 요약 UI 업데이트 함수
 * @param {Function} updateTotalAndDiscountUI - 총액 및 할인 UI 업데이트 함수
 * @param {Function} updateHeader - 헤더 업데이트 함수
 * @param {Function} findProductById - 상품 조회 함수
 * @param {Function} hasKeyboardMouseSet - 키보드+마우스 세트 확인 함수
 * @param {Function} hasFullProductSet - 풀세트 확인 함수
 * @param {Function} shouldApplyTuesdayBonus - 화요일 보너스 적용 확인 함수
 */
export function handleCalculateCartStuff(
  appState,
  uiElements,
  domElements,
  getCartItemQuantity,
  getTotalStock,
  calculateFinalDiscounts,
  updateOrderSummaryUI,
  updateTotalAndDiscountUI,
  updateHeader,
  findProductById,
  hasKeyboardMouseSet,
  hasFullProductSet,
  shouldApplyTuesdayBonus,
) {
  // ==========================================
  // 🏷️ 1단계: 변수 선언부 (관심사별 분류)
  // ==========================================

  // 📊 데이터 관련 변수들 (캐시된 DOM 사용)
  const cartItems = uiElements.cartDisplay.children;

  // ==========================================

  // ==========================================

  const { subTotal, itemCount, totalAmount, itemDiscounts } =
    calculateCartSubtotal(cartItems, appState.products, getCartItemQuantity);

  // ==========================================
  // 🧮 4단계: 할인 계산 로직
  // ==========================================

  const { finalAmount, discountRate, isTuesdayApplied } =
    calculateFinalDiscounts(subTotal, itemCount, totalAmount);

  // ==========================================
  // 🎨 5단계: UI 업데이트
  // ==========================================

  updateOrderSummaryUI(
    cartItems,
    appState.products,
    subTotal,
    itemDiscounts,
    itemCount,
    isTuesdayApplied,
  );

  updateTotalAndDiscountUI(
    finalAmount,
    discountRate,
    subTotal,
    isTuesdayApplied,
  );

  // 🛒 장바구니 아이템 개수 업데이트 (헤더 컴포넌트 사용)
  updateHeader(itemCount);

  // ⚠️ 재고 부족 알림 메시지 생성 (사용자 안내)
  const stockMsg = generateStockWarningMessage(appState.products);
  uiElements.stockInfo.textContent = stockMsg;

  // ==========================================
  // 📞 6단계: 상태 업데이트 및 관련 함수 호출
  // ==========================================

  // 🔄 계산 완료 후 전역 상태 업데이트 (다음 계산을 위해)
  appState.cart.totalAmount = finalAmount;
  appState.cart.itemCount = itemCount;

  updateStockInfoUI(appState.products, getTotalStock(), uiElements.stockInfo); // ⚠️ 재고 정보 추가 업데이트
  renderBonusPoints(
    appState,
    uiElements,
    domElements,
    findProductById,
    hasKeyboardMouseSet,
    hasFullProductSet,
    shouldApplyTuesdayBonus,
  );
}

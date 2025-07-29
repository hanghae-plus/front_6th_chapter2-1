// ==========================================
// 🎯 포인트 서비스
// ==========================================

import { THRESHOLDS, POINT_BONUSES, BONUS_RULES } from '../constant/index.js';

// 🏷️ 상품 ID 상수들
const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';

/**
 * 🤖 [AI-REFACTORED] 보너스 포인트 렌더링 (React 패턴 네이밍)
 *
 * @description 구매 금액과 특별 조건에 따라 적립 포인트를 계산하고 UI에 표시
 *
 * 포인트 적립 규칙:
 * - 기본: 구매액의 0.1% (1000원당 1포인트)
 * - 화요일: 기본 포인트 2배
 * - 키보드+마우스 세트: +50포인트
 * - 풀세트 구매 (키보드+마우스+모니터암): +100포인트 추가
 * - 대량구매: 10개↑ +20p, 20개↑ +50p, 30개↑ +100p
 *
 * 🎯 네이밍 개선: doRenderBonusPoints → renderBonusPoints
 * - React 패턴: render + 대상
 * - 함수 선언 통일: const 화살표 함수
 *
 * @param {Object} appState - 애플리케이션 상태
 * @param {Object} uiElements - UI 요소들
 * @param {Object} domElements - DOM 요소들
 * @param {Function} findProductById - 상품 조회 함수
 * @param {Function} hasKeyboardMouseSet - 키보드+마우스 세트 확인 함수
 * @param {Function} hasFullProductSet - 풀세트 확인 함수
 * @param {Function} shouldApplyTuesdayBonus - 화요일 보너스 적용 확인 함수
 *
 * @sideEffects
 * - 전역 상태 수정 (appState.cart.bonusPoints)
 * - DOM 수정 (loyalty-points 요소의 innerHTML, style.display)
 */
export function renderBonusPoints(
  appState,
  uiElements,
  domElements,
  findProductById,
  hasKeyboardMouseSet,
  hasFullProductSet,
  shouldApplyTuesdayBonus,
) {
  const basePoints = Math.floor(
    appState.cart.totalAmount / THRESHOLDS.POINTS_PER_WON,
  );
  let finalPoints;
  const pointsDetail = [];
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  const nodes = uiElements.cartDisplay.children;
  if (uiElements.cartDisplay.children.length === 0) {
    domElements.loyaltyPoints.style.display = 'none';
    return;
  }
  finalPoints = 0;
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  if (shouldApplyTuesdayBonus(basePoints)) {
    finalPoints = basePoints * POINT_BONUSES.TUESDAY_MULTIPLIER;
    pointsDetail.push('화요일 2배');
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  for (const node of nodes) {
    // 🎯 DRY 적용: 중복 제거된 유틸리티 사용
    const product = findProductById(node.id);
    if (!product) {
      continue;
    }
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (product.id === PRODUCT_THREE) {
      hasMonitorArm = true;
    }
  }
  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  if (hasKeyboardMouseSet(hasKeyboard, hasMouse)) {
    finalPoints = finalPoints + POINT_BONUSES.KEYBOARD_MOUSE_SET;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINT_BONUSES.KEYBOARD_MOUSE_SET}p`,
    );
  }
  // 🧠 복잡한 조건 → 의미있는 함수로 개선
  if (hasFullProductSet(hasKeyboard, hasMouse, hasMonitorArm)) {
    finalPoints = finalPoints + POINT_BONUSES.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINT_BONUSES.FULL_SET}p`);
  }
  // 🎁 데이터 기반 보너스 계산 (긴 if-else 체인 → 깔끔한 로직)
  const bonusRule = BONUS_RULES.find(
    rule => appState.cart.itemCount >= rule.threshold,
  );
  if (bonusRule) {
    finalPoints += bonusRule.bonus;
    pointsDetail.push(`대량구매(${bonusRule.name}) +${bonusRule.bonus}p`);
  }
  appState.cart.bonusPoints = finalPoints;
  const ptsTag = domElements.loyaltyPoints;
  if (ptsTag) {
    if (appState.cart.bonusPoints > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${appState.cart.bonusPoints}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(
          ', ',
        )}</div>`;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
}

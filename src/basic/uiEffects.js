import {
  OrderSummaryDetails,
  DiscountSummary,
  PointSummary,
} from './components/ui';
import { calculateTotalBonusPoints } from './utils/pointsUtils';
import { isTuesday } from './utils/utils';

/**
 * 장바구니 아이템 수량 UI 업데이트
 */
export function updateItemCountDisplay(itemCount, previousCount = null) {
  const itemCountElement = document.getElementById('item-count');
  if (!itemCountElement) return;

  const newText = `🛍️ ${itemCount} items in cart`;
  itemCountElement.textContent = newText;

  // 변경 감지 및 애니메이션 트리거
  if (previousCount !== null && previousCount !== itemCount) {
    itemCountElement.setAttribute('data-changed', 'true');
  }
}

/**
 * 주문 요약 세부사항 UI 업데이트
 */
export function updateOrderSummary({
  findProductById,
  cartItems,
  subTotal,
  itemCount,
  itemDiscounts,
  totalAmount,
}) {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  summaryDetails.innerHTML = '';
  summaryDetails.appendChild(
    OrderSummaryDetails({
      findProductById,
      cartItems,
      subTotal,
      itemCount,
      itemDiscounts,
      totalAmount,
    }),
  );
}

/**
 * 총액 표시 UI 업데이트
 */
export function updateTotalAmountDisplay(totalAmount, sumElement) {
  const totalDiv = sumElement?.querySelector('.text-2xl');
  if (!totalDiv) return;

  const formattedAmount = `₩${Math.round(totalAmount).toLocaleString()}`;
  totalDiv.textContent = formattedAmount;
}

/**
 * 기본 적립 포인트 표시 UI 업데이트
 */
export function updateBasicLoyaltyPoints(totalAmount) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  const points = Math.floor(totalAmount / 1000);

  if (points > 0) {
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
}

/**
 * 할인 정보 표시 UI 업데이트
 */
export function updateDiscountInfo(discountRate, totalAmount, originalTotal) {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  discountInfoDiv.innerHTML = '';
  discountInfoDiv.appendChild(
    DiscountSummary(discountRate, totalAmount, originalTotal),
  );
}

/**
 * 재고 상태 메시지 UI 업데이트
 */
export function updateStockStatus(productList, stockInfoElement) {
  if (!stockInfoElement) return;

  let stockMsg = '';
  for (const item of productList) {
    if (item.availableStock < 5) {
      if (item.availableStock > 0) {
        stockMsg += `${item.name}: 재고 부족 (${item.availableStock}개 남음)\n`;
      } else {
        stockMsg += `${item.name}: 품절\n`;
      }
    }
  }

  stockInfoElement.textContent = stockMsg;
}

/**
 * 화요일 특별 할인 UI 표시 업데이트
 */
export function updateTuesdaySpecialDisplay(showTuesdaySpecial) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (showTuesdaySpecial) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

/**
 * 보너스 포인트 전체 UI 업데이트
 */
export function updateBonusPointsDisplay({
  totalAmount,
  cartItems,
  itemCount,
  findProductById,
}) {
  // 계산 (순수 함수)
  const bonusPointsResult = calculateTotalBonusPoints(
    totalAmount,
    cartItems,
    itemCount,
    isTuesday(),
    findProductById,
  );

  // UI 업데이트 (사이드 이펙트)
  const pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) return;

  if (!bonusPointsResult.shouldShow) {
    pointsTag.style.display = 'none';
    return;
  }

  pointsTag.innerHTML = '';
  const pointSummary = PointSummary({
    bonusPoints: bonusPointsResult.totalPoints,
    pointsDetail: bonusPointsResult.pointsDetail,
  });
  pointsTag.appendChild(pointSummary);
  pointsTag.style.display = 'block';

  return bonusPointsResult.totalPoints;
}

/**
 * 장바구니 전체 UI 업데이트 (메인 useEffect)
 */
export function updateCartUI({
  // 계산된 데이터
  itemCount,
  subTotal,
  totalAmount,
  originalTotal,
  discountRate,
  itemDiscounts,
  cartItems,

  // 의존성
  productList,
  findProductById,
  showTuesdaySpecial,

  // DOM 요소들
  sumElement,
  stockInfoElement,

  // 이전 상태 (최적화용)
  previousCount = null,
}) {
  updateItemCountDisplay(itemCount, previousCount);
  updateOrderSummary({
    findProductById,
    cartItems,
    subTotal,
    itemCount,
    itemDiscounts,
    totalAmount,
  });
  updateTotalAmountDisplay(totalAmount, sumElement);
  updateDiscountInfo(discountRate, totalAmount, originalTotal);
  updateStockStatus(productList, stockInfoElement);
  updateTuesdaySpecialDisplay(showTuesdaySpecial);

  // 7. 보너스 포인트 업데이트
  const bonusPoints = updateBonusPointsDisplay({
    totalAmount,
    cartItems,
    itemCount,
    findProductById,
  });

  return { bonusPoints };
}

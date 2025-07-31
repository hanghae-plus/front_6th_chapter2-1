import { calculateTotalPoints } from '../../utils/pointUtils';

export const createRewardPoints = () => {
  const rewardPoints = document.createElement('div');
  rewardPoints.id = 'loyalty-points'; // ID는 테스트 호환성 위해 유지
  rewardPoints.className = 'text-xs text-blue-400 mt-2 text-right';
  rewardPoints.textContent = '적립 포인트: 0p';

  return rewardPoints;
};

/** 포인트 계산 및 업데이트
 * @param {Element} element - 포인트 요소
 * @param {Array} cartItems - 카트 아이템 목록
 * @param {Array} productList - 상품 목록
 * @param {number} totalAmount - 총 금액
 * @param {number} itemCount - 카트 아이템 수
 */
export const updateRewardPoints = (element, cartItems, productList, totalAmount, itemCount) => {
  if (cartItems.length === 0) {
    // 카트가 비어있으면 포인트 표시 숨기기
    element.style.display = 'none';
    return 0;
  }

  const { totalPoints, pointsDetails } = calculateTotalPoints(cartItems, productList, totalAmount, itemCount);

  if (totalPoints > 0) {
    element.innerHTML = createPointsDisplayTemplate(totalPoints, pointsDetails);
    element.style.display = 'block';
  } else {
    element.textContent = '적립 포인트: 0p';
    element.style.display = 'block';
  }

  return totalPoints;
};

/** 포인트 표시 템플릿
 * @param {number} totalPoints - 총 포인트
 * @param {Array} pointsDetails - 포인트 상세 목록
 */
const createPointsDisplayTemplate = (totalPoints, pointsDetails) => {
  return `
    <div>적립 포인트: <span class="font-bold">${totalPoints}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${pointsDetails.join(', ')}</div>
  `;
};

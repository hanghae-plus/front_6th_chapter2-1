/**
 * @description 기본 포인트 계산 (총 금액의 0.1%)
 * @param {number} totalAmount - 총 금액
 * @returns {number} 포인트
 */
export const calculateBasePoint = (totalAmount) => {
  return Math.floor(totalAmount / 1000);
};

/**
 * @description 세트 보너스 포인트를 반환
 * @param {boolean} hasKeyboard 키보드 포함 유무
 * @param {boolean} hasMouse 마우스 포함 유무
 * @param {boolean} hasMonitorArm 모니터암 포함 유무
 * @returns {{ label: string, point: number }[]} 세트보너스포인트 정보 배열
 */
export const getSetBonusPoint = ({ hasKeyboard, hasMouse, hasMonitorArm }) => {
  const bonuses = [];

  if (hasKeyboard && hasMouse) {
    bonuses.push({ label: '키보드+마우스 세트 +50p', point: 50 });
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonuses.push({ label: '풀세트 구매 +100p', point: 100 });
  }

  return bonuses;
};

/**
 * @description 벌크 보너스 포인트를 반환
 * @param {number} itemCount 상품 개수
 * @returns {{ label: string, point: number } | null} 벌크보너스포인트 정보
 */
export const getBulkBonusPoint = (itemCount) => {
  if (itemCount >= 30) {
    return { label: '대량구매(30개+) +100p', point: 100 };
  }

  if (itemCount >= 20) {
    return { label: '대량구매(20개+) +50p', point: 50 };
  }

  if (itemCount >= 10) {
    return { label: '대량구매(10개+) +20p', point: 20 };
  }

  return null;
};

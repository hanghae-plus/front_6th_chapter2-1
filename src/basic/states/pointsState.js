const pointsState = {
  basePoints: 0, // 기본 포인트
  bonusPoints: 0, // 보너스 포인트
  totalPoints: 0, // 총 포인트
  pointsDetail: [], // 포인트 상세 내역
};

/**
 * 포인트 상태 업데이트 함수들
 */
const pointsStateUpdaters = {
  /**
   * 포인트 정보 업데이트
   */
  updatePoints(points) {
    pointsState.basePoints = points.basePoints || pointsState.basePoints;
    pointsState.bonusPoints = points.bonusPoints || pointsState.bonusPoints;
    pointsState.totalPoints = points.totalPoints || pointsState.totalPoints;
    pointsState.pointsDetail = points.pointsDetail || pointsState.pointsDetail;
  },

  /**
   * 기본 포인트 업데이트
   */
  updateBasePoints(points) {
    pointsState.basePoints = points;
  },

  /**
   * 보너스 포인트 업데이트
   */
  updateBonusPoints(points) {
    pointsState.bonusPoints = points;
  },

  /**
   * 총 포인트 업데이트
   */
  updateTotalPoints(points) {
    pointsState.totalPoints = points;
  },

  /**
   * 포인트 상세 내역 업데이트
   */
  updatePointsDetail(detail) {
    pointsState.pointsDetail = detail;
  },

  /**
   * 포인트 상태 초기화
   */
  reset() {
    pointsState.basePoints = 0;
    pointsState.bonusPoints = 0;
    pointsState.totalPoints = 0;
    pointsState.pointsDetail = [];
  },
};

/**
 * 포인트 상태 구독자들
 */
const pointsStateSubscribers = [];

/**
 * 포인트 상태 변경을 구독하는 함수 등록
 */
function subscribeToPointsState(callback) {
  pointsStateSubscribers.push(callback);
}

/**
 * 포인트 상태 변경 시 모든 구독자들에게 알림
 */
function notifyPointsStateChange() {
  pointsStateSubscribers.forEach((callback) => callback(pointsState));
}

/**
 * 포인트 상태 업데이트 래퍼 함수
 */
function updatePointsState(updater, ...args) {
  updater(...args);
  notifyPointsStateChange();
}

// 포인트 상태 업데이트 함수들을 래핑
const pointsActions = {
  updatePoints: (points) => updatePointsState(pointsStateUpdaters.updatePoints, points),
  updateBasePoints: (points) => updatePointsState(pointsStateUpdaters.updateBasePoints, points),
  updateBonusPoints: (points) => updatePointsState(pointsStateUpdaters.updateBonusPoints, points),
  updateTotalPoints: (points) => updatePointsState(pointsStateUpdaters.updateTotalPoints, points),
  updatePointsDetail: (detail) => updatePointsState(pointsStateUpdaters.updatePointsDetail, detail),
  reset: () => updatePointsState(pointsStateUpdaters.reset),
};

// 외부에서 사용할 수 있도록 export
export { pointsState, pointsActions, subscribeToPointsState };

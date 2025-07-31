const uiState = {
  isManualOpen: false, // 매뉴얼 오버레이 열림 상태
};

/**
 * UI 상태 업데이트 함수들
 */
const uiStateUpdaters = {
  /**
   * 매뉴얼 오버레이 상태 토글
   */
  toggleManualOverlay() {
    uiState.isManualOpen = !uiState.isManualOpen;
  },

  /**
   * 매뉴얼 오버레이 열기
   */
  openManualOverlay() {
    uiState.isManualOpen = true;
  },

  /**
   * 매뉴얼 오버레이 닫기
   */
  closeManualOverlay() {
    uiState.isManualOpen = false;
  },

  /**
   * UI 상태 초기화
   */
  reset() {
    uiState.isManualOpen = false;
  },
};

/**
 * UI 상태 구독자들
 */
const uiStateSubscribers = [];

/**
 * UI 상태 변경을 구독하는 함수 등록
 */
function subscribeToUiState(callback) {
  uiStateSubscribers.push(callback);
}

/**
 * UI 상태 변경 시 모든 구독자들에게 알림
 */
function notifyUiStateChange() {
  uiStateSubscribers.forEach((callback) => callback(uiState));
}

/**
 * UI 상태 업데이트 래퍼 함수
 */
function updateUiState(updater, ...args) {
  updater(...args);
  notifyUiStateChange();
}

// UI 상태 업데이트 함수들을 래핑
const uiActions = {
  toggleManualOverlay: () => updateUiState(uiStateUpdaters.toggleManualOverlay),
  openManualOverlay: () => updateUiState(uiStateUpdaters.openManualOverlay),
  closeManualOverlay: () => updateUiState(uiStateUpdaters.closeManualOverlay),
  reset: () => updateUiState(uiStateUpdaters.reset),
};

// 외부에서 사용할 수 있도록 export
export { uiState, uiActions, subscribeToUiState };

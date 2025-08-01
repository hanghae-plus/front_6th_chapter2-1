/**
 * 애플리케이션 초기화 기능
 */

/**
 * 애플리케이션 상태 초기화
 * @param {Object} appState - AppState 인스턴스
 */
export function initializeApplication(appState) {
  // AppState 초기화
  appState.initialize();
}

/**
 * 상품 데이터 초기화
 * @param {Object} appState - AppState 인스턴스
 */
export function initializeProductData(appState) {
  // AppState에 상품 데이터 설정
  appState.initializeProductData();
}

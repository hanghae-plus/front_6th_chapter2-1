import { createLightningSaleTimer } from './LightningSaleTimer.js';
import { createSuggestionSaleTimer } from './SuggestionSaleTimer.js';

/**
 * 모든 타이머를 통합 관리하는 컴포넌트
 * @param {Function} doUpdatePricesInCart - 장바구니 가격 업데이트 콜백
 * @param {Object} state - 앱 상태 객체 (lastSelect, cartDisplay 포함)
 * @returns {Object} 모든 타이머 시작/중지 메서드를 포함한 객체
 */
export function createTimerManager(doUpdatePricesInCart, state) {
  // 개별 타이머 인스턴스 생성
  const lightningSaleTimer = createLightningSaleTimer(doUpdatePricesInCart);
  const suggestionSaleTimer = createSuggestionSaleTimer(doUpdatePricesInCart, state);

  /**
   * 모든 타이머를 시작합니다
   */
  function startAllTimers() {
    lightningSaleTimer.start();
    suggestionSaleTimer.start();
  }

  /**
   * 모든 타이머를 중지합니다
   */
  function stopAllTimers() {
    lightningSaleTimer.stop();
    suggestionSaleTimer.stop();
  }

  /**
   * 모든 타이머를 재시작합니다
   */
  function restartAllTimers() {
    stopAllTimers();
    startAllTimers();
  }

  /**
   * 번개세일 타이머만 시작합니다
   */
  function startLightningTimer() {
    lightningSaleTimer.start();
  }

  /**
   * 번개세일 타이머만 중지합니다
   */
  function stopLightningTimer() {
    lightningSaleTimer.stop();
  }

  /**
   * 추천할인 타이머만 시작합니다
   */
  function startSuggestionTimer() {
    suggestionSaleTimer.start();
  }

  /**
   * 추천할인 타이머만 중지합니다
   */
  function stopSuggestionTimer() {
    suggestionSaleTimer.stop();
  }

  /**
   * 타이머 상태를 확인합니다
   */
  function getTimerStatus() {
    return {
      lightningSale: {
        isRunning: lightningSaleTimer.isRunning ? lightningSaleTimer.isRunning() : false,
      },
      suggestionSale: {
        isRunning: suggestionSaleTimer.isRunning ? suggestionSaleTimer.isRunning() : false,
      },
    };
  }

  return {
    // 전체 타이머 관리
    startAll: startAllTimers,
    stopAll: stopAllTimers,
    restartAll: restartAllTimers,

    // 개별 타이머 관리
    startLightning: startLightningTimer,
    stopLightning: stopLightningTimer,
    startSuggestion: startSuggestionTimer,
    stopSuggestion: stopSuggestionTimer,

    // 상태 확인
    getStatus: getTimerStatus,

    // 개별 타이머 인스턴스 (고급 사용자용)
    lightningSaleTimer,
    suggestionSaleTimer,
  };
}

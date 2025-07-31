/**
 * 비동기 작업 관리 유틸리티
 * React 마이그레이션을 위한 비동기 작업 관리 시스템
 */

/**
 * 타이머 관리자 클래스
 */
export class TimerManager {
  constructor() {
    this.timers = new Set();
  }

  /**
   * setTimeout 래퍼
   * @param {Function} callback - 실행할 함수
   * @param {number} delay - 지연 시간 (ms)
   * @returns {number} 타이머 ID
   */
  setTimeout(callback, delay) {
    const timerId = setTimeout(callback, delay);
    this.timers.add(timerId);
    return timerId;
  }

  /**
   * setInterval 래퍼
   * @param {Function} callback - 실행할 함수
   * @param {number} interval - 간격 (ms)
   * @returns {number} 타이머 ID
   */
  setInterval(callback, interval) {
    const timerId = setInterval(callback, interval);
    this.timers.add(timerId);
    return timerId;
  }

  /**
   * 타이머 정리
   * @param {number} timerId - 정리할 타이머 ID
   */
  clearTimer(timerId) {
    if (this.timers.has(timerId)) {
      clearTimeout(timerId);
      clearInterval(timerId);
      this.timers.delete(timerId);
    }
  }

  /**
   * 모든 타이머 정리
   */
  clearAllTimers() {
    this.timers.forEach((timerId) => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    this.timers.clear();
  }
}

/**
 * 전역 타이머 관리자 인스턴스
 */
export const timerManager = new TimerManager();

/**
 * 안전한 비동기 작업 실행
 * @param {Function} asyncFn - 비동기 함수
 * @param {Function} onSuccess - 성공 콜백
 * @param {Function} onError - 에러 콜백
 */
export function safeAsyncExecute(asyncFn, onSuccess, onError) {
  try {
    const result = asyncFn();
    if (result instanceof Promise) {
      result.then(onSuccess).catch(onError);
    } else {
      onSuccess(result);
    }
  } catch (error) {
    onError(error);
  }
}

/**
 * 지연된 작업 실행
 * @param {Function} callback - 실행할 함수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {number} 타이머 ID
 */
export function delayedExecution(callback, delay) {
  return timerManager.setTimeout(callback, delay);
}

/**
 * 주기적 작업 실행
 * @param {Function} callback - 실행할 함수
 * @param {number} interval - 간격 (ms)
 * @returns {number} 타이머 ID
 */
export function periodicExecution(callback, interval) {
  return timerManager.setInterval(callback, interval);
}

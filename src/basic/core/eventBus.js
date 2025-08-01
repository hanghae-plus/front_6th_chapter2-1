/**
 * UI 이벤트 버스
 * 컴포넌트 간 통신을 위한 중앙 이벤트 관리 시스템
 */
export class UIEventBus {
  constructor() {
    this.events = {};
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventName - 이벤트 이름
   * @param {Function} handler - 이벤트 핸들러
   */
  on(eventName, handler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  /**
   * 이벤트 발송
   * @param {string} eventName - 이벤트 이름
   * @param {*} data - 이벤트 데이터
   */
  emit(eventName, data) {
    const handlers = this.events[eventName];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} eventName - 이벤트 이름
   * @param {Function} handler - 제거할 핸들러
   */
  off(eventName, handler) {
    const handlers = this.events[eventName];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 모든 이벤트 리스너 제거
   */
  clear() {
    this.events = {};
  }
}

// 전역 이벤트 버스 인스턴스
export const uiEventBus = new UIEventBus();

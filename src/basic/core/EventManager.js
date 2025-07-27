export class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  // 순수한 이벤트 관리 메서드들
  addEventListener(element, eventType, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    const elementListeners = this.listeners.get(element);
    if (!elementListeners.has(eventType)) {
      elementListeners.set(eventType, []);
    }

    elementListeners.get(eventType).push(handler);
    element.addEventListener(eventType, handler);
  }

  removeEventListener(element, eventType, handler) {
    const elementListeners = this.listeners.get(element);
    if (elementListeners && elementListeners.has(eventType)) {
      const handlers = elementListeners.get(eventType);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        element.removeEventListener(eventType, handler);
      }
    }
  }

  removeAllListeners(element, eventType) {
    const elementListeners = this.listeners.get(element);
    if (elementListeners && elementListeners.has(eventType)) {
      const handlers = elementListeners.get(eventType);
      handlers.forEach(handler => {
        element.removeEventListener(eventType, handler);
      });
      elementListeners.delete(eventType);
    }
  }

  removeAllElementListeners(element) {
    const elementListeners = this.listeners.get(element);
    if (elementListeners) {
      elementListeners.forEach((handlers, eventType) => {
        handlers.forEach(handler => {
          element.removeEventListener(eventType, handler);
        });
      });
      this.listeners.delete(element);
    }
  }

  // 이벤트 위임을 위한 메서드
  delegateEvent(parentElement, selector, eventType, handler) {
    parentElement.addEventListener(eventType, event => {
      const target = event.target.closest(selector);
      if (target && parentElement.contains(target)) {
        handler.call(target, event, target);
      }
    });
  }

  // 커스텀 이벤트 생성 및 발송
  createCustomEvent(eventName, detail = {}) {
    return new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true,
    });
  }

  dispatchCustomEvent(element, eventName, detail = {}) {
    const event = this.createCustomEvent(eventName, detail);
    element.dispatchEvent(event);
  }

  // 이벤트 리스너 등록을 위한 헬퍼 메서드
  on(element, eventType, handler) {
    this.addEventListener(element, eventType, handler);
  }

  off(element, eventType, handler) {
    this.removeEventListener(element, eventType, handler);
  }

  // 모든 리스너 정리
  cleanup() {
    this.listeners.forEach((elementListeners, element) => {
      this.removeAllElementListeners(element);
    });
    this.listeners.clear();
  }
}

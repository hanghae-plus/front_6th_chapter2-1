export class EventManager {
  constructor() {
    this.registeredEventListeners = new Map();
  }

  // 순수한 이벤트 관리 메서드들
  registerEventListener(targetElement, eventType, eventHandler) {
    if (!this.registeredEventListeners.has(targetElement)) {
      this.registeredEventListeners.set(targetElement, new Map());
    }

    const elementEventListeners = this.registeredEventListeners.get(targetElement);
    if (!elementEventListeners.has(eventType)) {
      elementEventListeners.set(eventType, []);
    }

    elementEventListeners.get(eventType).push(eventHandler);
    targetElement.addEventListener(eventType, eventHandler);
  }

  unregisterEventListener(targetElement, eventType, eventHandler) {
    const elementEventListeners = this.registeredEventListeners.get(targetElement);
    if (elementEventListeners && elementEventListeners.has(eventType)) {
      const eventHandlers = elementEventListeners.get(eventType);
      const handlerIndex = eventHandlers.indexOf(eventHandler);
      if (handlerIndex > -1) {
        eventHandlers.splice(handlerIndex, 1);
        targetElement.removeEventListener(eventType, eventHandler);
      }
    }
  }

  removeAllEventListenersForType(targetElement, eventType) {
    const elementEventListeners = this.registeredEventListeners.get(targetElement);
    if (elementEventListeners && elementEventListeners.has(eventType)) {
      const eventHandlers = elementEventListeners.get(eventType);
      eventHandlers.forEach(eventHandler => {
        targetElement.removeEventListener(eventType, eventHandler);
      });
      elementEventListeners.delete(eventType);
    }
  }

  removeAllEventListenersForElement(targetElement) {
    const elementEventListeners = this.registeredEventListeners.get(targetElement);
    if (elementEventListeners) {
      elementEventListeners.forEach((eventHandlers, eventType) => {
        eventHandlers.forEach(eventHandler => {
          targetElement.removeEventListener(eventType, eventHandler);
        });
      });
      this.registeredEventListeners.delete(targetElement);
    }
  }

  // 이벤트 위임을 위한 메서드
  setupEventDelegation(parentElement, childSelector, eventType, eventHandler) {
    parentElement.addEventListener(eventType, event => {
      const targetChildElement = event.target.closest(childSelector);
      if (targetChildElement && parentElement.contains(targetChildElement)) {
        eventHandler.call(targetChildElement, event, targetChildElement);
      }
    });
  }

  // 커스텀 이벤트 생성 및 발송
  createCustomEvent(eventName, eventDetail = {}) {
    return new CustomEvent(eventName, {
      detail: eventDetail,
      bubbles: true,
      cancelable: true,
    });
  }

  dispatchCustomEvent(targetElement, eventName, eventDetail = {}) {
    const customEvent = this.createCustomEvent(eventName, eventDetail);
    targetElement.dispatchEvent(customEvent);
  }

  // 이벤트 리스너 등록을 위한 헬퍼 메서드
  attachEventListener(targetElement, eventType, eventHandler) {
    this.registerEventListener(targetElement, eventType, eventHandler);
  }

  detachEventListener(targetElement, eventType, eventHandler) {
    this.unregisterEventListener(targetElement, eventType, eventHandler);
  }

  // 모든 리스너 정리
  cleanupAllEventListeners() {
    this.registeredEventListeners.forEach((elementEventListeners, targetElement) => {
      this.removeAllEventListenersForElement(targetElement);
    });
    this.registeredEventListeners.clear();
  }
}

/**
 * 이벤트 버스 - 컴포넌트 간 통신을 위한 이벤트 시스템
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * 이벤트 리스너를 등록합니다.
   *
   * @param {string} eventType - 이벤트 타입
   * @param {Function} callback - 콜백 함수
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * 이벤트를 발행합니다.
   *
   * @param {string} eventType - 이벤트 타입
   * @param {*} data - 이벤트 데이터
   */
  emit(eventType, data) {
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(callback => callback(data));
  }

  /**
   * 이벤트 리스너를 제거합니다.
   *
   * @param {string} eventType - 이벤트 타입
   * @param {Function} callback - 제거할 콜백 함수
   */
  off(eventType, callback) {
    const callbacks = this.listeners.get(eventType) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * 모든 리스너를 제거합니다.
   */
  clear() {
    this.listeners.clear();
  }
}

/**
 * 이벤트 타입 정의
 */
export const EVENT_TYPES = {
  CART_UPDATED: "cart:updated",
  ITEM_ADDED: "cart:item:added",
  ITEM_REMOVED: "cart:item:removed",
  QUANTITY_CHANGED: "cart:quantity:changed",
  PRODUCT_SELECTED: "product:selected",
  STOCK_UPDATED: "stock:updated",
  DISCOUNT_APPLIED: "discount:applied",
  TOTAL_UPDATED: "total:updated",
};

// 싱글톤 인스턴스 생성
export const eventBus = new EventBus();

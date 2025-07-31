/**
 * 알림 시스템 관리자
 * React 마이그레이션을 위한 알림 시스템 분리
 */

/**
 * 알림 타입 상수
 */
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  PROMOTION: "promotion",
};

/**
 * 알림 관리자 클래스
 */
export class NotificationManager {
  constructor() {
    this.subscribers = new Set();
    this.notifications = [];
  }

  /**
   * 알림 구독
   * @param {Function} callback - 알림 수신 콜백
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * 알림 발송
   * @param {string} message - 알림 메시지
   * @param {string} type - 알림 타입
   * @param {Object} options - 추가 옵션
   */
  show(message, type = NOTIFICATION_TYPES.INFO, options = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date(),
      ...options,
    };

    this.notifications.push(notification);
    this.notifySubscribers(notification);

    // 자동 제거 (기본 5초)
    if (options.autoRemove !== false) {
      setTimeout(() => {
        this.remove(notification.id);
      }, options.duration || 5000);
    }

    return notification.id;
  }

  /**
   * 구독자들에게 알림
   * @param {Object} notification - 알림 객체
   */
  notifySubscribers(notification) {
    this.subscribers.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("알림 콜백 실행 중 오류:", error);
      }
    });
  }

  /**
   * 알림 제거
   * @param {string} id - 알림 ID
   */
  remove(id) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  /**
   * 모든 알림 제거
   */
  clear() {
    this.notifications = [];
  }

  /**
   * 현재 알림 목록 조회
   * @returns {Array} 알림 목록
   */
  getNotifications() {
    return [...this.notifications];
  }
}

/**
 * 전역 알림 관리자 인스턴스
 */
export const notificationManager = new NotificationManager();

/**
 * 편의 함수들
 */
export function showInfo(message, options = {}) {
  return notificationManager.show(message, NOTIFICATION_TYPES.INFO, options);
}

export function showSuccess(message, options = {}) {
  return notificationManager.show(message, NOTIFICATION_TYPES.SUCCESS, options);
}

export function showWarning(message, options = {}) {
  return notificationManager.show(message, NOTIFICATION_TYPES.WARNING, options);
}

export function showError(message, options = {}) {
  return notificationManager.show(message, NOTIFICATION_TYPES.ERROR, options);
}

export function showPromotion(message, options = {}) {
  return notificationManager.show(message, NOTIFICATION_TYPES.PROMOTION, {
    duration: 8000,
    ...options,
  });
}

/**
 * 기존 alert 호환성 함수
 * @param {string} message - 메시지
 */
export function showAlert(message) {
  // 기존 alert 호환성을 위해 window.alert도 호출
  window.alert(message);
  return showInfo(message, { autoRemove: false });
}

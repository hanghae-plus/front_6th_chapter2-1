/**
 * @fileoverview NotificationBar 컴포넌트
 * 일관된 알림 시스템을 제공하는 컴포넌트
 *
 * 기존 main.basic.js의 분산된 alert() 호출을 분리하여
 * 재사용 가능하고 사용자 친화적인 알림 시스템으로 구현
 */

import { ALERT_UI, formatMessage } from '../constants/UIConstants.js';

/**
 * @typedef {Object} NotificationOptions
 * @property {number} [duration=5000] - 자동 닫기 시간 (ms, 0은 수동 닫기만)
 * @property {boolean} [closable=true] - 수동 닫기 버튼 표시 여부
 * @property {boolean} [persistent=false] - 지속 표시 (자동 닫기 안 함)
 * @property {string} [position='top-right'] - 표시 위치
 * @property {boolean} [sound=false] - 알림음 재생 여부
 * @property {function} [onClose] - 닫기 콜백
 * @property {function} [onClick] - 클릭 콜백
 * @property {string} [customClass] - 추가 CSS 클래스
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - 고유 식별자
 * @property {string} type - 알림 타입 (success, warning, error, info, flash, recommend, stock)
 * @property {string} title - 제목
 * @property {string} message - 메시지 내용
 * @property {number} createdAt - 생성 시간
 * @property {NotificationOptions} options - 알림 옵션
 */

/**
 * @typedef {Object} NotificationBarState
 * @property {Array<Notification>} notifications - 현재 표시 중인 알림들
 * @property {number} maxNotifications - 최대 동시 표시 수
 * @property {boolean} isPaused - 자동 진행 일시정지 상태
 */

/**
 * 알림 시스템 컴포넌트
 * 번개세일, 추천할인, 재고 경고 등 모든 알림을 통합 관리하는 순수 함수 기반 클래스
 *
 * 기존 main.basic.js의 분산된 alert() 호출을 컴포넌트로 분리하여
 * 사용자 경험과 일관성을 향상
 */
export class NotificationBar {
  // 정적 상태 관리
  static state = {
    notifications: [],
    maxNotifications: 3,
    isPaused: false,
    container: null,
  };

  /**
   * 알림 바 컨테이너를 렌더링하고 DOM에 추가
   * @param {string} [position='top-right'] - 컨테이너 위치
   * @returns {HTMLElement} 컨테이너 요소
   */
  static render(position = 'top-right') {
    // 기존 컨테이너 제거
    NotificationBar.destroy();

    // 위치별 CSS 클래스
    const positionClasses = {
      'top-right': 'fixed top-4 right-4 z-50',
      'top-left': 'fixed top-4 left-4 z-50',
      'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
      'bottom-right': 'fixed bottom-4 right-4 z-50',
      'bottom-left': 'fixed bottom-4 left-4 z-50',
      'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
    };

    const positionClass = positionClasses[position] || positionClasses['top-right'];

    // 컨테이너 생성
    const container = document.createElement('div');
    container.id = 'notification-bar';
    container.className = `notification-container ${positionClass} space-y-2 w-80 max-w-sm`;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', '알림 영역');

    // DOM에 추가
    document.body.appendChild(container);
    NotificationBar.state.container = container;

    return container;
  }

  /**
   * 알림 생성 및 표시
   * @param {string} type - 알림 타입
   * @param {string} message - 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static createNotification(type, message, options = {}) {
    // 기본 옵션 설정
    const {
      duration = 5000,
      closable = true,
      persistent = false,
      position = 'top-right',
      sound = false,
      onClose = null,
      onClick = null,
      customClass = '',
    } = options;

    // 컨테이너가 없으면 생성
    if (!NotificationBar.state.container) {
      NotificationBar.render(position);
    }

    // 고유 ID 생성
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 알림 객체 생성
    const notification = {
      id,
      type,
      title: NotificationBar.getTitleByType(type),
      message,
      createdAt: Date.now(),
      options: { duration, closable, persistent, onClose, onClick, customClass },
    };

    // 최대 개수 확인 및 오래된 알림 제거
    NotificationBar.enforceMaxNotifications();

    // 상태에 추가
    NotificationBar.state.notifications.push(notification);

    // DOM에 렌더링
    NotificationBar.renderNotification(notification);

    // 자동 닫기 설정 (persistent가 아니고 duration이 0보다 클 때)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        NotificationBar.closeNotification(id);
      }, duration);
    }

    // 알림음 재생
    if (sound) {
      NotificationBar.playNotificationSound(type);
    }

    return id;
  }

  /**
   * 번개세일 알림 생성
   * @param {Object} product - 상품 정보
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static generateFlashSaleAlert(product, options = {}) {
    const message = formatMessage(ALERT_UI.FLASH_SALE, { productName: product.name });

    const defaultOptions = {
      duration: 8000, // 번개세일은 조금 더 오래 표시
      sound: true,
      customClass: 'flash-sale-notification',
      ...options,
    };

    return NotificationBar.createNotification('flash', message, defaultOptions);
  }

  /**
   * 추천할인 알림 생성
   * @param {Object} product - 상품 정보
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static generateRecommendAlert(product, options = {}) {
    const message = formatMessage(ALERT_UI.RECOMMEND_SALE, { productName: product.name });

    const defaultOptions = {
      duration: 7000,
      sound: true,
      customClass: 'recommend-notification',
      ...options,
    };

    return NotificationBar.createNotification('recommend', message, defaultOptions);
  }

  /**
   * 재고 경고 알림 생성
   * @param {string} message - 경고 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static generateStockAlert(message, options = {}) {
    const defaultOptions = {
      duration: 4000,
      customClass: 'stock-alert-notification',
      ...options,
    };

    return NotificationBar.createNotification('stock', message, defaultOptions);
  }

  /**
   * 성공 알림 생성
   * @param {string} message - 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static success(message, options = {}) {
    return NotificationBar.createNotification('success', message, options);
  }

  /**
   * 경고 알림 생성
   * @param {string} message - 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static warning(message, options = {}) {
    return NotificationBar.createNotification('warning', message, options);
  }

  /**
   * 오류 알림 생성
   * @param {string} message - 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static error(message, options = {}) {
    const defaultOptions = {
      duration: 6000, // 오류는 조금 더 오래 표시
      ...options,
    };
    return NotificationBar.createNotification('error', message, defaultOptions);
  }

  /**
   * 정보 알림 생성
   * @param {string} message - 메시지
   * @param {NotificationOptions} [options={}] - 알림 옵션
   * @returns {string} 알림 ID
   */
  static info(message, options = {}) {
    return NotificationBar.createNotification('info', message, options);
  }

  /**
   * 개별 알림을 DOM에 렌더링
   * @param {Notification} notification - 알림 객체
   */
  static renderNotification(notification) {
    if (!NotificationBar.state.container) return;

    const notificationElement = document.createElement('div');
    notificationElement.id = notification.id;
    notificationElement.className = NotificationBar.getNotificationClasses(notification);
    notificationElement.setAttribute('role', 'alert');
    notificationElement.setAttribute('aria-atomic', 'true');

    // 클릭 이벤트
    if (notification.options.onClick) {
      notificationElement.style.cursor = 'pointer';
      notificationElement.addEventListener('click', notification.options.onClick);
    }

    // HTML 내용 생성
    notificationElement.innerHTML = NotificationBar.generateNotificationHTML(notification);

    // 닫기 버튼 이벤트
    if (notification.options.closable) {
      const closeButton = notificationElement.querySelector('.notification-close');
      if (closeButton) {
        closeButton.addEventListener('click', e => {
          e.stopPropagation();
          NotificationBar.closeNotification(notification.id);
        });
      }
    }

    // 애니메이션과 함께 추가
    notificationElement.style.opacity = '0';
    notificationElement.style.transform = 'translateX(100%)';

    NotificationBar.state.container.appendChild(notificationElement);

    // 애니메이션 실행
    requestAnimationFrame(() => {
      notificationElement.style.transition = 'all 0.3s ease-out';
      notificationElement.style.opacity = '1';
      notificationElement.style.transform = 'translateX(0)';
    });
  }

  /**
   * 알림 HTML 내용 생성
   * @param {Notification} notification - 알림 객체
   * @returns {string} HTML 내용
   */
  static generateNotificationHTML(notification) {
    const { type, title, message, options } = notification;
    const icon = NotificationBar.getIconByType(type);

    const closeButton = options.closable
      ? `<button class="notification-close text-gray-400 hover:text-gray-600 ml-2" aria-label="알림 닫기">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
           </svg>
         </button>`
      : '';

    return `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="notification-icon text-lg">${icon}</span>
        </div>
        <div class="ml-3 flex-1">
          <div class="notification-title text-sm font-medium text-gray-900">${title}</div>
          <div class="notification-message text-sm text-gray-600 mt-1">${message}</div>
        </div>
        ${closeButton}
      </div>
    `;
  }

  /**
   * 알림 타입별 CSS 클래스 반환
   * @param {Notification} notification - 알림 객체
   * @returns {string} CSS 클래스
   */
  static getNotificationClasses(notification) {
    const { type, options } = notification;

    const baseClasses = [
      'notification-item',
      'bg-white',
      'border',
      'rounded-lg',
      'shadow-lg',
      'p-4',
      'mb-2',
      'transition-all',
      'duration-300',
      'max-w-sm',
      'w-full',
    ];

    // 타입별 테두리 색상
    const typeClasses = {
      success: 'border-green-200 bg-green-50',
      warning: 'border-orange-200 bg-orange-50',
      error: 'border-red-200 bg-red-50',
      info: 'border-blue-200 bg-blue-50',
      flash: 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50',
      recommend: 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50',
      stock: 'border-gray-200 bg-gray-50',
    };

    const typeClass = typeClasses[type] || typeClasses.info;
    const customClass = options.customClass || '';

    return [...baseClasses, typeClass, customClass].filter(Boolean).join(' ');
  }

  /**
   * 알림 타입별 아이콘 반환
   * @param {string} type - 알림 타입
   * @returns {string} 아이콘
   */
  static getIconByType(type) {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
      flash: '⚡',
      recommend: '💝',
      stock: '📦',
    };
    return icons[type] || icons.info;
  }

  /**
   * 알림 타입별 제목 반환
   * @param {string} type - 알림 타입
   * @returns {string} 제목
   */
  static getTitleByType(type) {
    const titles = {
      success: '성공',
      warning: '경고',
      error: '오류',
      info: '정보',
      flash: '번개세일',
      recommend: '추천할인',
      stock: '재고 알림',
    };
    return titles[type] || titles.info;
  }

  /**
   * 알림 닫기
   * @param {string} id - 알림 ID
   */
  static closeNotification(id) {
    const notification = NotificationBar.state.notifications.find(n => n.id === id);
    if (!notification) return;

    const element = document.getElementById(id);
    if (element) {
      // 닫기 애니메이션
      element.style.transition = 'all 0.3s ease-in';
      element.style.opacity = '0';
      element.style.transform = 'translateX(100%)';

      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }

    // 상태에서 제거
    NotificationBar.state.notifications = NotificationBar.state.notifications.filter(
      n => n.id !== id
    );

    // 닫기 콜백 실행
    if (notification.options.onClose) {
      notification.options.onClose(notification);
    }
  }

  /**
   * 모든 알림 닫기
   */
  static closeAll() {
    const currentNotifications = [...NotificationBar.state.notifications];
    currentNotifications.forEach(notification => {
      NotificationBar.closeNotification(notification.id);
    });
  }

  /**
   * 최대 알림 개수 적용
   */
  static enforceMaxNotifications() {
    const { notifications, maxNotifications } = NotificationBar.state;

    if (notifications.length >= maxNotifications) {
      // 가장 오래된 알림 제거
      const oldestNotification = notifications[0];
      NotificationBar.closeNotification(oldestNotification.id);
    }
  }

  /**
   * 알림음 재생
   * @param {string} type - 알림 타입
   */
  static playNotificationSound(type) {
    // 간단한 비프음 (실제 프로젝트에서는 오디오 파일 사용)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 타입별 다른 주파수
      const frequencies = {
        success: 523.25, // C5
        warning: 440.0, // A4
        error: 329.63, // E4
        flash: 659.25, // E5
        recommend: 783.99, // G5
        stock: 493.88, // B4
        info: 523.25, // C5
      };

      oscillator.frequency.setValueAtTime(
        frequencies[type] || frequencies.info,
        audioContext.currentTime
      );
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // 브라우저에서 오디오를 지원하지 않거나 사용자가 차단한 경우 무시
      console.debug('Notification sound not available:', error);
    }
  }

  /**
   * 알림 바 제거
   */
  static destroy() {
    if (NotificationBar.state.container) {
      NotificationBar.state.container.remove();
      NotificationBar.state.container = null;
    }
    NotificationBar.state.notifications = [];
  }

  /**
   * 중복 알림 방지 헬퍼
   * @param {string} type - 알림 타입
   * @param {string} message - 메시지
   * @returns {boolean} 중복 여부
   */
  static isDuplicate(type, message) {
    return NotificationBar.state.notifications.some(
      notification => notification.type === type && notification.message === message
    );
  }

  /**
   * 기존 alert() 호출을 대체하는 호환 함수
   * @param {string} message - 경고 메시지
   */
  static replaceAlert(message) {
    // ALERT_UI 메시지 타입 감지
    if (message.includes('번개세일') || message.includes('⚡')) {
      const productName = message.match(/⚡번개세일! (.+?)이\(가\)/)?.[1] || '상품';
      return NotificationBar.generateFlashSaleAlert({ name: productName });
    } else if (message.includes('추천') || message.includes('💝')) {
      const productName = message.match(/💝 (.+?)은\(는\)/)?.[1] || '상품';
      return NotificationBar.generateRecommendAlert({ name: productName });
    } else if (message.includes('재고가 부족합니다')) {
      return NotificationBar.generateStockAlert(message);
    } else {
      // 일반 알림
      return NotificationBar.warning(message);
    }
  }
}

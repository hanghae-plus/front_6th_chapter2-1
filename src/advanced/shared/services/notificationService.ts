/**
 * 알림 서비스
 * 에러, 성공, 정보 메시지 처리
 * 테스트시 주입 가능한 구조
 */
export interface NotificationService {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

// 기본 알림 서비스 (alert 기반)
export const defaultNotificationService: NotificationService = {
  showError: (message: string) => {
    alert(message);
  },

  showSuccess: (message: string) => {
    alert(message);
  },

  showInfo: (message: string) => {
    alert(message);
  },
};

// 알림 서비스 인스턴스
export let notificationService: NotificationService =
  defaultNotificationService;

// 알림 서비스 교체 가능 (테스트나 다른 UI 라이브러리 사용시)
export const setNotificationService = (service: NotificationService) => {
  notificationService = service;
};

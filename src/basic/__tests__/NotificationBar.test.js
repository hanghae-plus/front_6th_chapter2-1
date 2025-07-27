/**
 * @fileoverview NotificationBar 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationBar } from '../components/NotificationBar.js';

describe('NotificationBar 컴포넌트', () => {
  let container;

  beforeEach(() => {
    // Given: 기본 테스트 환경 설정
    container = document.createElement('div');
    document.body.appendChild(container);

    // 기존 알림 바 정리
    NotificationBar.destroy();

    // 시간 관련 함수 모킹
    vi.useFakeTimers();
  });

  afterEach(() => {
    // DOM 정리
    document.body.removeChild(container);
    NotificationBar.destroy();

    // 타이머 정리
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('render() 메서드', () => {
    it('알림 바 컨테이너를 올바른 위치에 생성해야 한다', () => {
      // Given: 기본 상태

      // When: render 메서드 호출
      const result = NotificationBar.render('top-right');

      // Then: 올바른 컨테이너가 생성되어야 함
      expect(result).toBeTruthy();
      expect(result.id).toBe('notification-bar');
      expect(result.className).toContain('fixed top-4 right-4');
      expect(result.getAttribute('aria-live')).toBe('polite');
      expect(result.getAttribute('aria-label')).toBe('알림 영역');
    });

    it('다양한 위치에 알림 바를 생성할 수 있어야 한다', () => {
      // Given: 다양한 위치 옵션들
      const positionTests = [
        { position: 'top-left', expected: 'top-4 left-4' },
        { position: 'bottom-center', expected: 'bottom-4 left-1/2' },
        { position: 'top-center', expected: 'top-4 left-1/2' },
      ];

      positionTests.forEach(({ position, expected }) => {
        // When: 각 위치로 render 호출
        NotificationBar.destroy(); // 이전 컨테이너 제거
        const result = NotificationBar.render(position);

        // Then: 해당 위치 클래스가 적용되어야 함
        expect(result.className).toContain(expected);
      });
    });

    it('기존 컨테이너가 있으면 제거하고 새로 생성해야 한다', () => {
      // Given: 기존 컨테이너가 있는 상태
      const firstContainer = NotificationBar.render('top-right');

      // When: 새로운 위치로 render 호출
      const secondContainer = NotificationBar.render('bottom-left');

      // Then: 기존 컨테이너는 제거되고 새 컨테이너가 생성되어야 함
      expect(document.getElementById(firstContainer.id)).toBe(secondContainer);
      expect(secondContainer.className).toContain('bottom-4 left-4');
    });
  });

  describe('createNotification() 메서드', () => {
    it('기본 알림을 생성해야 한다', () => {
      // Given: 기본 알림 정보
      const type = 'info';
      const message = '테스트 메시지';

      // When: 알림 생성
      const notificationId = NotificationBar.createNotification(type, message);

      // Then: 알림이 생성되고 DOM에 추가되어야 함
      expect(notificationId).toBeTruthy();
      expect(NotificationBar.state.notifications).toHaveLength(1);

      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement).toBeTruthy();
      expect(notificationElement.textContent).toContain(message);
    });

    it('최대 알림 개수를 초과하면 오래된 알림을 제거해야 한다', () => {
      // Given: 최대 개수만큼 알림 생성
      const maxNotifications = NotificationBar.state.maxNotifications;
      const notificationIds = [];

      for (let i = 0; i < maxNotifications; i++) {
        notificationIds.push(NotificationBar.createNotification('info', `메시지 ${i}`));
      }

      // When: 추가 알림 생성
      const newNotificationId = NotificationBar.createNotification('info', '새 메시지');

      // 애니메이션 완료 대기
      vi.advanceTimersByTime(300);

      // Then: 첫 번째 알림이 제거되고 새 알림이 추가되어야 함
      expect(NotificationBar.state.notifications).toHaveLength(maxNotifications);
      expect(document.getElementById(notificationIds[0])).toBeNull(); // 첫 번째 제거됨
      expect(document.getElementById(newNotificationId)).toBeTruthy(); // 새 알림 존재
    });

    it('자동 닫기 기능이 동작해야 한다', () => {
      // Given: 짧은 duration의 알림
      const duration = 1000;

      // When: 자동 닫기 알림 생성
      const notificationId = NotificationBar.createNotification('info', '자동 닫기 테스트', {
        duration,
      });

      // 초기에는 존재
      expect(document.getElementById(notificationId)).toBeTruthy();

      // When: 시간 경과
      vi.advanceTimersByTime(duration + 100);

      // Then: 알림이 자동으로 닫혀야 함
      expect(NotificationBar.state.notifications).toHaveLength(0);
    });
  });

  describe('generateFlashSaleAlert() 메서드', () => {
    it('번개세일 알림을 올바르게 생성해야 한다', () => {
      // Given: 상품 정보
      const product = { name: '키보드' };

      // When: 번개세일 알림 생성
      const notificationId = NotificationBar.generateFlashSaleAlert(product);

      // Then: 번개세일 스타일의 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('flash');
      expect(notification.message).toContain('⚡번개세일!');
      expect(notification.message).toContain('키보드');
      expect(notification.options.customClass).toBe('flash-sale-notification');
      expect(notification.options.duration).toBe(8000); // 더 긴 표시 시간
    });

    it('번개세일 알림이 올바른 스타일을 가져야 한다', () => {
      // Given: 상품 정보
      const product = { name: '마우스' };

      // When: 번개세일 알림 생성
      const notificationId = NotificationBar.generateFlashSaleAlert(product);

      // Then: 올바른 시각적 요소들이 포함되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('⚡'); // 번개 아이콘
      expect(notificationElement.textContent).toContain('번개세일'); // 제목
      expect(notificationElement.className).toContain(
        'bg-gradient-to-r from-yellow-50 to-orange-50'
      );
    });
  });

  describe('generateRecommendAlert() 메서드', () => {
    it('추천할인 알림을 올바르게 생성해야 한다', () => {
      // Given: 상품 정보
      const product = { name: '모니터' };

      // When: 추천할인 알림 생성
      const notificationId = NotificationBar.generateRecommendAlert(product);

      // Then: 추천할인 스타일의 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('recommend');
      expect(notification.message).toContain('💝');
      expect(notification.message).toContain('모니터');
      expect(notification.message).toContain('어떠세요?');
      expect(notification.options.customClass).toBe('recommend-notification');
    });

    it('추천할인 알림이 올바른 스타일을 가져야 한다', () => {
      // Given: 상품 정보
      const product = { name: '스피커' };

      // When: 추천할인 알림 생성
      const notificationId = NotificationBar.generateRecommendAlert(product);

      // Then: 올바른 시각적 요소들이 포함되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('💝'); // 하트 아이콘
      expect(notificationElement.textContent).toContain('추천할인'); // 제목
      expect(notificationElement.className).toContain('bg-gradient-to-r from-purple-50 to-pink-50');
    });
  });

  describe('generateStockAlert() 메서드', () => {
    it('재고 경고 알림을 올바르게 생성해야 한다', () => {
      // Given: 재고 경고 메시지
      const message = '재고가 부족합니다.';

      // When: 재고 경고 알림 생성
      const notificationId = NotificationBar.generateStockAlert(message);

      // Then: 재고 경고 스타일의 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('stock');
      expect(notification.message).toBe(message);
      expect(notification.options.customClass).toBe('stock-alert-notification');
    });

    it('재고 알림이 올바른 스타일을 가져야 한다', () => {
      // Given: 재고 경고 메시지
      const message = '상품의 재고가 부족합니다.';

      // When: 재고 경고 알림 생성
      const notificationId = NotificationBar.generateStockAlert(message);

      // Then: 올바른 시각적 요소들이 포함되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('📦'); // 상자 아이콘
      expect(notificationElement.textContent).toContain('재고 알림'); // 제목
      expect(notificationElement.className).toContain('border-gray-200 bg-gray-50');
    });
  });

  describe('success, warning, error, info 메서드', () => {
    it('성공 알림을 생성해야 한다', () => {
      // Given: 성공 메시지
      const message = '성공적으로 처리되었습니다.';

      // When: 성공 알림 생성
      const notificationId = NotificationBar.success(message);

      // Then: 성공 스타일의 알림이 생성되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('✅');
      expect(notificationElement.textContent).toContain('성공');
      expect(notificationElement.className).toContain('border-green-200 bg-green-50');
    });

    it('경고 알림을 생성해야 한다', () => {
      // Given: 경고 메시지
      const message = '주의가 필요합니다.';

      // When: 경고 알림 생성
      const notificationId = NotificationBar.warning(message);

      // Then: 경고 스타일의 알림이 생성되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('⚠️');
      expect(notificationElement.textContent).toContain('경고');
      expect(notificationElement.className).toContain('border-orange-200 bg-orange-50');
    });

    it('오류 알림을 생성해야 한다', () => {
      // Given: 오류 메시지
      const message = '오류가 발생했습니다.';

      // When: 오류 알림 생성
      const notificationId = NotificationBar.error(message);

      // Then: 오류 스타일의 알림이 생성되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('❌');
      expect(notificationElement.textContent).toContain('오류');
      expect(notificationElement.className).toContain('border-red-200 bg-red-50');
    });

    it('정보 알림을 생성해야 한다', () => {
      // Given: 정보 메시지
      const message = '유용한 정보입니다.';

      // When: 정보 알림 생성
      const notificationId = NotificationBar.info(message);

      // Then: 정보 스타일의 알림이 생성되어야 함
      const notificationElement = document.getElementById(notificationId);
      expect(notificationElement.textContent).toContain('ℹ️');
      expect(notificationElement.textContent).toContain('정보');
      expect(notificationElement.className).toContain('border-blue-200 bg-blue-50');
    });
  });

  describe('closeNotification() 메서드', () => {
    it('특정 알림을 닫을 수 있어야 한다', () => {
      // Given: 여러 알림이 있는 상태
      const id1 = NotificationBar.createNotification('info', '메시지 1');
      const id2 = NotificationBar.createNotification('info', '메시지 2');

      // When: 첫 번째 알림 닫기
      NotificationBar.closeNotification(id1);

      // 애니메이션 완료 대기
      vi.advanceTimersByTime(300);

      // Then: 첫 번째 알림만 제거되어야 함
      expect(NotificationBar.state.notifications).toHaveLength(1);
      expect(NotificationBar.state.notifications[0].id).toBe(id2);
      expect(document.getElementById(id1)).toBeNull();
      expect(document.getElementById(id2)).toBeTruthy();
    });

    it('닫기 콜백이 실행되어야 한다', () => {
      // Given: 닫기 콜백이 있는 알림
      const onCloseSpy = vi.fn();
      const notificationId = NotificationBar.createNotification('info', '콜백 테스트', {
        onClose: onCloseSpy,
      });

      // When: 알림 닫기
      NotificationBar.closeNotification(notificationId);

      // Then: 콜백이 실행되어야 함
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeAll() 메서드', () => {
    it('모든 알림을 닫을 수 있어야 한다', () => {
      // Given: 여러 알림이 있는 상태
      NotificationBar.createNotification('info', '메시지 1');
      NotificationBar.createNotification('warning', '메시지 2');
      NotificationBar.createNotification('error', '메시지 3');

      // When: 모든 알림 닫기
      NotificationBar.closeAll();

      // Then: 모든 알림이 제거되어야 함
      expect(NotificationBar.state.notifications).toHaveLength(0);
    });
  });

  describe('replaceAlert() 메서드', () => {
    it('번개세일 alert를 알림으로 변환해야 한다', () => {
      // Given: 번개세일 alert 메시지
      const message = '⚡번개세일! 키보드이(가) 20% 할인 중입니다!';

      // When: alert 대체
      const notificationId = NotificationBar.replaceAlert(message);

      // Then: 번개세일 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('flash');
    });

    it('추천할인 alert를 알림으로 변환해야 한다', () => {
      // Given: 추천할인 alert 메시지
      const message = '💝 마우스은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!';

      // When: alert 대체
      const notificationId = NotificationBar.replaceAlert(message);

      // Then: 추천할인 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('recommend');
    });

    it('재고 부족 alert를 알림으로 변환해야 한다', () => {
      // Given: 재고 부족 alert 메시지
      const message = '재고가 부족합니다.';

      // When: alert 대체
      const notificationId = NotificationBar.replaceAlert(message);

      // Then: 재고 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('stock');
    });

    it('일반 alert를 경고 알림으로 변환해야 한다', () => {
      // Given: 일반 alert 메시지
      const message = '일반적인 알림 메시지입니다.';

      // When: alert 대체
      const notificationId = NotificationBar.replaceAlert(message);

      // Then: 경고 알림이 생성되어야 함
      const notification = NotificationBar.state.notifications.find(n => n.id === notificationId);
      expect(notification.type).toBe('warning');
    });
  });

  describe('이벤트 처리', () => {
    it('닫기 버튼 클릭 시 알림이 닫혀야 한다', () => {
      // Given: 닫기 버튼이 있는 알림
      const notificationId = NotificationBar.createNotification('info', '닫기 테스트', {
        closable: true,
      });

      // When: 닫기 버튼 클릭
      const closeButton = document.querySelector('.notification-close');
      closeButton.click();

      // 애니메이션 완료 대기
      vi.advanceTimersByTime(300);

      // Then: 알림이 닫혀야 함
      expect(NotificationBar.state.notifications).toHaveLength(0);
      expect(document.getElementById(notificationId)).toBeNull();
    });

    it('클릭 콜백이 실행되어야 한다', () => {
      // Given: 클릭 콜백이 있는 알림
      const onClickSpy = vi.fn();
      const notificationId = NotificationBar.createNotification('info', '클릭 테스트', {
        onClick: onClickSpy,
      });

      // When: 알림 클릭
      const notificationElement = document.getElementById(notificationId);
      notificationElement.click();

      // Then: 콜백이 실행되어야 함
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('접근성', () => {
    it('올바른 ARIA 속성을 가져야 한다', () => {
      // Given: 알림 생성
      const notificationId = NotificationBar.createNotification('info', '접근성 테스트');

      // When: 알림 요소 확인
      const notificationElement = document.getElementById(notificationId);

      // Then: 올바른 ARIA 속성이 설정되어야 함
      expect(notificationElement.getAttribute('role')).toBe('alert');
      expect(notificationElement.getAttribute('aria-atomic')).toBe('true');

      const container = NotificationBar.state.container;
      expect(container.getAttribute('aria-live')).toBe('polite');
      expect(container.getAttribute('aria-label')).toBe('알림 영역');
    });

    it('닫기 버튼에 적절한 레이블이 있어야 한다', () => {
      // Given: 닫기 버튼이 있는 알림
      NotificationBar.createNotification('info', '접근성 테스트', { closable: true });

      // When: 닫기 버튼 확인
      const closeButton = document.querySelector('.notification-close');

      // Then: 적절한 레이블이 있어야 함
      expect(closeButton.getAttribute('aria-label')).toBe('알림 닫기');
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('여러 타입의 알림이 함께 동작해야 한다', () => {
      // Given: 다양한 타입의 알림들

      // When: 여러 알림 생성 (maxNotifications=3이므로 마지막 3개만 남음)
      const flashId = NotificationBar.generateFlashSaleAlert({ name: '키보드' });
      const recommendId = NotificationBar.generateRecommendAlert({ name: '마우스' });
      const stockId = NotificationBar.generateStockAlert('재고가 부족합니다.');
      const successId = NotificationBar.success('처리 완료');

      // 애니메이션 완료 대기
      vi.advanceTimersByTime(300);

      // Then: 최대 개수만큼 알림이 표시되어야 함 (첫 번째 제거됨)
      expect(NotificationBar.state.notifications).toHaveLength(3);

      expect(document.getElementById(flashId)).toBeNull(); // 첫 번째 제거됨
      expect(document.getElementById(recommendId)).toBeTruthy();
      expect(document.getElementById(stockId)).toBeTruthy();
      expect(document.getElementById(successId)).toBeTruthy();

      // 각각 다른 스타일을 가져야 함 (남은 알림들만)
      expect(document.getElementById(recommendId).textContent).toContain('💝');
      expect(document.getElementById(stockId).textContent).toContain('📦');
      expect(document.getElementById(successId).textContent).toContain('✅');
    });

    it('실제 상황과 같은 알림 흐름이 동작해야 한다', () => {
      // Given: 실제 쇼핑 시나리오

      // When: 상품 추가 → 번개세일 → 추천 → 재고 부족 순서로 알림
      const step1 = NotificationBar.success('장바구니에 추가되었습니다.');

      vi.advanceTimersByTime(1000);
      const step2 = NotificationBar.generateFlashSaleAlert({ name: '키보드' });

      vi.advanceTimersByTime(2000);
      const step3 = NotificationBar.generateRecommendAlert({ name: '마우스' });

      vi.advanceTimersByTime(1000);
      const step4 = NotificationBar.generateStockAlert('선택한 상품의 재고가 부족합니다.', {
        duration: 10000,
      }); // 더 긴 duration

      // Then: 시간 흐름에 따라 알림이 적절히 관리되어야 함
      // 성공 알림은 기본 5초 후 사라져야 함
      vi.advanceTimersByTime(5000);
      // 애니메이션 완료 대기
      vi.advanceTimersByTime(300);
      expect(document.getElementById(step1)).toBeNull();

      // 남은 알림들 확인 (step2=8초, step3=7초, step4=10초로 모두 아직 존재)
      // maxNotifications=3이므로 step2는 제거되었을 수 있음
      expect(document.getElementById(step3)).toBeTruthy();
      expect(document.getElementById(step4)).toBeTruthy();
    });
  });
});

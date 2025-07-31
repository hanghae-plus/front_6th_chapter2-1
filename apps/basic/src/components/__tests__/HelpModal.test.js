/**
 * @fileoverview HelpModal 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelpModal } from '../HelpModal.js';

describe('HelpModal 컴포넌트', () => {
  let mockData;
  let container;

  beforeEach(() => {
    // Given: 기본 테스트 데이터 설정
    mockData = {
      title: '📖 테스트 도움말',
      sections: [
        {
          title: '💰 할인 정책',
          subsections: [
            {
              title: '개별 상품',
              items: ['키보드 10개↑: 10%', '마우스 10개↑: 15%']
            },
            {
              title: '전체 수량',
              items: ['30개 이상: 25%']
            }
          ]
        },
        {
          title: '🎁 포인트 적립',
          subsections: [
            {
              title: '기본',
              items: ['구매액의 0.1%']
            },
            {
              title: '추가',
              items: ['화요일: 2배', '키보드+마우스: +50p']
            }
          ]
        }
      ],
      tips: {
        title: '💡 TIP',
        items: ['화요일 대량구매 = MAX 혜택', '⚡+💝 중복 가능']
      }
    };

    // DOM 컨테이너 설정
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // DOM 정리
    document.body.removeChild(container);

    // 이벤트 리스너 정리
    const existingModals = document.querySelectorAll('[role="dialog"]');
    existingModals.forEach(modal => modal.remove());
  });

  describe('render() 메서드', () => {
    it('정상적인 데이터로 완전한 모달을 렌더링해야 한다', () => {
      // Given: 완전한 도움말 데이터

      // When: render 메서드 호출
      const result = HelpModal.render(mockData);

      // Then: 올바른 모달 구조가 생성되어야 함
      expect(result).toHaveProperty('overlay');
      expect(result).toHaveProperty('modal');
      expect(result).toHaveProperty('open');
      expect(result).toHaveProperty('close');

      expect(result.overlay.getAttribute('role')).toBe('dialog');
      expect(result.overlay.getAttribute('aria-modal')).toBe('true');
      expect(result.modal.querySelector('#help-modal-title')).toBeTruthy();
      expect(result.modal.querySelector('.help-modal-close')).toBeTruthy();
    });

    it('필수 데이터가 없으면 에러를 발생시켜야 한다', () => {
      // Given: 잘못된 데이터

      // When & Then: 에러 발생 확인
      expect(() => HelpModal.render(null)).toThrow(
        'HelpModal.render: 유효한 도움말 데이터가 필요합니다.'
      );
      expect(() => HelpModal.render({})).toThrow(
        'HelpModal.render: 유효한 도움말 데이터가 필요합니다.'
      );
    });

    it('옵션을 통해 모달 동작을 제어할 수 있어야 한다', () => {
      // Given: 커스텀 옵션들
      const options = {
        position: 'center',
        overlayClass: 'custom-overlay',
        modalClass: 'custom-modal',
        closeOnBackgroundClick: false,
        closeOnEscKey: false,
        enableFocusTrap: false
      };

      // When: 옵션과 함께 render 호출
      const result = HelpModal.render(mockData, options);

      // Then: 옵션이 적용되어야 함
      expect(result.overlay.className).toContain('custom-overlay');
      expect(result.modal.className).toContain('custom-modal');
      expect(result.modal.className).toContain('justify-center'); // center 위치
    });
  });

  describe('generateModalOverlay() 메서드', () => {
    it('올바른 오버레이 요소를 생성해야 한다', () => {
      // Given: 추가 CSS 클래스
      const additionalClass = 'test-overlay';

      // When: 오버레이 생성
      const overlay = HelpModal.generateModalOverlay(additionalClass);

      // Then: 올바른 속성들이 설정되어야 함
      expect(overlay.tagName).toBe('DIV');
      expect(overlay.className).toContain(
        'fixed inset-0 bg-black/50 z-40 hidden'
      );
      expect(overlay.className).toContain(additionalClass);
      expect(overlay.getAttribute('role')).toBe('dialog');
      expect(overlay.getAttribute('aria-modal')).toBe('true');
      expect(overlay.getAttribute('aria-labelledby')).toBe('help-modal-title');
    });

    it('추가 클래스 없이도 기본 오버레이를 생성해야 한다', () => {
      // Given: 추가 클래스 없음

      // When: 기본 오버레이 생성
      const overlay = HelpModal.generateModalOverlay();

      // Then: 기본 클래스들만 적용되어야 함
      expect(overlay.className).toBe(
        'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300'
      );
    });
  });

  describe('generateModalContainer() 메서드', () => {
    it('right 위치의 모달 컨테이너를 생성해야 한다', () => {
      // Given: right 위치 옵션
      const position = 'right';

      // When: 모달 컨테이너 생성
      const modal = HelpModal.generateModalContainer(mockData, '', position);

      // Then: right 위치 클래스가 적용되어야 함
      expect(modal.className).toContain('right-0');
      expect(modal.className).toContain('translate-x-full');
      expect(modal.getAttribute('tabindex')).toBe('-1');
    });

    it('left 위치의 모달 컨테이너를 생성해야 한다', () => {
      // Given: left 위치 옵션
      const position = 'left';

      // When: 모달 컨테이너 생성
      const modal = HelpModal.generateModalContainer(mockData, '', position);

      // Then: left 위치 클래스가 적용되어야 함
      expect(modal.className).toContain('left-0');
      expect(modal.className).toContain('-translate-x-full');
    });

    it('center 위치의 모달 컨테이너를 생성해야 한다', () => {
      // Given: center 위치 옵션
      const position = 'center';

      // When: 모달 컨테이너 생성
      const modal = HelpModal.generateModalContainer(mockData, '', position);

      // Then: center 위치 클래스가 적용되어야 함
      expect(modal.className).toContain('justify-center');
      expect(modal.className).toContain('items-center');
    });
  });

  describe('generateModalHeader() 메서드', () => {
    it('제목과 닫기 버튼이 포함된 헤더를 생성해야 한다', () => {
      // Given: 모달 제목
      const title = '📖 테스트 도움말';

      // When: 헤더 생성
      const header = HelpModal.generateModalHeader(title);

      // Then: 제목과 닫기 버튼이 포함되어야 함
      expect(header.querySelector('#help-modal-title').textContent).toBe(title);
      expect(header.querySelector('.help-modal-close')).toBeTruthy();
      expect(
        header.querySelector('.help-modal-close').getAttribute('aria-label')
      ).toBe('도움말 닫기');
      expect(header.querySelector('svg')).toBeTruthy(); // X 아이콘
    });

    it('올바른 HTML 구조를 가져야 한다', () => {
      // Given: 모달 제목
      const title = '테스트 제목';

      // When: 헤더 생성
      const header = HelpModal.generateModalHeader(title);

      // Then: 올바른 구조와 클래스가 적용되어야 함
      expect(header.className).toContain(
        'flex justify-between items-center mb-4'
      );
      expect(header.querySelector('h2').id).toBe('help-modal-title');
      expect(header.querySelector('button').type).toBe('button');
    });
  });

  describe('generateSection() 메서드', () => {
    it('섹션을 올바르게 생성해야 한다', () => {
      // Given: 섹션 데이터
      const section = {
        title: '💰 할인 정책',
        subsections: [
          {
            title: '개별 상품',
            items: ['키보드 10개↑: 10%', '마우스 10개↑: 15%']
          }
        ]
      };

      // When: 섹션 생성
      const result = HelpModal.generateSection(section);

      // Then: 섹션 제목과 하위 섹션이 포함되어야 함
      expect(result).toContain('💰 할인 정책');
      expect(result).toContain('개별 상품');
      expect(result).toContain('키보드 10개↑: 10%');
      expect(result).toContain('마우스 10개↑: 15%');
      expect(result).toContain('mb-6'); // 섹션 간격
      expect(result).toContain('space-y-3'); // 하위 섹션 간격
    });

    it('여러 하위 섹션을 처리해야 한다', () => {
      // Given: 여러 하위 섹션이 있는 섹션
      const section = {
        title: '테스트 섹션',
        subsections: [
          { title: '하위섹션1', items: ['항목1', '항목2'] },
          { title: '하위섹션2', items: ['항목3', '항목4'] }
        ]
      };

      // When: 섹션 생성
      const result = HelpModal.generateSection(section);

      // Then: 모든 하위 섹션이 포함되어야 함
      expect(result).toContain('하위섹션1');
      expect(result).toContain('하위섹션2');
      expect(result).toContain('항목1');
      expect(result).toContain('항목3');
    });
  });

  describe('generateSubsection() 메서드', () => {
    it('하위 섹션을 올바르게 생성해야 한다', () => {
      // Given: 하위 섹션 데이터
      const subsection = {
        title: '개별 상품',
        items: ['키보드 10개↑: 10%', '마우스 10개↑: 15%']
      };

      // When: 하위 섹션 생성
      const result = HelpModal.generateSubsection(subsection);

      // Then: 제목과 항목들이 올바르게 포함되어야 함
      expect(result).toContain('개별 상품');
      expect(result).toContain('• 키보드 10개↑: 10%');
      expect(result).toContain('• 마우스 10개↑: 15%');
      expect(result).toContain('bg-gray-100'); // 배경 스타일
      expect(result).toContain('font-semibold'); // 제목 스타일
    });

    it('항목들을 bullet point로 표시해야 한다', () => {
      // Given: 여러 항목이 있는 하위 섹션
      const subsection = {
        title: '테스트',
        items: ['항목A', '항목B', '항목C']
      };

      // When: 하위 섹션 생성
      const result = HelpModal.generateSubsection(subsection);

      // Then: 모든 항목이 bullet point와 함께 표시되어야 함
      expect(result).toContain('• 항목A');
      expect(result).toContain('• 항목B');
      expect(result).toContain('• 항목C');
    });
  });

  describe('generateTipsSection() 메서드', () => {
    it('팁 섹션을 올바르게 생성해야 한다', () => {
      // Given: 팁 데이터
      const tips = {
        title: '💡 TIP',
        items: ['화요일 대량구매 = MAX 혜택', '⚡+💝 중복 가능']
      };

      // When: 팁 섹션 생성
      const result = HelpModal.generateTipsSection(tips);

      // Then: 팁 제목과 항목들이 포함되어야 함
      expect(result).toContain('💡 TIP');
      expect(result).toContain('• 화요일 대량구매 = MAX 혜택');
      expect(result).toContain('• ⚡+💝 중복 가능');
      expect(result).toContain('border-t'); // 상단 테두리
      expect(result).toContain('text-2xs'); // 작은 텍스트
    });

    it('빈 팁 항목도 처리해야 한다', () => {
      // Given: 빈 팁 데이터
      const tips = {
        title: '팁',
        items: []
      };

      // When: 팁 섹션 생성
      const result = HelpModal.generateTipsSection(tips);

      // Then: 제목은 포함되고 내용은 비어있어야 함
      expect(result).toContain('팁');
      expect(result).not.toContain('•');
    });
  });

  describe('showModal() 및 hideModal() 메서드', () => {
    it('모달을 올바르게 표시해야 한다', () => {
      // Given: 모달 요소들
      const overlay = document.createElement('div');
      const modal = document.createElement('div');
      overlay.classList.add('hidden');
      modal.classList.add('translate-x-full');

      const onOpenSpy = vi.fn();

      // When: 모달 표시
      HelpModal.showModal(overlay, modal, onOpenSpy);

      // Then: hidden 클래스가 제거되어야 함
      expect(overlay.classList.contains('hidden')).toBe(false);

      // 애니메이션 완료 대기
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(modal.classList.contains('translate-x-full')).toBe(false);
          expect(onOpenSpy).toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('모달을 올바르게 숨겨야 한다', () => {
      // Given: 표시된 모달 요소들
      const overlay = document.createElement('div');
      const modal = document.createElement('div');
      const onCloseSpy = vi.fn();

      // When: 모달 숨김
      HelpModal.hideModal(overlay, modal, onCloseSpy);

      // Then: translate 클래스가 추가되어야 함
      expect(modal.classList.contains('translate-x-full')).toBe(true);

      // 애니메이션 완료 대기
      return new Promise(resolve => {
        setTimeout(() => {
          expect(overlay.classList.contains('hidden')).toBe(true);
          expect(onCloseSpy).toHaveBeenCalled();
          resolve();
        }, 350);
      });
    });
  });

  describe('setupFocusTrap() 메서드', () => {
    it('포커스 가능한 요소들 간 Tab 순환을 설정해야 한다', () => {
      // Given: 포커스 가능한 요소들이 있는 모달
      const modal = document.createElement('div');
      modal.innerHTML = `
        <button id="first">첫 번째</button>
        <button id="second">두 번째</button>
        <button id="last">마지막</button>
      `;
      document.body.appendChild(modal);

      // When: 포커스 트랩 설정
      HelpModal.setupFocusTrap(modal);

      // Then: Tab 키 이벤트가 설정되어야 함
      const firstButton = modal.querySelector('#first');
      const lastButton = modal.querySelector('#last');

      // 마지막 요소에서 Tab 키 테스트
      lastButton.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefault = vi.fn();
      tabEvent.preventDefault = preventDefault;

      modal.dispatchEvent(tabEvent);

      // DOM 정리
      document.body.removeChild(modal);
    });

    it('포커스 가능한 요소가 없으면 아무것도 하지 않아야 한다', () => {
      // Given: 포커스 가능한 요소가 없는 모달
      const modal = document.createElement('div');
      modal.innerHTML = '<div>내용</div>';

      // When: 포커스 트랩 설정 시도
      // Then: 에러가 발생하지 않아야 함
      expect(() => HelpModal.setupFocusTrap(modal)).not.toThrow();
    });
  });

  describe('createCompatibleModal() 메서드', () => {
    it('기존 main.basic.js와 호환되는 구조를 반환해야 한다', () => {
      // Given: 호환 모달 생성 요청

      // When: 호환 모달 생성
      const compatibleModal = HelpModal.createCompatibleModal();

      // Then: 기존 구조와 일치하는 속성들을 가져야 함
      expect(compatibleModal).toHaveProperty('overlay');
      expect(compatibleModal).toHaveProperty('column');
      expect(compatibleModal).toHaveProperty('toggle');
      expect(compatibleModal).toHaveProperty('open');
      expect(compatibleModal).toHaveProperty('close');

      expect(typeof compatibleModal.toggle).toBe('function');
      expect(typeof compatibleModal.open).toBe('function');
      expect(typeof compatibleModal.close).toBe('function');
    });

    it('toggle 함수가 올바르게 동작해야 한다', () => {
      // Given: 호환 모달
      const compatibleModal = HelpModal.createCompatibleModal();

      // When: toggle 호출 (숨겨진 상태에서)
      compatibleModal.overlay.classList.add('hidden');
      compatibleModal.toggle();

      // Then: 모달이 표시되어야 함
      expect(compatibleModal.overlay.classList.contains('hidden')).toBe(false);

      // When: toggle 다시 호출 (표시된 상태에서)
      compatibleModal.toggle();

      // Then: 모달이 숨겨져야 함
      expect(
        compatibleModal.column.classList.contains('translate-x-full')
      ).toBe(true);
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('전체 모달 생성부터 이벤트 처리까지 완전히 동작해야 한다', () => {
      // Given: 완전한 도움말 데이터와 옵션
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const options = { onOpen, onClose };

      // When: 모달 생성 및 DOM에 추가
      const helpModal = HelpModal.render(mockData, options);
      container.appendChild(helpModal.overlay);

      // 모달 열기
      helpModal.open();

      // Then: 모달이 표시되고 콜백이 호출되어야 함
      expect(helpModal.overlay.classList.contains('hidden')).toBe(false);

      return new Promise(resolve => {
        requestAnimationFrame(() => {
          expect(onOpen).toHaveBeenCalled();

          // 닫기 버튼 클릭
          const closeButton =
            helpModal.modal.querySelector('.help-modal-close');
          closeButton.click();

          // 애니메이션 완료 대기
          setTimeout(() => {
            expect(helpModal.overlay.classList.contains('hidden')).toBe(true);
            expect(onClose).toHaveBeenCalled();
            resolve();
          }, 350);
        });
      });
    });

    it('실제 MANUAL_DATA로 모달을 생성할 수 있어야 한다', () => {
      // Given: 실제 MANUAL_DATA 사용

      // When: 기본 데이터로 모달 생성
      const helpModal = HelpModal.render(); // MANUAL_DATA 사용

      // Then: 실제 도움말 내용이 포함되어야 함
      const content = helpModal.modal.innerHTML;
      expect(content).toContain('💰 할인 정책');
      expect(content).toContain('🎁 포인트 적립');
      expect(content).toContain('💡 TIP');
      expect(content).toContain('키보드 10개↑');
      expect(content).toContain('화요일: 2배');
    });

    it('키보드 접근성이 올바르게 동작해야 한다', () => {
      // Given: 포커스 트랩이 활성화된 모달
      const helpModal = HelpModal.render(mockData);
      container.appendChild(helpModal.overlay);

      // When: 모달 열기
      helpModal.open();

      return new Promise(resolve => {
        requestAnimationFrame(() => {
          // ESC 키로 닫기 테스트
          const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          document.dispatchEvent(escEvent);

          // Then: 모달이 닫혀야 함
          setTimeout(() => {
            expect(helpModal.overlay.classList.contains('hidden')).toBe(true);
            resolve();
          }, 350);
        });
      });
    });
  });
});

/**
 * @fileoverview HelpModal 컴포넌트
 * 할인 정책과 포인트 적립 안내를 표시하는 모달 컴포넌트
 *
 * 기존 main.basic.js의 하드코딩된 모달 로직을 분리하여
 * 재사용 가능하고 접근성을 고려한 모달 시스템으로 구현
 */

import { MANUAL_DATA } from '@constants/UIConstants';

/**
 * @typedef {Object} HelpModalOptions
 * @property {boolean} [closeOnBackgroundClick=true] - 배경 클릭 시 닫기 여부
 * @property {boolean} [closeOnEscKey=true] - ESC 키로 닫기 여부
 * @property {boolean} [enableFocusTrap=true] - 포커스 트랩 활성화 여부
 * @property {string} [overlayClass] - 추가 오버레이 CSS 클래스
 * @property {string} [modalClass] - 추가 모달 CSS 클래스
 * @property {string} [position='right'] - 모달 위치 (right, left, center)
 * @property {function} [onOpen] - 모달 열기 콜백
 * @property {function} [onClose] - 모달 닫기 콜백
 */

/**
 * @typedef {Object} HelpSection
 * @property {string} title - 섹션 제목
 * @property {Array<HelpSubsection>} subsections - 하위 섹션들
 */

/**
 * @typedef {Object} HelpSubsection
 * @property {string} title - 하위 섹션 제목
 * @property {Array<string>} items - 항목들
 */

/**
 * @typedef {Object} HelpTips
 * @property {string} title - 팁 섹션 제목
 * @property {Array<string>} items - 팁 항목들
 */

/**
 * @typedef {Object} HelpModalData
 * @property {string} title - 모달 제목
 * @property {Array<HelpSection>} sections - 도움말 섹션들
 * @property {HelpTips} tips - 팁 섹션
 */

/**
 * 도움말 모달 컴포넌트
 * 할인 정책, 포인트 적립 안내를 제공하는 순수 함수 기반 클래스
 *
 * 기존 main.basic.js의 복잡한 모달 로직을 컴포넌트로 분리하여
 * 재사용성과 접근성을 향상
 */
export class HelpModal {
  /**
   * 전체 도움말 모달을 렌더링
   * @param {HelpModalData} [data=MANUAL_DATA] - 도움말 데이터
   * @param {HelpModalOptions} [options={}] - 모달 옵션
   * @returns {Object} 모달 DOM 요소들과 제어 함수들
   */
  static render(data = MANUAL_DATA, options = {}) {
    // 기본 옵션 설정
    const {
      closeOnBackgroundClick = true,
      closeOnEscKey = true,
      enableFocusTrap = true,
      overlayClass = '',
      modalClass = '',
      position = 'right',
      onOpen = null,
      onClose = null,
    } = options;

    // 데이터 유효성 검사
    if (!data || !data.sections) {
      throw new Error('HelpModal.render: 유효한 도움말 데이터가 필요합니다.');
    }

    // 모달 구성 요소들 생성
    const overlay = HelpModal.generateModalOverlay(overlayClass);
    const modal = HelpModal.generateModalContainer(data, modalClass, position);
    const header = HelpModal.generateModalHeader(data.title);
    const content = HelpModal.generateModalContent(data);

    // 모달 조립
    modal.appendChild(header);
    modal.appendChild(content);
    overlay.appendChild(modal);

    // 이벤트 핸들러 설정
    const closeModal = () => {
      HelpModal.hideModal(overlay, modal, onClose);
    };

    const openModal = () => {
      HelpModal.showModal(overlay, modal, onOpen);
    };

    // 배경 클릭 이벤트
    if (closeOnBackgroundClick) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    // 닫기 버튼 이벤트
    const closeButton = modal.querySelector('.help-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    // ESC 키 이벤트
    if (closeOnEscKey) {
      const handleKeydown = e => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);
    }

    // 포커스 트랩 설정
    if (enableFocusTrap) {
      HelpModal.setupFocusTrap(modal);
    }

    return {
      overlay,
      modal,
      open: openModal,
      close: closeModal,
    };
  }

  /**
   * 모달 오버레이(배경)를 생성
   * @param {string} [additionalClass=''] - 추가 CSS 클래스
   * @returns {HTMLElement} 오버레이 요소
   */
  static generateModalOverlay(additionalClass = '') {
    const overlay = document.createElement('div');
    const classes = [
      'fixed',
      'inset-0',
      'bg-black/50',
      'z-40',
      'hidden',
      'transition-opacity',
      'duration-300',
      additionalClass,
    ]
      .filter(Boolean)
      .join(' ');

    overlay.className = classes;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'help-modal-title');

    return overlay;
  }

  /**
   * 모달 컨테이너를 생성
   * @param {HelpModalData} data - 도움말 데이터
   * @param {string} [additionalClass=''] - 추가 CSS 클래스
   * @param {string} [position='right'] - 모달 위치
   * @returns {HTMLElement} 모달 컨테이너
   */
  static generateModalContainer(data, additionalClass = '', position = 'right') {
    const modal = document.createElement('div');

    // 위치별 CSS 클래스 설정
    const positionClasses = {
      right:
        'fixed right-0 top-0 h-full w-80 transform translate-x-full transition-transform duration-300',
      left: 'fixed left-0 top-0 h-full w-80 transform -translate-x-full transition-transform duration-300',
      center: 'fixed inset-0 flex items-center justify-center p-4',
    };

    const classes = [
      positionClasses[position] || positionClasses.right,
      'bg-white',
      'shadow-2xl',
      'p-6',
      'overflow-y-auto',
      'z-50',
      additionalClass,
    ]
      .filter(Boolean)
      .join(' ');

    modal.className = classes;
    modal.setAttribute('tabindex', '-1');

    return modal;
  }

  /**
   * 모달 헤더(제목과 닫기 버튼)를 생성
   * @param {string} title - 모달 제목
   * @returns {HTMLElement} 헤더 요소
   */
  static generateModalHeader(title) {
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';

    header.innerHTML = `
      <h2 id="help-modal-title" class="text-xl font-bold">${title}</h2>
      <button 
        class="help-modal-close text-gray-500 hover:text-black transition-colors p-1 rounded-md hover:bg-gray-100"
        aria-label="도움말 닫기"
        type="button"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;

    return header;
  }

  /**
   * 모달 콘텐츠(섹션들과 팁)를 생성
   * @param {HelpModalData} data - 도움말 데이터
   * @returns {HTMLElement} 콘텐츠 요소
   */
  static generateModalContent(data) {
    const content = document.createElement('div');
    content.className = 'help-modal-content';

    // 섹션들 생성
    const sectionsHTML = data.sections.map(section => HelpModal.generateSection(section)).join('');

    // 팁 섹션 생성
    const tipsHTML = data.tips ? HelpModal.generateTipsSection(data.tips) : '';

    content.innerHTML = sectionsHTML + tipsHTML;
    return content;
  }

  /**
   * 개별 섹션(할인 정책, 포인트 적립 등)을 생성
   * @param {HelpSection} section - 섹션 데이터
   * @returns {string} 섹션 HTML
   */
  static generateSection(section) {
    const subsectionsHTML = section.subsections
      .map(subsection => HelpModal.generateSubsection(subsection))
      .join('');

    return `
      <div class="mb-6">
        <h3 class="text-base font-bold mb-3">${section.title}</h3>
        <div class="space-y-3">
          ${subsectionsHTML}
        </div>
      </div>
    `;
  }

  /**
   * 하위 섹션을 생성
   * @param {HelpSubsection} subsection - 하위 섹션 데이터
   * @returns {string} 하위 섹션 HTML
   */
  static generateSubsection(subsection) {
    const itemsHTML = subsection.items.map(item => `• ${item}`).join('<br>\n          ');

    return `
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">${subsection.title}</p>
        <p class="text-gray-700 text-xs pl-2">
          ${itemsHTML}
        </p>
      </div>
    `;
  }

  /**
   * 팁 섹션을 생성
   * @param {HelpTips} tips - 팁 데이터
   * @returns {string} 팁 섹션 HTML
   */
  static generateTipsSection(tips) {
    const itemsHTML = tips.items.map(tip => `• ${tip}`).join('<br>\n        ');

    return `
      <div class="border-t border-gray-200 pt-4 mt-4">
        <p class="text-xs font-bold mb-1">${tips.title}</p>
        <p class="text-2xs text-gray-600 leading-relaxed">
          ${itemsHTML}
        </p>
      </div>
    `;
  }

  /**
   * 모달을 표시
   * @param {HTMLElement} overlay - 오버레이 요소
   * @param {HTMLElement} modal - 모달 요소
   * @param {function} [onOpen] - 열기 콜백
   */
  static showModal(overlay, modal, onOpen = null) {
    overlay.classList.remove('hidden');

    // 애니메이션을 위한 지연
    requestAnimationFrame(() => {
      modal.classList.remove('translate-x-full', '-translate-x-full');

      // 첫 번째 포커스 가능한 요소에 포커스
      const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }

      if (onOpen) {
        onOpen();
      }
    });
  }

  /**
   * 모달을 숨김
   * @param {HTMLElement} overlay - 오버레이 요소
   * @param {HTMLElement} modal - 모달 요소
   * @param {function} [onClose] - 닫기 콜백
   */
  static hideModal(overlay, modal, onClose = null) {
    modal.classList.add('translate-x-full');

    // 애니메이션 완료 후 오버레이 숨김
    setTimeout(() => {
      overlay.classList.add('hidden');

      if (onClose) {
        onClose();
      }
    }, 300);
  }

  /**
   * 포커스 트랩 설정 (접근성)
   * @param {HTMLElement} modal - 모달 요소
   */
  static setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = e => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
  }

  /**
   * main.basic.js 호환 헬퍼 함수
   * 기존 manualToggle, manualOverlay, manualColumn 구조와 호환
   * @returns {Object} 기존 구조와 호환되는 DOM 요소들
   */
  static createCompatibleModal() {
    const helpModal = HelpModal.render();

    // 기존 이름으로 매핑
    const manualOverlay = helpModal.overlay;
    const manualColumn = helpModal.modal;

    // id 부여 (테스트에서 쉽게 찾을 수 있도록)
    manualOverlay.id = 'help-modal-overlay';
    manualColumn.id = 'help-modal-slidePanel';

    // 테스트가 기대하는 선택자와 정확히 일치하도록 클래스 설정
    // 테스트: document.querySelector('.fixed.inset-0')
    manualOverlay.className =
      'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

    // 테스트: document.querySelector('.fixed.right-0.top-0')
    manualColumn.className =
      'fixed right-0 top-0 h-full w-80 transform translate-x-full transition-transform duration-300 bg-white shadow-2xl p-6 overflow-y-auto z-50';

    manualOverlay.onclick = function (e) {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      }
    };

    return {
      overlay: manualOverlay,
      column: manualColumn,
      modal: manualOverlay, // 테스트 호환
      slidePanel: manualColumn, // 테스트 호환
      toggle: () => {
        manualOverlay.classList.toggle('hidden');
        manualColumn.classList.toggle('translate-x-full');
      },
      open: helpModal.open,
      close: helpModal.close,
    };
  }
}

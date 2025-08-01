/**
 * DOM 유틸리티
 * 선언적 DOM 조작을 위한 헬퍼 함수들
 */

/**
 * 요소 찾기 헬퍼
 * @param {string} selector - CSS 선택자
 * @param {Element} parent - 부모 요소 (기본값: document)
 * @returns {Element|null}
 */
export const findElement = (selector, parent = document) => {
  return parent.querySelector(selector);
};

/**
 * 텍스트 내용 설정
 * @param {Element} element - 대상 요소
 * @param {string} text - 설정할 텍스트
 */
export const setTextContent = (element, text) => {
  if (element) {
    element.textContent = text;
  }
};

/**
 * HTML 내용 설정
 * @param {Element} element - 대상 요소
 * @param {string} html - 설정할 HTML
 */
export const setInnerHTML = (element, html) => {
  if (element) {
    element.innerHTML = html;
  }
};

/**
 * 클래스 토글
 * @param {Element} element - 대상 요소
 * @param {string} className - 클래스명
 * @param {boolean} force - 강제 설정 여부
 */
export const toggleClass = (element, className, force) => {
  if (element) {
    element.classList.toggle(className, force);
  }
};

/**
 * 스타일 설정
 * @param {Element} element - 대상 요소
 * @param {string} property - CSS 속성
 * @param {string} value - 값
 */
export const setStyle = (element, property, value) => {
  if (element) {
    element.style[property] = value;
  }
};

/**
 * 이벤트 리스너 등록
 * @param {Element} element - 대상 요소
 * @param {string} event - 이벤트 타입
 * @param {Function} handler - 이벤트 핸들러
 * @param {object} options - 이벤트 옵션
 */
export const addEventListener = (element, event, handler, options = {}) => {
  if (element) {
    element.addEventListener(event, handler, options);
  }
};

/**
 * 조건부 렌더링
 * @param {Element} element - 대상 요소
 * @param {boolean} condition - 조건
 * @param {string} className - 토글할 클래스명 (기본값: 'hidden')
 */
export const renderIf = (element, condition, className = 'hidden') => {
  if (element) {
    toggleClass(element, className, !condition);
  }
};

/**
 * 안전한 DOM 조작
 * @param {string} selector - 선택자
 * @param {Function} operation - 수행할 작업
 */
export const safeDOM = (selector, operation) => {
  const element = findElement(selector);
  if (element) {
    operation(element);
  }
};

/**
 * 배치 DOM 업데이트
 * @param {Array} operations - DOM 작업 배열
 */
export const batchDOM = operations => {
  operations.forEach(({ selector, operation }) => {
    safeDOM(selector, operation);
  });
};

// DOM 생성 유틸리티 함수
// JSX와 유사한 방식으로 DOM을 생성하여 추후 React 전환을 용이하게 함

/**
 * HTML 문자열로부터 DOM 요소를 생성하는 함수
 * @param {string} html - HTML 문자열
 * @returns {Element} - 생성된 DOM 요소
 */
export function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * HTML 문자열로부터 여러 DOM 요소를 생성하는 함수
 * @param {string} html - HTML 문자열
 * @returns {DocumentFragment} - 생성된 DOM Fragment
 */
export function createElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
}

/**
 * 요소에 이벤트 리스너를 추가하는 함수
 * @param {Element} element - DOM 요소
 * @param {Object} events - 이벤트 맵 { eventName: handler }
 */
export function addEventListeners(element, events) {
  Object.entries(events).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });
}

/**
 * 요소를 쿼리하고 이벤트를 바인딩하는 함수
 * @param {Element} container - 컨테이너 요소
 * @param {Object} bindings - 쿼리 셀렉터와 이벤트 맵
 */
export function bindEvents(container, bindings) {
  Object.entries(bindings).forEach(([selector, events]) => {
    const element = container.querySelector(selector);
    if (element && events) {
      addEventListeners(element, events);
    }
  });
}

/**
 * 컴포넌트 렌더링 함수 (JSX 스타일로 변환 용이)
 * @param {Function} component - HTML을 반환하는 컴포넌트 함수
 * @param {Element} container - 렌더링할 컨테이너
 * @param {Object} eventBindings - 이벤트 바인딩 맵
 */
export function render(component, container, eventBindings = {}) {
  const html = typeof component === 'function' ? component() : component;
  const element = createElement(html);
  
  // 이벤트 바인딩
  if (eventBindings) {
    bindEvents(element, eventBindings);
  }
  
  container.appendChild(element);
  return element;
}
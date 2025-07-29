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
 * 요소의 outerHTML을 업데이트하고 새로운 요소를 반환하는 함수
 * @param {Element|string} elementOrSelector - DOM 요소 또는 선택자
 * @param {string} newHTML - 새로운 HTML 문자열
 * @returns {Element} - 업데이트된 DOM 요소
 */
export function $$(elementOrSelector, newHTML) {
  // 요소 찾기
  var element = typeof elementOrSelector === 'string' 
    ? document.querySelector(elementOrSelector)
    : elementOrSelector;
    
  if (!element) {
    console.error('Element not found:', elementOrSelector);
    return null;
  }
  
  // 부모 요소와 위치 저장
  var parent = element.parentNode;
  var nextSibling = element.nextSibling;
  
  // 새 요소 생성
  var newElement = createElement(newHTML);
  
  // 기존 요소를 새 요소로 교체
  if (nextSibling) {
    parent.insertBefore(newElement, nextSibling);
  } else {
    parent.appendChild(newElement);
  }
  
  // 기존 요소 제거
  element.remove();
  
  return newElement;
}
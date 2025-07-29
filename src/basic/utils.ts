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
 * 요소의 속성과 내용을 업데이트하는 함수
 * 새로운 요소를 생성하지 않고 기존 요소를 수정하여 DOM 참조를 유지
 * @param {Element|string} elementOrSelector - DOM 요소 또는 선택자
 * @param {string} newHTML - 새로운 HTML 문자열
 * @returns {Element} - 업데이트된 DOM 요소 (동일한 요소 반환)
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
  
  // 임시 요소를 생성하여 새 HTML 파싱
  var tempElement = createElement(newHTML);
  
  // 속성 업데이트
  // 기존 속성 모두 제거
  var attrs = element.attributes;
  for (var i = attrs.length - 1; i >= 0; i--) {
    element.removeAttribute(attrs[i].name);
  }
  
  // 새 속성 추가
  var newAttrs = tempElement.attributes;
  for (var i = 0; i < newAttrs.length; i++) {
    element.setAttribute(newAttrs[i].name, newAttrs[i].value);
  }
  
  // innerHTML 업데이트
  element.innerHTML = tempElement.innerHTML;
  
  return element;
}
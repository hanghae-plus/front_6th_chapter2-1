/**
 * DOM 조작 유틸리티
 * 요구사항: React와 유사한 패턴으로 구현하여 향후 전환 용이
 */

/**
 * HTML 문자열로부터 DOM 요소 생성
 */
export function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * DOM 요소 업데이트
 * 요구사항: 기존 DOM 참조 유지하면서 내용 업데이트
 */
export function $$(element:HTMLElement, newHTML:string) {
  let i
  if (!element) {
    console.error('Element not found:', element);
    return null;
  }
  
  const tempElement = createElement(newHTML)

  const attrs = element.attributes
  for (i = attrs.length - 1; i >= 0; i--) {
    element.removeAttribute(attrs[i].name);
  }
  
  var newAttrs = tempElement.attributes;
  for (i = 0; i < newAttrs.length; i++) {
    element.setAttribute(newAttrs[i].name, newAttrs[i].value);
  }

  let value = element.value

  element.innerHTML = tempElement.innerHTML;

  if (value) {
    element.value = value
  }

  return element;
}
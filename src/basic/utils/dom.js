// dom.js - DOM 관련 유틸 함수

/**
 * DOM 엘리먼트 생성 (tag, className)
 */
export function createElement(tag, className = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

/**
 * DOM Utility functions
 */

/**
 * Convert HTML string to DOM element
 * @param {string} html - HTML string
 * @returns {HTMLElement} DOM element
 */
export const htmlToElement = html => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  // 첫 번째 Element 노드를 찾아서 반환 (주석이나 텍스트 노드 무시)
  for (let i = 0; i < template.content.childNodes.length; i++) {
    const node = template.content.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      return node;
    }
  }

  // Element 노드가 없으면 첫 번째 자식 반환 (기존 동작)
  return template.content.firstChild;
};

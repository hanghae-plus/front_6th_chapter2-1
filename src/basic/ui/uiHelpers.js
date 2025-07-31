/**
 * UI 생성 유틸리티 함수들
 * createDocumentFragment + innerHTML 패턴을 사용하여 일관성 있는 UI 생성
 */

/**
 * HTML 템플릿에서 DOM 요소 생성 (간단한 버전)
 * @param {string} template - HTML 템플릿 문자열
 * @returns {HTMLElement} 생성된 DOM 요소
 */
export function createUIElement(template) {
  if (!template || typeof template !== "string") {
    console.warn("createUIElement: template is not a valid string", template);
    // 빈 div를 반환하여 null 오류 방지
    const fallbackDiv = document.createElement("div");
    return fallbackDiv;
  }

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = template.trim();
  const element = tempDiv.firstElementChild;

  if (!element) {
    console.warn("Template did not produce a valid element:", template);
    // 빈 div를 반환하여 null 오류 방지
    const fallbackDiv = document.createElement("div");
    fallbackDiv.innerHTML = template.trim();
    return fallbackDiv;
  }

  return element;
}

/**
 * 요소에 속성 설정
 * @param {HTMLElement} element - 대상 요소
 * @param {Object} attributes - 설정할 속성들
 * @returns {HTMLElement} 속성이 설정된 요소
 */
export function setElementAttributes(element, attributes = {}) {
  if (!element) {
    console.warn("Cannot set attributes on null element");
    return element;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "id") {
      element.id = value;
    } else if (key.startsWith("data-")) {
      element.setAttribute(key, value);
    } else if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
    } else {
      element[key] = value;
    }
  });
  return element;
}

/**
 * 템플릿 문자열에서 데이터 바인딩
 * @param {string} template - 템플릿 문자열
 * @param {Object} data - 바인딩할 데이터
 * @returns {string} 데이터가 바인딩된 HTML 문자열
 */
export function bindTemplate(template, data) {
  if (!template || typeof template !== "string") {
    console.warn("bindTemplate: template is not a valid string", template);
    return "";
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

/**
 * 텍스트 노드 생성
 * @param {string} text - 텍스트 내용
 * @returns {Text} 생성된 텍스트 노드
 */
export function createTextNode(text) {
  return document.createTextNode(text);
}

/**
 * 요소 내용을 텍스트로 설정
 * @param {HTMLElement} element - 대상 요소
 * @param {string} text - 설정할 텍스트
 * @returns {HTMLElement} 텍스트가 설정된 요소
 */
export function setElementText(element, text) {
  if (!element) return element;

  // 기존 내용 제거
  element.innerHTML = "";
  // 텍스트 노드 추가
  element.appendChild(createTextNode(text));
  return element;
}

/**
 * 요소 내용을 HTML로 설정
 * @param {HTMLElement} element - 대상 요소
 * @param {string} html - 설정할 HTML
 * @returns {HTMLElement} HTML이 설정된 요소
 */
export function setElementHTML(element, html) {
  if (!element) return element;

  // 직접 innerHTML 설정 (textContent 호환성을 위해)
  element.innerHTML = html;
  return element;
}

/**
 * 요소 표시/숨김 설정
 * @param {HTMLElement} element - 대상 요소
 * @param {boolean} visible - 표시 여부
 * @returns {HTMLElement} 설정된 요소
 */
export function setElementVisibility(element, visible) {
  if (!element) return element;

  if (visible) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
  return element;
}

/**
 * 요소에 자식 요소 추가
 * @param {HTMLElement} parent - 부모 요소
 * @param {HTMLElement} child - 자식 요소
 * @returns {HTMLElement} 부모 요소
 */
export function appendChild(parent, child) {
  if (!parent || !child) return parent;
  parent.appendChild(child);
  return parent;
}

/**
 * 여러 자식 요소들을 부모 요소에 추가
 * @param {HTMLElement} parent - 부모 요소
 * @param {Array} children - 자식 요소들
 * @returns {HTMLElement} 부모 요소
 */
export function appendChildren(parent, children) {
  if (!parent) return parent;
  children.forEach((child) => {
    if (child) {
      parent.appendChild(child);
    }
  });
  return parent;
}

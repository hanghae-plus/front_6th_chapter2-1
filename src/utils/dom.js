/**
 * HTML 문자열을 DOM 요소로 변환
 * @param {string} htmlString - 변환할 HTML 문자열
 * @returns {Element} - 생성된 DOM 요소
 */
export const createElementFromHTML = (htmlString) => {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
};

/**
 * HTML 문자열을 여러 DOM 요소로 변환 (여러 최상위 요소가 있는 경우)
 * @param {string} htmlString - 변환할 HTML 문자열
 * @returns {NodeList} - 생성된 DOM 요소들
 */
export const createElementsFromHTML = (htmlString) => {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.children;
};

/**
 * 기존 요소에 HTML 문자열을 안전하게 추가
 * @param {Element} element - 대상 요소
 * @param {string} htmlString - 추가할 HTML 문자열
 */
export const appendHTML = (element, htmlString) => {
  const newElement = createElementFromHTML(htmlString);
  element.appendChild(newElement);
};

/**
 * 기존 요소의 내용을 HTML 문자열로 대체
 * @param {Element} element - 대상 요소
 * @param {string} htmlString - 새로운 HTML 문자열
 */
export const replaceHTML = (element, htmlString) => {
  element.innerHTML = "";
  const newElement = createElementFromHTML(htmlString);
  element.appendChild(newElement);
};

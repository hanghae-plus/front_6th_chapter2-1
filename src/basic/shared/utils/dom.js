/**
 * DOM Utility functions
 */

/**
 * Create DOM element with properties
 * @param {string} tag - HTML tag name
 * @param {Object} props - Element properties
 * @param {string} props.className - CSS class names
 * @param {string} props.id - Element ID
 * @param {string} props.textContent - Text content
 * @returns {HTMLElement} Created element
 */
export const createElement = (tag, props = {}) => {
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else {
      element[key] = value;
    }
  });

  return element;
};

/**
 * Convert HTML string to DOM element
 * @param {string} html - HTML string
 * @returns {HTMLElement} DOM element
 */
export const htmlToElement = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
};

/**
 * Replace an element with new element
 * @param {HTMLElement} oldElement - Element to replace
 * @param {HTMLElement} newElement - New element
 */
export const replaceElement = (oldElement, newElement) => {
  oldElement.parentNode.replaceChild(newElement, oldElement);
};

const createElement = ({ elementType, className, innerHtml, ...props }) => {
  const element = document.createElement(elementType);
  element.className = className;
  element.innerHTML = innerHtml;

  return element;
};

export default createElement;

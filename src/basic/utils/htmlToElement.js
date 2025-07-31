// HTML 문자열을 DOM 노드로 변환 (첫 번째 자식 반환)
export function htmlToElement(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container.firstElementChild;
}

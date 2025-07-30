export function appendChildren(parent: HTMLElement, children: HTMLElement[]) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

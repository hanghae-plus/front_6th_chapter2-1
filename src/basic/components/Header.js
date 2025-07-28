// Header 컴포넌트
export function createHeader({ itemCount = 0, title = "🛒 Hanghae Online Store", subtitle = "Shopping Cart" }) {
  const header = document.createElement("div");
  header.className = "mb-8";

  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">${title}</h1>
    <div class="text-5xl tracking-tight leading-none">${subtitle}</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
  `;

  return header;
}

// Header 컴포넌트 아이템 수 업데이트 함수
export function updateHeaderItemCount(headerElement, itemCount) {
  const itemCountElement = headerElement.querySelector("#item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
}

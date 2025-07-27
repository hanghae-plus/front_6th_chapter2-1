/**
 * Header 컴포넌트
 * 쇼핑몰 헤더를 렌더링합니다.
 *
 * @param {Object} props
 * @param {number} props.itemCount - 장바구니 아이템 수
 * @param {string} [props.title="🛒 Hanghae Online Store"] - 헤더 제목
 * @param {string} [props.subtitle="Shopping Cart"] - 헤더 부제목
 * @returns {HTMLElement} 헤더 DOM 요소
 */
export function createHeader(props) {
  const {
    itemCount = 0,
    title = "🛒 Hanghae Online Store",
    subtitle = "Shopping Cart",
  } = props;

  const header = document.createElement("div");
  header.className = "mb-8";

  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">${title}</h1>
    <div class="text-5xl tracking-tight leading-none">${subtitle}</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
  `;

  return header;
}

/**
 * Header 컴포넌트 업데이트 함수
 * 아이템 카운트를 동적으로 업데이트합니다.
 *
 * @param {HTMLElement} headerElement - 헤더 DOM 요소
 * @param {number} itemCount - 새로운 아이템 수
 */
export function updateHeaderItemCount(headerElement, itemCount) {
  const itemCountElement = headerElement.querySelector("#item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
}

/**
 * Header 컴포넌트
 * 애플리케이션의 헤더 섹션을 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {number} [props.itemCount=0] - 장바구니 아이템 수
 * @returns {string} 헤더 HTML
 */
export function Header({ itemCount = 0 }) {
  return /* HTML */ `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
        🛍️ ${itemCount} items in cart
      </p>
    </div>
  `;
}

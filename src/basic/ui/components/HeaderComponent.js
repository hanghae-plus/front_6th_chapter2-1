/**
 * 헤더 컴포넌트
 */
export class HeaderComponent {
  constructor() {
    this.element = this.createElement();
  }

  /**
   * 헤더 요소 생성
   * @returns {HTMLElement} 헤더 요소
   */
  createElement() {
    const header = document.createElement('div');
    header.className = 'mb-8';
    header.innerHTML = this.getHeaderTemplate();
    return header;
  }

  /**
   * 헤더 템플릿 생성
   * @returns {string} 헤더 HTML 템플릿
   */
  getHeaderTemplate() {
    return `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">
        🛍️ 0 items in cart
      </p>
    `;
  }

  /**
   * 아이템 수량 업데이트
   * @param {number} count - 아이템 수량
   */
  updateItemCount(count) {
    const itemCountElement = this.element.querySelector('#item-count');
    if (itemCountElement) {
      itemCountElement.textContent = `🛍️ ${count} items in cart`;
    }
  }

  /**
   * 헤더 요소 반환
   * @returns {HTMLElement} 헤더 요소
   */
  getElement() {
    return this.element;
  }
}

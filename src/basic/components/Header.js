// ==========================================
// 🎯 헤더 컴포넌트
// ==========================================

/**
 * 🎯 Header 컴포넌트
 *
 * @description 브랜드 로고, 제목, 아이템 카운트를 포함한 헤더 섹션을 생성
 *
 * @param {number} itemCount - 장바구니 아이템 수
 * @returns {HTMLElement} 헤더 DOM 요소
 */
export const Header = (itemCount = 0) => {
  const header = document.createElement('div');
  header.className = 'mb-8';

  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount} items in cart</p>
  `;

  return header;
};

/**
 * 🎯 헤더 컴포넌트 업데이트
 *
 * @description 아이템 카운트를 업데이트
 *
 * @param {number} itemCount - 새로운 아이템 수
 */
export const updateHeader = itemCount => {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
};

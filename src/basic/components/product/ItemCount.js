export const createItemCount = () => {
  const itemCount = document.createElement('p');
  itemCount.id = 'item-count';
  itemCount.className = 'text-sm text-gray-500 font-normal mt-3';
  itemCount.textContent = '🛍️ 0 items in cart';

  return itemCount;
};

/** 아이템 카운트 업데이트
 * @param {Element} itemCountElement - 아이템 카운트 요소
 * @param {number} itemCount - 아이템 수량
 */
export const updateItemCount = (itemCountElement, itemCount) => {
  if (!itemCountElement) return;

  const previousCount = getCurrentCount(itemCountElement);
  itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;

  // 변경 감지
  if (previousCount !== itemCount) {
    itemCountElement.setAttribute('data-changed', 'true');
  }
};

/** 현재 아이템 수량 가져오기
 * @param {Element} element - 아이템 카운트 요소
 * @returns {number} 현재 아이템 수량
 */
const getCurrentCount = (element) => {
  const match = element.textContent.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

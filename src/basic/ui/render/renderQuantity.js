/**
 * 수량 렌더링 함수
 * @param {string} productId - 상품 ID
 * @param {number} newQty - 새로운 수량
 */
export const renderQuantity = (productId, newQty) => {
  // 상품 아이템 존재 체크
  const itemElem = document.getElementById(productId);
  if (!itemElem) return;

  // 수량 요소 존재 체크
  const qtyElem = itemElem.querySelector(".quantity-number");

  // 수량 요소 존재 시 수량 업데이트
  if (qtyElem) qtyElem.textContent = newQty;
};

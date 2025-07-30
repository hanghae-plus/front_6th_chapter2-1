/**
 * 장바구니 DOM에서 데이터를 추출하는 함수
 * @param {HTMLElement} cartDisp - 장바구니 컨테이너 DOM
 * @param {Array} prodList - 상품 목록
 * @returns {Array} 장바구니 아이템 데이터 배열
 */
export const extractCartData = (cartDisp, prodList) => {
  const cartItems = cartDisp.children;
  const items = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const curItem = prodList.find((product) => product.id === cartItem.id);
    if (!curItem) continue;

    const qtyElem = cartItem.querySelector(".quantity-number");
    const q = parseInt(qtyElem.textContent);

    items.push({
      id: curItem.id,
      name: curItem.name,
      val: curItem.val,
      quantity: q,
      element: cartItem,
    });
  }

  return items;
};

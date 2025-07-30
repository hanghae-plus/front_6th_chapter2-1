/**
 * 장바구니 아이템 스타일 업데이트
 * @param {Array} cartItems - 장바구니 아이템 배열
 */
export const updateCartItemStyles = (cartItems) => {
  // 장바구니 아이템 순회
  cartItems.forEach((item) => {
    // 장바구니 아이템 요소 존재 체크
    const cartItemElement = item.element;
    if (!cartItemElement) return;

    // 10개 이상 구매시 가격 텍스트를 굵게 표시
    const priceElems = cartItemElement.querySelectorAll(".text-lg");
    priceElems.forEach((elem) => {
      elem.style.fontWeight = item.quantity >= 10 ? "bold" : "normal";
    });
  });
};

export const updateCartItemStyles = (cartItems) => {
  cartItems.forEach((item) => {
    const cartItemElement = item.element;
    if (!cartItemElement) return;

    // 10개 이상 구매시 가격 텍스트를 굵게 표시
    const priceElems = cartItemElement.querySelectorAll(".text-lg");
    priceElems.forEach((elem) => {
      elem.style.fontWeight = item.quantity >= 10 ? "bold" : "normal";
    });
  });
};

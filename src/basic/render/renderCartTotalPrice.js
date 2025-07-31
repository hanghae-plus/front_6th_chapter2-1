// 장바구니 총 가격
export const renderCartTotalPrice = (appState) => {
  const cartTotal = document.getElementById('cart-total');
  const totalDiv = cartTotal?.querySelector('.text-2xl');

  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(appState.totalAfterDiscount).toLocaleString();
  }
};

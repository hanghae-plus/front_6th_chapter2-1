// 장바구니 총 가격
export const renderCartTotalPrice = (appState, cartTotal) => {
  const totalDiv = cartTotal.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(appState.totalAfterDiscount).toLocaleString();
  }
};

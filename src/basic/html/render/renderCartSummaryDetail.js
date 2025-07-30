import { isTodayTuesday } from '../../utils/isTodayTuesday';
import { findProductById } from '../../utils/findProductById';

// 할인 요약 내용
export const renderCartSummaryDetail = ({ state, appState }) => {
  const { cartState, productState } = state;
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, discountedProductList } = appState;

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = ''; // 기존 값 초기화

  let summaryText = '';

  // 장바구니에 상품이 존재
  if (cartState.length > 0) {
    for (let i = 0; i < cartState.length; i++) {
      const cartItem = cartState[i];
      const orderCount = cartItem.count;
      const product = findProductById(productState, cartItem.id)

      // 상품 총 가격 (changedPrice - 변동된 가격, orderCount - 상품 구매 수)
      const itemTotal = product.changedPrice * orderCount;

      // 상품 이름 x 구매 수 ₩ 가격 출력
      summaryText += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${orderCount}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 합계 출력
    summaryText += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${totalBeforeDiscount.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 출력
    if (totalProductCount >= 30) {
      // 총 구매 수가 30개 이상일 때 대량 구매 할인
      summaryText += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (discountedProductList.length > 0) {
      discountedProductList.forEach((item) => {
        summaryText += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인
    if (isTodayTuesday()) {
      if (totalAfterDiscount > 0) {
        summaryText += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    // 무료 배송 출력
    summaryText += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  summaryDetails.innerHTML = summaryText;
};

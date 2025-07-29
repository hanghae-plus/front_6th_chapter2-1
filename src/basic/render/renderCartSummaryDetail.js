import { findProductById } from '../utils/findProductById';
import { isTodayTuesday } from '../utils/isTodayTuesday';

// 할인 요약 내용
export const renderCartSummaryDetail = ({ cartItems, productList, appState }) => {
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, discountedProductList } = appState;

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  // 장바구니에 상품이 존재
  if (totalBeforeDiscount > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      // id로 현재의 장바구니 상품 찾음 (i로 순회)
      const curItem = findProductById(productList, cartItems[i].id);

      // 현재 상품의 구매 수
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const orderCount = parseInt(qtyElem.textContent);
      // 상품 총 가격 (changedPrice - 변동된 가격, orderCount - 상품 구매 수)
      const itemTotal = curItem.changedPrice * orderCount;

      // 상품 이름 x 구매 수 ₩ 가격 출력
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${orderCount}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 합계 출력
    summaryDetails.innerHTML += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${totalBeforeDiscount.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 출력
    if (totalProductCount >= 30) {
      // 총 구매 수가 30개 이상일 때 대량 구매 할인
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (discountedProductList.length > 0) {
      discountedProductList.forEach((item) => {
        summaryDetails.innerHTML += /* HTML */ `
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
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    // 무료 배송 출력
    summaryDetails.innerHTML += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
};

import { getProductById } from '../../services/productService';
import { formatCurrency } from '../../utils';

export const OrderSummaryDetails = () => {
  const summaryDetailsDiv = document.createElement('div');
  summaryDetailsDiv.id = 'summary-details';
  summaryDetailsDiv.className = 'space-y-3';

  // 요약 정보를 업데이트하는 함수
  const updateSummary = (
    cartData,
    subtotal,
    itemDiscountsApplied,
    isTuesdaySpecialApplied,
    totalItemCount
  ) => {
    summaryDetailsDiv.innerHTML = ''; // 기존 내용 비우기

    if (cartData.length === 0) return; // 장바구니가 비어있으면 아무것도 표시 안 함

    // 각 상품의 세부 정보 표시
    cartData.forEach((cartItem) => {
      const product = getProductById(cartItem.id);
      if (!product) return;
      const itemTotal = product.val * cartItem.quantity; // 현재 가격(할인 적용된) 기준
      summaryDetailsDiv.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${cartItem.quantity}</span>
          <span>${formatCurrency(itemTotal)}</span>
        </div>
      `;
    });

    // 소계(Subtotal) 표시
    summaryDetailsDiv.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
    `;

    // 대량 구매 할인 또는 개별 상품 할인 내역 표시
    if (totalItemCount >= 30) {
      summaryDetailsDiv.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscountsApplied.length > 0) {
      itemDiscountsApplied.forEach((item) => {
        summaryDetailsDiv.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 특별 할인 적용 여부 표시
    if (isTuesdaySpecialApplied) {
      summaryDetailsDiv.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송비 표시
    summaryDetailsDiv.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  };

  return { element: summaryDetailsDiv, updateSummary };
};

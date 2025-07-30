import { formatCurrency, formatPoints } from '../../utils';

export const OrderSummaryTotalDisplay = () => {
  const totalDivWrapper = document.createElement('div');
  totalDivWrapper.id = 'cart-total';
  totalDivWrapper.className = 'pt-5 border-t border-white/10';

  const totalAmountSpan = document.createElement('div');
  totalAmountSpan.className = 'text-2xl tracking-tight';

  const loyaltyPointsDiv = document.createElement('div');
  loyaltyPointsDiv.id = 'loyalty-points';
  loyaltyPointsDiv.className = 'text-xs text-blue-400 mt-2 text-right';

  totalDivWrapper.innerHTML = `
    <div class="flex justify-between items-baseline">
      <span class="text-sm uppercase tracking-wider">Total</span>
      </div>
  `;
  totalDivWrapper.querySelector('.flex').appendChild(totalAmountSpan);
  totalDivWrapper.appendChild(loyaltyPointsDiv);

  // 총액 및 포인트 정보를 업데이트하는 함수
  const updateTotal = (finalTotal, points, pointsDetails) => {
    totalAmountSpan.textContent = formatCurrency(finalTotal); // 최종 금액 표시

    if (points > 0) {
      // 적립 포인트가 있으면 상세 내역과 함께 표시
      loyaltyPointsDiv.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${formatPoints(points)}</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetails.join(', ')}</div>
      `;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      // 적립 포인트가 없으면 기본 메시지 표시
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  };

  return { element: totalDivWrapper, updateTotal };
};

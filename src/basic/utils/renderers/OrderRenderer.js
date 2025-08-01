/**
 * 주문 렌더링 관련 함수들
 */

/**
 * 주문 요약 상세 렌더링 컴포넌트
 */
export function renderOrderSummaryDetails(cartItems, productList, subTot, itemDiscounts) {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 각 상품별 정보 표시
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      const quantityElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElem.textContent);
      const itemTotal = curItem.price * quantity;

      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    itemDiscounts.forEach(function (discount) {
      const colorClass = discount.type === 'tuesday' ? 'text-purple-400' : 'text-green-400';
      const icon = discount.type === 'tuesday' ? '🌟' : discount.type === 'bulk' ? '🎉' : '';
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide ${colorClass}">
          <span class="text-xs">${icon} ${discount.name}</span>
          <span class="text-xs">-${discount.rate}%</span>
        </div>
      `;
    });

    // 배송비 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

/**
 * 화요일 특별 할인 UI 렌더링 컴포넌트
 */
export function renderTuesdaySpecial(isTuesday, totalAmount) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (isTuesday && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

/**
 * 총 결제 금액 렌더링 컴포넌트
 */
export function renderTotalAmount(totalAmount, orderSummaryElement) {
  const totalDiv = orderSummaryElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }
}

/**
 * 장바구니 수량 렌더링 컴포넌트
 */
export function renderItemCount(itemCount) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
  }
}

/**
 * 재고 메시지 렌더링 컴포넌트
 */
export function renderStockMessages(lowStockProducts, outOfStockProducts, stockInfoElement) {
  let stockMsg = '';

  // 재고 부족 상품 메시지
  lowStockProducts.forEach((item) => {
    stockMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
  });

  // 품절 상품 메시지
  outOfStockProducts.forEach((item) => {
    stockMsg += `${item.name}: 품절\n`;
  });

  stockInfoElement.textContent = stockMsg;
}

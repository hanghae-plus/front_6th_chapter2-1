import Option from '../components/Option';
import { VOLUME_ORDER_COUNT } from '../constants/enum';
import { calBonusPoints, getBonusPointsDetail } from '../utils/bonus';

// 재고 기준 미달 시 Selector border 색상 변경
function renderStockLimitWarning(productList, $selector) {
  const totalStock = productList.reduce((acc, item) => acc + item.quantity, 0);

  if (totalStock < 50) {
    $selector.style.borderColor = 'orange';
  } else {
    $selector.style.borderColor = '';
  }
}

// Selector 내 상품 Option element 업데이트
function renderSelectorOption(productList, $selector) {
  renderStockLimitWarning(productList, $selector);

  $selector.innerHTML = '';

  productList.forEach((product) => {
    const $option = Option({ product });
    $selector.appendChild($option);
  });
}

function renderBonusPoints(totalAmount, itemCount) {
  const $cartItems = document.getElementById('cart-items');
  const $loyaltyPoints = document.getElementById('loyalty-points');

  if ($cartItems.children.length === 0) {
    $loyaltyPoints.style.display = 'none';
    return;
  }

  const bonusPts = calBonusPoints(totalAmount, itemCount);
  const pointsDetail = getBonusPointsDetail(totalAmount, itemCount);

  if (!$loyaltyPoints) return;

  if (bonusPts > 0) {
    $loyaltyPoints.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
    $loyaltyPoints.style.display = 'block';
  } else {
    $loyaltyPoints.textContent = '적립 포인트: 0p';
    $loyaltyPoints.style.display = 'block';
  }
}

// 카트 요약정보 및 할인 정보 그리기
function renderCartSummaryDetails(
  cartItemList,
  productStore,
  subTotal,
  itemCount,
  itemDiscounts,
  { isTuesday, finalAmount },
) {
  const $summaryDetails = document.getElementById('summary-details');
  $summaryDetails.innerHTML = '';

  cartItemList.forEach((cartItem) => {
    const product = productStore.getProductById(cartItem.id);
    const quantity = parseInt(cartItem.querySelector('.quantity-number').textContent);
    const itemTotal = product.value * quantity;
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${product.name} x ${quantity}</span>
        <span>₩${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  $summaryDetails.innerHTML += `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subTotal.toLocaleString()}</span>
    </div>
  `;

  if (itemCount >= VOLUME_ORDER_COUNT) {
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span class="text-xs">-25%</span>
      </div>
    `;
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      $summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `;
    });
  }

  if (isTuesday && finalAmount > 0) {
    $summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-10%</span>
      </div>
    `;
  }

  $summaryDetails.innerHTML += `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// 카트 포인트·할인·재고 표시
function renderLoyaltyPoints(finalAmount) {
  const $loyaltyPoints = document.getElementById('loyalty-points');
  if ($loyaltyPoints) {
    const points = Math.floor(finalAmount / 1000);
    $loyaltyPoints.textContent = `적립 포인트: ${points > 0 ? points : 0}p`;
    $loyaltyPoints.style.display = 'block';
  }
}

function renderDiscountInfo(originalTotal, finalAmount, discountRate) {
  const $discountInfo = document.getElementById('discount-info');
  $discountInfo.innerHTML = '';

  if (discountRate > 0 && finalAmount > 0) {
    const savedAmount = originalTotal - finalAmount;
    $discountInfo.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

export {
  renderStockLimitWarning,
  renderSelectorOption,
  renderBonusPoints,
  renderCartSummaryDetails,
  renderLoyaltyPoints,
  renderDiscountInfo,
};

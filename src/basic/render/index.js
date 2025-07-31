import Option from '../components/Option';
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

export { renderStockLimitWarning, renderSelectorOption, renderBonusPoints };

import { getProductDiscountRate } from './utils';

// 장바구니 아이템들의 총액과 수량을 계산하는 순수 함수
export function calculateCartTotals(cartItems, findProductById) {
  let subTotal = 0;
  let itemCount = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(cartItems[i].id);
    const quantityElem = cartItems[i].querySelector('.quantity-number');

    const quantity = parseInt(quantityElem.textContent);
    const itemTot = curItem.val * quantity;

    itemCount += quantity;
    subTotal += itemTot;

    // 수량별 스타일 적용
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });

    // 개별 상품 할인율 적용
    if (quantity >= 10) {
      const disc = getProductDiscountRate(curItem.id);
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
  }

  return { subTotal, itemCount, itemDiscounts };
}

// 개별 상품 할인이 적용된 총액을 계산하는 순수 함수
export function calculateDiscountedTotal(cartItems, findProductById) {
  let totalAmount = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProductById(cartItems[i].id);
    const quantityElem = cartItems[i].querySelector('.quantity-number');
    const quantity = parseInt(quantityElem.textContent);
    const itemTot = curItem.val * quantity;

    let discountRate = 0;
    if (quantity >= 10) {
      discountRate = getProductDiscountRate(curItem.id);
    }

    totalAmount += itemTot * (1 - discountRate);
  }

  return totalAmount;
}

// 대량구매 할인을 적용하는 순수 함수
export function applyBulkDiscount(itemCount, totalAmount, subTotal) {
  if (itemCount >= 30) {
    return {
      discountedAmount: (subTotal * 75) / 100,
      discountRate: 25 / 100,
    };
  }

  return {
    discountedAmount: totalAmount,
    discountRate: (subTotal - totalAmount) / subTotal,
  };
}

// 화요일 특별 할인을 적용하는 순수 함수
export function applyTuesdayDiscount(totalAmount, originalTotal, isTuesday) {
  if (isTuesday && totalAmount > 0) {
    const discountedAmount = (totalAmount * 90) / 100;
    return {
      discountedAmount,
      finalDiscountRate: 1 - discountedAmount / originalTotal,
      showTuesdaySpecial: true,
    };
  }

  return {
    discountedAmount: totalAmount,
    finalDiscountRate: 1 - totalAmount / originalTotal,
    showTuesdaySpecial: false,
  };
}

import { productList, PRODUCTS } from './stores';
import { updateCartSummaryUI, cartState, cartDisp } from '../main.basic';
import { isTuesday } from './dateUtils';
import { updateStockAndPoints } from './uiUpdate';
export function handleCalculateCartStuff() {
  cartState.itemCnt = 0;
  cartState.totalAmt = 0;
  let subTot = 0;
  const itemDiscounts = [];

  const cartItems = Array.from(cartDisp.children);

  // 1. 수량/금액 합산 및 개별 할인 계산
  const results = cartItems.map((node) => {
    const curItem = productList.find((p) => p.id === node.id);
    const qtyElem = node.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountedPrice * q;

    node.querySelectorAll('.text-lg').forEach((el) => {
      el.style.fontWeight = q >= 10 ? 'bold' : 'normal';
    });

    cartState.itemCnt += q;
    subTot += itemTot;

    // 개별 할인은 30개 미만일 때만 적용
    let disc = 0;
    if (cartState.itemCnt < 30 && q >= 10) {
      const discMap = {
        [PRODUCTS.KEYBOARD]: 0.1,
        [PRODUCTS.MOUSE]: 0.15,
        [PRODUCTS.MONITOR_ARM]: 0.2,
        [PRODUCTS.LAPTOP_POUCH]: 0.05,
        [PRODUCTS.SPEAKER]: 0.25,
      };
      disc = discMap[curItem.id] || 0;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
      cartState.totalAmt += itemTot * (1 - disc);
    } else {
      cartState.totalAmt += itemTot;
    }

    return { node, curItem, q, itemTot };
  });

  const originalTotal = subTot;
  let discRate = 0;

  // 2. 30개 이상이면 전체 25% 할인만 적용 (개별 할인 무시)
  if (cartState.itemCnt >= 30) {
    cartState.totalAmt = subTot * 0.75;
    discRate = 0.25;
  } else {
    discRate = (subTot - cartState.totalAmt) / subTot;
  }

  // 3. 화요일이면 10% 추가 할인
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday() && cartState.totalAmt > 0) {
    cartState.totalAmt = cartState.totalAmt * 0.9;
    discRate = 1 - cartState.totalAmt / originalTotal;
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 4. UI 업데이트
  updateCartSummaryUI({
    itemCnt: cartState.itemCnt,
    subTot,
    results,
    itemDiscounts,
    isTuesday,
    totalAmt: cartState.totalAmt,
    discRate,
    originalTotal,
  });

  // 5. 재고 및 포인트 등 추가 UI 업데이트
  updateStockAndPoints();
}

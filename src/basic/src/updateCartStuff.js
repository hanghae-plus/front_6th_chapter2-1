import { PRODUCT_1, PRODUCT_2, PRODUCT_3, PRODUCT_4, PRODUCT_5 } from '../constants.js';
import { onUpdateBonusPoints } from './updateBonusPoints';
import { onUpdateStockInfo } from './updateStockInfo';

export function onUpdateCartStuff({ cartDisplay, productList, stockInfo, sum }) {
  let totalAmt = 0;
  let itemCnt = 0;
  const cartItems = cartDisplay.children;
  let subTot = 0;

  const itemDiscounts = [];
  const lowStockItems = [];
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].q < 5 && productList[idx].q > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');

      let disc;
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_1) {
          disc = 10 / 100;
        } else {
          if (curItem.id === PRODUCT_2) {
            disc = 15 / 100;
          } else {
            if (curItem.id === PRODUCT_3) {
              disc = 20 / 100;
            } else {
              if (curItem.id === PRODUCT_4) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  const originalTotal = subTot;
  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${curItem.name} x ${q}</span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        `;
    }
    summaryDetails.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subTot.toLocaleString()}</span>
        </div>
      `;
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
            <span class="text-xs">-25%</span>
          </div>
        `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-green-400">
              <span class="text-xs">${item.name} (10개↑)</span>
              <span class="text-xs">-${item.discount}%</span>
            </div>
          `;
      });
    }
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
            <div class="flex justify-between text-sm tracking-wide text-purple-400">
              <span class="text-xs">🌟 화요일 추가 할인</span>
              <span class="text-xs">-10%</span>
            </div>
          `;
      }
    }
    summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
  }
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
  }
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  let stockMsg = '';
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  onUpdateStockInfo({ productList, stockInfo });
  onUpdateBonusPoints({ cartDisplay, totalAmt, productList, itemCnt });
}

import {
  INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD,
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_DISCOUNT,
  TUESDAY_SPECIAL_DISCOUNT,
  PRODUCT_DISCOUNTS,
  KEYBOARD,
  MOUSE,
  MONITOR_ARM,
  NOTEBOOK_CASE,
  SPEAKER,
} from '../constants.js';
import { isTuesday } from '../utils/date.js';
import { findProductById } from '../utils/product.js';

export class CartCalculationService {
  constructor(productList, cartDisp, summaryDetails, totalDiv, discountInfoDiv, itemCountElement) {
    this.productList = productList;
    this.cartDisp = cartDisp;
    this.summaryDetails = summaryDetails;
    this.totalDiv = totalDiv;
    this.discountInfoDiv = discountInfoDiv;
    this.itemCountElement = itemCountElement;
  }

  calculateCart() {
    let totalAmt = 0;
    let itemCnt = 0;
    let originalTotal = 0;
    let subTot = 0;
    let discRate = 0;

    const itemDiscounts = [];
    const cartItems = this.cartDisp.children;

    // 각 아이템별 계산
    for (let i = 0; i < cartItems.length; i++) {
      const curItem = findProductById(this.productList, cartItems[i].id);
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      let disc = 0;

      itemCnt += q;
      subTot += itemTot;

      // 개별 상품 할인 적용
      this.updateItemPriceDisplay(cartItems[i], q);

      if (q >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD) {
        disc = this.calculateIndividualDiscount(curItem.id);
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }

      totalAmt += itemTot * (1 - disc);
    }

    // 대량구매 할인 적용
    const { finalTotal: bulkTotal, discRate: bulkDiscRate } = this.applyBulkPurchaseDiscount(
      totalAmt,
      subTot,
      itemCnt
    );
    totalAmt = bulkTotal;
    originalTotal = subTot;

    // 화요일 특별 할인 적용
    const { finalTotal: tuesdayTotal, finalDiscRate: tuesdayDiscRate } =
      this.applyTuesdaySpecialDiscount(totalAmt, originalTotal, bulkDiscRate);
    totalAmt = tuesdayTotal;
    discRate = tuesdayDiscRate;

    // UI 업데이트
    this.updateSummaryDetails(cartItems, subTot, itemCnt, itemDiscounts);
    this.updateTotalDisplay(totalAmt);
    this.updateDiscountInfo(originalTotal, totalAmt, discRate);
    this.updateItemCount(itemCnt);

    return {
      totalAmt: Math.round(totalAmt),
      itemCnt,
      originalTotal,
      discRate,
    };
  }

  updateItemPriceDisplay(itemDiv, qty) {
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = qty >= INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD ? 'bold' : 'normal';
      }
    });
  }

  calculateIndividualDiscount(productId) {
    const discountMap = {
      [KEYBOARD]: PRODUCT_DISCOUNTS[KEYBOARD] / 100,
      [MOUSE]: PRODUCT_DISCOUNTS[MOUSE] / 100,
      [MONITOR_ARM]: PRODUCT_DISCOUNTS[MONITOR_ARM] / 100,
      [NOTEBOOK_CASE]: PRODUCT_DISCOUNTS[NOTEBOOK_CASE] / 100,
      [SPEAKER]: PRODUCT_DISCOUNTS[SPEAKER] / 100,
    };
    return discountMap[productId] || 0;
  }

  applyBulkPurchaseDiscount(totalAmt, subTot, itemCnt) {
    let discRate = 0;

    if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
      totalAmt = (subTot * (100 - BULK_PURCHASE_DISCOUNT)) / 100;
      discRate = BULK_PURCHASE_DISCOUNT / 100;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }

    return { finalTotal: totalAmt, discRate };
  }

  applyTuesdaySpecialDiscount(totalAmt, originalTotal, discRate) {
    const tuesdaySpecial = document.getElementById('tuesday-special');
    if (tuesdaySpecial) {
      if (isTuesday()) {
        if (totalAmt > 0) {
          totalAmt = (totalAmt * (100 - TUESDAY_SPECIAL_DISCOUNT)) / 100;
          // 화요일 할인 적용 후의 최종 할인율 계산
          discRate = 1 - totalAmt / originalTotal;
          tuesdaySpecial.classList.remove('hidden');
        } else {
          tuesdaySpecial.classList.add('hidden');
        }
      } else {
        tuesdaySpecial.classList.add('hidden');
      }
    }
    return { finalTotal: totalAmt, finalDiscRate: discRate };
  }

  updateSummaryDetails(cartItems, subTot, itemCnt, itemDiscounts) {
    this.summaryDetails.innerHTML = '';

    if (subTot > 0) {
      // 아이템별 상세 내역
      for (let i = 0; i < cartItems.length; i++) {
        const curItem = findProductById(this.productList, cartItems[i].id);
        const qtyElem = cartItems[i].querySelector('.quantity-number');
        const q = parseInt(qtyElem.textContent);
        const itemTotal = curItem.val * q;
        this.summaryDetails.innerHTML += `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${curItem.name} x ${q}</span>
            <span>₩${itemTotal.toLocaleString()}</span>
          </div>
        `;
      }

      // 소계
      this.summaryDetails.innerHTML += `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subTot.toLocaleString()}</span>
        </div>
      `;

      // 할인 정보
      this.renderDiscountDetails(itemCnt, itemDiscounts);

      // 배송 정보
      this.summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
    }
  }

  renderDiscountDetails(itemCnt, itemDiscounts) {
    if (itemCnt >= BULK_PURCHASE_THRESHOLD) {
      this.summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (${BULK_PURCHASE_THRESHOLD}개 이상)</span>
          <span class="text-xs">-${BULK_PURCHASE_DISCOUNT}%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach((item) => {
        this.summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (${INDIVIDUAL_PRODUCT_DISCOUNT_THRESHOLD}개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday()) {
      this.summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-${TUESDAY_SPECIAL_DISCOUNT}%</span>
        </div>
      `;
    }
  }

  updateTotalDisplay(totalAmt) {
    if (this.totalDiv) {
      this.totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
    }
  }

  updateDiscountInfo(originalTotal, totalAmt, discRate) {
    this.discountInfoDiv.innerHTML = '';
    if (discRate > 0 && totalAmt > 0) {
      const savedAmount = originalTotal - totalAmt;
      this.discountInfoDiv.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">
            ₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다
          </div>
        </div>
      `;
    }
  }

  updateItemCount(itemCnt) {
    if (this.itemCountElement) {
      const previousCount = parseInt(this.itemCountElement.textContent.match(/\d+/) || 0);
      this.itemCountElement.textContent = `🛍️  ${itemCnt} items in cart`;
      if (previousCount !== itemCnt) {
        this.itemCountElement.setAttribute('data-changed', 'true');
      }
    }
  }
}

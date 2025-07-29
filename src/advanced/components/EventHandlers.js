import {
  getDiscountedProductName,
  getDiscountedPriceHTML,
} from '../main.basic.js';
import { handleCalculateCartStuff } from '../services/cartService.js';

/**
 * 이벤트 핸들러들 설정
 */
export function setupEventHandlers(
  uiElements,
  appState,
  domElements,
  getCartItemQuantity,
  getTotalStock,
  calculateFinalDiscounts,
  updateOrderSummaryUI,
  updateTotalAndDiscountUI,
  updateHeader,
  findProductById,
  hasKeyboardMouseSet,
  hasFullProductSet,
  shouldApplyTuesdayBonus,
  updateProductSelectUI,
  updateCartPricesUI,
  isValidQuantityChange,
) {
  // ➕ 상품 추가 버튼 이벤트
  uiElements.addButton.addEventListener('click', () => {
    const selItem = uiElements.productSelect.value;
    if (!selItem) {
      alert('상품을 선택해주세요.');
      return;
    }

    const itemToAdd = findProductById(selItem);
    if (!itemToAdd) {
      return;
    }

    if (itemToAdd.quantity <= 0) {
      alert('품절된 상품입니다.');
      return;
    }

    const existingItem = document.getElementById(selItem);
    if (existingItem) {
      const qtyElem = existingItem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      if (isValidQuantityChange(currentQty + 1, itemToAdd, currentQty)) {
        qtyElem.textContent = currentQty + 1;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${getDiscountedProductName(itemToAdd)}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${getDiscountedPriceHTML(itemToAdd)}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${getDiscountedPriceHTML(itemToAdd)}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      uiElements.cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    handleCalculateCartStuff(
      appState,
      uiElements,
      domElements,
      getCartItemQuantity,
      getTotalStock,
      calculateFinalDiscounts,
      updateOrderSummaryUI,
      updateTotalAndDiscountUI,
      updateHeader,
      findProductById,
      hasKeyboardMouseSet,
      hasFullProductSet,
      shouldApplyTuesdayBonus,
    );
    appState.lastSelected = selItem;
  });

  // 🛒 장바구니 아이템 이벤트 (수량 변경, 제거)
  uiElements.cartDisplay.addEventListener('click', event => {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = findProductById(prodId);

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const currentQty = getCartItemQuantity(itemElem);
        const newQty = currentQty + qtyChange;

        if (isValidQuantityChange(newQty, prod, currentQty)) {
          const qtyElem = itemElem.querySelector('.quantity-number');
          qtyElem.textContent = newQty;
          prod.quantity -= qtyChange;
        } else if (newQty <= 0) {
          prod.quantity += currentQty;
          itemElem.remove();
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const remQty = getCartItemQuantity(itemElem);
        prod.quantity += remQty;
        itemElem.remove();
      }

      handleCalculateCartStuff(
        appState,
        uiElements,
        domElements,
        getCartItemQuantity,
        getTotalStock,
        calculateFinalDiscounts,
        updateOrderSummaryUI,
        updateTotalAndDiscountUI,
        updateHeader,
        findProductById,
        hasKeyboardMouseSet,
        hasFullProductSet,
        shouldApplyTuesdayBonus,
      );
      updateProductSelectUI(appState.products, getTotalStock());
    }
  });
}

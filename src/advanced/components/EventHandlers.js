import { handleCalculateCartStuff } from '../services/cartService.js';
import { createCartItemElement } from '../utils/pureFunctions.js';

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
      const newItem = createCartItemElement(itemToAdd);
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

// ================================================
// 장바구니 이벤트 핸들러
// ================================================

import { findProductById } from '../utils/product.js';
import { updateStockQuantity } from '../utils/stock.js';

/**
 * 상품을 장바구니에 추가하는 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleAddToCart(event, context) {
  const { productList, cartDisp, sel, handleCalculateCartStuff, stateActions, NewItem } = context;

  const selItem = sel.value;
  const hasItem = productList.some((product) => product.id === selItem);

  if (!selItem || !hasItem) {
    return;
  }

  const itemToAdd = findProductById(productList, selItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      // 이미 장바구니에 있는 상품인 경우 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem.textContent) + 1;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        updateStockQuantity(productList, itemToAdd.id, -1);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로운 상품 추가
      cartDisp.innerHTML += NewItem({ item: itemToAdd });
      updateStockQuantity(productList, itemToAdd.id, -1);
    }
    handleCalculateCartStuff();
    stateActions.updateSelectedProduct(selItem);
  }
}

/**
 * 장바구니 내 상품 수량 변경 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleQuantityChange(event, context) {
  const { productList, handleCalculateCartStuff } = context;

  const tgt = event.target;
  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(productList, prodId);

  if (!prod || !itemElem) return;

  const qtyChange = parseInt(tgt.dataset.change);
  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty + qtyChange;

  if (newQty > 0 && newQty <= prod.quantity + currentQty) {
    // 수량 변경
    qtyElem.textContent = newQty;
    updateStockQuantity(productList, prodId, -qtyChange);
  } else if (newQty <= 0) {
    // 수량이 0이 되면 상품 제거
    updateStockQuantity(productList, prodId, currentQty);
    itemElem.remove();
  } else {
    alert('재고가 부족합니다.');
  }

  handleCalculateCartStuff();
}

/**
 * 장바구니에서 상품 제거 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleRemoveItem(event, context) {
  const { productList, handleCalculateCartStuff } = context;

  const tgt = event.target;
  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(productList, prodId);

  if (!prod || !itemElem) return;

  const qtyElem = itemElem.querySelector('.quantity-number');
  const remQty = parseInt(qtyElem.textContent);

  // 재고 복구
  updateStockQuantity(productList, prodId, remQty);
  itemElem.remove();

  handleCalculateCartStuff();
}

/**
 * 장바구니 클릭 이벤트 위임 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Object} context - 컨텍스트 객체
 */
export function handleCartClick(event, context) {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change')) {
    handleQuantityChange(event, context);
  } else if (tgt.classList.contains('remove-item')) {
    handleRemoveItem(event, context);
  }
}

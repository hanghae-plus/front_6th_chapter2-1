import { getProductById, setLastSelectedProductId } from './business-state.js';
import {
  getAddButtonElement,
  getProductSelectElement,
  getCartDisplayElement,
  getHelpToggleElement,
  getHelpOverlayElement,
  getHelpColumnElement,
} from './dom-refs.js';
import { CartController, ProductController } from '../../features/index.js';
import { CartItem } from '../../features/cart/components/CartItem.js';
import { DEFAULT_MESSAGES } from '../constants/index.js';

// ==================== 이벤트 핸들러 초기화 ====================
export function initializeEvents() {
  setupHelpManualEvents();
  setupAddButtonHandler();
  setupCartClickHandler();
}

/** 헬프 매뉴얼 이벤트 핸들러 설정 */
function setupHelpManualEvents() {
  const helpToggle = getHelpToggleElement();
  const helpOverlay = getHelpOverlayElement();
  const helpColumn = getHelpColumnElement();

  if (!helpToggle || !helpOverlay || !helpColumn) return;

  const closeHelp = () => {
    helpOverlay.classList.add('hidden');
    helpColumn.classList.add('translate-x-full');
  };

  // 토글 버튼 클릭
  helpToggle.onclick = () => {
    helpOverlay.classList.toggle('hidden');
    helpColumn.classList.toggle('translate-x-full');
  };

  // 오버레이 클릭 (외부 영역)
  helpOverlay.onclick = (e) => {
    if (e.target === helpOverlay) closeHelp();
  };

  // 닫기 버튼 클릭
  const closeButton = helpColumn.querySelector('button');
  if (closeButton) closeButton.onclick = closeHelp;
}

/** 장바구니 추가 버튼 이벤트 핸들러 */
function setupAddButtonHandler() {
  getAddButtonElement().addEventListener('click', () => {
    const selItem = getProductSelectElement().value;
    const itemToAdd = getProductById(selItem);

    if (!itemToAdd || itemToAdd.stock <= 0) return;

    const existingItem = document.getElementById(itemToAdd.id);

    if (existingItem) {
      updateExistingItemQuantity(existingItem, itemToAdd);
    } else {
      addNewItemToCart(itemToAdd);
    }

    CartController.updateCartDisplay();
    setLastSelectedProductId(selItem);
  });
}

/** 기존 장바구니 아이템 수량 증가 */
function updateExistingItemQuantity(existingItem, product) {
  const qtyElem = existingItem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty + 1;

  if (newQty > product.stock + currentQty) {
    alert(DEFAULT_MESSAGES.STOCK_SHORTAGE);
    return;
  }

  qtyElem.textContent = newQty;
  product.stock--;
}

/** 새로운 아이템 장바구니 추가 */
function addNewItemToCart(product) {
  const cartItem = { id: product.id, quantity: 1 };
  getCartDisplayElement().insertAdjacentHTML(
    'beforeend',
    CartItem(cartItem, product)
  );

  product.stock--;
}

/** 장바구니 클릭 이벤트 핸들러 */
function setupCartClickHandler() {
  getCartDisplayElement().addEventListener('click', (e) => {
    const prodId = e.target.dataset.productId;
    if (!prodId) return;

    if (e.target.classList.contains('quantity-change')) {
      handleQuantityChange(e.target, prodId);
    } else if (e.target.classList.contains('remove-item')) {
      handleItemRemove(prodId);
    }
  });
}

/** 수량 변경 처리 */
function handleQuantityChange(target, prodId) {
  const qtyChange = parseInt(target.dataset.change);
  const itemElem = document.getElementById(prodId);
  const product = getProductById(prodId);

  if (!product || !itemElem) return;

  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty + qtyChange;

  if (newQty <= 0) {
    product.stock += currentQty;
    itemElem.remove();
    refreshCartUI();
    return;
  }

  if (newQty > product.stock + currentQty) {
    alert(DEFAULT_MESSAGES.STOCK_SHORTAGE);
    return;
  }

  qtyElem.textContent = newQty;
  product.stock -= qtyChange;
  refreshCartUI();
}

/** 아이템 제거 처리 */
function handleItemRemove(prodId) {
  const itemElem = document.getElementById(prodId);
  const product = getProductById(prodId);

  if (!product || !itemElem) return;

  const qtyElem = itemElem.querySelector('.quantity-number');
  const remQty = parseInt(qtyElem.textContent);

  product.stock += remQty;
  itemElem.remove();
  refreshCartUI();
}

/** UI 새로고침 */
function refreshCartUI() {
  CartController.updateCartDisplay();
  ProductController.updateSelectOptions();
}

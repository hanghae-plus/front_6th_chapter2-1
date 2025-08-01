// Cart Actions - React의 action creators와 유사한 패턴
import { updateState, getCartItemsContainer } from './cartState.js';
import { findProductById } from '../data/productData.js';

// 액션 타입 상수들 (React의 action types와 유사)
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  UPDATE_TOTAL: 'UPDATE_TOTAL',
  UPDATE_ITEM_COUNT: 'UPDATE_ITEM_COUNT',
  SET_LAST_SELECTED: 'SET_LAST_SELECTED',
  RESET_CART: 'RESET_CART',
};

// 액션 생성자들 (React의 action creators와 유사)
export function addItemToCart(productId) {
  return {
    type: CART_ACTIONS.ADD_ITEM,
    payload: { productId },
  };
}

export function removeItemFromCart(productId) {
  return {
    type: CART_ACTIONS.REMOVE_ITEM,
    payload: { productId },
  };
}

export function updateItemQuantity(productId, changeAmount) {
  return {
    type: CART_ACTIONS.UPDATE_QUANTITY,
    payload: { productId, changeAmount },
  };
}

export function updateCartTotal(totalAmount) {
  return {
    type: CART_ACTIONS.UPDATE_TOTAL,
    payload: { totalAmount },
  };
}

export function updateItemCount(itemCount) {
  return {
    type: CART_ACTIONS.UPDATE_ITEM_COUNT,
    payload: { itemCount },
  };
}

export function setLastSelectedProduct(productId) {
  return {
    type: CART_ACTIONS.SET_LAST_SELECTED,
    payload: { productId },
  };
}

export function resetCart() {
  return {
    type: CART_ACTIONS.RESET_CART,
  };
}

// 액션 디스패처 (React의 dispatch와 유사)
export function dispatchCartAction(action) {
  switch (action.type) {
  case CART_ACTIONS.ADD_ITEM:
    handleAddItem(action.payload.productId);
    break;
  case CART_ACTIONS.REMOVE_ITEM:
    handleRemoveItem(action.payload.productId);
    break;
  case CART_ACTIONS.UPDATE_QUANTITY:
    handleUpdateQuantity(
      action.payload.productId,
      action.payload.changeAmount
    );
    break;
  case CART_ACTIONS.UPDATE_TOTAL:
    updateState({ totalAmount: action.payload.totalAmount });
    break;
  case CART_ACTIONS.UPDATE_ITEM_COUNT:
    updateState({ itemCount: action.payload.itemCount });
    break;
  case CART_ACTIONS.SET_LAST_SELECTED:
    updateState({ lastSelectedProductId: action.payload.productId });
    break;
  case CART_ACTIONS.RESET_CART:
    updateState({
      itemCount: 0,
      totalAmount: 0,
      lastSelectedProductId: null,
    });
    break;
  default:
    console.warn('Unknown cart action:', action.type);
  }
}

// 액션 핸들러들
function handleAddItem(productId) {
  const product = findProductById(productId);
  if (!product || product.stockQuantity <= 0) return;

  const cartItemsContainer = getCartItemsContainer();
  if (!cartItemsContainer) return;

  const existingCartItem = document.getElementById(productId);
  if (existingCartItem) {
    updateExistingCartItem(existingCartItem, product);
  } else {
    // 새 아이템 추가 로직은 main.basic.js에서 처리
    console.log('New item should be added via UI component');
  }
}

function handleRemoveItem(productId) {
  const cartItem = document.getElementById(productId);
  if (!cartItem) return;

  const product = findProductById(productId);
  if (!product) return;

  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement.textContent);
  product.stockQuantity += quantity;

  cartItem.remove();
}

function handleUpdateQuantity(productId, changeAmount) {
  const cartItem = document.getElementById(productId);
  if (!cartItem) return;

  const product = findProductById(productId);
  if (!product) return;

  const quantityElement = cartItem.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + changeAmount;

  if (newQuantity <= 0) {
    handleRemoveItem(productId);
    return;
  }

  if (newQuantity <= product.stockQuantity + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.stockQuantity -= changeAmount;
  }
}

function updateExistingCartItem(cartItem, product) {
  const quantityElement = cartItem.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.stockQuantity) {
    quantityElement.textContent = newQuantity;
    product.stockQuantity--;
  }
}

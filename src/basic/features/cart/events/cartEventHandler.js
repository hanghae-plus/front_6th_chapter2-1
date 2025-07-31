import { renderCartItem } from '@/basic/features/cart/components/CartItem.js';
import {
  stockValidators,
  quantityManagers,
  stockManagers,
} from '@/basic/features/cart/utils/stockUtils.js';
import { productState } from '@/basic/features/product/store/productStore.js';
import { findProductById } from '@/basic/features/product/utils/productUtils.js';
import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';

// DOM 조작 함수들
const domManagers = {
  /**
   * 장바구니 컨테이너 찾기
   * @returns {HTMLElement|null} 장바구니 컨테이너
   */
  getCartContainer: () => {
    return document.getElementById('cart-items');
  },

  /**
   * 장바구니 아이템 추가
   * @param {HTMLElement} cartItem - 장바구니 아이템
   */
  addCartItem: cartItem => {
    const cartContainer = domManagers.getCartContainer();
    if (cartContainer) {
      cartContainer.appendChild(cartItem);
    }
  },

  /**
   * 장바구니 아이템 제거
   * @param {HTMLElement} itemElement - 제거할 아이템 요소
   */
  removeCartItem: itemElement => {
    itemElement.remove();
  },
};

// 알림 함수들
const notifiers = {
  /**
   * 재고 부족 알림
   */
  showInsufficientStockAlert: () => {
    alert('재고가 부족합니다.');
  },
};

// 장바구니 아이템 관리 함수들
const cartItemManagers = {
  /**
   * 기존 아이템 수량 업데이트
   * @param {object} product - 상품 정보
   * @param {HTMLElement} existingItem - 기존 아이템 요소
   * @returns {boolean} 성공 여부
   */
  updateItemQuantity: (product, existingItem) => {
    const quantityElement = existingItem.querySelector(
      `.${ELEMENT_IDS.QUANTITY_NUMBER}`,
    );
    const currentQuantity =
      quantityManagers.getCurrentQuantity(quantityElement);
    const newQuantity = quantityManagers.calculateNewQuantity(
      currentQuantity,
      1,
    );

    if (
      stockValidators.isInsufficientStock(
        currentQuantity,
        newQuantity,
        product.q,
      )
    ) {
      notifiers.showInsufficientStockAlert();
      return false;
    }

    quantityManagers.updateQuantityDisplay(quantityElement, newQuantity);
    stockManagers.decreaseStock(product);
    return true;
  },

  /**
   * 새 아이템 추가
   * @param {object} product - 상품 정보
   * @returns {boolean} 성공 여부
   */
  addNewItem: product => {
    if (stockValidators.isOutOfStock(product.q)) {
      notifiers.showInsufficientStockAlert();
      return false;
    }

    const cartItem = renderCartItem({
      id: product.id,
      name: product.name,
      val: product.val,
      originalVal: product.originalVal,
      quantity: 1,
      onSale: product.onSale || false,
      suggestSale: product.suggestSale || false,
    });

    domManagers.addCartItem(cartItem);
    stockManagers.decreaseStock(product);
    return true;
  },

  /**
   * 아이템 수량 변경
   * @param {object} product - 상품 정보
   * @param {HTMLElement} itemElement - 아이템 요소
   * @param {number} change - 변경 수량
   */
  changeItemQuantity: (product, itemElement, change) => {
    const quantityElement = itemElement.querySelector('.quantity-number');
    const currentQuantity =
      quantityManagers.getCurrentQuantity(quantityElement);
    const newQuantity = quantityManagers.calculateNewQuantity(
      currentQuantity,
      change,
    );

    if (newQuantity <= 0) {
      cartItemManagers.removeItem(product, itemElement);
      return;
    }

    if (!stockValidators.canIncreaseQuantity(change, product.q)) {
      notifiers.showInsufficientStockAlert();
      return;
    }

    quantityManagers.updateQuantityDisplay(quantityElement, newQuantity);
    stockManagers.decreaseStock(product, change);
  },

  /**
   * 아이템 제거
   * @param {object} product - 상품 정보
   * @param {HTMLElement} itemElement - 제거할 아이템 요소
   */
  removeItem: (product, itemElement) => {
    const quantityElement = itemElement.querySelector(
      `.${ELEMENT_IDS.QUANTITY_NUMBER}`,
    );
    const quantity = quantityManagers.getCurrentQuantity(quantityElement);
    stockManagers.increaseStock(product, quantity);
    domManagers.removeCartItem(itemElement);
  },
};

// 이벤트 핸들러 함수들
const eventHandlers = {
  /**
   * 장바구니 추가 버튼 클릭 핸들러
   * @param {Event} event - 클릭 이벤트
   * @param {object} options - 옵션 객체
   */
  handleAddToCartClick: (event, { onAddToCart }) => {
    event.preventDefault();
    if (onAddToCart) {
      onAddToCart();
    }
  },

  /**
   * 장바구니 추가 처리
   */
  handleAddToCart: () => {
    const productSelector = document.getElementById(ELEMENT_IDS.PRODUCT_SELECT);
    const selectedProductId = productSelector.value;
    const product = findProductById(selectedProductId, productState.products);

    if (!product) return;

    const existingItem = document.getElementById(selectedProductId);
    const success = existingItem
      ? cartItemManagers.updateItemQuantity(product, existingItem)
      : cartItemManagers.addNewItem(product);

    if (success) {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  },
};

// 기존 cartUtils 객체 (하위 호환성 유지)
const cartUtils = {
  updateItemQuantity: cartItemManagers.updateItemQuantity,
  addNewItem: cartItemManagers.addNewItem,
  changeItemQuantity: cartItemManagers.changeItemQuantity,
  removeItem: cartItemManagers.removeItem,
};

const handleCartClick = (
  event,
  { cartUtils, onCalculate, onUpdateOptions },
) => {
  const target = event.target;

  if (
    !target.classList.contains('quantity-change') &&
    !target.classList.contains('remove-item')
  ) {
    return;
  }

  const productId = target.dataset.productId;
  if (!productId) return;

  const itemElement = document.getElementById(productId);
  const product = findProductById(productId, productState.products);

  if (!product || !itemElement) return;

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    cartUtils.changeItemQuantity(product, itemElement, quantityChange);
  } else if (target.classList.contains('remove-item')) {
    cartUtils.removeItem(product, itemElement);
  }

  if (onCalculate) {
    onCalculate();
  }

  if (onUpdateOptions) {
    onUpdateOptions();
  }
};

export const registerCartEvents = (onCalculate, onUpdateOptions) => {
  const addToCartButton = document.getElementById('add-to-cart');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', event => {
      eventHandlers.handleAddToCartClick(event, {
        onAddToCart: eventHandlers.handleAddToCart,
      });
    });
  }

  const cartContainer = document.getElementById(ELEMENT_IDS.CART_ITEMS);
  if (cartContainer) {
    cartContainer.addEventListener('click', event => {
      handleCartClick(event, {
        cartUtils,
        onCalculate,
        onUpdateOptions,
      });
    });
  }
};

export { cartUtils };
export const handleAddToCart = eventHandlers.handleAddToCart;

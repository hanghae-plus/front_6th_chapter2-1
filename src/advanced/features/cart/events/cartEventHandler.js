import { renderCartItem } from '@/basic/features/cart/components/CartItem.js';
import {
  stockValidators,
  quantityManagers,
  stockManagers,
} from '@/basic/features/cart/utils/stockUtils.js';
import { productState } from '@/basic/features/product/store/productStore.js';
import { findProductById } from '@/basic/features/product/utils/productUtils.js';
import { ELEMENT_IDS } from '@/basic/shared/constants/elementIds.js';

// 헬퍼 함수들
const getCartContainer = () => document.getElementById(ELEMENT_IDS.CART_ITEMS);
const getAddCartButton = () => document.getElementById(ELEMENT_IDS.ADD_TO_CART);
const getProductSelect = () =>
  document.getElementById(ELEMENT_IDS.PRODUCT_SELECT);

const addCartItem = cartItem => {
  const cartContainer = getCartContainer();
  if (cartContainer) {
    cartContainer.appendChild(cartItem);
  }
};

const removeCartItem = itemElement => {
  itemElement.remove();
};

const showInsufficientStockAlert = () => {
  alert('재고가 부족합니다.');
};

let calculateCallback = null;
let updateOptionsCallback = null;

const handleAddToCart = () => {
  const sel = getProductSelect();
  const productId = sel?.value;

  if (!productId) return;

  const product = findProductById(productId, productState.products);
  if (!product) return;

  if (!stockValidators.hasAvailableStock(product.id, product.val)) {
    showInsufficientStockAlert();
    return;
  }

  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    quantityManagers.updateItemQuantity(existingItem, 1);
  } else {
    const cartItem = renderCartItem({
      id: product.id,
      name: product.name,
      val: product.val,
      quantity: 1,
      originalVal: product.val,
      onSale: product.onSale || false,
      suggestSale: product.suggestSale || false,
    });
    addCartItem(cartItem);
  }

  stockManagers.updateStock(product.id, -1);

  // 계산 콜백 호출
  if (calculateCallback) {
    calculateCallback();
  }

  // 옵션 업데이트 콜백 호출
  if (updateOptionsCallback) {
    updateOptionsCallback();
  }
};

const handleCartClick = (event, callbacks) => {
  const target = event.target;

  if (target.classList.contains('quantity-change')) {
    const change = parseInt(target.dataset.change);
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);

    if (itemElement) {
      const product = findProductById(productId, productState.products);
      if (product) {
        if (change > 0) {
          if (stockValidators.hasAvailableStock(productId, product.val)) {
            quantityManagers.updateItemQuantity(itemElement, change);
            stockManagers.updateStock(productId, -change);
          } else {
            showInsufficientStockAlert();
            return; // 재고 부족 시 콜백 호출하지 않음
          }
        } else {
          quantityManagers.updateItemQuantity(itemElement, change);
          stockManagers.updateStock(productId, -change);
        }

        // 계산 콜백 호출
        if (callbacks.onCalculate) {
          callbacks.onCalculate();
        }

        // 옵션 업데이트 콜백 호출
        if (callbacks.onUpdateOptions) {
          callbacks.onUpdateOptions();
        }
      }
    }
  }

  if (target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);

    if (itemElement) {
      const quantitySpan = itemElement.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantitySpan?.textContent || '0');
      stockManagers.updateStock(productId, currentQuantity);
      removeCartItem(itemElement);

      // 계산 콜백 호출
      if (callbacks.onCalculate) {
        callbacks.onCalculate();
      }

      // 옵션 업데이트 콜백 호출
      if (callbacks.onUpdateOptions) {
        callbacks.onUpdateOptions();
      }
    }
  }
};

// 간단한 이벤트 매니저 객체
const cartEventManager = {
  registerEvents(onCalculate, onUpdateOptions) {
    // 콜백 저장
    calculateCallback = onCalculate;
    updateOptionsCallback = onUpdateOptions;

    // 장바구니 추가 버튼 이벤트
    const addButton = getAddCartButton();
    if (addButton) {
      addButton.addEventListener('click', handleAddToCart);
    }

    // 장바구니 아이템 클릭 이벤트 (수량 변경, 삭제)
    const cartContainer = getCartContainer();
    if (cartContainer) {
      cartContainer.addEventListener('click', event => {
        handleCartClick(event, { onCalculate, onUpdateOptions });
      });
    }
  },
};

export { cartEventManager, handleAddToCart };

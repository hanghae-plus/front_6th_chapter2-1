import { addItemToCart, removeItemFromCart } from '../components/cart/CartDisplay.js';
import { updateProductOptions } from '../components/product/ProductSelector.js';
import { CartError, ERROR_TYPES, ProductError, ValidationError } from '../types/errors.js';
import { validateProduct, validateQuantity } from '../utils/validation.js';

export function createCartEventHandler({ productList, cartDisplay, productSelector, timerService, onCartUpdate }) {
  /** 상품 아이디로 상품 찾기 */
  const findProductByID = (productID) => productList.find((product) => product.productId === productID) ?? null;

  /** 선택된 상품 검증 */
  const validateSelectedProduct = () => {
    const selectedID = productSelector.value;
    return selectedID && findProductByID(selectedID);
  };

  /** 카트 아이템 요소 찾기 */
  const getCartItemElement = (productID) => document.getElementById(productID);

  /** 수량 관련 유틸리티 */
  const getQuantityElement = (itemEl) => {
    const quantityEl = itemEl.querySelector('.quantity-number');
    if (!quantityEl) throw new ValidationError('수량 요소 없음', 'quantity-element');
    return quantityEl;
  };

  /** 수량 업데이트 */
  const updateItemQuantity = (itemEl, newQuantity) => {
    getQuantityElement(itemEl).textContent = newQuantity;
  };

  /** 재고 관리 */
  const decreaseStock = (product, amount = 1) => {
    product.stock -= amount;
  };

  /** 재고 증가 */
  const increaseStock = (product, amount = 1) => {
    product.stock += amount;
  };

  /** 수량 증가 처리 */
  const increaseItemQuantity = (itemEl, product) => {
    const current = parseInt(getQuantityElement(itemEl).textContent);
    const next = current + 1;

    validateQuantity(next, product, current);
    updateItemQuantity(itemEl, next);
    decreaseStock(product);
  };

  /** 새 아이템 추가 */
  const addNewItem = (product) => {
    validateProduct(product, product.productId);
    addItemToCart(cartDisplay, product);
    decreaseStock(product);
  };

  /** 카트에 상품 추가 처리 */
  const handleAddToCart = () => {
    try {
      const product = validateSelectedProduct();
      if (!product) throw new ProductError('유효한 상품을 선택해주세요.');

      if (product.stock <= 0) {
        throw new CartError('품절된 상품입니다.', ERROR_TYPES.INSUFFICIENT_STOCK);
      }

      const existingItem = getCartItemElement(product.productId);
      if (existingItem) {
        increaseItemQuantity(existingItem, product);
      } else {
        addNewItem(product);
      }

      onCartUpdate();
      timerService.setLastSelectedProduct(productSelector.value);
    } catch (error) {
      console.error('카트 추가 오류:', error.message);
      alert(error.message);
    }
  };

  /** 클릭 이벤트 관련 */
  const isValidClickTarget = (target) =>
    target.classList.contains('quantity-change') || target.classList.contains('remove-item');

  /** 클릭 이벤트 타입 추출 */
  const getClickEventType = (target) => {
    if (target.classList.contains('quantity-change')) return 'quantity-change';
    if (target.classList.contains('remove-item')) return 'remove-item';
    return null;
  };

  /** 수량 변경 처리 */
  const updateQuantity = (target, itemEl, product) => {
    const change = parseInt(target.dataset.change);
    const current = parseInt(getQuantityElement(itemEl).textContent);
    const next = current + change;

    if (next > 0) {
      validateQuantity(next, product, current);
      updateItemQuantity(itemEl, next);
      decreaseStock(product, change);
    } else {
      increaseStock(product, current);
      removeItemFromCart(product.productId);
    }
  };

  /** 아이템 삭제 처리 */
  const removeItem = (itemEl, productID, product) => {
    const count = parseInt(getQuantityElement(itemEl).textContent);
    increaseStock(product, count);
    removeItemFromCart(productID);
  };

  /** 카트 액션 처리 */
  const processCartAction = (type, target, itemEl, product) => {
    const actions = {
      'quantity-change': () => updateQuantity(target, itemEl, product),
      'remove-item': () => removeItem(itemEl, product.productId, product),
    };

    const action = actions[type];
    if (action) action();
  };

  /** 카트 클릭 처리 */
  const handleCartClick = (event) => {
    try {
      const target = event.target;
      if (!isValidClickTarget(target)) return;

      const productID = target.dataset.productId;
      if (!productID) throw new ValidationError('상품 ID 없음', 'product-id');

      const itemEl = getCartItemElement(productID);
      const product = findProductByID(productID);
      if (!product) throw new ProductError('상품을 찾을 수 없습니다.', productID);

      const type = getClickEventType(target);
      processCartAction(type, target, itemEl, product);

      onCartUpdate();
      updateProductOptions(productSelector, productList);
    } catch (error) {
      console.error('카트 클릭 오류:', error.message);
      alert(error.message);
    }
  };

  /** 이벤트 리스너 등록 */
  const attachCartEvents = (addButton) => {
    addButton.addEventListener('click', handleAddToCart);
    cartDisplay.addEventListener('click', handleCartClick);
  };

  return {
    attachCartEvents,
  };
}

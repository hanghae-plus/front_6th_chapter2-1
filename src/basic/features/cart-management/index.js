/**
 * 장바구니 관리 기능
 * 클린 코드 원칙에 따라 모듈화된 장바구니 관리 로직
 */

import { findProductById } from '../../shared/utils/product-utils.js';
import { handleCalculateCartStuff, onUpdateSelectOptions } from '../events/index.js';

/**
 * 할인 아이콘 및 가격 스타일 생성
 * @param {Object} product - 상품 정보
 * @returns {Object} 아이콘과 가격 정보
 */
function createSaleInfo(product) {
  let saleIcon = '';
  let priceClass = '';
  let priceHTML = '';

  if (product.onSale && product.suggestSale) {
    saleIcon = '⚡💝';
    priceClass = 'text-purple-600';
  } else if (product.onSale) {
    saleIcon = '⚡';
    priceClass = 'text-red-500';
  } else if (product.suggestSale) {
    saleIcon = '💝';
    priceClass = 'text-blue-500';
  }

  if (product.onSale || product.suggestSale) {
    priceHTML = `
      <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span>
      <span class="${priceClass}">₩${product.val.toLocaleString()}</span>
    `;
  } else {
    priceHTML = `₩${product.val.toLocaleString()}`;
  }

  return { saleIcon, priceHTML };
}

/**
 * 장바구니 아이템 HTML 생성
 * @param {Object} product - 상품 정보
 * @returns {string} HTML 문자열
 */
function createCartItemHTML(product) {
  const { saleIcon, priceHTML } = createSaleInfo(product);

  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceHTML}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;
}

/**
 * 기존 아이템 수량 증가
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} product - 상품 정보
 * @param {HTMLElement} itemElement - 장바구니 아이템 요소
 * @returns {boolean} 성공 여부
 */
function increaseExistingItemQuantity(appState, product, itemElement) {
  const quantityElement = itemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q--;
    return true;
  } else {
    alert('재고가 부족합니다.');
    return false;
  }
}

/**
 * 새 아이템을 장바구니에 추가
 * @param {Object} appState - AppState 인스턴스
 * @param {Object} product - 상품 정보
 */
function addNewItemToCart(appState, product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  newItem.innerHTML = createCartItemHTML(product);

  appState.elements.cartDisplay.appendChild(newItem);
  product.q--;
}

/**
 * 장바구니에 상품 추가
 * @param {Object} appState - AppState 인스턴스
 */
export function addItemToCart(appState) {
  const selectedItemId = appState.elements.productSelect.value;
  const product = findProductById(appState.products, selectedItemId);

  if (!selectedItemId || !product) {
    return;
  }

  if (product.q <= 0) {
    alert('품절된 상품입니다.');
    return;
  }

  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const success = increaseExistingItemQuantity(appState, product, existingItem);
    if (!success) return;
  } else {
    // 새 아이템 추가
    addNewItemToCart(appState, product);
  }

  // UI 업데이트
  handleCalculateCartStuff(appState);
  appState.lastSel = selectedItemId;
}

/**
 * 수량 변경 처리
 * @param {Object} appState - AppState 인스턴스
 * @param {HTMLElement} itemElement - 장바구니 아이템 요소
 * @param {Object} product - 상품 정보
 * @param {number} quantityChange - 수량 변경값
 */
function handleQuantityChange(appState, itemElement, product, quantityChange) {
  const quantityElement = itemElement.querySelector('.quantity-number');
  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
    quantityElement.textContent = newQuantity;
    product.q -= quantityChange;
  } else if (newQuantity <= 0) {
    // 수량이 0 이하가 되면 아이템 제거
    product.q += currentQuantity;
    itemElement.remove();
  } else {
    alert('재고가 부족합니다.');
  }
}

/**
 * 아이템 완전 제거
 * @param {Object} appState - AppState 인스턴스
 * @param {HTMLElement} itemElement - 장바구니 아이템 요소
 * @param {Object} product - 상품 정보
 */
function removeItemCompletely(appState, itemElement, product) {
  const quantityElement = itemElement.querySelector('.quantity-number');
  const removeQuantity = parseInt(quantityElement.textContent);
  product.q += removeQuantity;
  itemElement.remove();
}

/**
 * 장바구니 아이템 수량 변경 및 삭제 처리
 * @param {Object} appState - AppState 인스턴스
 * @param {Event} event - 클릭 이벤트
 */
export function handleCartItemAction(appState, event) {
  const target = event.target;

  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  const productId = target.dataset.productId;
  const itemElement = document.getElementById(productId);
  const product = findProductById(appState.products, productId);

  if (!itemElement || !product) {
    return;
  }

  if (target.classList.contains('quantity-change')) {
    // 수량 변경 처리
    const quantityChange = parseInt(target.dataset.change);
    handleQuantityChange(appState, itemElement, product, quantityChange);
  } else if (target.classList.contains('remove-item')) {
    // 아이템 완전 제거
    removeItemCompletely(appState, itemElement, product);
  }

  // UI 업데이트
  handleCalculateCartStuff(appState);
  onUpdateSelectOptions(appState);
}

/**
 * 장바구니 이벤트 핸들러 설정
 * @param {Object} appState - AppState 인스턴스
 */
export function setupCartEventHandlers(appState) {
  // 장바구니 추가 버튼 이벤트 핸들러
  appState.elements.addButton.addEventListener('click', () => {
    addItemToCart(appState);
  });

  // 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러
  appState.elements.cartDisplay.addEventListener('click', (event) => {
    handleCartItemAction(appState, event);
  });
}

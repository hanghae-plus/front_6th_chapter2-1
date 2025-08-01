// ============================================
// EVENT HANDLERS & TIMER FUNCTIONS
// ============================================

import { TIMER_CONFIG } from './constants.js';
import { updateSelectOptions, calculateCart, updatePricesInCart } from './uiUpdates.js';

// 전역 변수들 (main.basic.js에서 설정됨)
let productList, productSelector, cartDisplay, lastSelectedProduct;

// 전역 변수 설정 함수
export function setGlobalVariables(globals) {
  productList = globals.productList;
  productSelector = globals.productSelector;
  cartDisplay = globals.cartDisplay;
  lastSelectedProduct = globals.lastSelectedProduct;
}

// 이벤트 리스너 설정
export function setupEventListeners(addButton) {
  addButton.addEventListener('click', handleAddToCart);
  cartDisplay.addEventListener('click', handleCartInteraction);
}

// 장바구니에 상품 추가
function handleAddToCart() {
  const selectedProductId = productSelector.value;

  if (!selectedProductId) return;

  const product = productList.find((p) => p.id === selectedProductId);
  if (!product || product.quantity <= 0) return;

  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const quantityElement = existingItem.querySelector('.quantity-number');
    const newQuantity = parseInt(quantityElement.textContent) + 1;

    if (newQuantity <= product.quantity + parseInt(quantityElement.textContent)) {
      quantityElement.textContent = newQuantity;
      product.quantity--;
    } else {
      alert('재고가 부족합니다.');
      return;
    }
  } else {
    // 새 아이템 추가
    const newItem = createCartItemElement(product);
    cartDisplay.appendChild(newItem);
    product.quantity--;
  }

  calculateCart();
  lastSelectedProduct = selectedProductId;
}

// 장바구니 아이템 요소 생성
function createCartItemElement(product) {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceDisplay =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalValue.toLocaleString()}</span> <span class="${product.onSale && product.suggestSale ? 'text-purple-600' : product.onSale ? 'text-red-500' : 'text-blue-500'}">₩${product.value.toLocaleString()}</span>`
      : `₩${product.value.toLocaleString()}`;

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  return newItem;
}

// 장바구니 상호작용 처리
function handleCartInteraction(event) {
  const target = event.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = productList.find((p) => p.id === productId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const quantityElement = itemElement.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= currentQuantity + product.quantity) {
        quantityElement.textContent = newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        product.quantity += currentQuantity;
        itemElement.remove();
      } else {
        alert('재고가 부족합니다.');
        return;
      }
    } else if (target.classList.contains('remove-item')) {
      const quantityElement = itemElement.querySelector('.quantity-number');
      const removedQuantity = parseInt(quantityElement.textContent);
      product.quantity += removedQuantity;
      itemElement.remove();
    }

    calculateCart();
    updateSelectOptions();
  }
}

// 타이머 설정
export function setupTimers() {
  // 번개세일 타이머
  const lightningDelay = Math.random() * TIMER_CONFIG.LIGHTNING_SALE_DELAY;
  setTimeout(() => {
    const lightningInterval = setInterval(() => {
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyProduct = productList[luckyIndex];
      
      if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
        luckyProduct.value = Math.round(luckyProduct.originalValue * 0.8);
        luckyProduct.onSale = true;
        alert(`⚡번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
        updatePricesInCart();
      }
    }, TIMER_CONFIG.LIGHTNING_SALE_INTERVAL);
    
    // 테스트 환경에서 타이머 정리
    if (typeof window !== 'undefined' && window.__TESTING__) {
      window.__LIGHTNING_INTERVAL__ = lightningInterval;
    }
  }, lightningDelay);

  // 추천할인 타이머
  const recommendationDelay = Math.random() * TIMER_CONFIG.RECOMMENDATION_DELAY;
  setTimeout(() => {
    const recommendationInterval = setInterval(() => {
      if (cartDisplay.children.length === 0) return;
      
      if (lastSelectedProduct) {
        let suggestedProduct = null;
        
        for (let k = 0; k < productList.length; k++) {
          const product = productList[k];
          if (product.id !== lastSelectedProduct && product.quantity > 0 && !product.suggestSale) {
            suggestedProduct = product;
            break;
          }
        }
        
        if (suggestedProduct) {
          alert(`💝 ${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestedProduct.value = Math.round(suggestedProduct.value * 0.95);
          suggestedProduct.suggestSale = true;
          updateSelectOptions();
          updatePricesInCart();
        }
      }
    }, TIMER_CONFIG.RECOMMENDATION_INTERVAL);
    
    // 테스트 환경에서 타이머 정리
    if (typeof window !== 'undefined' && window.__TESTING__) {
      window.__RECOMMENDATION_INTERVAL__ = recommendationInterval;
    }
  }, recommendationDelay);
}

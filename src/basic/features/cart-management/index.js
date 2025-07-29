import { CartRepository } from '../../entities/cart/index.js';
import { ProductRepository } from '../../entities/product/index.js';
import { PricingService } from '../pricing/index.js';
import { PointsService } from '../points/index.js';
import { findProductById } from '../../shared/utils/product-utils.js';
import { handleCalculateCartStuff, onUpdateSelectOptions } from '../events/index.js';

/**
 * 장바구니 관리 기능
 */

/**
 * 장바구니에 상품 추가
 * @param {Object} appState - AppState 인스턴스
 */
export function addItemToCart(appState) {
  var selItem = appState.elements.productSelect.value;
  var hasItem = findProductById(appState.products, selItem) !== null;

  if (!selItem || !hasItem) {
    return;
  }

  var itemToAdd = findProductById(appState.products, selItem);
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);

    if (item) {
      // 기존 아이템 수량 증가
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem.textContent) + 1;

      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

      var saleIcon = '';
      var priceClass = '';
      var priceHTML = '';

      if (itemToAdd.onSale && itemToAdd.suggestSale) {
        saleIcon = '⚡💝';
        priceClass = 'text-purple-600';
      } else if (itemToAdd.onSale) {
        saleIcon = '⚡';
        priceClass = 'text-red-500';
      } else if (itemToAdd.suggestSale) {
        saleIcon = '💝';
        priceClass = 'text-blue-500';
      }

      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        priceHTML =
          '<span class="line-through text-gray-400">₩' +
          itemToAdd.originalVal.toLocaleString() +
          '</span> <span class="' +
          priceClass +
          '">₩' +
          itemToAdd.val.toLocaleString() +
          '</span>';
      } else {
        priceHTML = '₩' + itemToAdd.val.toLocaleString();
      }

      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${priceHTML}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;

      appState.elements.cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }

    handleCalculateCartStuff(appState);
    appState.lastSel = selItem;
  }
}

/**
 * 장바구니 아이템 수량 변경 및 삭제 처리
 * @param {Object} appState - AppState 인스턴스
 * @param {Event} event - 클릭 이벤트
 */
export function handleCartItemAction(appState, event) {
  var target = event.target;

  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    var productId = target.dataset.productId;
    var itemElement = document.getElementById(productId);
    var product = findProductById(appState.products, productId);

    if (target.classList.contains('quantity-change')) {
      // 수량 변경 처리
      var quantityChange = parseInt(target.dataset.change);
      var quantityElement = itemElement.querySelector('.quantity-number');
      var currentQuantity = parseInt(quantityElement.textContent);
      var newQuantity = currentQuantity + quantityChange;

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
    } else if (target.classList.contains('remove-item')) {
      // 아이템 완전 제거
      var quantityElement = itemElement.querySelector('.quantity-number');
      var removeQuantity = parseInt(quantityElement.textContent);
      product.q += removeQuantity;
      itemElement.remove();
    }

    // UI 업데이트
    handleCalculateCartStuff(appState);
    onUpdateSelectOptions(appState);
  }
}

/**
 * 장바구니 이벤트 핸들러 설정
 * @param {Object} appState - AppState 인스턴스
 */
export function setupCartEventHandlers(appState) {
  // 장바구니 추가 버튼 이벤트 핸들러
  appState.elements.addButton.addEventListener('click', function () {
    addItemToCart(appState);
  });

  // 장바구니 아이템 수량 변경 및 삭제 이벤트 핸들러
  appState.elements.cartDisplay.addEventListener('click', function (event) {
    handleCartItemAction(appState, event);
  });
}

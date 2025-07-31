import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../../lib/products';

const ProductPicker = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // 상품의 할인 상태에 따른 이름 접두사 반환 (기본 버전과 동일)
  const getProductNamePrefix = (product: any) => {
    if (product.onSale && product.suggestSale) {
      return '⚡💝';
    } else if (product.onSale) {
      return '⚡';
    } else if (product.suggestSale) {
      return '💝';
    }
    return '';
  };

  // 바닐라 JS의 handleAddToCart 함수와 동일한 로직을 React로 구현
  const handleAddToCart = () => {
    if (!selectedProductId) {
      return;
    }

    // 선택된 상품 찾기
    const product = PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product || product.quantity === 0) {
      alert('재고가 부족합니다.');
      return;
    }

    // 기존 장바구니 아이템이 있는지 확인
    const cartItemsContainer = document.getElementById('cart-items');
    const existingItem = document.getElementById(selectedProductId);

    if (existingItem) {
      // 기존 아이템 수량 증가
      const quantitySpan = existingItem.querySelector('.quantity-number');
      if (quantitySpan) {
        const currentQty = parseInt(quantitySpan.textContent || '0');
        const newQty = currentQty + 1;

        if (newQty <= product.quantity + currentQty) {
          quantitySpan.textContent = newQty.toString();
          // 가격 업데이트
          updateItemPrice(existingItem, product, newQty);
        } else {
          alert('재고가 부족합니다.');
          return;
        }
      }
    } else {
      // 새 아이템 추가
      const newCartItem = createCartItemElement(product, 1);
      if (cartItemsContainer) {
        cartItemsContainer.appendChild(newCartItem);
      }
    }

    // 재고 감소 시뮬레이션 (실제로는 상태 관리 필요)
    product.quantity--;

    // Order Summary와 재고 정보 업데이트
    updateOrderSummary();
    updateStockInfo();
  };

  // 장바구니 아이템 생성 함수 (바닐라 JS 버전과 유사)
  const createCartItemElement = (product: any, quantity: number) => {
    const itemElement = document.createElement('div');
    itemElement.id = product.id;
    itemElement.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

    const priceDisplay = `₩${product.price.toLocaleString()}`;
    const namePrefix = getProductNamePrefix(product);

    itemElement.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${namePrefix}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceDisplay}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
      </div>
    `;

    // 이벤트 리스너 추가
    addCartItemEventListeners(itemElement);

    return itemElement;
  };

  // 장바구니 아이템에 이벤트 리스너 추가
  const addCartItemEventListeners = (itemElement: Element) => {
    // 수량 변경 버튼 이벤트
    const quantityButtons = itemElement.querySelectorAll('.quantity-change');
    quantityButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const productId = target.dataset.productId;
        const change = parseInt(target.dataset.change || '0');

        if (productId) {
          handleQuantityChange(productId, change);
        }
      });
    });

    // 제거 버튼 이벤트
    const removeButton = itemElement.querySelector('.remove-item');
    if (removeButton) {
      removeButton.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const productId = target.dataset.productId;

        if (productId) {
          handleRemoveItem(productId);
        }
      });
    }
  };

  // 수량 변경 처리
  const handleQuantityChange = (productId: string, change: number) => {
    const itemElement = document.getElementById(productId);
    const quantitySpan = itemElement?.querySelector('.quantity-number');
    const product = PRODUCTS.find((p) => p.id === productId);

    if (!itemElement || !quantitySpan || !product) return;

    const currentQty = parseInt(quantitySpan.textContent || '0');
    const newQty = currentQty + change;

    if (newQty <= 0) {
      // 아이템 제거
      handleRemoveItem(productId);
    } else if (change > 0 && product.quantity === 0) {
      alert('재고가 부족합니다.');
    } else {
      // 수량 변경
      quantitySpan.textContent = newQty.toString();
      product.quantity -= change;
      updateItemPrice(itemElement, product, newQty);
      updateOrderSummary();
      updateStockInfo();
    }
  };

  // 아이템 제거 처리
  const handleRemoveItem = (productId: string) => {
    const itemElement = document.getElementById(productId);
    const quantitySpan = itemElement?.querySelector('.quantity-number');
    const product = PRODUCTS.find((p) => p.id === productId);

    if (!itemElement || !quantitySpan || !product) return;

    const currentQty = parseInt(quantitySpan.textContent || '0');

    // 재고 복원
    product.quantity += currentQty;

    // 아이템 제거
    itemElement.remove();

    // Order Summary와 재고 정보 업데이트
    updateOrderSummary();
    updateStockInfo();
  };

  // 아이템 가격 업데이트
  const updateItemPrice = (itemElement: Element, product: any, quantity: number) => {
    const priceElements = itemElement.querySelectorAll('.text-lg, .text-xs');
    const priceDisplay = `₩${product.price.toLocaleString()}`;

    priceElements.forEach((elem) => {
      if (elem.classList.contains('text-lg')) {
        elem.textContent = priceDisplay;
      }
    });
  };

  // Order Summary 업데이트
  const updateOrderSummary = () => {
    const cartItems = document.querySelectorAll('#cart-items > div');
    const summaryDetails = document.getElementById('summary-details');
    const cartTotal = document.querySelector('#cart-total .text-2xl');
    const loyaltyPoints = document.getElementById('loyalty-points');

    if (!summaryDetails || !cartTotal || !loyaltyPoints) return;

    let totalAmount = 0;
    let itemCount = 0;
    summaryDetails.innerHTML = '';

    // 장바구니가 비어있으면 빈 상태 메시지 표시
    if (cartItems.length === 0) {
      summaryDetails.innerHTML = `
        <div class="text-center text-gray-400 text-sm py-8">
          장바구니가 비어있습니다
        </div>
      `;
    } else {
      // 각 장바구니 아이템 처리
      cartItems.forEach((item) => {
        const quantityElem = item.querySelector('.quantity-number');
        const nameElem = item.querySelector('h3');
        const productId = item.id;

        if (quantityElem && nameElem) {
          const quantity = parseInt(quantityElem.textContent || '0');
          const product = PRODUCTS.find((p) => p.id === productId);

          if (product) {
            const itemTotal = product.price * quantity;
            totalAmount += itemTotal;
            itemCount += quantity;

            const namePrefix = getProductNamePrefix(product);

            summaryDetails.innerHTML += `
              <div class="flex justify-between text-xs tracking-wide text-gray-400">
                <span>${namePrefix}${product.name} x ${quantity}</span>
                <span>₩${itemTotal.toLocaleString()}</span>
              </div>
            `;
          }
        }
      });

      if (totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="border-t border-white/10 my-3"></div>
          <div class="flex justify-between text-sm tracking-wide">
            <span>Subtotal</span>
            <span>₩${totalAmount.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-sm tracking-wide text-gray-400">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        `;
      }
    }

    // 화요일 할인 체크
    const today = new Date();
    if (today.getDay() === 2 && totalAmount > 0) {
      totalAmount = totalAmount * 0.9;
      const tuesdaySpecial = document.getElementById('tuesday-special');
      if (tuesdaySpecial) {
        tuesdaySpecial.classList.remove('hidden');
      }
    }

    // 총액 업데이트
    cartTotal.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;

    // 적립 포인트 업데이트 (0.1%)
    const points = Math.round(totalAmount * 0.001);
    loyaltyPoints.textContent = `적립 포인트: ${points}p`;

    // 헤더의 아이템 카운트 업데이트
    const itemCountElem = document.getElementById('item-count');
    if (itemCountElem) {
      itemCountElem.textContent = `🛍️ ${itemCount} items in cart`;
    }
  };

  // 재고 상태 업데이트
  const updateStockInfo = () => {
    const outOfStockProducts = PRODUCTS.filter((product) => product.quantity === 0);
    const stockStatusElem = document.getElementById('stock-status');

    if (stockStatusElem) {
      if (outOfStockProducts.length > 0) {
        stockStatusElem.textContent = outOfStockProducts.map((product) => `${product.name}: 품절`).join('\n');
        stockStatusElem.style.display = 'block';
      } else {
        stockStatusElem.style.display = 'none';
      }
    }
  };

  useEffect(() => {
    updateStockInfo();
  }, []);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {PRODUCTS.filter((product) => product.quantity > 0).map((product) => {
          const namePrefix = getProductNamePrefix(product);
          return (
            <option key={product.id} value={product.id}>
              {namePrefix}
              {product.name} - ₩{product.price.toLocaleString()}
            </option>
          );
        })}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        에러 방지 노트북 파우치: 품절
      </div>
    </div>
  );
};

export default ProductPicker;

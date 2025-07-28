import { formatCurrency, formatPoints } from '../../shared/utils/index.js';

// 장바구니 위젯
export class CartWidget {
  constructor(container, cartManagementService) {
    this.container = container;
    this.cartService = cartManagementService;
    this.render();
  }

  render() {
    const cartState = this.cartService.getCartState();
    
    this.container.innerHTML = `
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <div id="cart-items">
          ${cartState.isEmpty ? this._renderEmptyCart() : this._renderCartItems(cartState)}
        </div>
      </div>
      <div class="bg-black text-white p-8 flex flex-col">
        ${this._renderOrderSummary(cartState)}
      </div>
    `;
    
    this.bindEvents();
  }

  _renderEmptyCart() {
    return `
      <div class="text-center text-gray-500 py-8">
        <p>장바구니가 비어있습니다</p>
      </div>
    `;
  }

  _renderCartItems(cartState) {
    return cartState.items.map((item, index) => 
      this._renderCartItem(item, index === 0, index === cartState.items.length - 1)
    ).join('');
  }

  _renderCartItem(item, isFirst, isLast) {
    const { product, quantity, discount } = item;
    const itemTotal = product.val * quantity * (1 - discount);
    
    return `
      <div id="${product.id}" class="flex items-center justify-between p-4 border-b border-gray-200 ${isFirst ? 'first:pt-0' : ''} ${isLast ? 'last:border-b-0' : ''}">
        <div class="flex items-center flex-1">
          <div class="w-16 h-16 bg-gradient-black rounded-lg mr-4"></div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${product.name}</h3>
            <p class="text-sm text-gray-500">${formatCurrency(product.val)} ${discount > 0 ? `(${Math.round(discount * 100)}% 할인)` : ''}</p>
            <div class="flex items-center mt-2">
              <button class="quantity-change w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50" data-product-id="${product.id}" data-change="-1">-</button>
              <span class="quantity-number mx-3 min-w-[2rem] text-center">${quantity}</span>
              <button class="quantity-change w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50" data-product-id="${product.id}" data-change="1">+</button>
            </div>
          </div>
        </div>
        <div class="text-right">
          <p class="font-medium">${formatCurrency(itemTotal)}</p>
          <button class="remove-item text-xs text-red-500 hover:text-red-700 mt-1" data-product-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
  }

  _renderOrderSummary(cartState) {
    if (cartState.isEmpty) {
      return `
        <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
        <div class="flex-1 flex flex-col">
          <div id="summary-details" class="space-y-3">
            <p class="text-center text-white/60">장바구니가 비어있습니다</p>
          </div>
          <div class="mt-auto">
            <div id="cart-total" class="pt-5 border-t border-white/10">
              <div class="flex justify-between items-baseline">
                <span class="text-sm uppercase tracking-wider">Total</span>
                <div class="text-2xl tracking-tight">₩0</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-details" class="space-y-3">
          ${this._renderSummaryDetails(cartState)}
        </div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4">
            ${this._renderDiscountInfo(cartState)}
          </div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">${formatCurrency(cartState.finalAmount)}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="item-count" class="text-center text-white/80 text-sm mt-4">
        🛍️ ${cartState.totalQuantity} items in cart
      </div>
      <div id="loyalty-points" class="text-center text-white/80 text-sm mt-2" ${cartState.isEmpty ? 'style="display: none;"' : ''}>
        적립 포인트: ${formatPoints(cartState.points)}${cartState.pointsDetails}
      </div>
    `;
  }

  _renderSummaryDetails(cartState) {
    let html = '';
    
    // 개별 아이템 표시
    cartState.items.forEach(item => {
      const { product, quantity } = item;
      const itemTotal = product.val * quantity;
      html += `
        <div class="flex justify-between text-xs tracking-wide">
          <span>${product.name} × ${quantity}</span>
          <span>${formatCurrency(itemTotal)}</span>
        </div>
      `;
    });

    // 소계
    html += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>${formatCurrency(cartState.subtotal)}</span>
      </div>
    `;

    // 할인 정보
    if (cartState.bulkDiscount) {
      html += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span>대량 할인 (25%)</span>
          <span>-${formatCurrency(cartState.subtotal * 0.25)}</span>
        </div>
      `;
    } else if (cartState.itemDiscounts.length > 0) {
      cartState.itemDiscounts.forEach(discount => {
        html += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span>${discount.name} (${discount.discount}%)</span>
            <span>할인 적용</span>
          </div>
        `;
      });
    }

    if (cartState.tuesdayDiscount) {
      html += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span>화요일 특별 할인 (10%)</span>
          <span>추가 할인</span>
        </div>
      `;
    }

    // 배송비
    html += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;

    return html;
  }

  _renderDiscountInfo(cartState) {
    if (cartState.discountRate > 0 && cartState.finalAmount > 0) {
      const savedAmount = cartState.subtotal - cartState.finalAmount;
      return `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(cartState.discountRate * 100).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">${formatCurrency(savedAmount)} 할인되었습니다</div>
        </div>
      `;
    }
    return '';
  }

  bindEvents() {
    // 수량 변경 버튼
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-change')) {
        const productId = e.target.dataset.productId;
        const change = parseInt(e.target.dataset.change);
        this.handleQuantityChange(productId, change);
      }
      
      // 제거 버튼
      if (e.target.classList.contains('remove-item')) {
        const productId = e.target.dataset.productId;
        this.handleRemoveItem(productId);
      }
    });
  }

  handleQuantityChange(productId, change) {
    try {
      const cartState = this.cartService.getCartState();
      const currentItem = cartState.items.find(item => item.productId === productId);
      if (currentItem) {
        const newQuantity = currentItem.quantity + change;
        this.cartService.updateQuantity(productId, newQuantity);
        this.render();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  handleRemoveItem(productId) {
    this.cartService.removeFromCart(productId);
    this.render();
  }

  // 위젯 업데이트
  update() {
    this.render();
  }
}
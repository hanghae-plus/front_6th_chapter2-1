import { useProducts, useCart } from './hooks';
import { isTuesday } from './entities';
import { $$ } from './utils';

// App Component - 전체 애플리케이션 렌더링
export function App() {
  const { cartData } = useCart();
  const itemCount = cartData.itemCount;
  
  return `
    ${Header()}
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        ${ProductSelector()}
        <div id="cart-items"></div>
      </div>
      <div class="bg-black text-white p-8 flex flex-col">
        <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
        <div class="flex-1 flex flex-col">
          <div id="summary-details" class="space-y-3"></div>
          <div class="mt-auto">
            <div id="discount-info" class="mb-4"></div>
            ${CartTotal()}
            ${TuesdaySpecialBanner()}
          </div>
        </div>
        ${CheckoutButton()}
        ${ShippingNotice()}
      </div>
    </div>
    ${HelpButton()}
    <div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300" onclick="if (event.target === this) { this.classList.add('hidden'); document.querySelector('.fixed.right-0.top-0').classList.add('translate-x-full'); }">
      <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
        ${HelpCloseButton()}
        <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
        ${HelpDiscountSection()}
        ${HelpPointsSection()}
        ${HelpTips()}
      </div>
    </div>
  `;
}

// Header Component
export function Header() {
  const { cartData } = useCart();
  const itemCount = cartData.itemCount;
  
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount || 0} items in cart</p>
    </div>
  `;
}

// ProductOptions Component - 전체 select 요소 생성
export function ProductOptions() {
  const { products, hasLowStock } = useProducts();
  const borderColor = hasLowStock() ? 'orange' : '';

  const options = products.map(item => {
    const optionData = ProductOption({item: item});
    return `<option value="${item.id}" class="${optionData.className || ''}" ${optionData.disabled ? 'disabled' : ''}>${optionData.html}</option>`;
  }).join('');

  return `<select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" style="border-color: ${borderColor}">${options}</select>`;
}

// ProductOption Component
export function ProductOption({ item }) {
  let discountText = '';

  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  
  if (item.q === 0) {
    return {
      html: `${item.name} - ${item.val}원 (품절)${discountText}`,
      className: 'text-gray-400',
      disabled: true
    };
  }
  
  if (item.onSale && item.suggestSale) {
    return {
      html: `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`,
      className: 'text-purple-600 font-bold',
      disabled: false
    };
  } else if (item.onSale) {
    return {
      html: `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`,
      className: 'text-red-500 font-bold',
      disabled: false
    };
  } else if (item.suggestSale) {
    return {
      html: `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`,
      className: 'text-blue-500 font-bold',
      disabled: false
    };
  }
  
  return {
    html: `${item.name} - ${item.val}원`,
    className: '',
    disabled: false
  };
}

// CartItem Component
export function CartItem({ item, quantity = 1 }) {
  const priceData = ProductPrice({product: item});

  return `
    <div id="${item.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      ${ProductImage()}
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${priceData.namePrefix}${item.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceData.priceHTML}</p>
        ${QuantityControls({ productId: item.id, quantity: quantity })}
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceData.priceHTML}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
      </div>
    </div>
  `;
}

// ProductImage Component
export function ProductImage() {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  `;
}

// QuantityControls Component
export function QuantityControls({ productId, quantity }) {
  return `
    <div class="flex items-center gap-4">
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="-1">−</button>
      <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="1">+</button>
    </div>
  `;
}

// DiscountInfo Component
export function DiscountInfo({ discountRate, savedAmount }) {
  if (discountRate <= 0 || !savedAmount) return '';
  
  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
}

// LoyaltyPoints Component
export function LoyaltyPoints({ points, details }) {
  if (!points || points <= 0) {
    return '<div>적립 포인트: <span class="font-bold">0p</span></div>';
  }
  
  return `
    <div>적립 포인트: <span class="font-bold">${points}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${details.join(', ')}</div>
  `;
}

// SummaryDetails Component
export function SummaryDetails({ subtotal, items = [], discounts = [], itemCount, isTuesday }) {
  if (subtotal <= 0) return '';
  
  return `
    ${SummaryItems({ items: items })}
    ${Divider()}
    ${SummarySubtotal({ amount: subtotal })}
    ${SummaryDiscounts({ 
      itemCount: itemCount, 
      discounts: discounts, 
      isTuesday: isTuesday 
    })}
    ${SummaryShipping()}
  `;
}

// SummaryItems Component
export function SummaryItems({ items }) {
  return items.map(item => `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${item.name} x ${item.quantity}</span>
        <span>₩${item.total.toLocaleString()}</span>
      </div>
    `).join('');
}

// Divider Component
export function Divider() {
  return '<div class="border-t border-white/10 my-3"></div>';
}

// SummarySubtotal Component
export function SummarySubtotal({ amount }) {
  return `
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${amount.toLocaleString()}</span>
    </div>
  `;
}

// SummaryDiscounts Component
export function SummaryDiscounts({ itemCount, discounts, isTuesday }) {
  const discountItems = [];

  if (itemCount >= 30) {
    discountItems.push(DiscountItem({ 
      label: '🎉 대량구매 할인 (30개 이상)', 
      percent: 25 
    }));
  } else if (discounts.length > 0) {
    const itemDiscounts = discounts.map(discount => DiscountItem({
      label: `${discount.name} (10개↑)`,
      percent: discount.discount
    }));
    discountItems.push(...itemDiscounts);
  }
  
  if (isTuesday) {
    discountItems.push(DiscountItem({ 
      label: '🌟 화요일 추가 할인', 
      percent: 10,
      color: 'text-purple-400'
    }));
  }
  
  return discountItems.join('');
}

// DiscountItem Component
export function DiscountItem({ label, percent, color = 'text-green-400' }) {
  return `
    <div class="flex justify-between text-sm tracking-wide ${color}">
      <span class="text-xs">${label}</span>
      <span class="text-xs">-${percent}%</span>
    </div>
  `;
}

// SummaryShipping Component
export function SummaryShipping() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

// StockStatus Component
export function StockStatus() {
  const { getStockInfo } = useProducts();
  const { lowStockItems } = getStockInfo();
  
  return lowStockItems
    .map(item => item.message)
    .join('\n');
}

// ProductPrice Component Helper
export function ProductPrice({ product }) {
  let namePrefix = '';
  let priceHTML = '';

  if (product.onSale && product.suggestSale) {
    namePrefix = '⚡💝';
    priceHTML = PriceWithDiscount({ 
      original: product.originalVal, 
      current: product.val, 
      color: 'text-purple-600' 
    });
  } else if (product.onSale) {
    namePrefix = '⚡';
    priceHTML = PriceWithDiscount({ 
      original: product.originalVal, 
      current: product.val, 
      color: 'text-red-500' 
    });
  } else if (product.suggestSale) {
    namePrefix = '💝';
    priceHTML = PriceWithDiscount({ 
      original: product.originalVal, 
      current: product.val, 
      color: 'text-blue-500' 
    });
  } else {
    priceHTML = `₩${product.val.toLocaleString()}`
  }
  
  return { namePrefix, priceHTML };
}


// PriceWithDiscount Component
export function PriceWithDiscount({ original, current, color }) {
  return `
    <span class="line-through text-gray-400">₩${original.toLocaleString()}</span> 
    <span class="${color}">₩${current.toLocaleString()}</span>
  `;
}

// ProductSelector Component
export function ProductSelector() {
  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
      <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
    </div>
  `;
}


// CartTotal Component
export function CartTotal() {
  return `
    <div id="cart-total" class="pt-5 border-t border-white/10">
      <div class="flex justify-between items-baseline">
        <span class="text-sm uppercase tracking-wider">Total</span>
        <div class="text-2xl tracking-tight">₩0</div>
      </div>
      <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
    </div>
  `;
}

// TuesdaySpecialBanner Component
export function TuesdaySpecialBanner() {
  return `
    <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
      <div class="flex items-center gap-2">
        <span class="text-2xs">🎉</span>
        <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
      </div>
    </div>
  `;
}

// CheckoutButton Component
export function CheckoutButton() {
  return `
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
  `;
}

// ShippingNotice Component
export function ShippingNotice() {
  return `
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
}

// HelpButton Component
export function HelpButton() {
  return `
    <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50" onclick="document.querySelector('.fixed.inset-0').classList.toggle('hidden'); document.querySelector('.fixed.right-0.top-0').classList.toggle('translate-x-full');">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
}

// HelpCloseButton Component
export function HelpCloseButton() {
  return `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
}

// HelpDiscountSection Component
export function HelpDiscountSection() {
  const cards = [
    HelpCard({
      title: '개별 상품',
      content: `
        • 키보드 10개↑: 10%<br>
        • 마우스 10개↑: 15%<br>
        • 모니터암 10개↑: 20%<br>
        • 스피커 10개↑: 25%
      `
    }),
    HelpCard({
      title: '전체 수량',
      content: '• 30개 이상: 25%'
    }),
    HelpCard({
      title: '특별 할인',
      content: `
        • 화요일: +10%<br>
        • ⚡번개세일: 20%<br>
        • 💝추천할인: 5%
      `
    })
  ];

  return `
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        ${cards.join('\n        ')}
      </div>
    </div>
  `;
}

// HelpPointsSection Component
export function HelpPointsSection() {
  const cards = [
    HelpCard({
      title: '기본',
      content: '• 구매액의 0.1%'
    }),
    HelpCard({
      title: '추가',
      content: `
        • 화요일: 2배<br>
        • 키보드+마우스: +50p<br>
        • 풀세트: +100p<br>
        • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
      `
    })
  ];

  return `
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        ${cards.join('\n        ')}
      </div>
    </div>
  `;
}

// HelpCard Component
export function HelpCard({ title, content }) {
  return `
    <div class="bg-gray-100 rounded-lg p-3">
      <p class="font-semibold text-sm mb-1">${title}</p>
      <p class="text-gray-700 text-xs pl-2">${content}</p>
    </div>
  `;
}

// HelpTips Component
export function HelpTips() {
  return `
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;
}

// ===== RERENDER FUNCTIONS =====
// 각 함수는 필요한 데이터를 hooks로 가져와서 해당 DOM 요소를 재렌더링

// 상품 선택 드롭다운 재렌더링
export function rerenderProductSelect() {
  const sel = document.getElementById('product-select');
  if (sel) {
    $$(sel, ProductOptions());
  }
}

// 장바구니 아이템 목록 재렌더링
export function rerenderCartItems() {
  const { cart } = useCart();
  const { products } = useProducts();
  const cartDisp = document.getElementById('cart-items');
  
  if (!cartDisp) return;
  
  // 현재 DOM의 상태와 cart 객체 비교하여 업데이트
  const existingItems = {};
  Array.from(cartDisp.children).forEach(child => {
    existingItems[child.id] = child;
  });
  
  // cart 객체를 기반으로 DOM 업데이트
  Object.keys(cart).forEach(productId => {
    const quantity = cart[productId];
    if (quantity <= 0) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = existingItems[productId];
    
    if (existingItem) {
      // 기존 아이템이 있으면 업데이트
      const quantityElement = existingItem.querySelector('.quantity-number');
      if (quantityElement) {
        quantityElement.textContent = quantity;
      }
      
      // 가격 업데이트 (할인 상태가 변경될 수 있음)
      const priceData = ProductPrice({product: product});
      const nameElement = existingItem.querySelector('h3');
      if (nameElement) {
        nameElement.innerHTML = priceData.namePrefix + product.name;
      }
      
      const priceElements = existingItem.querySelectorAll('.text-xs.text-black, .text-lg');
      priceElements.forEach(elem => {
        if (elem.classList.contains('text-black')) {
          elem.innerHTML = priceData.priceHTML;
        } else if (elem.classList.contains('text-lg')) {
          elem.innerHTML = priceData.priceHTML;
        }
      });
      
      delete existingItems[productId];
    } else {
      // 새 아이템 추가
      const cartItemHTML = CartItem({ item: product, quantity: quantity });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cartItemHTML;
      cartDisp.appendChild(tempDiv.firstElementChild);
    }
  });
  
  // cart에 없는 아이템은 제거
  Object.keys(existingItems).forEach(productId => {
    existingItems[productId].remove();
  });
}

// 화요일 배너 재렌더링
export function rerenderTuesdayBanner() {
  const { cartData } = useCart();
  const tuesdaySpecial = document.getElementById('tuesday-special');
  
  if (!tuesdaySpecial) return;
  
  if (isTuesday(new Date()) && cartData.totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

// 아이템 개수 재렌더링
export function rerenderItemCount() {
  const { cartData } = useCart();
  const itemCountElement = document.getElementById('item-count');
  
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${cartData.itemCount} items in cart`;
    if (previousCount !== cartData.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

// 주문 요약 재렌더링
export function rerenderSummaryDetails() {
  const { cartData } = useCart();
  const summaryDetails = document.getElementById('summary-details');
  
  if (summaryDetails) {
    summaryDetails.innerHTML = SummaryDetails({
      subtotal: cartData.subtotal,
      items: cartData.summaryItems,
      itemCount: cartData.itemCount,
      discounts: cartData.itemDiscounts,
      isTuesday: cartData.isTuesday
    });
  }
}

// 총액 재렌더링
export function rerenderCartTotal() {
  const { cartData } = useCart();
  const sum = document.getElementById('cart-total');
  
  if (sum) {
    const totalDiv = sum.querySelector('.text-2xl');
    if (totalDiv) {
      totalDiv.textContent = `₩${Math.round(cartData.totalAmount).toLocaleString()}`;
    }
  }
}

// 포인트 재렌더링
export function rerenderLoyaltyPoints() {
  const { cartData, pointsData } = useCart();
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  
  if (loyaltyPointsDiv && pointsData) {
    loyaltyPointsDiv.innerHTML = LoyaltyPoints({points: pointsData.finalPoints, details: pointsData.details});
    loyaltyPointsDiv.style.display = pointsData.finalPoints > 0 || cartData.itemCount > 0 ? 'block' : 'none';
  }
}


// 할인 정보 재렌더링
export function rerenderDiscountInfo() {
  const { cartData } = useCart();
  const discountInfoDiv = document.getElementById('discount-info');
  
  if (discountInfoDiv) {
    discountInfoDiv.innerHTML = DiscountInfo({discountRate: cartData.discountRate, savedAmount: cartData.savedAmount});
  }
}

// 재고 상태 재렌더링
export function rerenderStockStatus() {
  const stockInfo = document.getElementById('stock-status');
  
  if (stockInfo) {
    stockInfo.textContent = StockStatus();
  }
}

// 전체 UI 재렌더링 (모든 부분을 재렌더링)
export function rerenderUI() {
  rerenderProductSelect();
  rerenderCartItems();
  rerenderTuesdayBanner();
  rerenderItemCount();
  rerenderSummaryDetails();
  rerenderCartTotal();
  rerenderLoyaltyPoints();
  rerenderDiscountInfo();
  rerenderStockStatus();
}
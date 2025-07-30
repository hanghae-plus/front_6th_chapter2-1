import { useProducts, useCart } from './hooks';
import { isTuesday, type Product, type CartData, type PointsData } from './entities';
import { $$ } from './utils';

/**
 * 세일 상태에 따른 상품명 접두사
 * 요구사항: 번개세일(⚡), 추천할인(💝) 표시
 */
export const getProductNamePrefix = (product: Product): string =>
  product.onSale && product.suggestSale ? '⚡💝' :
    product.onSale ? '⚡' :
      product.suggestSale ? '💝' : ''


/**
 * 메인 애플리케이션 컴포넌트
 * 요구사항: 상품 선택, 장바구니 표시, 주문 요약 화면 구성
 */
export function App() {
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

/**
 * 헤더 컴포넌트
 * 요구사항: 상단 타이틀 및 장바구니 아이템 개수 표시
 */
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

/**
 * 상품 선택 드롭다운
 * 요구사항: 재고 50개 미만 시 테두리 주황색 표시
 */
export function ProductOptions() {
  const { products, hasLowStock } = useProducts();
  const borderColor = hasLowStock() ? 'orange' : '';

  const options = products.map(item => ProductOption({ item })).join('');

  return `<select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3" style="border-color: ${borderColor}">${options}</select>`;
}

/**
 * 개별 상품 옵션
 * 요구사항: 할인 상태 표시, 품절 시 비활성화
 */
export function ProductOption({ item }: { item: Product }) {
  let discountText = '';
  let text = '';
  let className = '';
  let disabled = false;

  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  
  if (item.quantity === 0) {
    text = `${item.name} - ${item.val}원 (품절)${discountText}`;
    className = 'text-gray-400';
    disabled = true;
  } else if (item.onSale && item.suggestSale) {
    text = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
    className = 'text-purple-600 font-bold';
  } else if (item.onSale) {
    text = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
    className = 'text-red-500 font-bold';
  } else if (item.suggestSale) {
    text = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
    className = 'text-blue-500 font-bold';
  } else {
    text = `${item.name} - ${item.val}원`;
  }
  
  return `<option value="${item.id}" class="${className}" ${disabled ? 'disabled' : ''}>${text}</option>`;
}

/**
 * 장바구니 아이템 컴포넌트
 * 요구사항: 상품 정보, 수량 조절, 삭제 기능
 */
export function CartItem({ item, quantity = 1 }: { item: Product; quantity?: number }) {
  const namePrefix = getProductNamePrefix(item);
  const priceHTML = ProductPrice({ product: item });

  return `
    <div id="${item.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      ${ProductImage()}
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${namePrefix}${item.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${priceHTML}</p>
        ${QuantityControls({ product: item, quantity: quantity })}
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
      </div>
    </div>
  `;
}

/**
 * 상품 이미지 플레이스홀더
 */
export function ProductImage() {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  `;
}

/**
 * 수량 조절 버튼
 * 요구사항: + - 버튼으로 수량 조절
 */
export function QuantityControls({ product, quantity }: { product: Product; quantity: number }) {
  const productId = product.id;
  return `
    <div class="flex items-center gap-4">
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="-1">−</button>
      <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="1">+</button>
    </div>
  `;
}

/**
 * 할인 정보 표시
 * 요구사항: 할인율 및 절약 금액 표시
 */
export function DiscountInfo({ cartData }: { cartData: CartData }) {
  if (cartData.discountRate <= 0 || !cartData.savedAmount) return '';
  
  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(cartData.discountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(cartData.savedAmount).toLocaleString()} 할인되었습니다</div>
    </div>
  `;
}

/**
 * 포인트 적립 표시
 * 요구사항: 기본 포인트 및 보너스 상세 표시
 */
export function LoyaltyPoints({ pointsData }: { pointsData: PointsData }) {
  if (!pointsData.finalPoints || pointsData.finalPoints <= 0) {
    return '<div>적립 포인트: <span class="font-bold">0p</span></div>';
  }
  
  return `
    <div>적립 포인트: <span class="font-bold">${pointsData.finalPoints}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${pointsData.details.join(', ')}</div>
  `;
}

/**
 * 주문 요약 상세
 * 요구사항: 상품별 금액, 할인, 배송비 표시
 */
export function SummaryDetails({ cartData }: { cartData: CartData }) {
  if (cartData.subtotal <= 0) return '';
  
  return `
    ${SummaryItems({ items: cartData.summaryItems })}
    ${Divider()}
    ${SummarySubtotal({ amount: cartData.subtotal })}
    ${SummaryDiscounts({ 
      itemCount: cartData.itemCount, 
      discounts: cartData.itemDiscounts, 
      isTuesday: cartData.isTuesday 
    })}
    ${SummaryShipping()}
  `;
}

/**
 * 주문 상품 목록
 */
export function SummaryItems({ items }: { items: CartData['summaryItems'] }) {
  return items.map(item => `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${item.name} x ${item.quantity}</span>
        <span>₩${item.total.toLocaleString()}</span>
      </div>
    `).join('');
}

/**
 * 구분선
 */
export function Divider() {
  return '<div class="border-t border-white/10 my-3"></div>';
}

/**
 * 소계 표시
 */
export function SummarySubtotal({ amount }: { amount: number }) {
  return `
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${amount.toLocaleString()}</span>
    </div>
  `;
}

/**
 * 할인 내역 표시
 * 요구사항: 개별 할인, 대량 구매 할인, 화요일 할인
 */
export function SummaryDiscounts({ itemCount, discounts, isTuesday }: { itemCount: CartData['itemCount']; discounts: CartData['itemDiscounts']; isTuesday: CartData['isTuesday'] }) {
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

/**
 * 개별 할인 항목
 */
export function DiscountItem({ label, percent, color = 'text-green-400' }: { label: string; percent: number; color?: string }) {
  return `
    <div class="flex justify-between text-sm tracking-wide ${color}">
      <span class="text-xs">${label}</span>
      <span class="text-xs">-${percent}%</span>
    </div>
  `;
}

/**
 * 배송비 표시
 * 요구사항: 무료 배송
 */
export function SummaryShipping() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

/**
 * 재고 상태 표시
 * 요구사항: 5개 미만 재고 부족 경고, 0개 품절 표시
 */
export function StockStatus() {
  const { getStockInfo } = useProducts();
  const { lowStockItems } = getStockInfo();
  
  return lowStockItems
    .map(item => item.message)
    .join('\n');
}


/**
 * 상품 가격 표시
 * 요구사항: 원가, 할인가, 할인율 표시
 */
export function ProductPrice({ product }: { product: Product }) {
  return product.onSale || product.suggestSale
    ? `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
       <span class="${product.onSale && product.suggestSale ? 'text-purple-600' :
                      product.onSale ? 'text-red-500' : 'text-blue-500'}">₩${product.val.toLocaleString()}</span>`
    : `₩${product.val.toLocaleString()}`;
}

/**
 * 상품 선택 영역
 * 요구사항: 드롭다운, 추가 버튼, 재고 상태
 */
export function ProductSelector() {
  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
      <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
    </div>
  `;
}


/**
 * 총액 표시
 * 요구사항: 최종 결제 금액 및 포인트
 */
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

/**
 * 화요일 특별 할인 배너
 * 요구사항: 화요일에만 표시
 */
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

/**
 * 결제 진행 버튼
 */
export function CheckoutButton() {
  return `
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
  `;
}

/**
 * 배송 및 포인트 안내
 */
export function ShippingNotice() {
  return `
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
}

/**
 * 도움말 버튼
 */
export function HelpButton() {
  return `
    <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50" onclick="document.querySelector('.fixed.inset-0').classList.toggle('hidden'); document.querySelector('.fixed.right-0.top-0').classList.toggle('translate-x-full');">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
}

/**
 * 도움말 닫기 버튼
 */
export function HelpCloseButton() {
  return `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
}

/**
 * 도움말 할인 정책 섹션
 */
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

/**
 * 도움말 포인트 정책 섹션
 */
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

/**
 * 도움말 카드 컴포넌트
 */
export function HelpCard({ title, content }: { title: string; content: string }) {
  return `
    <div class="bg-gray-100 rounded-lg p-3">
      <p class="font-semibold text-sm mb-1">${title}</p>
      <p class="text-gray-700 text-xs pl-2">${content}</p>
    </div>
  `;
}

/**
 * 도움말 팁 섹션
 */
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

/**
 * UI 재렌더링 함수들
 * 요구사항: 상태 변경 시 DOM 업데이트
 */

/**
 * 상품 선택 드롭다운 재렌더링
 */
export function rerenderProductSelect() {
  const sel = document.getElementById('product-select');
  if (sel) {
    $$(sel, ProductOptions());
  }
}

/**
 * 장바구니 아이템 목록 재렌더링
 * 요구사항: 상품 추가/제거/수량 변경 시 업데이트
 */
export function rerenderCartItems() {
  const { cart } = useCart();
  const { products } = useProducts();
  const cartDisp = document.getElementById('cart-items');
  if (!cartDisp) return;

  const existingItems: Record<string, Element> = {};
  Array.from(cartDisp.children).forEach(child => {
    existingItems[child.id] = child;
  });
  
  Object.keys(cart).forEach(productId => {
    const quantity = cart[productId];
    if (quantity <= 0) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = existingItems[productId];
    
    if (existingItem) {
      const quantityElement = existingItem.querySelector('.quantity-number');
      if (quantityElement) {
        quantityElement.textContent = String(quantity);
      }
      
      const namePrefix = getProductNamePrefix(product);
      const priceHTML = ProductPrice({ product });
      const nameElement = existingItem.querySelector('h3');
      if (nameElement) {
        nameElement.innerHTML = namePrefix + product.name;
      }
      
      const priceElements = existingItem.querySelectorAll('.text-xs.text-black, .text-lg');
      priceElements.forEach((elem: Element) => {
        if (elem.classList.contains('text-black')) {
          elem.innerHTML = priceHTML;
        } else if (elem.classList.contains('text-lg')) {
          elem.innerHTML = priceHTML;
        }
      });
      
      delete existingItems[productId];
    } else {
      const cartItemHTML = CartItem({ item: product, quantity: quantity });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cartItemHTML;
      if (tempDiv.firstElementChild) {
        cartDisp.appendChild(tempDiv.firstElementChild);
      }
    }
  });
  
  Object.keys(existingItems).forEach(productId => {
    existingItems[productId].remove();
  });
}

/**
 * 화요일 배너 재렌더링
 */
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

/**
 * 아이템 개수 재렌더링
 */
export function rerenderItemCount() {
  const { cartData } = useCart();
  const itemCountElement = document.getElementById('item-count');
  
  if (itemCountElement) {
    const match = itemCountElement.textContent?.match(/\d+/);
    const previousCount = match ? parseInt(match[0]) : 0;
    itemCountElement.textContent = `🛍️ ${cartData.itemCount} items in cart`;
    if (previousCount !== cartData.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

/**
 * 주문 요약 재렌더링
 */
export function rerenderSummaryDetails() {
  const { cartData } = useCart();
  const summaryDetails = document.getElementById('summary-details');
  
  if (summaryDetails) {
    summaryDetails.innerHTML = SummaryDetails({ cartData });
  }
}

/**
 * 총액 재렌더링
 */
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

/**
 * 포인트 재렌더링
 */
export function rerenderLoyaltyPoints() {
  const { cartData, pointsData } = useCart();
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  
  if (loyaltyPointsDiv && pointsData) {
    loyaltyPointsDiv.innerHTML = LoyaltyPoints({ pointsData });
    loyaltyPointsDiv.style.display = pointsData.finalPoints > 0 || cartData.itemCount > 0 ? 'block' : 'none';
  }
}


/**
 * 할인 정보 재렌더링
 */
export function rerenderDiscountInfo() {
  const { cartData } = useCart();
  const discountInfoDiv = document.getElementById('discount-info');
  
  if (discountInfoDiv) {
    discountInfoDiv.innerHTML = DiscountInfo({ cartData });
  }
}

/**
 * 재고 상태 재렌더링
 */
export function rerenderStockStatus() {
  const stockInfo = document.getElementById('stock-status');
  
  if (stockInfo) {
    stockInfo.textContent = StockStatus();
  }
}

/**
 * 전체 UI 재렌더링
 * 요구사항: 모든 UI 요소 일괄 업데이트
 */
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
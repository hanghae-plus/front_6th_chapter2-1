// 유틸리티 함수 import
import { createElement, createElements, addEventListeners, bindEvents, render } from './utils.js';


// 전역 변수 선언
// 상태 관리 변수
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var totalAmt = 0


// DOM 요소 참조 변수
var sel
var addBtn
var cartDisp
var sum


// 상품 ID 상수
var PRODUCT_ONE = 'p1'
var p2 = 'p2'
var product_3 = 'p3'
var p4 = "p4"
var PRODUCT_5 = `p5`


// React Component 같은 컨벤션의 HTML 생성 함수들
// Header Component
function Header({ itemCount }) {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ ${itemCount || 0} items in cart</p>
    </div>
  `;
}


// ProductOption Component
function ProductOption({ item }) {
  var discountText = '';
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
    html: `${item.name} - ${item.val}원${discountText}`,
    className: '',
    disabled: false
  };
}


// CartItem Component
function CartItem({ item, quantity = 1 }) {
  var priceData = ProductPrice({ product: item });
  
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
function ProductImage() {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  `;
}

// QuantityControls Component
function QuantityControls({ productId, quantity }) {
  return `
    <div class="flex items-center gap-4">
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="-1">−</button>
      <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${quantity}</span>
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${productId}" data-change="1">+</button>
    </div>
  `;
}


// DiscountInfo Component
function DiscountInfo({ discountRate, savedAmount }) {
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
function LoyaltyPoints({ points, details }) {
  if (!points || points <= 0) {
    return '<div>적립 포인트: <span class="font-bold">0p</span></div>';
  }
  
  return `
    <div>적립 포인트: <span class="font-bold">${points}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${details.join(', ')}</div>
  `;
}


// SummaryDetails Component
function SummaryDetails({ subtotal, items = [], discounts = [], itemCount, isTuesday }) {
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
function SummaryItems({ items }) {
  return items.map(function(item) {
    return `
      <div class="flex justify-between text-xs tracking-wide text-gray-400">
        <span>${item.name} x ${item.quantity}</span>
        <span>₩${item.total.toLocaleString()}</span>
      </div>
    `;
  }).join('');
}

// Divider Component
function Divider() {
  return '<div class="border-t border-white/10 my-3"></div>';
}

// SummarySubtotal Component
function SummarySubtotal({ amount }) {
  return `
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${amount.toLocaleString()}</span>
    </div>
  `;
}

// SummaryDiscounts Component
function SummaryDiscounts({ itemCount, discounts, isTuesday }) {
  var html = '';
  
  if (itemCount >= 30) {
    html += DiscountItem({ 
      label: '🎉 대량구매 할인 (30개 이상)', 
      percent: 25 
    });
  } else if (discounts.length > 0) {
    discounts.forEach(function(discount) {
      html += DiscountItem({ 
        label: `${discount.name} (10개↑)`, 
        percent: discount.discount 
      });
    });
  }
  
  if (isTuesday) {
    html += DiscountItem({ 
      label: '🌟 화요일 추가 할인', 
      percent: 10,
      color: 'text-purple-400'
    });
  }
  
  return html;
}

// DiscountItem Component
function DiscountItem({ label, percent, color = 'text-green-400' }) {
  return `
    <div class="flex justify-between text-sm tracking-wide ${color}">
      <span class="text-xs">${label}</span>
      <span class="text-xs">-${percent}%</span>
    </div>
  `;
}

// SummaryShipping Component
function SummaryShipping() {
  return `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}


// StockStatus Component
function StockStatus({ products }) {
  var messages = [];
  
  products.forEach(function(item) {
    if (item.q < 5) {
      if (item.q > 0) {
        messages.push(`${item.name}: 재고 부족 (${item.q}개 남음)`);
      } else {
        messages.push(`${item.name}: 품절`);
      }
    }
  });
  
  return messages.join('\n');
}


// ProductPrice Component Helper
function ProductPrice({ product }) {
  var namePrefix = '';
  var priceHTML = '';
  
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
    priceHTML = Price({ amount: product.val });
  }
  
  return { namePrefix, priceHTML };
}

// Price Component
function Price({ amount }) {
  return `₩${amount.toLocaleString()}`;
}

// PriceWithDiscount Component
function PriceWithDiscount({ original, current, color }) {
  return `
    <span class="line-through text-gray-400">₩${original.toLocaleString()}</span> 
    <span class="${color}">₩${current.toLocaleString()}</span>
  `;
}


// 셀렉터 테두리 색상 결정
function getSelectorBorderColor(totalStock) {
  return totalStock < 50 ? 'orange' : '';
}


// 전체 재고 수량 계산
function calculateTotalStock(prodList) {
  var total = 0;
  for (var i = 0; i < prodList.length; i++) {
    total += prodList[i].q;
  }
  return total;
}


// 아이템 할인율 계산
function calculateItemDiscount(productId, quantity) {
  if (quantity < 10) return 0;
  
  switch(productId) {
    case 'p1': return 0.10;
    case 'p2': return 0.15;
    case 'p3': return 0.20;
    case 'p4': return 0.05;
    case 'p5': return 0.25;
    default: return 0;
  }
}


// 화요일 체크
function isTuesday(date) {
  return date.getDay() === 2;
}


// 화요일 할인 적용
function applyTuesdayDiscount(amount, isToday) {
  if (isToday && amount > 0) {
    return amount * 0.9;
  }
  return amount;
}


// 할인율 계산
function calculateDiscountRate(originalTotal, finalTotal) {
  if (originalTotal === 0) return 0;
  return 1 - (finalTotal / originalTotal);
}


// 대량 구매 할인 적용
function applyBulkDiscount(subtotal, itemCount) {
  if (itemCount >= 30) {
    return {
      amount: subtotal * 0.75,
      discountRate: 0.25
    };
  }
  return {
    amount: subtotal,
    discountRate: 0
  };
}


// 화요일 특별 표시 여부 결정
function shouldShowTuesdaySpecial(isTuesday, totalAmount) {
  return isTuesday && totalAmount > 0;
}


// 아이템 가격 표시 스타일 결정
function getItemPriceStyle(quantity) {
  return quantity >= 10 ? 'bold' : 'normal';
}


// Layout Components
// MainGrid Component
function MainGrid() {
  return '<div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden"></div>';
}

// LeftColumn Component
function LeftColumn() {
  return `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${ProductSelector()}
      <div id="cart-items"></div>
    </div>
  `;
}

// ProductSelector Component
function ProductSelector() {
  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
      <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
    </div>
  `;
}

// RightColumn Component
function RightColumn() {
  return `
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
  `;
}

// CartTotal Component
function CartTotal() {
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
function TuesdaySpecialBanner() {
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
function CheckoutButton() {
  return `
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
  `;
}

// ShippingNotice Component
function ShippingNotice() {
  return `
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
}


// Help Components
// HelpButton Component
function HelpButton() {
  return `
    <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
}

// HelpOverlay Component
function HelpOverlay() {
  return '<div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"></div>';
}

// HelpSidebar Component
function HelpSidebar() {
  return `
    <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
      ${HelpCloseButton()}
      <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
      ${HelpDiscountSection()}
      ${HelpPointsSection()}
      ${HelpTips()}
    </div>
  `;
}

// HelpCloseButton Component
function HelpCloseButton() {
  return `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
}

// HelpDiscountSection Component
function HelpDiscountSection() {
  return `
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        ${HelpCard({
          title: '개별 상품',
          content: `
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          `
        })}
        ${HelpCard({
          title: '전체 수량',
          content: '• 30개 이상: 25%'
        })}
        ${HelpCard({
          title: '특별 할인',
          content: `
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          `
        })}
      </div>
    </div>
  `;
}

// HelpPointsSection Component
function HelpPointsSection() {
  return `
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        ${HelpCard({
          title: '기본',
          content: '• 구매액의 0.1%'
        })}
        ${HelpCard({
          title: '추가',
          content: `
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          `
        })}
      </div>
    </div>
  `;
}

// HelpCard Component
function HelpCard({ title, content }) {
  return `
    <div class="bg-gray-100 rounded-lg p-3">
      <p class="font-semibold text-sm mb-1">${title}</p>
      <p class="text-gray-700 text-xs pl-2">${content}</p>
    </div>
  `;
}

// HelpTips Component
function HelpTips() {
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


// 메인 초기화 함수
function main() {
  var root;
  var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  var lightningDelay;
  
  
  // 전역 상태 초기화
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  
  
  // 상품 목록 초기화
  prodList = [
    {id: PRODUCT_ONE, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false},
    {id: p2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false},
    {id: product_3, name: "거북목 탈출 모니터암", val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false},
    {id: p4, name: "에러 방지 노트북 파우치", val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false},
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false
    }
  ]
  
  
  // DOM 요소 생성 시작
  root = document.getElementById('app')
  
  
  // 헤더 생성
  header = createElement(Header({ itemCount: 0 }));
  
  
  // Layout Components
  gridContainer = createElement(MainGrid());
  leftColumn = createElement(LeftColumn());
  rightColumn = createElement(RightColumn());
  
  
  // DOM 요소 참조 설정
  sel = leftColumn.querySelector('#product-select');
  addBtn = leftColumn.querySelector('#add-to-cart');
  cartDisp = leftColumn.querySelector('#cart-items');
  stockInfo = leftColumn.querySelector('#stock-status');
  sum = rightColumn.querySelector('#cart-total');
  
  
  // Help Components
  manualToggle = createElement(HelpButton());
  manualOverlay = createElement(HelpOverlay());
  manualColumn = createElement(HelpSidebar());
  
  // 이벤트 리스너 설정
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  
  
  // DOM 트리 최종 조립
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  
  
  // 초기 재고 수량 계산
  var initStock = 0;
  for (var i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }
  
  
  // 초기 UI 업데이트
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  
  
  // 번개세일 타이머 설정
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {

        luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  
  
  // 추천 할인 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        var suggest = null;

        for (var k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== lastSel) {
            if (prodList[k].q > 0) {
              if (!prodList[k].suggestSale) {
                suggest = prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.val = Math.round(suggest.val * (100 - 5) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};


// 전역 변수 - 합계 표시 요소
var sum


// 상품 선택 옵션 업데이트 함수
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  
  
  // 기존 옵션 초기화
  sel.innerHTML = '';
  
  
  // 전체 재고 수량 계산
  totalStock = calculateTotalStock(prodList);
  
  
  // 각 상품에 대한 옵션 생성
  for (var i = 0; i < prodList.length; i++) {
    (function() {
      var item = prodList[i];
      var optionData = ProductOption({ item: item });
      var optionHTML = `<option value="${item.id}" class="${optionData.className || ''}" ${optionData.disabled ? 'disabled' : ''}>${optionData.html}</option>`;
      sel.insertAdjacentHTML('beforeend', optionHTML);
    })();
  }
  
  
  // 전체 재고가 부족할 때 테두리 색상 변경
  sel.style.borderColor = getSelectorBorderColor(totalStock);
}


// 장바구니 계산 및 UI 업데이트 메인 함수
function handleCalculateCartStuff() {
  var cartItems;
  var subTot;
  var itemDiscounts;
  var lowStockItems;
  var idx;
  var originalTotal;
  var bulkDisc;
  var itemDisc;
  var savedAmount;
  var summaryDetails;
  var totalDiv;
  var loyaltyPointsDiv;
  var points;
  var discountInfoDiv;
  var itemCountElement;
  var previousCount;
  var stockMsg;
  var pts;
  var hasP1;
  var hasP2;
  var loyaltyDiv;
  
  
  // 변수 초기화
  totalAmt = 0;
  itemCnt = 0;
  cartItems = cartDisp.children;
  subTot = 0;
  itemDiscounts = [];
  lowStockItems = [];
  
  
  // 재고 부족 상품 확인
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
      lowStockItems.push(prodList[idx].name);
    }
  }
  
  
  // 장바구니 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q;
      var itemTot;
      var disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = getItemPriceStyle(q);
        }
      });
      disc = calculateItemDiscount(curItem.id, q);
      if (disc > 0) {
        itemDiscounts.push({name: curItem.name, discount: disc * 100});
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  
  
  // 할인율 계산
  let discRate = 0;
  var originalTotal = subTot;
  
  
  // 대량 구매 할인 적용
  var bulkDiscountResult = applyBulkDiscount(subTot, itemCnt);
  if (itemCnt >= 30) {
    totalAmt = bulkDiscountResult.amount;
    discRate = bulkDiscountResult.discountRate;
  } else {
    discRate = calculateDiscountRate(subTot, totalAmt);
  }


  // 화요일 할인 적용
  const today = new Date();
  var isTodayTuesday = isTuesday(today);
  var tuesdaySpecial = document.getElementById('tuesday-special');
  
  totalAmt = applyTuesdayDiscount(totalAmt, isTodayTuesday);
  discRate = calculateDiscountRate(originalTotal, totalAmt);
  
  // 화요일 표시 여부 설정
  if (shouldShowTuesdaySpecial(isTodayTuesday, totalAmt)) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  
  
  // UI 요소 업데이트
  // 아이템 개수 표시
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
  }
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  
  
  // 주문 요약 상세 내용 생성
  // 주문 아이템 데이터 준비
  var summaryItems = [];
  for (let i = 0; i < cartItems.length; i++) {
    var curItem;
    for (var j = 0; j < prodList.length; j++) {
      if (prodList[j].id === cartItems[i].id) {
        curItem = prodList[j];
        break;
      }
    }
    var qtyElem = cartItems[i].querySelector('.quantity-number');
    var q = parseInt(qtyElem.textContent);
    summaryItems.push({
      name: curItem.name,
      quantity: q,
      total: curItem.val * q
    });
  }
  
  summaryDetails.innerHTML = SummaryDetails({
    subtotal: subTot,
    items: summaryItems,
    itemCount: itemCnt,
    discounts: itemDiscounts,
    isTuesday: isTodayTuesday
  });
  
  
  // 총액 업데이트
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
  
  
  // 포인트 계산 및 표시
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  
  
  // 할인 정보 섹션 업데이트
  discountInfoDiv = document.getElementById('discount-info');
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
  }
  discountInfoDiv.innerHTML = DiscountInfo({ discountRate: discRate, savedAmount: savedAmount });
  
  
  // 아이템 카운트 변경 감지
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  
  
  // 재고 메시지 생성
  stockInfo.textContent = StockStatus({ products: prodList });


  // 추가 업데이트 함수 호출
  handleStockInfoUpdate();
  doRenderBonusPoints();
}


// 보너스 포인트 렌더링 함수
var doRenderBonusPoints = function() {
  var basePoints;
  var finalPoints;
  var pointsDetail;

  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  
  
  // 장바구니가 비어있으면 포인트 섹션 숨김
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  
  
  // 기본 포인트 계산
  basePoints = Math.floor(totalAmt / 1000)
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  
  
  // 화요일 보너스 적용
  if (isTuesday(new Date())) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  
  
  // 세트 구매 확인
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = null;

    for (var pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === node.id) {
        product = prodList[pIdx];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      hasMonitorArm = true;
    }
  }
  
  
  // 세트 보너스 적용
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }


  // 수량별 보너스 적용
  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  
  
  // 최종 포인트 업데이트
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    ptsTag.innerHTML = LoyaltyPoints({ points: bonusPts, details: pointsDetail });
    ptsTag.style.display = 'block';
  }
}


// 전체 재고 수량 계산 함수
function onGetStockTotal() {
  return calculateTotalStock(prodList);
}


// 재고 정보 업데이트 함수
var handleStockInfoUpdate = function() {
  stockInfo.textContent = StockStatus({ products: prodList });
}


// 장바구니 내 가격 업데이트 함수
function doUpdatePricesInCart() {
  var totalCount = 0, j = 0;
  var cartItems;
  
  
  // 첫 번째 방법으로 총 수량 계산
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  
  
  // 두 번째 방법으로 총 수량 재계산 (중복)
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
  }
  
  
  // 각 아이템의 가격 표시 업데이트
  cartItems = cartDisp.children;
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;

    for (var productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');
      
      // 가격 업데이트를 위한 로직
      var priceData = ProductPrice({ product: product });
      
      priceDiv.innerHTML = priceData.priceHTML;
      nameDiv.textContent = priceData.namePrefix + product.name;
    }
  }
  
  
  // 전체 재계산
  handleCalculateCartStuff();
}


// 메인 함수 실행
main();


// 이벤트 리스너 등록
// 장바구니 추가 버튼 클릭 이벤트
addBtn.addEventListener("click", function () {
  var selItem = sel.value

  var hasItem = false;
  for (var idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  var itemToAdd = null;
  for (var j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd['id']);
    if (item) {
      var qtyElem = item.querySelector('.quantity-number')
      var newQty = parseInt(qtyElem['textContent']) + 1
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = createElement(CartItem({ item: itemToAdd, quantity: 1 }));
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});


// 장바구니 아이템 클릭 이벤트 (수량 변경, 삭제)
cartDisp.addEventListener("click", function (event) {
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains("remove-item")) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId)
    var prod = null;

    for (var prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector('.quantity-number');
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var qtyElem = itemElem.querySelector('.quantity-number');
      var remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});
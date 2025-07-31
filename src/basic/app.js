import { PRODUCT_ID, DISCOUNT, STOCK, TIMER, POINTS } from './constants.js';
import { state } from './state.js';
import {
  createInitialDOM,
  updateItemCount,
  updateCartSummary,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateStockStatus,
  updateTuesdaySpecial,
} from './view.js';
import { setupEventListeners } from './events.js';
import { startTimers } from './services.js';
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from './calculator.js';

// DOM 요소를 인자로 받아 사용하는 함수들
function onUpdateSelectOptions(sel) {
  let totalStock = 0;
  for (const product of state.products) {
    totalStock += product.q;
  }

  sel.innerHTML = '';
  for (const item of state.products) {
    const opt = document.createElement('option');
    opt.value = item.id;
    let discountText = '';
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.q === 0) {
      opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = `${item.name} - ${item.val}원${discountText}`;
      }
    }
    sel.appendChild(opt);
  }

  sel.style.borderColor =
    totalStock < STOCK.TOTAL_STOCK_WARNING_THRESHOLD ? 'orange' : '';
}

function handleCalculateCartStuff(cartDisp) {
  const cartItems = Array.from(cartDisp.children).map((item) => ({
    id: item.id,
    quantity: parseInt(item.querySelector('.quantity-number').textContent),
  }));

  const subtotal = calculateSubtotal(cartItems, state.products);
  const discounts = calculateDiscounts(cartItems, state.products);
  const totalAmount = calculateTotal(
    subtotal,
    discounts.totalDiscount,
    discounts.bulkDiscountRate
  );
  const points = calculatePoints(cartItems, totalAmount, state.products);

  state.totalAmount = totalAmount;
  state.itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  state.bonusPoints = points.finalPoints;

  updateItemCount(state.itemCount);
  updateCartSummary({
    cart: cartItems,
    products: state.products,
    subtotal,
    totalAmount,
    discounts,
  });
  updateDiscountInfo(subtotal, totalAmount);
  updateTuesdaySpecial(totalAmount);
  updateStockStatus(state.products);
  updateLoyaltyPoints(points);
}

function doUpdatePricesInCart(cartDisp) {
  const cartItems = Array.from(cartDisp.children);
  for (const cartItem of cartItems) {
    const product = state.products.find((p) => p.id === cartItem.id);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff(cartDisp);
}

// 애플리케이션의 메인 진입점
function main() {
  const dom = createInitialDOM();
  const {
    productSelect,
    addToCartButton,
    cartItemsContainer,
    helpButton,
    helpOverlay,
    helpColumn,
  } = dom;

  // 도움말 UI 이벤트 핸들러
  helpButton.onclick = () => {
    helpOverlay.classList.toggle('hidden');
    helpColumn.classList.toggle('translate-x-full');
  };
  helpOverlay.onclick = (e) => {
    if (e.target === helpOverlay) {
      helpOverlay.classList.add('hidden');
      helpColumn.classList.add('translate-x-full');
    }
  };
  helpColumn.querySelector('button').onclick = () => {
    helpOverlay.classList.add('hidden');
    helpColumn.classList.add('translate-x-full');
  };

  // 초기 렌더링 및 계산
  onUpdateSelectOptions(productSelect);
  handleCalculateCartStuff(cartItemsContainer);

  // 이벤트 리스너 설정
  setupEventListeners({
    addBtn: addToCartButton,
    cartDisp: cartItemsContainer,
    productSelect: productSelect,
    onUpdateSelectOptions: () => onUpdateSelectOptions(productSelect),
    handleCalculateCartStuff: () => handleCalculateCartStuff(cartItemsContainer),
  });

  // 비동기 서비스 시작
  startTimers({
    onUpdateSelectOptions: () => onUpdateSelectOptions(productSelect),
    doUpdatePricesInCart: () => doUpdatePricesInCart(cartItemsContainer),
    cartDisp: cartItemsContainer,
  });
}

// 앱 실행
main();
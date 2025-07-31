import { PRODUCT_ID, DISCOUNT, STOCK, TIMER, POINTS } from './constants.js';
import { state } from './state.js';
import { createInitialDOM } from './view.js';
import { setupEventListeners } from './events.js';
import { startTimers } from './services.js';
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from './calculator.js';

var stockInfo, sel, addBtn, cartDisp, sum;

function main() {
  const dom = createInitialDOM();
  sel = dom.productSelect;
  addBtn = dom.addToCartButton;
  cartDisp = dom.cartItemsContainer;
  stockInfo = dom.stockStatus;
  sum = document.querySelector('#cart-total');

  const manualToggle = dom.helpButton;
  const manualOverlay = dom.helpOverlay;
  const manualColumn = dom.helpColumn;

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

  manualColumn.querySelector('button').onclick = function () {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  };
  var initStock = 0;
  for (var i = 0; i < state.products.length; i++) {
    initStock += state.products[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  startTimers({ onUpdateSelectOptions, doUpdatePricesInCart, cartDisp });
}
var sum;
function onUpdateSelectOptions() {
  var totalStock;
  var opt;
  var discountText;
  sel.innerHTML = '';
  totalStock = 0;
  for (var idx = 0; idx < state.products.length; idx++) {
    var _p = state.products[idx];
    totalStock = totalStock + _p.q;
  }
  for (var i = 0; i < state.products.length; i++) {
    (function () {
      var item = state.products[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent =
          item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent =
            '⚡💝' +
            item.name +
            ' - ' +
            item.originalVal +
            '원 → ' +
            item.val +
            '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent =
            '⚡' +
            item.name +
            ' - ' +
            item.originalVal +
            '원 → ' +
            item.val +
            '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent =
            '💝' +
            item.name +
            ' - ' +
            item.originalVal +
            '원 → ' +
            item.val +
            '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      sel.appendChild(opt);
    })();
  }
  if (totalStock < STOCK.TOTAL_STOCK_WARNING_THRESHOLD) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}
import {
  calculateSubtotal,
  calculateDiscounts,
  calculateTotal,
  calculatePoints,
} from './calculator.js';
import {
  updateItemCount,
  updateCartSummary,
  updateDiscountInfo,
  updateLoyaltyPoints,
  updateStockStatus,
  updateTuesdaySpecial,
} from './view.js';

function handleCalculateCartStuff() {
  // ... (이전과 동일한 계산 로직)

  // UI 업데이트 (view.js에 위임)
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
  // doRenderBonusPoints 호출을 제거하고 updateLoyaltyPoints를 직접 사용
  updateLoyaltyPoints(points);
  handleStockInfoUpdate(); // 이 함수는 아직 남아있으므로 호출 유지
}

// doRenderBonusPoints는 이제 직접 호출되지 않으므로,
// 관련 로직이 handleCalculateCartStuff에 통합되었음을 확인하고
// 중복되는 UI 업데이트를 제거하거나 또는 이 함수를 완전히 제거하는 것을 고려해야 합니다.
// 지금은 중복을 감수하고 그대로 둡니다.
var doRenderBonusPoints = function () {
  const cartItems = Array.from(cartDisp.children).map((item) => ({
    id: item.id,
    quantity: parseInt(item.querySelector('.quantity-number').textContent),
  }));

  const points = calculatePoints(
    cartItems,
    state.totalAmount,
    state.products
  );
  state.bonusPoints = points.finalPoints;

  updateLoyaltyPoints(points);
};
function onGetStockTotal() {
  var sum;
  var i;
  var currentProduct;
  sum = 0;
  for (i = 0; i < state.products.length; i++) {
    currentProduct = state.products[i];
    sum += currentProduct.q;
  }
  return sum;
}
var handleStockInfoUpdate = function () {
  var infoMsg;
  var totalStock;
  var messageOptimizer;
  infoMsg = '';
  totalStock = onGetStockTotal();
  if (totalStock < 30) {
  }
  state.products.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  var totalCount = 0,
    j = 0;
  var cartItems;
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(
      cartDisp.children[j].querySelector('.quantity-number').textContent
    );
  }
  cartItems = cartDisp.children;
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;
    for (var productIdx = 0; productIdx < state.products.length; productIdx++) {
      if (state.products[productIdx].id === itemId) {
        product = state.products[productIdx];
        break;
      }
    }
    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}
main();

setupEventListeners({
  addBtn,
  cartDisp,
  onUpdateSelectOptions,
  handleCalculateCartStuff,
});

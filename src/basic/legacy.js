

import { PRODUCT_ID, DISCOUNT, STOCK, TIMER, POINTS } from './constants.js';
import { state } from './state.js';
import { createInitialDOM } from './view.js';
import { setupEventListeners } from './events.js';
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

  manualColumn.querySelector('button').onclick = function() {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  };
  var initStock = 0;
  for (var i = 0; i < state.products.length; i++) {
    initStock += state.products[i].q;
  }
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * state.products.length);
      var luckyItem = state.products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(luckyItem.originalVal * (1 - DISCOUNT.LIGHTNING_SALE_RATE));
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (state.lastSelected) {
        var suggest = null;
        for (var k = 0; k < state.products.length; k++) {
          if (state.products[k].id !== state.lastSelected) {
            if (state.products[k].q > 0) {
              if (!state.products[k].suggestSale) {
                suggest = state.products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * (1 - DISCOUNT.RECOMMEND_SALE_RATE));
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER.RECOMMEND_SALE_INTERVAL);
  }, Math.random() * 20000);
};
var sum
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
    (function() {
      var item = state.products[i];
      opt = document.createElement("option")
      opt.value = item.id;
      discountText = '';
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText
        opt.disabled = true
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
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
  state.totalAmount = 0;
  state.itemCount = 0;
  originalTotal = state.totalAmount
  cartItems = cartDisp.children;
  subTot = 0;
  bulkDisc = subTot;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < state.products.length; idx++) {
    if (state.products[idx].q < STOCK.LOW_STOCK_THRESHOLD && state.products[idx].q > 0) {
      lowStockItems.push(state.products[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < state.products.length; j++) {
        if (state.products[j].id === cartItems[i].id) {
          curItem = state.products[j];
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
      state.itemCount += q;
      subTot += itemTot;
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= 10) {
        if (curItem.id === PRODUCT_ID.P1) {
          disc = DISCOUNT.KEYBOARD_DISCOUNT_RATE;
        } else if (curItem.id === PRODUCT_ID.P2) {
          disc = DISCOUNT.MOUSE_DISCOUNT_RATE;
        } else if (curItem.id === PRODUCT_ID.P3) {
          disc = DISCOUNT.MONITOR_ARM_DISCOUNT_RATE;
        } else if (curItem.id === PRODUCT_ID.P4) {
          disc = 5 / 100; // This product is out of stock, so it doesn't matter.
        } else if (curItem.id === PRODUCT_ID.P5) {
          disc = DISCOUNT.SPEAKER_DISCOUNT_RATE;
        }
        if (disc > 0) {
          itemDiscounts.push({name: curItem.name, discount: disc * 100});
        }
      }
      state.totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  var originalTotal = subTot;
  if (state.itemCount >= DISCOUNT.BULK_DISCOUNT_THRESHOLD) {
    state.totalAmount = subTot * (1 - DISCOUNT.BULK_DISCOUNT_RATE);
    discRate = DISCOUNT.BULK_DISCOUNT_RATE;
  } else {
    discRate = (subTot - state.totalAmount) / subTot;
  }
  const today = new Date();
  var isTuesday = today.getDay() === 2;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (state.totalAmount > 0) {
      state.totalAmount = state.totalAmount * (1 - DISCOUNT.TUESDAY_DISCOUNT_RATE);
      discRate = 1 - (state.totalAmount / originalTotal);
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  document.getElementById('item-count').textContent = '🛍️ ' + state.itemCount + ' items in cart';
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;
      for (var j = 0; j < state.products.length; j++) {
        if (state.products[j].id === cartItems[i].id) {
          curItem = state.products[j];
          break;
        }
      }
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;
    if (state.itemCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (state.totalAmount > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(state.totalAmount).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(state.totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && state.totalAmount > 0) {
    savedAmount = originalTotal - state.totalAmount;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + state.itemCount + ' items in cart';
    if (previousCount !== state.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  stockMsg = '';
  for (var stockIdx = 0; stockIdx < state.products.length; stockIdx++) {
    var item = state.products[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
var doRenderBonusPoints = function() {
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(state.totalAmount * POINTS.BASE_POINT_RATE)
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINTS.TUESDAY_BONUS_RATE;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  for (const node of nodes) {
    var product = null;
    for (var pIdx = 0; pIdx < state.products.length; pIdx++) {
      if (state.products[pIdx].id === node.id) {
        product = state.products[pIdx];
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
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINTS.KEYBOARD_MOUSE_SET_BONUS;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINTS.FULL_SET_BONUS;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (state.itemCount >= POINTS.BULK_PURCHASE_BONUS.LEVEL_3.threshold) {
    finalPoints = finalPoints + POINTS.BULK_PURCHASE_BONUS.LEVEL_3.points;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (state.itemCount >= POINTS.BULK_PURCHASE_BONUS.LEVEL_2.threshold) {
    finalPoints = finalPoints + POINTS.BULK_PURCHASE_BONUS.LEVEL_2.points;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (state.itemCount >= POINTS.BULK_PURCHASE_BONUS.LEVEL_1.threshold) {
    finalPoints = finalPoints + POINTS.BULK_PURCHASE_BONUS.LEVEL_1.points;
    pointsDetail.push('대량구매(10개+) +20p');
  }
  state.bonusPoints = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (state.bonusPoints > 0) {
      ptsTag.innerHTML = '<div>적립 포인트: <span class="font-bold">' + state.bonusPoints + 'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' + pointsDetail.join(', ') + '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block'
    }
  }
}
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
var handleStockInfoUpdate = function() {
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
}
function doUpdatePricesInCart() {
  var totalCount = 0, j = 0;
  var cartItems;
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
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
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-purple-600">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-red-500">₩' + product.val.toLocaleString() + '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = '<span class="line-through text-gray-400">₩' + product.originalVal.toLocaleString() + '</span> <span class="text-blue-500">₩' + product.val.toLocaleString() + '</span>';
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

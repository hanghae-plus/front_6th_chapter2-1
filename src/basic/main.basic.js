import App from './App.js';
import { createTimerManager } from './components/TimerManager.js';
import { TUESDAY_DAY_OF_WEEK } from './data/date.data.js';
import {
  DISCOUNT_RATE_BULK,
  DISCOUNT_RATE_PRODUCT_1,
  DISCOUNT_RATE_PRODUCT_2,
  DISCOUNT_RATE_PRODUCT_3,
  DISCOUNT_RATE_PRODUCT_4,
  DISCOUNT_RATE_PRODUCT_5,
  DISCOUNT_RATE_TUESDAY,
} from './data/discount.data.js';
import {
  POINT_BONUS_FULL_SET,
  POINT_BONUS_KEYBOARD_MOUSE_SET,
  POINT_BONUS_QUANTITY_TIER1,
  POINT_BONUS_QUANTITY_TIER2,
  POINT_BONUS_QUANTITY_TIER3,
  POINT_MULTIPLIER_TUESDAY,
  POINT_RATE_BASE,
} from './data/point.data.js';
import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  PRODUCT_5,
  PRODUCT_LIST,
} from './data/product.data.js';
import {
  LOW_STOCK_THRESHOLD,
  MIN_QUANTITY_FOR_BULK_DISCOUNT,
  MIN_QUANTITY_FOR_DISCOUNT,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER1,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER2,
  MIN_QUANTITY_FOR_POINT_BONUS_TIER3,
} from './data/quantity.data.js';

// 상태 변수
let itemCounts;
let lastSelect;
let totalAmount = 0;

// DOM 요소
let stockInfo;
let select;
let addButton;
let cartDisplay;

function main() {
  totalAmount = 0;
  itemCounts = 0;
  lastSelect = null;

  // 앱 진입점
  const root = document.getElementById('app');
  new App(root);

  // 메인 레이아웃 컴포넌트 생성
  select = document.querySelector('#product-select');
  addButton = document.querySelector('#add-to-cart');
  stockInfo = document.querySelector('#stock-status');
  cartDisplay = document.querySelector('#cart-items');

  handleCalculateCartStuff();

  // 타이머 매니저 생성 및 모든 타이머 시작
  const timerManager = createTimerManager(doUpdatePricesInCart, {
    lastSelect,
    cartDisplay,
  });

  timerManager.startAll();
}

function handleCalculateCartStuff() {
  // 초기화
  totalAmount = 0;
  itemCounts = 0;
  let originalTotal = totalAmount;
  const cartItems = cartDisplay.children;
  let subTot = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let q;
      let itemTot;
      let disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;
      itemCounts += q;
      subTot += itemTot;
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(elem => {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= MIN_QUANTITY_FOR_DISCOUNT ? 'bold' : 'normal';
        }
      });
      if (q >= MIN_QUANTITY_FOR_DISCOUNT) {
        if (curItem.id === PRODUCT_1) {
          disc = DISCOUNT_RATE_PRODUCT_1 / 100;
        } else {
          if (curItem.id === PRODUCT_2) {
            disc = DISCOUNT_RATE_PRODUCT_2 / 100;
          } else {
            if (curItem.id === PRODUCT_3) {
              disc = DISCOUNT_RATE_PRODUCT_3 / 100;
            } else {
              if (curItem.id === PRODUCT_4) {
                disc = DISCOUNT_RATE_PRODUCT_4 / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = DISCOUNT_RATE_PRODUCT_5 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  originalTotal = subTot;
  if (itemCounts >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    totalAmount = (subTot * (100 - DISCOUNT_RATE_BULK)) / 100;
    discRate = DISCOUNT_RATE_BULK / 100;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }
  const today = new Date();
  const isTuesday = today.getDay() === TUESDAY_DAY_OF_WEEK;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * (100 - DISCOUNT_RATE_TUESDAY)) / 100;
      discRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // DOM 업데이트
  document.getElementById('item-count').textContent = '🛍️ ' + itemCounts + ' items in cart';
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          curItem = PRODUCT_LIST[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
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

    // 대량구매 할인
    if (itemCounts >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(item => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 특별 할인
    if (isTuesday) {
      if (totalAmount > 0) {
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

  // 총액 및 포인트 표시
  const cartTotalElement = document.getElementById('cart-total');
  const totalDiv = cartTotalElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / POINT_RATE_BASE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
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

  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCounts + ' items in cart';
    if (previousCount !== itemCounts) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 메시지 생성
  let stockMsg = '';
  for (let stockIdx = 0; stockIdx < PRODUCT_LIST.length; stockIdx++) {
    const item = PRODUCT_LIST[stockIdx];
    if (item.q < LOW_STOCK_THRESHOLD) {
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

const doRenderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let nodes;
  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(totalAmount / POINT_RATE_BASE);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === TUESDAY_DAY_OF_WEEK) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_MULTIPLIER_TUESDAY;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisplay.children;
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < PRODUCT_LIST.length; pIdx++) {
      if (PRODUCT_LIST[pIdx].id === node.id) {
        product = PRODUCT_LIST[pIdx];
        break;
      }
    }
    if (!product) {
      continue;
    }
    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_BONUS_KEYBOARD_MOUSE_SET;
    pointsDetail.push('키보드+마우스 세트 +' + POINT_BONUS_KEYBOARD_MOUSE_SET + 'p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_BONUS_FULL_SET;
    pointsDetail.push('풀세트 구매 +' + POINT_BONUS_FULL_SET + 'p');
  }
  if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER3) {
    finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER3;
    pointsDetail.push(
      '대량구매(' + MIN_QUANTITY_FOR_POINT_BONUS_TIER3 + '개+) +' + POINT_BONUS_QUANTITY_TIER3 + 'p'
    );
  } else {
    if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER2) {
      finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER2;
      pointsDetail.push(
        '대량구매(' +
          MIN_QUANTITY_FOR_POINT_BONUS_TIER2 +
          '개+) +' +
          POINT_BONUS_QUANTITY_TIER2 +
          'p'
      );
    } else {
      if (itemCounts >= MIN_QUANTITY_FOR_POINT_BONUS_TIER1) {
        finalPoints = finalPoints + POINT_BONUS_QUANTITY_TIER1;
        pointsDetail.push(
          '대량구매(' +
            MIN_QUANTITY_FOR_POINT_BONUS_TIER1 +
            '개+) +' +
            POINT_BONUS_QUANTITY_TIER1 +
            'p'
        );
      }
    }
  }
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        finalPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < PRODUCT_LIST.length; i++) {
    currentProduct = PRODUCT_LIST[i];
    sum += currentProduct.q;
  }
  return sum;
}

const handleStockInfoUpdate = function () {
  let infoMsg;
  let totalStock;
  let messageOptimizer;
  infoMsg = '';
  totalStock = onGetStockTotal();
  if (totalStock < MIN_QUANTITY_FOR_BULK_DISCOUNT) {
  }
  PRODUCT_LIST.forEach(item => {
    if (item.q < LOW_STOCK_THRESHOLD) {
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
  // 이 로직은 장바구니(cartDisplay)의 각 아이템에 대해 수량을 합산하여 totalCount에 저장하는 역할을 한다.
  // 첫 번째 while 루프는 cartDisplay의 자식 요소(장바구니 아이템)를 순회하면서,
  // 각 아이템 내의 '.quantity-number' 클래스를 가진 요소에서 수량을 읽어와 totalCount에 누적한다.
  // qty가 존재하지 않을 경우 0을 더한다.
  // 두 번째 for 루프는 위와 동일한 동작을 하지만, while 루프 이후 totalCount를 0으로 초기화한 뒤
  // for문을 사용하여 cartDisplay의 모든 자식 요소를 순회하며 수량을 다시 합산한다.
  // 결과적으로 두 루프 모두 장바구니 내 모든 상품의 총 수량을 계산하는 코드이나,
  // 실제로는 두 번째 for 루프의 결과만이 남게 된다(첫 번째 루프의 결과는 덮어써짐).
  // 즉, 첫 번째 while 루프는 불필요하게 중복된 코드로 보인다.

  let totalCount = 0,
    j = 0;
  let cartItems;

  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(cartDisplay.children[j].querySelector('.quantity-number').textContent);
  }

  cartItems = cartDisplay.children;

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    for (let productIdx = 0; productIdx < PRODUCT_LIST.length; productIdx++) {
      if (PRODUCT_LIST[productIdx].id === itemId) {
        product = PRODUCT_LIST[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
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

addButton.addEventListener('click', () => {
  const selItem = select.value;

  let hasItem = false;
  for (let idx = 0; idx < PRODUCT_LIST.length; idx++) {
    if (PRODUCT_LIST[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < PRODUCT_LIST.length; j++) {
    if (PRODUCT_LIST[j].id === selItem) {
      itemToAdd = PRODUCT_LIST[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisplay.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSelect = selItem;
  }
});

cartDisplay.addEventListener('click', event => {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < PRODUCT_LIST.length; prdIdx++) {
      if (PRODUCT_LIST[prdIdx].id === prodId) {
        prod = PRODUCT_LIST[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
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
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
  }
});

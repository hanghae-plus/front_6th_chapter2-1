import {
  KEYBOARD_ID,
  MOUSE_ID,
  MONITOR_ID,
  HEADPHONE_ID,
  SPEAKER_ID,
} from '../constants/productId.js';
import {
  QUANTITY_THRESHOLDS,
  DISCOUNT_RATES,
  POINT_RATES,
  STOCK_THRESHOLDS,
  TIMER_DELAYS,
} from '../constants/shopPolicy.js';

import { createManualToggle, createManual } from '../components/Manual.js';
import { createHeader } from '../components/Header.js';
import { createProductSelector } from '../components/ProductSelector.js';
import { createDiscountInfo } from '../components/DiscountInfo.js';
import {
  createGridContainer,
  createLeftColumn,
  createRightColumn,
} from '../components/Layout.js';
import {
  createCartDisplay,
  createCartItemElement,
  setupCartEventListeners,
} from '../components/CartDisplay.js';
import { formatPrice } from '../utils/format.js';
import { createPriceDisplay } from '../components/PriceDisplay.js';
import { createProductOptions } from '../components/ProductOptions.js';
import { createPointsDisplay } from '../components/PointsDisplay.js';

import { createOrderSummary } from '../components/OrderSummary/index.js';

let prodList = [
  {
    id: KEYBOARD_ID,
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MOUSE_ID,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: MONITOR_ID,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: HEADPHONE_ID,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: SPEAKER_ID,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];
let bonusPts = 0;
let stockInfo;
let itemCnt = 0;
let lastSel = null;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;

// 유틸리티 함수: 상품 ID로 상품 찾기
const findProductById = (productId) =>
  prodList.find((product) => product.id === productId);

// 유틸리티 함수: 상품별 할인율 가져오기
const getProductDiscount = (productId) => {
  const discountMap = {
    [KEYBOARD_ID]: DISCOUNT_RATES.PRODUCT.KEYBOARD,
    [MOUSE_ID]: DISCOUNT_RATES.PRODUCT.MOUSE,
    [MONITOR_ID]: DISCOUNT_RATES.PRODUCT.MONITOR_ARM,
    [HEADPHONE_ID]: DISCOUNT_RATES.PRODUCT.LAPTOP_POUCH,
    [SPEAKER_ID]: DISCOUNT_RATES.PRODUCT.SPEAKER,
  };
  return discountMap[productId] || 0;
};

// 유틸리티 함수: 대량구매 보너스 포인트 계산
const getBulkBonus = (itemCount) => {
  if (itemCount >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    return {
      points: POINT_RATES.BULK_BONUS.LARGE,
      threshold: QUANTITY_THRESHOLDS.BONUS_LARGE,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_MEDIUM) {
    return {
      points: POINT_RATES.BULK_BONUS.MEDIUM,
      threshold: QUANTITY_THRESHOLDS.BONUS_MEDIUM,
    };
  } else if (itemCount >= QUANTITY_THRESHOLDS.BONUS_SMALL) {
    return {
      points: POINT_RATES.BULK_BONUS.SMALL,
      threshold: QUANTITY_THRESHOLDS.BONUS_SMALL,
    };
  }
  return null;
};

// 유틸리티 함수: 수량 요소에서 숫자 추출
const getQuantityFromElement = (element) => parseInt(element.textContent) || 0;

function main() {
  let root;
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;

  // 상품 데이터 초기화
  // prodList는 이미 전역으로 사용 가능
  root = document.getElementById('app');

  // 헤더 컴포넌트 생성
  header = createHeader({ itemCount: 0 });

  // 레이아웃 컴포넌트 생성
  gridContainer = createGridContainer();
  leftColumn = createLeftColumn();

  // 상품 선택기 컴포넌트 생성
  const addToCartHandler = function () {
    // 기존 addBtn.onclick 로직을 여기에 구현
    const selectedProduct = prodList[sel.selectedIndex];
    if (selectedProduct && selectedProduct.q > 0) {
      // 장바구니 추가 로직
    }
  };

  selectorContainer = createProductSelector({ onAddToCart: addToCartHandler });
  sel = selectorContainer.querySelector('#product-select');
  addBtn = selectorContainer.querySelector('#add-to-cart');
  stockInfo = selectorContainer.querySelector('#stock-status');

  leftColumn.appendChild(selectorContainer);
  cartDisp = createCartDisplay();
  leftColumn.appendChild(cartDisp);
  rightColumn = createRightColumn();

  const orderSummaryElement = createOrderSummary({
    subTot: 0,
    cartItems: [],
    itemCnt: 0,
    itemDiscounts: [],
    isTuesday: false,
    totalAmt: 0,
    constants: { QUANTITY_THRESHOLDS, DISCOUNT_RATES },
    findProductById,
    getQuantityFromElement,
    formatPrice,
    discRate: 0,
    originalTotal: 0,
    loyaltyPoints: 0,
    tuesdayMessage: 'Tuesday Special 10% Applied',
    pointsNotice: 'Earn loyalty points with purchase.',
  });

  rightColumn.appendChild(orderSummaryElement);
  sum = rightColumn.querySelector('#cart-total');

  // 매뉴얼 컴포넌트 생성
  const manualCloseHandler = function () {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  };

  const manualToggleHandler = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualToggle = createManualToggle({ onToggle: manualToggleHandler });
  const manualComponents = createManual({ onClose: manualCloseHandler });
  manualOverlay = manualComponents.overlay;
  manualColumn = manualComponents.column;
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  lightningDelay = Math.random() * TIMER_DELAYS.LIGHTNING.DELAY_MAX;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(
          luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING)
        );
        luckyItem.onSale = true;
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING * 100}% 할인 중입니다!`
        );
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMER_DELAYS.LIGHTNING.INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = null;

        for (let k = 0; k < prodList.length; k++) {
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
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );

          suggest.val = Math.round(suggest.val * (1 - DISCOUNT_RATES.SUGGEST));
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMER_DELAYS.SUGGEST.INTERVAL);
  }, Math.random() * TIMER_DELAYS.SUGGEST.DELAY_MAX);
}
let sum;
function onUpdateSelectOptions() {
  createProductOptions(sel, prodList, STOCK_THRESHOLDS);
}
function handleCalculateCartStuff() {
  const cartItems = cartDisp.children;
  let subTot = 0;
  let itemDiscounts = [];
  // 전역 변수 초기화 (매번 계산 시마다 리셋)
  totalAmt = 0;
  itemCnt = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      const curItem = findProductById(cartItems[i].id);
      let qtyElem = cartItems[i].querySelector('.quantity-number');
      let q = getQuantityFromElement(qtyElem);
      let itemTot = curItem.val * q;
      let disc = 0;
      itemCnt += q;
      subTot += itemTot;
      const priceElems = cartItems[i].querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });
      if (q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
        disc = getProductDiscount(curItem.id);
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  const originalTotal = subTot;
  if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_LARGE) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK);
    discRate = DISCOUNT_RATES.BULK;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = totalAmt * (1 - DISCOUNT_RATES.TUESDAY);

      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  document.getElementById('item-count').textContent =
    '🛍️ ' + itemCnt + ' items in cart';
  // 주문 요약 섹션 전체를 새로 생성
  const rightColumn = document.querySelector('.right-column');
  const existingOrderSummary = rightColumn.querySelector(
    '.order-summary-section'
  );
  if (existingOrderSummary) {
    existingOrderSummary.remove();
  }

  const newOrderSummary = createOrderSummary({
    subTot,
    cartItems,
    itemCnt,
    itemDiscounts,
    isTuesday,
    totalAmt,
    discRate,
    originalTotal,
    findProductById,
    getQuantityFromElement,
  });
  newOrderSummary.classList.add('order-summary-section');

  rightColumn.appendChild(newOrderSummary);
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = formatPrice(totalAmt);
  }
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmt * POINT_RATES.BASE_RATE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  discountInfoDiv.appendChild(
    createDiscountInfo({
      discRate,
      totalAmt,
      originalTotal,
      formatPrice,
    })
  );
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  let stockMsg = '';

  for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    const item = prodList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg =
          stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockInfoUpdate();
  doRenderBonusPoints();
}
let doRenderBonusPoints = function () {
  const nodes = cartDisp.children;

  if (nodes.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  let basePoints = Math.floor(totalAmt * POINT_RATES.BASE_RATE);
  let finalPoints = 0;
  let pointsDetail = [];

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push(`화요일 ${POINT_RATES.TUESDAY_MULTIPLIER}배`);
    }
  }
  for (const node of nodes) {
    const product = findProductById(node.id);
    if (!product) continue;
    if (product.id === KEYBOARD_ID) {
      hasKeyboard = true;
    } else if (product.id === MOUSE_ID) {
      hasMouse = true;
    } else if (product.id === MONITOR_ID) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + POINT_RATES.SETS.KEYBOARD_MOUSE;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINT_RATES.SETS.KEYBOARD_MOUSE}p`
    );
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + POINT_RATES.SETS.FULL_SET;
    pointsDetail.push(`풀세트 구매 +${POINT_RATES.SETS.FULL_SET}p`);
  }

  // 대량구매 보너스 포인트 계산
  const bulkBonus = getBulkBonus(itemCnt);

  if (bulkBonus) {
    finalPoints += bulkBonus.points;
    pointsDetail.push(
      `대량구매(${bulkBonus.threshold}개+) +${bulkBonus.points}p`
    );
  }
  bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  createPointsDisplay(ptsTag, bonusPts, pointsDetail);
};
let handleStockInfoUpdate = function () {
  let infoMsg = '';
  prodList.forEach(function (item) {
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
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    const product = findProductById(itemId);
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      createPriceDisplay(priceDiv, product);
      nameDiv.textContent =
        (product.onSale && product.suggestSale
          ? '⚡💝'
          : product.onSale
            ? '⚡'
            : product.suggestSale
              ? '💝'
              : '') + product.name;
    }
  }
  handleCalculateCartStuff();
}
main();
addBtn.addEventListener('click', function () {
  const selItem = sel.value;

  const itemToAdd = findProductById(selItem);

  if (!selItem || !itemToAdd) {
    return;
  }
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const currentQty = getQuantityFromElement(qtyElem);
      const newQty = currentQty + 1;
      if (newQty <= itemToAdd.q + currentQty) {
        qtyElem.textContent = newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = createCartItemElement(itemToAdd);
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});
setupCartEventListeners(cartDisp, {
  findProductById,
  getQuantityFromElement,
  handleCalculateCartStuff,
  onUpdateSelectOptions,
});

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

import { createManual } from '../components/Manual/index.js';
import { createManualToggle } from '../components/ManualToggle.js';
import { createHeader } from '../components/Header.js';
import { createProductSelector } from '../components/ProductSelector.js';
import { createDiscountInfo } from '../components/DiscountInfo.js';
import {
  createGridContainer,
  createLeftColumn,
  createRightColumn,
} from '../components/Layout.js';
import { createCartDisplay } from '../components/CartDisplay/index.js';
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
  selectorContainer = createProductSelector();
  sel = selectorContainer.querySelector('#product-select');
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
  const manual = createManual();
  const manualToggle = createManualToggle();

  // Manual 관련 이벤트 핸들러
  const manualCloseHandler = function () {
    manual.classList.add('hidden');
    manual.querySelector('.transform').classList.add('translate-x-full');
  };

  const manualToggleHandler = function () {
    manual.classList.toggle('hidden');
    manual.querySelector('.transform').classList.toggle('translate-x-full');
  };

  // setupEventListeners 패턴으로 통일
  manualToggle.setupEventListeners({ onToggle: manualToggleHandler });
  manual.setupEventListeners({ onClose: manualCloseHandler });
  selectorContainer.setupEventListeners({ onAddToCart: handleAddToCart });
  cartDisp.setupEventListeners({
    handleQuantityChange,
    handleRemoveItem,
  });

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manual);
  onUpdateSelectOptions();
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
        handlePriceUpdate();
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
          handlePriceUpdate();
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
  let finalPoints = basePoints;
  let pointsDetail = [];

  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  if (basePoints > 0) {
    pointsDetail.push('기본: ' + basePoints + 'p');

    // 화요일 보너스 체크
    if (new Date().getDay() === 2) {
      finalPoints = basePoints * POINT_RATES.TUESDAY_MULTIPLIER;
      pointsDetail.push(`화요일 ${POINT_RATES.TUESDAY_MULTIPLIER}배`);
    }
  }
  // 세트 상품 체크를 한 번에 처리
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
  // 세트 보너스 포인트 계산
  if (hasKeyboard && hasMouse) {
    finalPoints += POINT_RATES.SETS.KEYBOARD_MOUSE;
    pointsDetail.push(
      `키보드+마우스 세트 +${POINT_RATES.SETS.KEYBOARD_MOUSE}p`
    );
  }

  // 풀세트 보너스 포인트 계산 (키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += POINT_RATES.SETS.FULL_SET;
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

  // PointsDisplay 컴포넌트 생성 및 DOM에 추가
  const pointsDisplay = createPointsDisplay({
    bonusPoints: bonusPts,
    pointsDetail: pointsDetail,
  });

  // DOM 조작 최적화: 기존 내용이 있으면 교체, 없으면 추가
  if (ptsTag.firstChild) {
    ptsTag.replaceChild(pointsDisplay, ptsTag.firstChild);
  } else {
    ptsTag.appendChild(pointsDisplay);
  }
  ptsTag.style.display = 'block';
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

main();
// 장바구니 추가 전용 핸들러
function handleAddToCart() {
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
        return;
      }
    } else {
      cartDisp.addItem(itemToAdd);
      itemToAdd.q--;
    }

    // 장바구니 추가 후 필요한 계산 및 업데이트
    handleCalculateCartStuff();
    lastSel = selItem;
  }
}

// 수량 변경 전용 핸들러
function handleQuantityChange(prodId, change) {
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(prodId);

  if (!itemElem || !prod) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = getQuantityFromElement(qtyElem);
  const newQty = currentQty + change;

  if (newQty > 0 && newQty <= prod.q + currentQty) {
    qtyElem.textContent = newQty;
    prod.q -= change;
  } else if (newQty <= 0) {
    prod.q += currentQty;
    itemElem.remove();
  } else {
    alert('재고가 부족합니다.');
    return;
  }

  handleCalculateCartStuff();
}

// 상품 제거 전용 핸들러
function handleRemoveItem(prodId) {
  const itemElem = document.getElementById(prodId);
  const prod = findProductById(prodId);

  if (!itemElem || !prod) {
    return;
  }

  const qtyElem = itemElem.querySelector('.quantity-number');
  const remQty = getQuantityFromElement(qtyElem);
  prod.q += remQty;
  itemElem.remove();

  handleCalculateCartStuff();
}

// 가격 업데이트 전용 핸들러
function handlePriceUpdate() {
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
}

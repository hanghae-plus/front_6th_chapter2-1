// ========================================
// 전역 변수 및 상수 정의
// ========================================

// 상품 데이터 및 장바구니 관련 변수
let prodList;
let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;
let sum;

// 상품 ID 상수
const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = 'p4';
const PRODUCT_5 = `p5`;

// ========================================
// 메인 초기화 함수
// ========================================

function main() {
  // 초기값 설정
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  // ----------------------------------------
  // 상품 데이터 초기화
  // ----------------------------------------
  prodList = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: product_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: p4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  // ----------------------------------------
  // 기본 DOM 구조 생성
  // ----------------------------------------
  const root = document.getElementById('app');

  // 헤더 생성
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  // 상품 선택 요소들 생성
  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // ----------------------------------------
  // 왼쪽 컬럼 (상품 선택 및 장바구니)
  // ----------------------------------------
  const leftColumn = document.createElement('div');
  leftColumn['className'] =
    'bg-white border border-gray-200 p-8 overflow-y-auto';

  // 상품 선택 컨테이너
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // 장바구니 추가 버튼
  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 재고 상태 표시
  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  // 요소들 조립
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';
  leftColumn.appendChild(cartDisp);

  // ----------------------------------------
  // 오른쪽 컬럼 (주문 요약)
  // ----------------------------------------
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  sum = rightColumn.querySelector('#cart-total');

  // ----------------------------------------
  // 도움말 모달 생성
  // ----------------------------------------
  const manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualOverlay = document.createElement('div');
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // ----------------------------------------
  // DOM 구조 조립
  // ----------------------------------------
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ----------------------------------------
  // 초기 데이터 설정
  // ----------------------------------------
  let initStock = 0;
  for (let i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q;
  }

  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // ----------------------------------------
  // 타이머 기반 이벤트 설정
  // ----------------------------------------

  // 번개세일 타이머
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  // 추천 상품 타이머
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
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
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          );
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// ========================================
// 상품 옵션 업데이트 함수
// ========================================

function onUpdateSelectOptions() {
  let totalStock;
  let opt;
  let discountText;

  sel.innerHTML = '';
  totalStock = 0;

  // 전체 재고 계산
  for (let idx = 0; idx < prodList.length; idx++) {
    const _p = prodList[idx];
    totalStock = totalStock + _p.q;
  }

  // 각 상품별 옵션 생성
  for (let i = 0; i < prodList.length; i++) {
    (function () {
      const item = prodList[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';

      // 할인 상태 표시
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      // 품절 상품 처리
      if (item.q === 0) {
        opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        // 할인 조합별 표시
        if (item.onSale && item.suggestSale) {
          opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${
            item.val
          }원 (25% SUPER SALE!)`;
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
    })();
  }

  // 재고 부족 경고 표시
  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// ========================================
// 장바구니 계산 및 표시 함수
// ========================================

function handleCalculateCartStuff() {
  // 변수 선언
  let subTot;
  let idx;
  let originalTotal;
  let itemDisc;
  let savedAmount;
  let points;
  let previousCount;
  let stockMsg;
  let pts;
  let hasP1;
  let hasP2;
  let loyaltyDiv;

  const cartItems = cartDisp.children;
  const bulkDisc = subTot;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 초기값 설정
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt;
  subTot = 0;

  // ----------------------------------------
  // 재고 부족 상품 체크
  // ----------------------------------------
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
      lowStockItems.push(prodList[idx].name);
    }
  }

  // ----------------------------------------
  // 장바구니 아이템별 계산
  // ----------------------------------------
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 상품 정보 찾기
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let disc;

      // 수량 및 가격 계산
      const quantity = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * quantity;
      disc = 0;
      itemCnt += quantity;
      subTot += itemTot;

      // 수량별 스타일 적용
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });

      // ----------------------------------------
      // 개별 상품 할인율 적용
      // ----------------------------------------
      if (quantity >= 10) {
        if (curItem.id === PRODUCT_ONE) {
          disc = 10 / 100;
        } else {
          if (curItem.id === p2) {
            disc = 15 / 100;
          } else {
            if (curItem.id === product_3) {
              disc = 20 / 100;
            } else {
              if (curItem.id === p4) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }

      totalAmt += itemTot * (1 - disc);
    })();
  }

  // ----------------------------------------
  // 대량 구매 할인 적용
  // ----------------------------------------
  let discRate = 0;
  originalTotal = subTot;
  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // ----------------------------------------
  // 화요일 특별 할인 적용
  // ----------------------------------------
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ----------------------------------------
  // UI 업데이트
  // ----------------------------------------

  // 아이템 수량 표시
  document.getElementById('item-count').textContent =
    `🛍️ ${itemCnt} items in cart`;

  // 주문 요약 세부사항 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 각 상품별 요약 표시
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
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

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (itemCnt >= 30) {
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

    // 화요일 할인 표시
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }

    // 배송비 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // ----------------------------------------
  // 총액 및 포인트 업데이트
  // ----------------------------------------

  // 총액 표시
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }

  // 적립 포인트 표시
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
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

  // 할인 정보 표시
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
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
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // ----------------------------------------
  // 재고 상태 메시지 업데이트
  // ----------------------------------------
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    const item = prodList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        stockMsg = `${stockMsg + item.name}: 품절\n`;
      }
    }
  }
  stockInfo.textContent = stockMsg;

  handleStockInfoUpdate();
  doRenderBonusPoints();
}

// ========================================
// 보너스 포인트 계산 및 렌더링 함수
// ========================================

const doRenderBonusPoints = () => {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  // 장바구니가 비어있으면 포인트 숨김
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // ----------------------------------------
  // 기본 포인트 계산
  // ----------------------------------------
  const basePoints = Math.floor(totalAmt / 1000);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // ----------------------------------------
  // 화요일 포인트 2배
  // ----------------------------------------
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  // ----------------------------------------
  // 세트 상품 보너스 포인트
  // ----------------------------------------
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  const nodes = cartDisp.children;

  // 장바구니에 있는 상품 종류 확인
  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < prodList.length; pIdx++) {
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

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // ----------------------------------------
  // 수량별 보너스 포인트
  // ----------------------------------------
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

  // ----------------------------------------
  // 포인트 UI 업데이트
  // ----------------------------------------
  bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        `<div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>` +
        `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

// ========================================
// 재고 관리 함수들
// ========================================

function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;

  sum = 0;
  for (i = 0; i < prodList.length; i++) {
    currentProduct = prodList[i];
    sum += currentProduct.q;
  }
  return sum;
}

const handleStockInfoUpdate = () => {
  let infoMsg = '';
  let messageOptimizer;

  const totalStock = onGetStockTotal();

  // 재고 부족 경고 체크
  if (totalStock < 30) {
  }

  // 각 상품별 재고 상태 메시지 생성
  prodList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg + item.name}: 품절\n`;
      }
    }
  });

  stockInfo.textContent = infoMsg;
};

// ========================================
// 장바구니 가격 업데이트 함수
// ========================================

function doUpdatePricesInCart() {
  let totalCount = 0;
  let j = 0;

  // 총 수량 계산 (첫 번째 방법)
  while (cartDisp.children[j]) {
    const qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }

  // 총 수량 계산 (두 번째 방법)
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(
      cartDisp.children[j].querySelector('.quantity-number').textContent,
    );
  }

  // ----------------------------------------
  // 각 장바구니 아이템의 가격 업데이트
  // ----------------------------------------
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    // 상품 정보 찾기
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 및 이름 표시
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

  handleCalculateCartStuff();
}

// ========================================
// 메인 실행 및 이벤트 리스너 설정
// ========================================

// 애플리케이션 초기화
main();

// ----------------------------------------
// 장바구니 추가 버튼 이벤트
// ----------------------------------------
addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  let hasItem = false;

  // 선택된 상품 유효성 검사
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  if (!selItem || !hasItem) {
    return;
  }

  // 선택된 상품 정보 가져오기
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);

    // 이미 장바구니에 있는 상품인 경우 수량 증가
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
      // 새로운 상품을 장바구니에 추가
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
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500'}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }

    handleCalculateCartStuff();
    lastSel = selItem;
  }
});

// ----------------------------------------
// 장바구니 수량 변경 및 삭제 이벤트
// ----------------------------------------
cartDisp.addEventListener('click', function (event) {
  const tgt = event.target;
  let qtyElem;

  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 찾기
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }

    // 수량 변경 처리
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      qtyElem = itemElem.querySelector('.quantity-number');
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
    }
    // 상품 삭제 처리
    else if (tgt.classList.contains('remove-item')) {
      qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }

    // 재고 부족 상품 체크
    if (prod && prod.q < 5) {
    }

    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

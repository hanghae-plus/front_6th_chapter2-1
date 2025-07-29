// 리팩토링 완료 후 파일 분리할 것

// ============================================
// 전역 상태 관리
// ============================================
let productList;
let bonusPts = 0;
let stockInfo;
let itemCount;
let lastSelector;
let productSelect;
let addBtn;
let totalAmount = 0;

// ============================================
// 상수 정의
// ============================================
const PRODUCT_1 = 'p1';
const PRODUCT_2 = 'p2';
const PRODUCT_3 = 'p3';
const PRODUCT_4 = 'p4';
const PRODUCT_5 = `p5`;

// ============================================
// DOM 요소 참조
// ============================================
let cartDisplay;

// ============================================
// 컴포넌트 함수들
// ============================================
function Header() {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  `;
}

function GridContainer() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      <!-- 왼쪽 컬럼 (상품 선택 + 카트) -->
      <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
        <!-- 셀렉터 컨테이너 -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
          </select>
          <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
            Add to Cart
          </button>
          <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
        </div>
        
        <!-- 카트 표시 영역 -->
        <div id="cart-items"></div>
      </div>

      <!-- 오른쪽 컬럼 (주문 요약) -->
      <div class="bg-black text-white p-8 flex flex-col">
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
      </div>
    </div>
  `;
}

function ManualToggle() {
  return `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  `;
}

function ManualOverlay() {
  return `
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
      <!-- 수동 안내 컬럼 -->
      <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
        <button id="manual-close" class="absolute top-4 right-4 text-gray-500 hover:text-black">
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
      </div>
    </div>
  `;
}

// ============================================
// 메인 함수
// ============================================
function main() {
  // ============================================
  // 지역 변수 선언
  // ============================================
  // 상태 초기화
  totalAmount = 0;
  itemCount = 0;
  lastSelector = null;

  // ============================================
  // 상품 데이터 정의
  // ============================================
  productList = [
    {
      id: PRODUCT_1,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_2,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_3,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_4,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  // ============================================
  // DOM 요소 생성 및 설정
  // ============================================
  const root = document.getElementById('app');

  // 랜더
  const htmlContent = `
    ${Header()}
    ${GridContainer()}
    ${ManualToggle()}
    ${ManualOverlay()}
  `;
  // 실제로 DOM에 추가
  root.innerHTML = htmlContent;

  // ============================================
  // DOM 요소 참조 설정
  // ============================================
  productSelect = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  stockInfo = document.getElementById('stock-status');
  cartDisplay = document.getElementById('cart-items');
  sum = document.getElementById('cart-total');
  const manualToggle = document.getElementById('manual-toggle');
  const manualOverlay = document.getElementById('manual-overlay');
  const manualColumn = document.getElementById('manual-column');

  // ============================================
  // 수동 안내 이벤트 리스너 설정
  // ============================================
  manualToggle.addEventListener('click', () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  });

  manualOverlay.addEventListener('click', (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  });

  document.getElementById('manual-close').addEventListener('click', () => {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  });

  // ============================================
  // 초기화 및 이벤트 설정
  // ============================================
  // 초기 UI 업데이트
  handleUpdateSelectOptions();
  handleCalculateCart();

  // ============================================
  // 자동 할인 시스템 설정
  // ============================================
  // 번개세일 타이머
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        handleUpdateSelectOptions();
        handleUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  // 추천 할인 타이머
  setTimeout(function () {
    setInterval(function () {
      if (cartDisplay.children.length === 0) {
        // 카트가 비어있을 때 처리
      }
      if (lastSelector) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelector) {
            if (productList[k].quantity > 0) {
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          handleUpdateSelectOptions();
          handleUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// ============================================
// 전역 변수
// ============================================
let sum;

// ============================================
// UI 업데이트 함수들
// ============================================
// 원본 함수명: onUpdateSelectOptions
function handleUpdateSelectOptions() {
  // 상품 셀렉터 옵션 업데이트
  let totalStock;
  let option;
  let discountText;

  productSelect.innerHTML = '';
  totalStock = 0;

  // 총 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.quantity;
  }

  // 각 상품별 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    (function () {
      const item = productList[i];
      option = document.createElement('option');
      option.value = item.id;
      discountText = '';

      // 할인 상태에 따른 텍스트 설정
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      // 품절 여부에 따른 옵션 설정
      if (item.quantity === 0) {
        option.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        // 할인 상태에 따른 가격 표시
        if (item.onSale && item.suggestSale) {
          option.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
          option.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          option.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
          option.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          option.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
          option.className = 'text-blue-500 font-bold';
        } else {
          option.textContent = `${item.name} - ${item.val}원${discountText}`;
        }
      }
      productSelect.appendChild(option);
    })();
  }

  // 재고 부족 시 셀렉터 스타일 변경
  if (totalStock < 50) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}

// ============================================
// 카트 계산 및 UI 업데이트 함수
// ============================================
// 원본 함수명: handleCalculateCartStuff
function handleCalculateCart() {
  // ============================================
  // 초기화
  // ============================================
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // ============================================
  // 재고 부족 상품 확인
  // ============================================
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].quantity < 5 && productList[idx].quantity > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }

  // ============================================
  // 카트 아이템별 계산
  // ============================================
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 상품 정보 찾기
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      // 수량 및 가격 계산
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      let disc = 0;
      itemCount += q;
      subTot += itemTot;

      // ============================================
      // UI 스타일 업데이트
      // ============================================
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });

      // ============================================
      // 개별 상품 할인 계산
      // ============================================
      if (q >= 10) {
        if (curItem.id === PRODUCT_1) {
          disc = 10 / 100;
        } else if (curItem.id === PRODUCT_2) {
          disc = 15 / 100;
        } else if (curItem.id === PRODUCT_3) {
          disc = 20 / 100;
        } else if (curItem.id === PRODUCT_4) {
          disc = 5 / 100;
        } else if (curItem.id === PRODUCT_5) {
          disc = 25 / 100;
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmount += itemTot * (1 - disc);
    })();
  }

  // ============================================
  // 전체 할인 계산
  // ============================================
  let discRate = 0;
  const originalTotal = subTot;

  // 대량구매 할인 (30개 이상)
  if (itemCount >= 30) {
    totalAmount = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmount) / subTot;
  }

  // ============================================
  // 화요일 특별 할인
  // ============================================
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;
      discRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ============================================
  // UI 업데이트
  // ============================================
  // 아이템 카운트 업데이트
  document.getElementById('item-count').textContent = `🛍️ ${itemCount} items in cart`;

  // 요약 상세 정보 업데이트
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 각 아이템별 요약 정보
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
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
    if (itemCount >= 30) {
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
      if (totalAmount > 0) {
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

  // ============================================
  // 총액 및 포인트 업데이트
  // ============================================
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmount).toLocaleString()}`;
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // ============================================
  // 할인 정보 표시
  // ============================================
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

  // ============================================
  // 아이템 카운트 업데이트
  // ============================================
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCount} items in cart`;
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // ============================================
  // 재고 정보 업데이트
  // ============================================
  let stockMsg = '';
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg = `${stockMsg}${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        stockMsg = `${stockMsg}${item.name}: 품절\n`;
      }
    }
  }
  stockInfo.textContent = stockMsg;
  handleUpdateStockInfo();
  handleRenderBonusPoints();
}

// ============================================
// 포인트 렌더링 함수
// ============================================
// 원본 함수명: doRenderBonusPoints
const handleRenderBonusPoints = function () {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // ============================================
  // 기본 포인트 계산
  // ============================================
  const basePoints = Math.floor(totalAmount / 1000);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  // ============================================
  // 화요일 2배 포인트
  // ============================================
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  // ============================================
  // 상품 조합 보너스 포인트
  // ============================================
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  const nodes = cartDisplay.children;

  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < productList.length; pIdx++) {
      if (productList[pIdx].id === node.id) {
        product = productList[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }

  // 키보드+마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // ============================================
  // 대량구매 보너스 포인트
  // ============================================
  if (itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCount >= 20) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCount >= 10) {
    finalPoints = finalPoints + 20;
    pointsDetail.push('대량구매(10개+) +20p');
  }

  // ============================================
  // 포인트 UI 업데이트
  // ============================================
  bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

// ============================================
// 유틸리티 함수들
// ============================================
// 원본 함수명: onGetStockTotal
function handleGetStockTotal() {
  let sum;
  let i;
  let currentProduct;
  sum = 0;
  for (i = 0; i < productList.length; i++) {
    currentProduct = productList[i];
    sum += currentProduct.quantity;
  }
  return sum;
}

// 원본 함수명: handleStockInfoUpdate
const handleUpdateStockInfo = function () {
  let infoMsg;
  const totalStock = handleGetStockTotal();
  infoMsg = '';
  if (totalStock < 30) {
  }
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg = `${infoMsg}${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        infoMsg = `${infoMsg}${item.name}: 품절\n`;
      }
    }
  });
  stockInfo.textContent = infoMsg;
};

// 원본 함수명: doUpdatePricesInCart
function handleUpdatePricesInCart() {
  // ============================================
  // 카트 아이템 가격 업데이트
  // ============================================
  const cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < productList.length; productIdx++) {
      if (productList[productIdx].id === itemId) {
        product = productList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 표시
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-purple-600">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-red-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = `
          <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
          <span class="text-blue-500">₩${product.val.toLocaleString()}</span>
        `;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCart();
}

// ============================================
// 이벤트 리스너 설정
// ============================================
main();

// ============================================
// 카트 추가 버튼 이벤트
// ============================================
addBtn.addEventListener('click', function () {
  const selItem = productSelect.value;
  let hasItem = false;

  // 선택된 상품 유효성 검사
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }

  // 추가할 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < productList.length; j++) {
    if (productList[j].id === selItem) {
      itemToAdd = productList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 생성
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
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    handleCalculateCart();
    lastSelector = selItem;
  }
});

// ============================================
// 카트 아이템 이벤트 (수량 변경, 삭제)
// ============================================
cartDisplay.addEventListener('click', function (event) {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 찾기
    for (let prdIdx = 0; prdIdx < productList.length; prdIdx++) {
      if (productList[prdIdx].id === prodId) {
        prod = productList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        qtyElem.textContent = newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        prod.quantity += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // 아이템 삭제 처리
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.quantity += remQty;
      itemElem.remove();
    }

    if (prod && prod.quantity < 5) {
      // 재고 부족 시 처리 (현재 비어있음)
    }
    handleCalculateCart();
    handleUpdateSelectOptions();
  }
});

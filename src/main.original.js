// ==================== 전역 변수 선언부 ====================
// 문제점: 전역 상태 과다 사용, DOM 의존성, 계산 가능한 값들의 별도 관리

// 비즈니스 데이터
var prodList; // 상품 목록 배열 (가변 상태로 사이드 이펙트 위험)
var bonusPts = 0; // 적립 포인트 (계산 결과인데 전역으로 관리)
var itemCnt; // 장바구니 총 수량 (계산 가능한 값)
var totalAmt = 0; // 총 금액 (계산 가능한 값)
var lastSel; // 마지막 선택 상품 ID (추천 기능용)

// DOM 요소 참조
var stockInfo; // 재고 정보 표시 DOM 요소
var sel; // 상품 선택 드롭다운 DOM 요소
var addBtn; // 추가 버튼 DOM 요소
var cartDisp; // 장바구니 표시 DOM 요소

// 상품 ID 상수 (문제점: 네이밍 일관성 없음)
var PRODUCT_ONE = 'p1'; // 키보드
var p2 = 'p2'; // 마우스 (네이밍 불일치)
var product_3 = 'p3'; // 모니터암 (camelCase 위반)
var p4 = 'p4'; // 노트북 파우치
var PRODUCT_5 = `p5`; // 스피커 (불필요한 백틱 사용)

// ==================== 메인 함수 시작 ====================
// 문제점: 270행의 거대한 함수, 6가지 이상의 책임을 가짐
function main() {
  // ---------------- 지역 변수 선언 ----------------
  // DOM 요소 생성용 지역 변수들
  var root;
  var header;
  var gridContainer;
  var leftColumn;
  var selectorContainer;
  var rightColumn;
  var manualToggle;
  var manualOverlay;
  var manualColumn;

  // ---------------- 전역 상태 초기화 ----------------
  // 프로모션 타이머 설정용
  var lightningDelay;

  // 전역 상태 리셋 (함수 호출 시마다 초기화)
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  // ---------------- 상품 데이터 하드코딩 ----------------
  // 문제점: 하드코딩된 상품 정보, 불일치한 속성명 (val/originalVal/q)
  prodList = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      val: 10000, // 현재 가격 (price가 더 명확)
      originalVal: 10000, // 원래 가격 (originalPrice가 더 명확)
      q: 50, // 재고 (stock이 더 명확)
      onSale: false, // 번개세일 상태
      suggestSale: false, // 추천할인 상태
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
      id: product_3, // camelCase 위반
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
      q: 0, // 품절 상품
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

  // ---------------- DOM 구조 생성 시작 ----------------
  // 루트 요소 획득
  var root = document.getElementById('app'); // 중복 선언 (18행에서 이미 선언)

  // ---------------- 헤더 영역 생성 ----------------
  header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `; // 문제점: HTML 템플릿 하드코딩, CSS 클래스 하드코딩

  // ---------------- 상품 선택 드롭다운 생성 ----------------
  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // ---------------- 그리드 컨테이너 생성 ----------------
  gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // ---------------- 좌측 컬럼 (상품 선택 + 장바구니) ----------------
  leftColumn = document.createElement('div');
  leftColumn['className'] =
    'bg-white border border-gray-200 p-8 overflow-y-auto'; // 괄호 표기법 불필요

  // 상품 선택 영역 컨테이너
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // 추가 버튼 생성
  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 재고 정보 표시 영역
  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  // 좌측 컬럼 요소들 조립
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';
  leftColumn.appendChild(cartDisp);

  // ---------------- 우측 컬럼 (주문 요약) ----------------
  rightColumn = document.createElement('div');
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
  `; // 문제점: 거대한 HTML 템플릿 하드코딩, 재사용 불가

  // 총액 표시 요소 참조 획득
  sum = rightColumn.querySelector('#cart-total');

  // ---------------- 사용자 매뉴얼 토글 버튼 ----------------
  manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  }; // 문제점: 인라인 이벤트 핸들러
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  // ---------------- 매뉴얼 오버레이 ----------------
  manualOverlay = document.createElement('div');
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  }; // 문제점: 인라인 이벤트 핸들러

  // ---------------- 매뉴얼 사이드바 ----------------
  manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    
    <!-- 할인 정책 섹션 -->
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <!-- 개별 상품 할인 -->
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <!-- 전체 수량 할인 -->
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <!-- 특별 할인 -->
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
    
    <!-- 포인트 적립 섹션 -->
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <!-- 기본 적립 -->
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <!-- 추가 적립 -->
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
    
    <!-- 팁 섹션 -->
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `; // 문제점: 할인 정책이 하드코딩, 비즈니스 로직과 UI가 혼재

  // ---------------- DOM 트리 조립 ----------------
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ---------------- 초기화 완료 ----------------
  // 초기 재고 계산 (사용되지 않는 변수)
  var initStock = 0;
  for (var i = 0; i < prodList.length; i++) {
    initStock += prodList[i].q; // 계산 후 사용하지 않음
  }

  // 초기 UI 업데이트
  onUpdateSelectOptions(); // 드롭다운 옵션 생성
  handleCalculateCartStuff(); // 초기 계산 및 UI 업데이트

  // ---------------- 번개세일 시스템 ----------------
  // 문제점: 전역 상태 직접 조작, alert() 남용
  lightningDelay = Math.random() * 10000; // 0~10초 랜덤 지연
  setTimeout(() => {
    setInterval(function () {
      // 랜덤 상품 선택
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];

      // 재고 있고 세일 중이 아닌 상품에 번개세일 적용
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100); // 20% 할인
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!'); // UX 방해
        onUpdateSelectOptions(); // UI 업데이트
        doUpdatePricesInCart(); // 장바구니 가격 업데이트
      }
    }, 30000); // 30초마다 실행
  }, lightningDelay);

  // ---------------- 추천할인 시스템 ----------------
  // 문제점: 복잡한 중첩 로직, 전역 상태 의존
  setTimeout(function () {
    setInterval(function () {
      // 빈 블록 (의미 없는 조건)
      if (cartDisp.children.length === 0) {
        // 빈 로직
      }

      // 마지막 선택 상품과 다른 상품 추천
      if (lastSel) {
        var suggest = null;

        // 추천할 상품 찾기 (복잡한 중첩 조건)
        for (var k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== lastSel) {
            // 마지막 선택과 다른 상품
            if (prodList[k].q > 0) {
              // 재고 있는 상품
              if (!prodList[k].suggestSale) {
                // 아직 추천할인 적용 안된 상품
                suggest = prodList[k];
                break;
              }
            }
          }
        }

        // 추천할인 적용
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          ); // UX 방해
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100); // 5% 할인
          suggest.suggestSale = true;
          onUpdateSelectOptions(); // UI 업데이트
          doUpdatePricesInCart(); // 장바구니 가격 업데이트
        }
      }
    }, 60000); // 60초마다 실행
  }, Math.random() * 20000); // 0~20초 랜덤 지연
}

// ==================== 전역 변수 (sum) ====================
var sum; // 총액 표시 DOM 요소 (main 함수에서 초기화)

// ==================== 드롭다운 옵션 업데이트 함수 ====================
// 문제점: 복잡한 중첩 조건문, 하드코딩된 할인율, 불필요한 IIFE
function onUpdateSelectOptions() {
  // 지역 변수 선언
  var totalStock;
  var opt;
  var discountText;

  // 드롭다운 초기화
  sel.innerHTML = '';

  // ---------------- 전체 재고 계산 ----------------
  totalStock = 0;
  for (var idx = 0; idx < prodList.length; idx++) {
    var _p = prodList[idx]; // 불필요한 변수
    totalStock = totalStock + _p.q;
  }

  // ---------------- 상품별 옵션 생성 ----------------
  for (var i = 0; i < prodList.length; i++) {
    (function () {
      // 불필요한 IIFE (즉시 실행 함수)
      var item = prodList[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';

      // 할인 상태별 아이콘 추가
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      // ---------------- 품절 상품 처리 ----------------
      if (item.q === 0) {
        opt.textContent =
          item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        // ---------------- 할인 상태별 텍스트 생성 (복잡한 중첩 조건) ----------------
        if (item.onSale && item.suggestSale) {
          // 번개세일 + 추천할인 (25% = 20% + 5%)
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
          // 번개세일만 (20%)
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
          // 추천할인만 (5%)
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
          // 일반 상품
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      sel.appendChild(opt);
    })();
  }

  // ---------------- 재고 부족 시 시각적 피드백 ----------------
  if (totalStock < 50) {
    // 매직 넘버
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// ==================== 장바구니 계산 메인 함수 ====================
// 문제점: 225행의 거대한 몬스터 함수, 6가지 이상의 책임
function handleCalculateCartStuff() {
  // ---------------- 지역 변수 대량 선언 ----------------
  var cartItems;
  var subTot;
  var itemDiscounts;
  var lowStockItems;
  var idx;
  var originalTotal;
  var bulkDisc; // 사용되지 않음
  var itemDisc; // 사용되지 않음
  var savedAmount;
  var summaryDetails;
  var totalDiv;
  var loyaltyPointsDiv;
  var points;
  var discountInfoDiv;
  var itemCountElement;
  var previousCount;
  var stockMsg;
  var pts; // 사용되지 않음
  var hasP1; // 사용되지 않음
  var hasP2; // 사용되지 않음
  var loyaltyDiv; // 사용되지 않음

  // ---------------- 전역 상태 초기화 ----------------
  totalAmt = 0;
  itemCnt = 0;
  originalTotal = totalAmt; // 항상 0
  cartItems = cartDisp.children;
  subTot = 0;
  bulkDisc = subTot; // 항상 0, 사용되지 않음
  itemDiscounts = [];
  lowStockItems = [];

  // ---------------- 재고 부족 상품 수집 ----------------
  for (idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].q < 5 && prodList[idx].q > 0) {
      // 매직 넘버 5
      lowStockItems.push(prodList[idx].name); // 수집 후 사용되지 않음
    }
  }

  // ---------------- 장바구니 아이템별 계산 ----------------
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 불필요한 IIFE
      var curItem;

      // 상품 찾기 (반복 패턴 #1)
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      // 수량 및 기본 계산
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q;
      var itemTot;
      var disc;
      q = parseInt(qtyElem.textContent);
      itemTot = curItem.val * q;
      disc = 0;

      // 전역 상태 업데이트
      itemCnt += q;
      subTot += itemTot;

      // ---------------- UI 스타일 업데이트 ----------------
      var itemDiv = cartItems[i];
      var priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal'; // 매직 넘버 10
        }
      });

      // ---------------- 개별 상품 할인 계산 (if-else 지옥) ----------------
      if (q >= 10) {
        // 매직 넘버 10
        if (curItem.id === PRODUCT_ONE) {
          disc = 10 / 100; // 하드코딩된 할인율
        } else {
          if (curItem.id === p2) {
            disc = 15 / 100; // 하드코딩된 할인율
          } else {
            if (curItem.id === product_3) {
              // camelCase 위반
              disc = 20 / 100; // 하드코딩된 할인율
            } else {
              if (curItem.id === p4) {
                disc = 5 / 100; // 하드코딩된 할인율
              } else {
                if (curItem.id === PRODUCT_5) {
                  disc = 25 / 100; // 하드코딩된 할인율
                }
              }
            }
          }
        }

        // 할인 정보 수집
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }

      // 할인 적용된 총액 누적
      totalAmt += itemTot * (1 - disc);
    })();
  }

  // ---------------- 대량 할인 계산 ----------------
  let discRate = 0;
  var originalTotal = subTot; // 변수명 중복

  if (itemCnt >= 30) {
    // 매직 넘버 30
    totalAmt = (subTot * 75) / 100; // 25% 할인 (하드코딩)
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // ---------------- 화요일 할인 ----------------
  const today = new Date();
  var isTuesday = today.getDay() === 2; // 매직 넘버 2 (화요일)
  var tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100; // 10% 추가 할인 (하드코딩)
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ---------------- 장바구니 아이템 수 업데이트 ----------------
  document.getElementById('item-count').textContent =
    '🛍️ ' + itemCnt + ' items in cart';

  // ---------------- 주문 요약 HTML 생성 ----------------
  // 문제점: innerHTML += 성능 이슈, 거대한 템플릿 하드코딩
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 아이템별 요약 생성
    for (let i = 0; i < cartItems.length; i++) {
      var curItem;

      // 상품 찾기 (반복 패턴 #2)
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }

      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      var itemTotal = curItem.val * q;

      // HTML 누적 추가 (성능 이슈)
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 추가
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // ---------------- 할인 정보 표시 ----------------
    if (itemCnt >= 30) {
      // 대량 할인
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      // 개별 상품 할인
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

  // ---------------- 총액 표시 업데이트 ----------------
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }

  // ---------------- 기본 포인트 표시 ----------------
  // 문제점: 간단한 포인트 계산인데도 별도 함수로 분리되어 있음
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000); // 0.1% 적립률 (하드코딩)
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // ---------------- 할인 정보 박스 생성 ----------------
  discountInfoDiv = document.getElementById('discount-info');
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

  // ---------------- 아이템 수 변경 감지 ----------------
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true'); // 사용되지 않는 속성
    }
  }

  // ---------------- 재고 상태 메시지 생성 ----------------
  stockMsg = '';
  for (var stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    var item = prodList[stockIdx];
    if (item.q < 5) {
      // 매직 넘버 5
      if (item.q > 0) {
        stockMsg =
          stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;

  // ---------------- 다른 함수 호출 ----------------
  handleStockInfoUpdate(); // 재고 정보 업데이트 (중복 로직)
  doRenderBonusPoints(); // 보너스 포인트 계산 및 표시
}

// ==================== 보너스 포인트 계산 함수 ====================
// 문제점: 복잡한 포인트 정책 하드코딩, 상품 찾기 반복 로직
var doRenderBonusPoints = function () {
  // 지역 변수 선언
  var basePoints;
  var finalPoints;
  var pointsDetail;
  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;

  // ---------------- 빈 장바구니 처리 ----------------
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // ---------------- 기본 포인트 계산 ----------------
  basePoints = Math.floor(totalAmt / 1000); // 0.1% 적립률 (하드코딩)
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  // ---------------- 화요일 2배 적립 ----------------
  if (new Date().getDay() === 2) {
    // 매직 넘버 2 (화요일)
    if (basePoints > 0) {
      finalPoints = basePoints * 2; // 하드코딩된 배수
      pointsDetail.push('화요일 2배');
    }
  }

  // ---------------- 세트 구매 보너스 확인 ----------------
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;

  // 장바구니에서 상품 타입 확인
  for (const node of nodes) {
    var product = null;

    // 상품 찾기 (반복 패턴 #3)
    for (var pIdx = 0; pIdx < prodList.length; pIdx++) {
      if (prodList[pIdx].id === node.id) {
        product = prodList[pIdx];
        break;
      }
    }

    if (!product) continue;

    // 상품 타입별 플래그 설정
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      // camelCase 위반
      hasMonitorArm = true;
    }
  }

  // ---------------- 세트 보너스 적용 ----------------
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50; // 하드코딩된 보너스
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100; // 하드코딩된 보너스
    pointsDetail.push('풀세트 구매 +100p');
  }

  // ---------------- 수량별 보너스 (중첩 if-else) ----------------
  if (itemCnt >= 30) {
    // 매직 넘버
    finalPoints = finalPoints + 100; // 하드코딩된 보너스
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      // 매직 넘버
      finalPoints = finalPoints + 50; // 하드코딩된 보너스
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        // 매직 넘버
        finalPoints = finalPoints + 20; // 하드코딩된 보너스
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  // ---------------- 전역 상태 업데이트 및 UI 표시 ----------------
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');

  if (ptsTag) {
    if (bonusPts > 0) {
      // HTML 문자열 조합으로 UI 생성
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
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

// ==================== 유틸리티 함수들 ====================

// ---------------- 총 재고 계산 함수 ----------------
// 문제점: 간단한 로직인데 별도 함수, 네이밍 불일치
function onGetStockTotal() {
  var sum; // 전역 변수와 이름 충돌
  var i;
  var currentProduct;

  sum = 0;
  for (i = 0; i < prodList.length; i++) {
    currentProduct = prodList[i];
    sum += currentProduct.q;
  }
  return sum;
}

// ---------------- 재고 정보 업데이트 함수 ----------------
// 문제점: 빈 조건문, 중복 로직
var handleStockInfoUpdate = function () {
  var infoMsg;
  var totalStock;
  var messageOptimizer; // 사용되지 않는 변수

  infoMsg = '';
  totalStock = onGetStockTotal();

  // 빈 조건문 (의미 없음)
  if (totalStock < 30) {
    // 매직 넘버
    // 빈 로직
  }

  // 재고 부족/품절 메시지 생성 (handleCalculateCartStuff와 중복)
  prodList.forEach(function (item) {
    if (item.q < 5) {
      // 매직 넘버
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });

  stockInfo.textContent = infoMsg;
};

// ==================== 장바구니 가격 업데이트 함수 ====================
// 문제점: 불필요한 totalCount 계산, 중복 로직
function doUpdatePricesInCart() {
  // ---------------- 불필요한 총 수량 계산 ----------------
  var totalCount = 0,
    j = 0;
  var cartItems;

  // 첫 번째 계산 (while문)
  while (cartDisp.children[j]) {
    var qty = cartDisp.children[j].querySelector('.quantity-number');
    totalCount += qty ? parseInt(qty.textContent) : 0;
    j++;
  }

  // 두 번째 계산 (for문) - 첫 번째 결과 덮어씀
  totalCount = 0;
  for (j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(
      cartDisp.children[j].querySelector('.quantity-number').textContent
    );
  } // totalCount 계산 후 사용되지 않음

  // ---------------- 장바구니 아이템 가격 표시 업데이트 ----------------
  cartItems = cartDisp.children;
  for (var i = 0; i < cartItems.length; i++) {
    var itemId = cartItems[i].id;
    var product = null;

    // 상품 찾기 (반복 패턴 #4)
    for (var productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }

    if (product) {
      var priceDiv = cartItems[i].querySelector('.text-lg');
      var nameDiv = cartItems[i].querySelector('h3');

      // ---------------- 할인 상태별 가격 표시 (중복 로직) ----------------
      if (product.onSale && product.suggestSale) {
        // 번개세일 + 추천할인
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 번개세일만
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천할인만
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 정상 가격
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }

  // 계산 함수 재호출
  handleCalculateCartStuff();
}

// ==================== 애플리케이션 시작 ====================
main(); // 메인 함수 실행

// ==================== 이벤트 핸들러들 ====================

// ---------------- 상품 추가 버튼 클릭 이벤트 ----------------
// 문제점: 복잡한 로직, 중복된 상품 찾기, 거대한 HTML 템플릿
addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var hasItem = false;

  // 선택된 상품이 존재하는지 확인
  for (var idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  // 유효하지 않은 선택 시 종료
  if (!selItem || !hasItem) {
    return;
  }

  // 추가할 상품 찾기 (상품 찾기 반복 패턴 #5)
  var itemToAdd = null;
  for (var j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }

  // ---------------- 상품 추가 로직 ----------------
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd['id']); // 불필요한 괄호 표기법

    if (item) {
      // ---------------- 기존 아이템 수량 증가 ----------------
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem['textContent']) + 1; // 불필요한 괄호 표기법

      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--; // 불필요한 괄호 표기법
      } else {
        alert('재고가 부족합니다.'); // UX 방해
      }
    } else {
      // ---------------- 새 아이템 생성 ----------------
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

      // 거대한 HTML 템플릿 (문제점: 가독성 저하, 유지보수 어려움)
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

      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }

    // UI 업데이트 및 마지막 선택 저장
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});

// ---------------- 장바구니 클릭 이벤트 (수량 변경, 삭제) ----------------
// 문제점: 복잡한 이벤트 위임, 중복된 상품 찾기
cartDisp.addEventListener('click', function (event) {
  var tgt = event.target;

  // 수량 변경 또는 삭제 버튼 클릭 시만 처리
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = null;

    // 상품 찾기 (반복 패턴 #6)
    for (var prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }

    // ---------------- 수량 변경 처리 ----------------
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector('.quantity-number');
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.q + currentQty) {
        // 수량 변경 가능
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        // 수량이 0 이하가 되면 아이템 제거
        prod.q += currentQty;
        itemElem.remove();
      } else {
        // 재고 부족
        alert('재고가 부족합니다.'); // UX 방해
      }
    }
    // ---------------- 아이템 제거 처리 ----------------
    else if (tgt.classList.contains('remove-item')) {
      var qtyElem = itemElem.querySelector('.quantity-number'); // 변수명 중복
      var remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }

    // 빈 조건문 (의미 없음)
    if (prod && prod.q < 5) {
      // 매직 넘버
      // 빈 로직
    }

    // UI 업데이트
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

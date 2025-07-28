// 상품 아이디
var PRODUCT_1 = 'p1';
var PRODUCT_2 = 'p2';
var PRODUCT_3 = 'p3';
var PRODUCT_4 = 'p4';
var PRODUCT_5 = 'p5';

// 상품 목록
var productList = [
  {
    id: PRODUCT_1,
    name: '버그 없애는 키보드',
    val: 10000, // 변동된 가격
    originalVal: 10000, // 원래 가격
    q: 50, // 재고 수
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_2,
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_3,
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_4,
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_5,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
  },
];

// 상품 선택 셀렉터
var sel;
// ADD TO CART 버튼
var addBtn;
// 장바구니 내 상품 목록
var cartDisp;
// 장바구니 총 가격 컴포넌트
var sum;

// 최종 적립 포인트
var bonusPts = 0;
// 상품 재고 품절 표시 컴포넌트
var stockInfo;
// 장바구니 내 총 상품 수 (헤더)
var itemCnt = 0;
// 장바구니 상품들 총 가격
var totalAmt = 0;
// 제일 최근에 장바구니에 담은 상품
var lastSel = null;

function main() {
  // 전체 페이지
  var root = document.getElementById('app');

  // 헤더 - 장바구니 상품 총 개수 업데이트 필요
  var header;
  header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  // 할인 정보 토글
  var manualToggle;
  var manualOverlay;
  var manualColumn;
  manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = /* HTML */ `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  `;
  manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  // 오버레이 배경 눌러도 토글 적용
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = /* HTML */ `
    <button
      class="absolute top-4 right-4 text-gray-500 hover:text-black"
      onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
    >
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
            • 키보드 10개↑: 10%<br />
            • 마우스 10개↑: 15%<br />
            • 모니터암 10개↑: 20%<br />
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
            • 화요일: +10%<br />
            • ⚡번개세일: 20%<br />
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
            • 화요일: 2배<br />
            • 키보드+마우스: +50p<br />
            • 풀세트: +100p<br />
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br />
        • ⚡+💝 중복 가능<br />
        • 상품4 = 품절
      </p>
    </div>
  `;
  manualOverlay.appendChild(manualColumn);

  // grid = left + right
  var gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  var leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  // 상품 선택 셀렉터
  sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // ADD TO CART 검은색 버튼
  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 상품 재고 품절 표시
  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  // selectContainer 선언 후 차례로 컴포넌트 추가
  var selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  // 장바구니 내의 상품들
  cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';

  // left에 셀렉터 관련 + 장바구니 상품 목록 차례로 추가
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisp);

  // right - Order Summary 검은 박스
  var rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = /* HTML */ `
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
    <button
      class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
    >
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  // 장바구니 총 가격 컴포넌트
  sum = rightColumn.querySelector('#cart-total');

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 장바구니 계산
  handleCalculateCartStuff();
  // 셀렉터 옵션 업데이트
  onUpdateSelectOptions();

  // 세일 추천 alert 함수
  // 첫번째 - 번개 세일
  var lightningDelay = Math.random() * 10000; // 1 ~ 10초
  setTimeout(() => {
    setInterval(function () {
      // 랜덤 상품 선택
      var luckyIdx = Math.floor(Math.random() * productList.length);
      var luckyItem = productList[luckyIdx];

      // 상품이 재고가 있고 세일 중이 아님
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        // 20프로 할인 적용 후 상태를 할인 중으로 업데이트
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        // alert 실행
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        // 셀렉트 옵션 및 장바구니 상태 업데이트
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
      // 30초마다 시도
    }, 30000);
  }, lightningDelay); // 초기 지연

  // 두번째 - 추천 세일
  setTimeout(function () {
    setInterval(function () {
      // 마지막에 장바구니에 담은 상품이 있으면 실행
      if (lastSel) {
        let suggest = null;
        for (let k = 0; k < productList.length; k++) {
          // 마지막에 담은 상품이 아님
          if (productList[k].id !== lastSel) {
            // 상품의 재고가 남아있음
            if (productList[k].q > 0) {
              // 추천 상태가 아님
              if (!productList[k].suggestSale) {
                suggest = productList[k];
                break;
              }
            }
          }
        }
        // 조건에 맞는 상품이 존재
        if (suggest) {
          // alert 실행
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');

          // 5프로 할인 적용 후 상태를 추천 중으로 업데이트
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;

          // 셀렉트 옵션 및 장바구니 상태 업데이트
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
      // 60초마다 시도
    }, 60000);
  }, Math.random() * 20000); // 초기 지연 1 ~ 20초
}

// 셀렉트 내의 옵션 텍스트 업데이트
function onUpdateSelectOptions() {
  // 전체 재고 수
  let totalStock = 0;
  // 셀렉터 내의 옵션들 초기화
  sel.innerHTML = '';

  // 전체 재고 수 계산
  for (let idx = 0; idx < productList.length; idx++) {
    var _p = productList[idx];
    totalStock = totalStock + _p.q;
  }

  for (let i = 0; i < productList.length; i++) {
    var item = productList[i];
    let discountText = '';

    // 셀렉터에 넣을 옵션 생성
    let opt = document.createElement('option');
    // 옵션의 value = 상품의 id
    opt.value = item.id;

    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';
    // 품절 상품
    if (item.q === 0) {
      opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        // 세일 추천 상품
        opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        // 세일 상품
        opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        // 추천 상품
        opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
        opt.className = 'text-blue-500 font-bold';
      } else {
        // 일반 상품
        opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
      }
    }
    sel.appendChild(opt);
  }

  // 재고 수에 따른 셀렉터 스타일 업데이트
  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// 장바구니 할인, 가격 계산 및 출력 함수
function handleCalculateCartStuff() {
  // 장바구니 내 상품 목록
  var cartItems = cartDisp.children;
  // 할인 전 총 가격
  var subTot = 0;
  // 10개 이상 구매 상품 할인 목록 - { name, discount }
  var itemDiscounts = [];
  // 재고가 5개 이하인 상품 목록
  var lowStockItems = [];
  // 할인 가격
  var savedAmount;
  // 총 적립 포인트
  var points;

  // 변경될 총 가격, 총 상품 수 초기화 후 새로 계산
  totalAmt = 0;
  itemCnt = 0;

  // 재고가 5개 이하인 상품 추출
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].q < 5 && productList[idx].q > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }

  for (let i = 0; i < cartItems.length; i++) {
    // 현재 상품 찾기
    var curItem; // 상품 객체
    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        curItem = productList[j];
        break;
      }
    }

    // 현재 상품의 구매 수
    var qtyElem = cartItems[i].querySelector('.quantity-number');
    var q = parseInt(qtyElem.textContent);
    // 상품 총 가격 (val - 변동된 가격, q - 상품 구매 수)
    var itemTot = curItem.val * q;

    // 각 상품의 할인율 (for문을 돌면서 초기화하고 새로 생성됨)
    var disc = 0;

    // 장바구니 내의 총 상품 개수 (총 구매 수)
    itemCnt += q;
    // 장바구내 내의 총 상품 가격
    subTot += itemTot;

    // 10개 이상 구매 시 볼드 스타일 적용
    let itemDiv = cartItems[i];
    let priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
      }
    });

    // 10개 이상 구매 시 각 상품별 할인율 적용
    if (q >= 10) {
      if (curItem.id === PRODUCT_1) {
        disc = 10 / 100;
      } else {
        if (curItem.id === PRODUCT_2) {
          disc = 15 / 100;
        } else {
          if (curItem.id === PRODUCT_3) {
            disc = 20 / 100;
          } else {
            if (curItem.id === PRODUCT_4) {
              disc = 5 / 100;
            } else {
              if (curItem.id === PRODUCT_5) {
                disc = 25 / 100;
              }
            }
          }
        }
      }
      // 할인이 적용된 상품을 목록에 넣음 - 10개 이상 구매 상품
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    // 총 가격에 할인 적용
    totalAmt += itemTot * (1 - disc);
  }

  // 총 할인율
  let discRate = 0;
  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일인지 확인
  const today = new Date();
  var isTuesday = today.getDay() === 2;
  var tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    // 화요일이면 10% 할인 적용
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100;
      discRate = 1 - totalAmt / subTot;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 헤더의 장바구니 총 개수 표시
  document.getElementById('item-count').textContent = '🛍️ ' + itemCnt + ' items in cart';

  // 요약 내용 초기화
  var summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  // 장바구니에 상품이 존재
  if (subTot > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      // id로 현재의 장바구니 상품 찾음 (i로 순회)
      var curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }

      // 현재 상품의 구매 수
      var qtyElem = cartItems[i].querySelector('.quantity-number');
      var q = parseInt(qtyElem.textContent);
      // 상품 총 가격 (val - 변동된 가격, q - 상품 구매 수)
      var itemTotal = curItem.val * q;

      // 상품 이름 x 구매 수 ₩ 가격 출력
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 합계 출력
    summaryDetails.innerHTML += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 출력
    if (itemCnt >= 30) {
      // 총 구매 수가 30개 이상일 때 대량 구매 할인
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    // 화요일 할인
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    // 무료 배송 출력
    summaryDetails.innerHTML += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 장바구니 총 가격
  var totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }

  // 총 적립 포인트 출력
  var loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000);

    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // 포인트 정보 출력 (둥근 녹색 박스)
  var discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    // 최종 할인된 가격
    savedAmount = subTot - totalAmt;
    discountInfoDiv.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 헤더 내의 상품 수 업데이트
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
  }

  // 재고 품절 텍스트 출력 (= handleStockInfoUpdate ?)
  var stockMsg = '';
  for (var stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    var item = productList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  //handleStockInfoUpdate();
  doRenderBonusPoints();
}

// 포인트 출력
function doRenderBonusPoints() {
  // 기본 포인트 - 총 가격 / 1000
  var basePoints = Math.floor(totalAmt / 1000);
  // 최종 포인트
  var finalPoints = 0;
  // 포인트 상세 전체 텍스트
  var pointsDetail = [];

  // 각 상품의 존재 여부
  var hasKeyboard = false;
  var hasMouse = false;
  var hasMonitorArm = false;

  // 장바구내 내 상품들
  var nodes = cartDisp.children;

  // 장바구니에 상품이 없으면 적립 포인트 요소 없앰
  if (nodes.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 출력
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  // 화요일 포인트 출력
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  for (const node of nodes) {
    // 아이디로 현재 상품 찾기
    var product = null;
    for (var pIdx = 0; pIdx < productList.length; pIdx++) {
      if (productList[pIdx].id === node.id) {
        product = productList[pIdx];
        break;
      }
    }
    if (!product) continue;

    // 찾은 상품으로 존재 여부 업데이트
    if (product.id === PRODUCT_1) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_2) {
      hasMouse = true;
    } else if (product.id === PRODUCT_3) {
      hasMonitorArm = true;
    }
  }

  // 상품에 따른 포인트 추가
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
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

  // 최종 적립 포인트 업데이트
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
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
}

// 재고 품절 텍스트를 stockInfo에 출력
function handleStockInfoUpdate() {
  var infoMsg = '';

  productList.forEach(function (item) {
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

// 장바구니 상품 정보 업데이트
function doUpdatePricesInCart() {
  var totalCount = 0;
  var cartItems = cartDisp.children;

  // 총 구매 개수 계산
  for (let j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
  }

  //
  for (let i = 0; i < cartItems.length; i++) {
    // 아이디로 상품 찾기
    let itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < productList.length; productIdx++) {
      if (productList[productIdx].id === itemId) {
        product = productList[productIdx];
        break;
      }
    }

    if (product) {
      // 업데이트할 가격, 이름
      let priceDiv = cartItems[i].querySelector('.text-lg');
      let nameDiv = cartItems[i].querySelector('h3');

      if (product.onSale && product.suggestSale) {
        // 세일 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 세일 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 일반 상품
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  // 장바구니 계산 처리
  handleCalculateCartStuff();
}

// 페이지 렌더링
main();

// ADD TO CART 버튼 이벤트
addBtn.addEventListener('click', function () {
  // 현재 셀렉터에 선택된 옵션 value (상품 id)
  var selItem = sel.value;
  // 셀렉터의 옵션과 같은 상품을 찾음
  var hasItem = false;
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  // 상품이 없으면 return
  if (!selItem || !hasItem) {
    return;
  }

  // id가 일치하는 상품을 찾음
  var itemToAdd = null;
  for (let j = 0; j < productList.length; j++) {
    if (productList[j].id === selItem) {
      itemToAdd = productList[j];
      break;
    }
  }

  // 상품의 재고가 1 이상 존재
  if (itemToAdd && itemToAdd.q > 0) {
    // 선택된 상품이 이미 장바구니에 존재하면 수량만 업데이트
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      // 상품의 구매 수를 1 늘림
      var qtyElem = item.querySelector('.quantity-number');
      var newQty = parseInt(qtyElem.textContent) + 1;

      // 1 늘린 상품 구매 수 <= 상품의 재고 수 + 상품의 장바구니 구매 수 (상품의 최초 수)
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        // 상품의 재고를 1 줄임
        itemToAdd.q--;
      } else {
        // 1 늘린 상품 구매 수 > 상품의 최초 수
        alert('재고가 부족합니다.');
      }
    } else {
      // 장바구니에 없던 상품을 추가 (div 요소 생성)
      var newItem = document.createElement('div');
      // 상품의 id를 부여
      newItem.id = itemToAdd.id;

      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = /* HTML */ `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div
            class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
          ></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">
            ${itemToAdd.onSale && itemToAdd.suggestSale
              ? '⚡💝'
              : itemToAdd.onSale
                ? '⚡'
                : itemToAdd.suggestSale
                  ? '💝'
                  : ''}${itemToAdd.name}
          </h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">
            ${itemToAdd.onSale || itemToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? 'text-purple-600'
                  : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                '</span>'
              : '₩' + itemToAdd.val.toLocaleString()}
          </p>
          <div class="flex items-center gap-4">
            <button
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
              data-product-id="${itemToAdd.id}"
              data-change="-1"
            >
              −
            </button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
              data-product-id="${itemToAdd.id}"
              data-change="1"
            >
              +
            </button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">
            ${itemToAdd.onSale || itemToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                itemToAdd.originalVal.toLocaleString() +
                '</span> <span class="' +
                (itemToAdd.onSale && itemToAdd.suggestSale
                  ? 'text-purple-600'
                  : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                '">₩' +
                itemToAdd.val.toLocaleString() +
                '</span>'
              : '₩' + itemToAdd.val.toLocaleString()}
          </div>
          <a
            class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
            data-product-id="${itemToAdd.id}"
            >Remove</a
          >
        </div>
      `;
      // 장바구니 내 상품 목록에 상품 추가
      cartDisp.appendChild(newItem);
      // 상품의 재고를 1 줄임
      itemToAdd.q--;
    }
    // 장바구니 관련 계산
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});

// 장바구니 각 상품 컴포넌트 이벤트
cartDisp.addEventListener('click', function (event) {
  // 클릭한 장바구내 내의 상품
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    // 선택한 장바구니 상품의 id
    var prodId = tgt.dataset.productId; // PRODUCT_1 ~ PRODUCT_5
    var itemElem = document.getElementById(prodId);

    // id로 상품을 찾음
    var prod = null;
    for (var prdIdx = 0; prdIdx < productList.length; prdIdx++) {
      if (productList[prdIdx].id === prodId) {
        prod = productList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change); // -1 이거나 1

      // 장바구니 상품의 구매 수 (= currentQty)
      let qtyElem = itemElem.querySelector('.quantity-number');
      let currentQty = parseInt(qtyElem.textContent);
      // 변경된 상품 구매 수 (기존 수 +- 1)
      let newQty = currentQty + qtyChange;

      // 1 증가된 상품 수 <= 상품의 재고 수 + 현재 구매 수 (상품의 최초 수)
      // 증가만 함
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        // 상품 구매 수 업데이트
        qtyElem.textContent = newQty;
        // 상품의 재고 수를 1 줄임
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        // 변경된 수량이 0 이하 (장바구니에서 삭제 필요)
        // 줄어든 수만큼 상품 재고 복구
        prod.q += currentQty;
        // 요소 제거
        itemElem.remove();
      } else {
        // 변경된 수량이 재고 초과인 경우
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // remove 버튼 클릭일 경우
      let qtyElem = itemElem.querySelector('.quantity-number');
      let remQty = parseInt(qtyElem.textContent);
      // 삭제된 상품 수만큼 상품의 재고 복구
      prod.q += remQty;
      // 요소 제거
      itemElem.remove();
    }

    // 장바구니 관련 계산
    handleCalculateCartStuff();
    // 셀렉터 옵션 업데이트
    onUpdateSelectOptions();
  }
});

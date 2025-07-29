import { createHeader } from './components/Header';
import { createManualToggle } from './components/ManualToggle';
import { createManualOverlay } from './components/ManualOverlay';
import { createManualColumn } from './components/ManualColumn';
import { createGridContainer } from './components/GridContainer';
import { createLeftColumn } from './components/LeftColumn';
import { createRightColumn } from './components/rightColumn';
import { createSelectorContainer } from './components/SelectorContainer';
import { createAddToCartBtn } from './components/AddToCartBtn';
import { createProductSelector } from './components/ProductSelector';
import { createCartProductList } from './components/CartProductList';
import { createStockStatus } from './components/StockStatus';
import { createProductOption } from './components/ProductOption';
import { createCartProduct } from './components/CartProduct';
import { isTodayTuesday } from './utils/isTodayTuesday';
import { getRandomNumber } from './utils/getRandomNumber';
import { findProductById } from './utils/findProductById';
import { findSuggestedProduct } from './utils/findSuggestedProduct';
import { getTotalStock } from './utils/getTotalStock';
import { getQuantityDiscountRate } from './utils/getQuantityDiscountRate';
import { getCartQuantityDiscountRate } from './utils/getCartQuantityDiscountRate';

// 상품 아이디
export const PRODUCT_1 = 'p1';
export const PRODUCT_2 = 'p2';
export const PRODUCT_3 = 'p3';
export const PRODUCT_4 = 'p4';
export const PRODUCT_5 = 'p5';

// 상품 목록 - 전역 상태 관리 필요
const productList = [
  {
    id: PRODUCT_1,
    name: '버그 없애는 키보드',
    changedPrice: 10000, // 변동된 가격
    originalPrice: 10000, // 원래 가격
    quantity: 50, // 재고 수
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_2,
    name: '생산성 폭발 마우스',
    changedPrice: 20000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_3,
    name: '거북목 탈출 모니터암',
    changedPrice: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_4,
    name: '에러 방지 노트북 파우치',
    changedPrice: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT_5,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    changedPrice: 25000,
    originalPrice: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

const appState = {
  totalPoint: 0, // 최종 적립 포인트
  totalProductCount: 0, // 장바구니 내 총 상품 수 (헤더)
  totalProductPrice: 0, // 장바구니 내 총 상품 가격
  lastSelectedProductId: null, // 제일 최근에 장바구니에 담은 상품의 id
};

// 상품 선택 셀렉터
let sel;
// ADD TO CART 버튼
let addBtn;
// 장바구니 내 상품 목록
let cartDisp;
// 장바구니 총 가격 컴포넌트
let sum;
// 상품 재고 품절 표시 컴포넌트
let stockInfo;

function main() {
  // 전체 페이지 -----
  const root = document.getElementById('app');

  // 헤더 -----
  const header = createHeader(); // 장바구니 총 상품 개수 넘겨주기

  // 할인 정보 토글 -----
  const manualToggle = createManualToggle({
    onClick: () => {
      manualOverlay.classList.toggle('hidden');
      manualColumn.classList.toggle('translate-x-full');
    },
  });

  const manualOverlay = createManualOverlay({
    onClick: (e) => {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add('hidden');
        manualColumn.classList.add('translate-x-full');
      }
    },
  });

  const manualColumn = createManualColumn();
  manualOverlay.appendChild(manualColumn);

  // grid = left + right -----
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();

  // 상품 선택 셀렉터
  sel = createProductSelector();

  // ADD TO CART 검은색 버튼
  addBtn = createAddToCartBtn();

  // 상품 재고 품절 표시
  stockInfo = createStockStatus();

  // selectContainer 선언 후 차례로 컴포넌트 추가
  const selectorContainer = createSelectorContainer();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  // 장바구니 상품 목록 -----
  cartDisp = createCartProductList();

  // left에 셀렉터 관련 + 장바구니 상품 목록 차례로 추가
  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisp);

  // right - Order Summary 검은 박스
  const rightColumn = createRightColumn();

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
  setTimeout(() => {
    setInterval(() => {
      // 랜덤 상품 선택
      const luckyIdx = Math.floor(getRandomNumber(productList.length));
      const luckyItem = productList[luckyIdx];

      // 상품이 재고가 있고 세일 중이 아님
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // 20프로 할인 적용 후 상태를 할인 중으로 업데이트
        luckyItem.changedPrice = Math.round((luckyItem.originalPrice * 80) / 100);
        luckyItem.onSale = true;
        // alert 실행
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        // 셀렉트 옵션 및 장바구니 상태 업데이트
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
      // 30초마다 시도
    }, 30000);
  }, getRandomNumber(10000)); // 초기 지연

  // 두번째 - 추천 세일
  setTimeout(() => {
    setInterval(() => {
      // 마지막에 장바구니에 담은 상품이 있으면 실행
      if (appState.lastSelectedProductId) {
        const suggestedProduct = findSuggestedProduct(productList, appState.lastSelectedProductId);
        
        // 조건에 맞는 상품이 존재
        if (suggestedProduct) {
          // alert 실행
          alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');

          // 5프로 할인 적용 후 상태를 추천 중으로 업데이트
          suggestedProduct.changedPrice = Math.round((suggestedProduct.changedPrice * (100 - 5)) / 100);
          suggestedProduct.suggestSale = true;

          // 셀렉트 옵션 및 장바구니 상태 업데이트
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
      // 60초마다 시도
    }, 60000);
  }, getRandomNumber(20000)); // 초기 지연 1 ~ 20초
}

// 셀렉트 내의 옵션 텍스트 업데이트
function onUpdateSelectOptions() {
  // 셀렉터 내의 옵션들 초기화
  sel.innerHTML = '';

  // 전체 재고 수 계산
  const totalStock = getTotalStock(productList);

  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];

    // 셀렉터에 넣을 옵션 생성
    const opt = createProductOption({ item });
    sel.appendChild(opt);
  }

  // 재고 수에 따른 셀렉터 스타일 업데이트
  if (totalStock < 50) {
    sel.style.borderColor = 'orange';
  } else {
    sel.style.borderColor = '';
  }
}

// ----------------------------------------------

function calculateCartSummary(cartItems, productList) {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  let totalProductCount = 0;
  const discountedProductList = [];

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const product = findProductById(productList, cartItem.id);

    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const orderCount = parseInt(qtyElem.textContent);
    const itemPrice = product.changedPrice * orderCount;

    // 기본 총 가격 계산
    totalBeforeDiscount += itemPrice;
    totalProductCount += orderCount;

    // 개별 할인 - 아이템 당 10개 이상 구매
    const itemDiscountRate = getQuantityDiscountRate(product.id, orderCount);
    if (itemDiscountRate > 0) {
      discountedProductList.push({ name: product.name, discount: itemDiscountRate * 100 });
    }

    const discountedItemPrice = itemPrice * (1 - itemDiscountRate);
    totalAfterDiscount += discountedItemPrice;
  }

  // 대량 구매 할인 - 총 30개 이상 구매 (기존 할인에서 덮어씀)
  const cartDiscountRate = getCartQuantityDiscountRate(totalProductCount);
  if (cartDiscountRate > 0) {
    totalAfterDiscount = totalBeforeDiscount * (1 - cartDiscountRate);
    discountedProductList.length = 0;
  }

  // 화요일 할인 - 10% 추가 할인
  if (isTodayTuesday()) {
    totalAfterDiscount *= 0.9;
  }

  // 최종 할인율 계산
  const totalDiscountedRate = totalBeforeDiscount > 0 ? 1 - totalAfterDiscount / totalBeforeDiscount : 0;

  return {
    totalProductCount, // 총 상품 수
    totalBeforeDiscount, // 할인 전 총 가격
    totalAfterDiscount, // 할인 후 총 가격
    totalDiscountedRate, // 총 할인율
    discountedProductList, // 개별 할인된 상품 목록
  };
}

// 장바구니 할인, 가격 계산 및 출력 함수
function handleCalculateCartStuff() {
  // 장바구니 내 상품 목록
  const cartItems = cartDisp.children;

  // ui에 필요한 값 리턴
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, totalDiscountedRate, discountedProductList } =
    calculateCartSummary(cartItems, productList);

  appState.totalProductPrice = totalAfterDiscount;
  appState.totalProductCount = totalProductCount;

  // UI ----------------------------

  // 화요일 처리
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTodayTuesday()) {
    if (appState.totalProductPrice > 0) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 요약 내용 초기화
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  // 장바구니에 상품이 존재
  if (totalBeforeDiscount > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      // id로 현재의 장바구니 상품 찾음 (i로 순회) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const curItem = findProductById(productList, cartItems[i].id);

      // 현재 상품의 구매 수
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const orderCount = parseInt(qtyElem.textContent);
      // 상품 총 가격 (changedPrice - 변동된 가격, orderCount - 상품 구매 수)
      const itemTotal = curItem.changedPrice * orderCount;

      // 상품 이름 x 구매 수 ₩ 가격 출력
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${orderCount}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 합계 출력
    summaryDetails.innerHTML += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${totalBeforeDiscount.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 출력
    if (appState.totalProductCount >= 30) {
      // 총 구매 수가 30개 이상일 때 대량 구매 할인
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (discountedProductList.length > 0) {
      discountedProductList.forEach(function (item) {
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    // 화요일 할인
    if (isTodayTuesday()) {
      if (appState.totalProductPrice > 0) {
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
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(appState.totalProductPrice).toLocaleString();
  }

  // 총 할인율 정보 출력 (둥근 녹색 박스)
  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (totalDiscountedRate > 0 && appState.totalProductPrice > 0) {
    // 최종 할인된 가격
    let savedPrice = totalBeforeDiscount - appState.totalProductPrice;
    discountInfoDiv.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(totalDiscountedRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedPrice).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 헤더 내의 상품 수 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = '🛍️ ' + appState.totalProductCount + ' items in cart';
  }

  // 재고 품절 텍스트 출력 (= handleStockInfoUpdate ?)
  let stockMsg = '';
  for (let stockIdx = 0; stockIdx < productList.length; stockIdx++) {
    const item = productList[stockIdx];
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;
  //handleStockInfoUpdate();
  doRenderBonusPoints();
}

// -------------------------------------

// 포인트 출력
function doRenderBonusPoints() {
  // 기본 포인트 - 총 가격 / 1000
  const basePoints = Math.floor(appState.totalProductPrice / 1000);
  // 최종 포인트
  let finalPoints = 0;
  // 포인트 상세 전체 텍스트
  const pointsDetail = [];

  // 각 상품의 존재 여부
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  // 장바구내 내 상품들
  const nodes = cartDisp.children;

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
  if (isTodayTuesday()) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  for (const node of nodes) {
    // 아이디로 현재 상품 찾기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const product = findProductById(productList, node.id);
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
  if (appState.totalProductCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (appState.totalProductCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (appState.totalProductCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  // 최종 적립 포인트 업데이트
  appState.totalPoint = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (appState.totalPoint > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        appState.totalPoint +
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
  let infoMsg = '';

  productList.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMsg;
}

// 장바구니 상품 정보 업데이트
function doUpdatePricesInCart() {
  let totalCount = 0;
  const cartItems = cartDisp.children;

  // 총 구매 개수 계산
  for (let j = 0; j < cartDisp.children.length; j++) {
    totalCount += parseInt(cartDisp.children[j].querySelector('.quantity-number').textContent);
  }

  //
  for (let i = 0; i < cartItems.length; i++) {
    // 아이디로 상품 찾기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const itemId = cartItems[i].id;
    const product = findProductById(productList, itemId);

    if (product) {
      // 업데이트할 가격, 이름
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      if (product.onSale && product.suggestSale) {
        // 세일 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 세일 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천 상품
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.changedPrice.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 일반 상품
        priceDiv.textContent = '₩' + product.changedPrice.toLocaleString();
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
  let selItem = sel.value;
  // 셀렉터의 옵션과 같은 상품을 찾음
  let hasItem = false;
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

  // id가 일치하는 상품을 찾음 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const itemToAdd = findProductById(productList, selItem);

  // 상품의 재고가 1 이상 존재
  if (itemToAdd && itemToAdd.quantity > 0) {
    // 선택된 상품이 이미 장바구니에 존재하면 수량만 업데이트
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      // 상품의 구매 수를 1 늘림
      let qtyElem = item.querySelector('.quantity-number');
      let newQty = parseInt(qtyElem.textContent) + 1;

      // 1 늘린 상품 구매 수 <= 상품의 재고 수 + 상품의 장바구니 구매 수 (상품의 최초 수)
      if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        // 상품의 재고를 1 줄임
        itemToAdd.quantity--;
      } else {
        // 1 늘린 상품 구매 수 > 상품의 최초 수
        alert('재고가 부족합니다.');
      }
    } else {
      // 장바구니에 없던 상품을 추가 (div 요소 생성)
      const newItem = createCartProduct({ itemToAdd }); // 인자로 itemToAdd 넘겨주기
      // 장바구니 내 상품 목록에 상품 추가
      cartDisp.appendChild(newItem);
      // 상품의 재고를 1 줄임
      itemToAdd.quantity--;
    }
    // 장바구니 관련 계산
    handleCalculateCartStuff();
    appState.lastSelectedProductId = selItem;
  }
});

// 장바구니 각 상품 컴포넌트 이벤트
cartDisp.addEventListener('click', function (event) {
  // 클릭한 장바구내 내의 상품
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    // 선택한 장바구니 상품의 id
    const prodId = tgt.dataset.productId; // PRODUCT_1 ~ PRODUCT_5
    const itemElem = document.getElementById(prodId);

    // id로 상품을 찾음 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const prod = findProductById(productList, prodId);

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change); // -1 이거나 1

      // 장바구니 상품의 구매 수 (= currentQty)
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      // 변경된 상품 구매 수 (기존 수 +- 1)
      const newQty = currentQty + qtyChange;

      // 1 증가된 상품 수 <= 상품의 재고 수 + 현재 구매 수 (상품의 최초 수)
      // 증가만 함
      if (newQty > 0 && newQty <= prod.quantity + currentQty) {
        // 상품 구매 수 업데이트
        qtyElem.textContent = newQty;
        // 상품의 재고 수를 1 줄임
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        // 변경된 수량이 0 이하 (장바구니에서 삭제 필요)
        // 줄어든 수만큼 상품 재고 복구
        prod.quantity += currentQty;
        // 요소 제거
        itemElem.remove();
      } else {
        // 변경된 수량이 재고 초과인 경우
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // remove 버튼 클릭일 경우
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      // 삭제된 상품 수만큼 상품의 재고 복구
      prod.quantity += remQty;
      // 요소 제거
      itemElem.remove();
    }

    // 장바구니 관련 계산
    handleCalculateCartStuff();
    // 셀렉터 옵션 업데이트
    onUpdateSelectOptions();
  }
});

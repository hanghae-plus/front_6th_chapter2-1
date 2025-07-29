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

import { getRandomNumber } from './utils/getRandomNumber';
import { findProductById } from './utils/findProductById';
import { findSuggestedProduct } from './utils/findSuggestedProduct';
import { getTotalStock } from './utils/getTotalStock';

import { calculateCartSummary } from './services/calculateCartSummary';
import { calculateBonusPoint } from './services/calculateBonusPoint';

import { renderBonusPoints } from './render/renderBonusPoint';
import { renderCartSummaryDetail } from './render/renderCartSummaryDetail';
import { renderCartTotalPrice } from './render/renderCartTotalPrice';
import { renderDiscountRate } from './render/renderDiscountRate';
import { renderTotalProductCount } from './render/renderTotalProductCount';
import { renderTuesdaySpecial } from './render/renderTuesdaySpecial';
import { renderCartProduct } from './render/renderCartProduct';
import { renderStockMessage } from './render/renderStockMessage';

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
  totalPoints: 0, // 최종 적립 포인트
  pointsDetail: [], // 포인트 상세 문자열

  totalProductCount: 0, // 장바구니 내 총 상품 수 (헤더)
  totalBeforeDiscount: 0, // 할인 전 장바구니 내 총 상품 가격
  totalAfterDiscount: 0, // 장바구니 내 총 상품 가격

  totalDiscountedRate: 0, // 총 할인율
  discountedProductList: [], // 할인 적용된 상품 목록
  lastSelectedProductId: null, // 제일 최근에 장바구니에 담은 상품의 id
};

// 상품 선택 셀렉터
let sel;
// ADD TO CART 버튼
let addBtn;
// 장바구니 내 상품 목록
let cartDisp;
// 장바구니 총 가격 컴포넌트
let cartTotal;
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
  cartTotal = rightColumn.querySelector('#cart-total');

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 장바구니 계산
  handleCalculateCartStuff();
  // 셀렉터 옵션 업데이트
  updateSelectOptions();

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
        updateSelectOptions();
        updatePricesInCart();
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
          updateSelectOptions();
          updatePricesInCart();
        }
      }
      // 60초마다 시도
    }, 60000);
  }, getRandomNumber(20000)); // 초기 지연 1 ~ 20초
}

// ----------------------------------------------

// 장바구니 가격 계산 + 출력 함수
function handleCalculateCartStuff() {
  // 장바구니 내 상품 목록
  const cartItems = cartDisp.children;

  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, totalDiscountedRate, discountedProductList } =
    calculateCartSummary(cartItems, productList);

  // 전역 상태 업데이트
  appState.totalProductCount = totalProductCount;

  appState.totalAfterDiscount = totalAfterDiscount;
  appState.totalBeforeDiscount = totalBeforeDiscount;

  appState.totalDiscountedRate = totalDiscountedRate;
  appState.discountedProductList = discountedProductList;

  const { totalPoints, pointsDetail } = calculateBonusPoint({ cartItems, productList, appState });

  appState.totalPoints = totalPoints;
  appState.pointsDetail = pointsDetail;

  // UI 장바구니 관련 출력
  renderTuesdaySpecial(appState);
  renderCartSummaryDetail({ cartItems, productList, appState });
  renderCartTotalPrice(appState, cartTotal);
  renderDiscountRate(appState);
  renderTotalProductCount(appState);
  renderBonusPoints(appState);
}

// -------------------------------------

// 셀렉트 내의 옵션 텍스트 업데이트
function updateSelectOptions() {
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

// 장바구니 상품 정보 업데이트
function updatePricesInCart() {
  const cartItems = cartDisp.children;

  // 장바구니 상품 각 ui
  renderCartProduct({ cartItems, productList });
  updateCartProductStyle();

  // 장바구니 계산 처리 + ui 업데이트
  handleCalculateCartStuff();
  // 재고 처리 업데이트
  renderStockMessage(productList, stockInfo);
}

function updateCartProductStyle() {
  const cartItems = cartDisp.children;

  for (let i = 0; i < cartItems.length; i++) {
    const qtyElem = cartItems[i].querySelector('.quantity-number');
    const priceElem = cartItems[i].querySelector('.text-lg');
    const itemCount = parseInt(qtyElem.textContent);

    if (priceElem) {
      priceElem.style.fontWeight = itemCount >= 10 ? 'bold' : 'normal';
    }
  }
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

  // id가 일치하는 상품을 찾음
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

    updateCartProductStyle();

    // 장바구니 관련 계산
    handleCalculateCartStuff();
    // 재고 처리 업데이트
    renderStockMessage(productList, stockInfo);

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

    // id로 상품을 찾음
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

    updateCartProductStyle();

    // 장바구니 관련 계산
    handleCalculateCartStuff();
    // 재고 처리 업데이트
    renderStockMessage(productList, stockInfo);
    // 셀렉터 옵션 업데이트
    updateSelectOptions();
  }
});

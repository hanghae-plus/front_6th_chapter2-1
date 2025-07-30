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

import { getRandomNumber } from './utils/getRandomNumber';
import { findSuggestedProduct } from './utils/findSuggestedProduct';

import { calculateCartSummary } from './html/services/calculateCartSummary';
import { calculateBonusPoint } from './html/services/calculateBonusPoint';

import { renderBonusPoints } from './html/render/renderBonusPoint';
import { renderCartSummaryDetail } from './html/render/renderCartSummaryDetail';
import { renderCartTotalPrice } from './html/render/renderCartTotalPrice';
import { renderDiscountRate } from './html/render/renderDiscountRate';
import { renderTotalProductCount } from './html/render/renderTotalProductCount';
import { renderTuesdaySpecial } from './html/render/renderTuesdaySpecial';
import { renderStockMessage } from './html/render/renderStockMessage';
import { renderCartProductList } from './html/render/renderCartProducList';
import { renderProductOptionList } from './html/render/renderProductOptionList';

import { applyFlashSale, applySuggestSale } from './html/states/productState';
import { changeQuantity, removeFromCart } from './html/states/cartState';

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

const cartList = [];

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

// 이거로 최종 상태 관리
const state = {
  productState: productList,
  cartState: cartList,
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
  updateCartStatus({ state, appState });
  // 셀렉터 옵션 업데이트
  renderProductOptionList(state);

  // 세일 추천 alert 함수
  // 첫번째 - 번개 세일
  setTimeout(() => {
    setInterval(() => {
      // 랜덤 상품 선택
      const luckyIdx = Math.floor(getRandomNumber(state.productState.length));
      const luckyItem = state.productState[luckyIdx];

      // 상품이 재고가 있고 세일 중이 아님
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // 20프로 할인 적용 후 상태를 할인 중으로 업데이트
        applyFlashSale(state, luckyItem.id);
        // alert 실행
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');

        // 셀렉트 옵션 및 장바구니 상태 업데이트
        renderProductOptionList(state);
        updateCartStatus({ state, appState });
      }
      // 30초마다 시도
    }, 3000);
  }, getRandomNumber(10000)); // 초기 지연

  // 두번째 - 추천 세일
  setTimeout(() => {
    setInterval(() => {
      // 마지막에 장바구니에 담은 상품이 있으면 실행
      if (appState.lastSelectedProductId) {
        const suggestedProduct = findSuggestedProduct(state.productState, appState.lastSelectedProductId);

        // 조건에 맞는 상품이 존재
        if (suggestedProduct) {
          // 5프로 할인 적용 후 상태를 추천 중으로 업데이트
          applySuggestSale(state, suggestedProduct.id);

          // alert 실행
          alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');

          // 셀렉트 옵션 및 장바구니 상태 업데이트
          renderProductOptionList(state);
          updateCartStatus({ state, appState });
        }
      }
      // 60초마다 시도
    }, 60000);
  }, getRandomNumber(20000)); // 초기 지연 1 ~ 20초
}

// ----------------------------------------------

function updateUI({ state, appState }) {
  renderTuesdaySpecial(appState);
  renderCartSummaryDetail({ state, appState });
  renderCartTotalPrice(appState);
  renderDiscountRate(appState);
  renderTotalProductCount(appState);
  renderBonusPoints(appState);
  renderStockMessage(state);
  renderCartProductList(state);
}

// 장바구니 가격 계산 + 출력 함수
function updateCartStatus({ state, appState }) {
  const { totalBeforeDiscount, totalAfterDiscount, totalProductCount, totalDiscountedRate, discountedProductList } =
    calculateCartSummary(state);

  // 전역 상태 업데이트
  appState.totalProductCount = totalProductCount;

  appState.totalAfterDiscount = totalAfterDiscount;
  appState.totalBeforeDiscount = totalBeforeDiscount;

  appState.totalDiscountedRate = totalDiscountedRate;
  appState.discountedProductList = discountedProductList;

  const { totalPoints, pointsDetail } = calculateBonusPoint({ state, appState });

  appState.totalPoints = totalPoints;
  appState.pointsDetail = pointsDetail;

  updateUI({ state, appState });
}

// -------------------------------------

// 페이지 렌더링
main();

// ADD TO CART 버튼 이벤트
addBtn.addEventListener('click', () => {
  // 현재 셀렉터에 선택된 옵션 value (상품 id)
  let productId = sel.value;
  // 셀렉터의 옵션과 같은 상품을 찾음

  changeQuantity(state, productId, 1);
  // 장바구니 관련 계산
  updateCartStatus({ state, appState });

  // 선택 상태 업데이트
  appState.lastSelectedProductId = productId;
});

// 장바구니 각 상품 컴포넌트 이벤트
cartDisp.addEventListener('click', (event) => {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change, 10); // -1 또는 1
      changeQuantity(state, prodId, qtyChange);
    } else if (tgt.classList.contains('remove-item')) {
      removeFromCart(state, prodId);
    }

    // 장바구니 관련 계산
    updateCartStatus({ state, appState });
    // 셀렉터 옵션 업데이트
    renderProductOptionList(state);
  }
});

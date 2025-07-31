import { createHeader } from './components/Header';
import { createManualToggle } from './components/ManualToggle';
import { createManualOverlay } from './components/ManualOverlay';
import { createManualColumn } from './components/ManualColumn';
import { createGridContainer } from './components/GridContainer';
import { createLeftColumn } from './components/LeftColumn';
import { createRightColumn } from './components/RightColumn';
import { createSelectorContainer } from './components/SelectorContainer';
import { createAddToCartBtn } from './components/AddToCartBtn';
import { createProductSelector } from './components/ProductSelector';
import { createCartProductList } from './components/CartProductList';
import { createStockStatus } from './components/StockStatus';

import { PRODUCT } from './html/constants/constants';
import { applySaleAlert } from './html/services/applySaleAlert';
import { changeQuantity, removeFromCart } from './html/states/cartState';
import { updateProductSelector } from './html/services/updateProductSeletor';
import { updateCartStatus } from './html/services/updateCartStatus';

// 상품 목록 - 전역 상태 관리 필요
const productList = [
  {
    id: PRODUCT.ID[1],
    name: PRODUCT.NAME.KEYBOARD,
    changedPrice: 10000, // 변동된 가격
    originalPrice: 10000, // 원래 가격
    quantity: 50, // 재고 수
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT.ID[2],
    name: PRODUCT.NAME.MOUSE,
    changedPrice: 20000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT.ID[3],
    name: PRODUCT.NAME.MONITOR,
    changedPrice: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT.ID[4],
    name: PRODUCT.NAME.POUCH,
    changedPrice: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCT.ID[5],
    name: PRODUCT.NAME.SPEACKER,
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

// 최종 상태 관리
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
  const stockInfo = createStockStatus();

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

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // 장바구니 계산
  updateCartStatus({ state, appState });
  // 셀렉터 옵션 업데이트
  updateProductSelector(state);
  // 세일 추천 alert 함수
  applySaleAlert({ state, appState });
}

// ----------------------------------------------

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
    updateProductSelector(state);
  }
});

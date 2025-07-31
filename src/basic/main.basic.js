// 📦 Imports (알파벳 순)
import { CartDisplay } from './components/Cart';
import { Header, Layout } from './components/Layout';
import { ManualGuide } from './components/ManualGuide';
import {
  OrderSummaryDetails,
  OrderSummaryDiscountInfo,
  OrderSummaryTotalDisplay,
  OrderSummaryTuesdaySpecial,
} from './components/OrderSummary';
import { ProductAddToCartButton, ProductSelect, ProductStockInfo } from './components/Product';
import { addItemToCart } from './services/cartService';
import { setupTimers } from './utils/setupTimers';
import { updateUI } from './utils/updateUI';

export function App() {
  const root = document.getElementById('app');

  // Layout 구성
  const headerComp = Header();
  const layoutComp = Layout();
  const manualGuideComp = ManualGuide();

  const stockInfoComp = ProductStockInfo();

  // 상품 선택 관련 요소

  const productSelectComp = ProductSelect(() => {
    stockInfoComp.updateStockInfo();
  });

  // 초기 선택 상품 ID 설정

  const addToCartButtonComp = ProductAddToCartButton(() => {
    const result = addItemToCart();
    if (result.success) {
      updateAll();
    } else {
      alert(result.message);
    }
  });
  const cartDisplayComp = CartDisplay(() => updateAll());

  // 주문 요약 관련 컴포넌트들
  const summaryDetailsComp = OrderSummaryDetails();
  const discountInfoComp = OrderSummaryDiscountInfo();
  const totalDisplayComp = OrderSummaryTotalDisplay();
  const tuesdaySpecialComp = OrderSummaryTuesdaySpecial();

  // 왼쪽 컬럼에 상품 선택/추가 섹션 배치
  const productSelectionSection = document.createElement('div');
  productSelectionSection.className = 'mb-6 pb-6 border-b border-gray-200';
  productSelectionSection.appendChild(productSelectComp.element);
  productSelectionSection.appendChild(addToCartButtonComp);
  productSelectionSection.appendChild(stockInfoComp.element);
  layoutComp.leftColumn.appendChild(productSelectionSection);

  // 왼쪽 컬럼에 장바구니 디스플레이 배치
  layoutComp.leftColumn.appendChild(cartDisplayComp.element);

  // 오른쪽 컬럼 (주문 요약)에 각 섹션 배치
  const orderSummaryContainer = layoutComp.rightColumn.querySelector('.flex-1.flex.flex-col');
  orderSummaryContainer.insertBefore(tuesdaySpecialComp.element, orderSummaryContainer.children[0]);
  orderSummaryContainer.insertBefore(totalDisplayComp.element, orderSummaryContainer.children[1]);
  orderSummaryContainer.insertBefore(discountInfoComp.element, orderSummaryContainer.children[1]);
  orderSummaryContainer.insertBefore(summaryDetailsComp.element, orderSummaryContainer.children[1]); //

  // 최상위 DOM (`#app`)에 모든 주요 컴포넌트 추가
  root.appendChild(headerComp);
  root.appendChild(layoutComp.container);
  root.appendChild(manualGuideComp.toggleButton);
  root.appendChild(manualGuideComp.overlay);

  // 모든 컴포넌트의 update 함수를 한 곳에서 호출하여 UI를 갱신
  const allComponentsForUpdate = {
    productSelectComp,
    cartDisplayComp,
    stockInfoComp,
    summaryDetailsComp,
    discountInfoComp,
    totalDisplayComp,
    tuesdaySpecialComp,
  };
  const updateAll = () => updateUI(allComponentsForUpdate);

  // 애플리케이션 초기 상태 렌더링 ---
  updateAll();

  // 타이머 세팅
  const updateLastSelectedProductId = setupTimers(updateAll);

  //  Add 버튼 클릭 시 추천상품 상태 업데이트
  addToCartButtonComp.addEventListener('click', () => {
    updateLastSelectedProductId();
  });
}

// 앱 시작
App();

import { CartDisplay } from './components/Cart';
import { Header, Layout } from './components/Layout';
import { ManualGuide } from './components/ManualGuide';
import {
  DiscountInfo,
  SummaryDetails,
  TotalDisplay,
  TuesdaySpecial,
} from './components/OrderSummary';
import { AddToCartButton, ProductSelect, StockInfo } from './components/Product';
import { addItemToCart } from './services/cartService';
import { setupTimers } from './utils/setupTimers';
import { updateUI } from './utils/updateUI';

export function App() {
  const root = document.getElementById('app');

  const header = Header();
  const { container, leftColumn, rightColumn } = Layout();

  const productSelectComp = ProductSelect((productId) => {
    selectedProductId = productId;
    stockInfoComp.updateStockInfo();
  });
  let selectedProductId = productSelectComp.element.value;

  const stockInfoComp = StockInfo();
  const addToCartButtonComp = AddToCartButton(() => {
    if (!selectedProductId) return alert('상품을 선택해주세요.');
    const result = addItemToCart(selectedProductId);
    if (result.success) {
      updateAll();
    } else {
      alert(result.message);
    }
  });

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  selectorContainer.appendChild(productSelectComp.element);
  selectorContainer.appendChild(addToCartButtonComp);
  selectorContainer.appendChild(stockInfoComp.element);
  leftColumn.appendChild(selectorContainer);

  const cartDisplayComp = CartDisplay(() => updateAll());
  leftColumn.appendChild(cartDisplayComp.element);

  const summaryDetailsComp = SummaryDetails();
  const discountInfoComp = DiscountInfo();
  const totalDisplayComp = TotalDisplay();
  const tuesdaySpecialComp = TuesdaySpecial();

  const orderSummaryContainer = rightColumn.querySelector('.flex-1.flex.flex-col');
  orderSummaryContainer.insertBefore(tuesdaySpecialComp.element, orderSummaryContainer.children[0]);
  orderSummaryContainer.insertBefore(totalDisplayComp.element, orderSummaryContainer.children[1]);
  orderSummaryContainer.insertBefore(discountInfoComp.element, orderSummaryContainer.children[1]);
  orderSummaryContainer.insertBefore(summaryDetailsComp.element, orderSummaryContainer.children[1]);

  const { toggleButton, overlay } = ManualGuide();

  container.appendChild(leftColumn);
  container.appendChild(rightColumn);
  overlay.appendChild(toggleButton);
  root.appendChild(header);
  root.appendChild(container);
  root.appendChild(toggleButton);
  root.appendChild(overlay);

  const updateAll = () =>
    updateUI({
      productSelectComp,
      cartDisplayComp,
      stockInfoComp,
      summaryDetailsComp,
      discountInfoComp,
      totalDisplayComp,
      tuesdaySpecialComp,
    });

  updateAll();

  // 번개세일/추천할인 타이머 세팅
  const updateLastSelectedProductId = setupTimers(updateAll);

  // AddToCartButton 클릭 시 추천대상 ID 업데이트
  addToCartButtonComp.addEventListener('click', () => {
    updateLastSelectedProductId(selectedProductId);
  });
}

// DOMContentLoaded 이벤트 발생 시 App 함수를 실행하여 애플리케이션 시작
document.addEventListener('DOMContentLoaded', App);

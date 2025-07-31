import { products } from './data/products.json';
import { EventHandlers } from './eventHandlers';
import { initializeDiscountEvents } from './src/discountEvent';
import { initializeLayout } from './src/renderUI';
import { onUpdateCartStuff } from './src/updateCartStuff';
import { onUpdatePricesInCart } from './src/updatePricesInCart';
import { onUpdateSelectOptions } from './src/updateSelectOptions';

function main() {
  let lastSel = null;
  const productList = products;

  function setLastSel(selItem) {
    lastSel = selItem;
  }

  // UI 초기화
  const { sel, stockInfo, addBtn, cartDisplay, sum, manualOverlay, manualToggle, manualColumn } = initializeLayout();

  const handleCalculateCartStuff = () => {
    onUpdateCartStuff({ cartDisplay, productList, stockInfo, sum });
  };

  const handleUpdateSelectOptions = () => {
    onUpdateSelectOptions({ productList, selectedOption: sel });
  };

  const handleUpdatePricesInCart = () => {
    onUpdatePricesInCart({ cartDisplay, productList, handleCalculateCartStuff });
  };

  const handleUpdateForDiscountEvents = () => {
    handleUpdateSelectOptions();
    handleUpdatePricesInCart();
  };

  handleUpdateSelectOptions();
  handleCalculateCartStuff();

  // 할인 이벤트 초기화
  initializeDiscountEvents({
    productList,
    handleUpdateForDiscountEvents,
    lastSel,
  });

  // 이벤트 핸들러 초기화
  const eventHandlers = new EventHandlers({
    addBtn,
    cartDisplay,
    manualToggle,
    manualOverlay,
    manualColumn,
    productList,
    sel,
    setLastSel,
    handleCalculateCartStuff,
    handleUpdateSelectOptions,
  });
  eventHandlers.setupEventListeners();
}
// --- main 함수 끝 ---

main();

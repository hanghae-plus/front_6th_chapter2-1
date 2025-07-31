import { EventHandlers } from './eventHandlers';
import products from './src/data/products.json';
import { onUpdateCartStuff } from './src/updateCartStuff';
import { onUpdatePricesInCart } from './src/updatePricesInCart';
import { onUpdateSelectOptions } from './src/updateSelectOptions';

function Header() {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  return header;
}

function RightColumn() {
  const rightColumn = document.createElement('div');
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
  `;

  return rightColumn;
}

function LeftColumn() {
  const leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  return leftColumn;
}

function SelectorContainer() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  return selectorContainer;
}

function ProductSelectBox() {
  const productSelectBox = document.createElement('select');
  productSelectBox.id = 'product-select';
  productSelectBox.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return productSelectBox;
}

function StockInfo() {
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  return stockInfo;
}

function AddButton() {
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  return addButton;
}

function GridContainer() {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  return gridContainer;
}

function CartDisplay() {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  return cartDisplay;
}

function ManualToggleButton() {
  const manualToggleButton = document.createElement('button');

  manualToggleButton.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggleButton.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  return manualToggleButton;
}

function ManualColumn() {
  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
  <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
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
`;

  return manualColumn;
}

function ManualOverlay() {
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  return manualOverlay;
}

function lightningDelayTimer(second) {
  return Math.random() * second * 1000;
}

function initializeLayout() {
  const root = document.getElementById('app');

  // Header 영역
  const header = Header();

  // Main Content 영역
  const gridContainer = GridContainer();
  const { leftColumn, cartDisplay, sel, stockInfo, addBtn } = initializeLeftColumn();
  const { rightColumn, sum } = initializeRightColumn();

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  // Manual(도움말) 영역
  const { manualOverlay, manualToggle, manualColumn } = initializeManual();

  // 최종 조립
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  return {
    sel,
    stockInfo,
    addBtn,
    cartDisplay,
    sum,
    manualOverlay,
    manualToggle,
    manualColumn,
  };
}

function initializeLeftColumn() {
  const leftColumn = LeftColumn();
  const selectorContainer = SelectorContainer();
  const sel = ProductSelectBox();
  const stockInfo = StockInfo();
  const addBtn = AddButton();
  const cartDisplay = CartDisplay();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(stockInfo);
  selectorContainer.appendChild(addBtn);

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  return { leftColumn, cartDisplay, sel, stockInfo, addBtn };
}

function initializeRightColumn() {
  const rightColumn = RightColumn();
  const sum = rightColumn.querySelector('#cart-total');

  return { rightColumn, sum };
}

function initializeManual() {
  const manualColumn = ManualColumn();
  const manualToggle = ManualToggleButton();
  const manualOverlay = ManualOverlay();

  manualOverlay.appendChild(manualColumn);

  return { manualOverlay, manualToggle, manualColumn };
}

function initializeDiscountEvents({ prodList, sel, cartDisplay, handleCalculateCartStuff, lastSel }) {
  // 번개세일 이벤트
  function initializeLightningSale() {
    setTimeout(() => {
      setInterval(function () {
        const luckyIdx = Math.floor(Math.random() * prodList.length);
        const luckyItem = prodList[luckyIdx];
        if (luckyItem.q > 0 && !luckyItem.onSale) {
          luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
          luckyItem.onSale = true;
          alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          onUpdateSelectOptions({ productList: prodList, selectedOption: sel });
          onUpdatePricesInCart({ cartDisplay, productList: prodList, handleCalculateCartStuff });
        }
      }, 30000);
    }, lightningDelayTimer(10));
  }

  // 추천 할인 이벤트
  function initializeSuggestSale() {
    setTimeout(function () {
      setInterval(function () {
        if (lastSel) {
          let suggest = null;
          for (let k = 0; k < prodList.length; k++) {
            if (prodList[k].id !== lastSel) {
              if (prodList[k].q > 0) {
                if (!prodList[k].suggestSale) {
                  suggest = prodList[k];
                  break;
                }
              }
            }
          }
          if (suggest) {
            alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
            suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
            suggest.suggestSale = true;
            onUpdateSelectOptions({ productList: prodList, selectedOption: sel });
            onUpdatePricesInCart({ cartDisplay, productList: prodList, handleCalculateCartStuff });
          }
        }
      }, 60000);
    }, lightningDelayTimer(20));
  }

  initializeLightningSale();
  initializeSuggestSale();
}

function main() {
  const totalAmt = 0;
  const itemCnt = 0;
  let lastSel = null;
  const prodList = products.prodList;

  function setLastSel(selItem) {
    lastSel = selItem;
  }

  // UI 초기화
  const { sel, stockInfo, addBtn, cartDisplay, sum, manualOverlay, manualToggle, manualColumn } = initializeLayout();

  const handleCalculateCartStuff = () => {
    onUpdateCartStuff({ cartDisplay, prodList, totalAmt, itemCnt, stockInfo, sum });
  };
  const handleUpdateSelectOptions = () => {
    onUpdateSelectOptions({ productList: prodList, selectedOption: sel });
  };

  handleUpdateSelectOptions();
  handleCalculateCartStuff();

  // 할인 이벤트 초기화
  initializeDiscountEvents({
    prodList,
    sel,
    cartDisplay,
    handleCalculateCartStuff,
    lastSel,
  });

  // 이벤트 핸들러 초기화
  const eventHandlers = new EventHandlers({
    addBtn,
    cartDisplay,
    manualToggle,
    manualOverlay,
    manualColumn,
    prodList,
    sel,
    setLastSel,
    handleCalculateCartStuff,
    handleUpdateSelectOptions,
  });
  eventHandlers.setupEventListeners();
}
// --- main 함수 끝 ---

main();

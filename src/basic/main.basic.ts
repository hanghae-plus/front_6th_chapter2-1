// 유틸리티 함수 import
import { createElement, $$ } from './utils.js';

// 렌더 함수 import
import {
  App,
  rerenderProductSelect,
  rerenderCartItems,
  rerenderUI,
  rerenderStockStatus
} from './render.js';

// 비즈니스 로직 import
import {
  PRODUCT_IDS,
  createInitialProducts,
  calculateTotalStock,
  calculateItemDiscount,
  isTuesday,
  applyTuesdayDiscount,
  calculateDiscountRate,
  applyBulkDiscount,
  calculateCartData,
  calculatePoints,
  applyLightningSale,
  applySuggestionSale,
  updateProductStock,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  canAddToCart,
  getAvailableStock,
  getStockInfo
} from './entities.js';


// 전역 변수 선언
// 상태 관리 변수
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var totalAmt = 0
var cart = {} // 장바구니 모델 { productId: quantity }


// DOM 요소 참조 변수
var sel
var addBtn
var cartDisp
var sum


export function useProducts() {
  return {
    products: prodList,
    totalStock: calculateTotalStock(prodList),

    getProductById: (id) => prodList.find(p => p.id === id),
    getStockInfo: () => getStockInfo(prodList),
    hasLowStock: () => calculateTotalStock(prodList) < 50,

    updateProducts: (newProducts) => {
      prodList = newProducts;
    }
  };
}

export function useCart() {
  const cartData = calculateCartData(cart, prodList, new Date());
  const pointsData = calculatePoints(cartData, cart, new Date());
  
  return {
    cart: cart,
    cartData: cartData,
    pointsData: pointsData,
    isEmpty: Object.keys(cart).length === 0,
    getItemQuantity: (productId) => cart[productId] || 0,
    hasItem: (productId) => productId in cart
  };
}

export function useGlobalState() {
  return {
    totalAmt: totalAmt,
    itemCnt: itemCnt,
    bonusPts: bonusPts,
    lastSel: lastSel
  };
}


// APP FUNCTIONS

// 앱 초기화 함수 (useEffect - 마운트 시 1회)
function initializeApp() {
  // 전역 상태 초기화
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  cart = {}; // cart 객체 초기화
  
  // 상품 목록 초기화
  prodList = createInitialProducts();
  
  // DOM 요소 생성
  var root = document.getElementById('app');
  root.innerHTML = App();
  
  // DOM 요소 참조 설정
  sel = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  cartDisp = document.getElementById('cart-items');
  stockInfo = document.getElementById('stock-status');
  sum = document.getElementById('cart-total');
  
  // 초기 UI 업데이트
  onUpdateSelectOptions();
  rerenderCart();
}

// 번개세일 타이머 설정 (useEffect)
export function setupLightningSaleTimer() {
  const lightningDelay = Math.random() * 10000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const { products, updateProducts } = useProducts();
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        // setState 패턴으로 상태 업데이트
        updateProducts(applyLightningSale(products, luckyItem.id));
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
    }, lightningDelay);

  // cleanup 함수 반환
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}

// 추천 할인 타이머 설정 (useEffect - lastSel 의존성)
export function setupSuggestSaleTimer() {
  const suggestionDelay = Math.random() * 20000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      if (cartDisp.children.length === 0) {
        return;
      }
      if (lastSel) {
        const { products, updateProducts } = useProducts();
        const suggest = products.find(product => product.id !== lastSel &&
          product.q > 0 &&
          !product.suggestSale);
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          // setState 패턴으로 상태 업데이트
          updateProducts(applySuggestionSale(products, suggest.id, lastSel));
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, suggestionDelay);

  // cleanup 함수 반환
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}

// 이벤트 리스너 설정 (useEffect)
function setupEventListeners() {
  // 장바구니 추가 버튼 클릭 이벤트
  addBtn.addEventListener("click", handleAddToCart);
  
  // 장바구니 아이템 클릭 이벤트
  cartDisp.addEventListener("click", handleCartItemClick);
}

// 메인 초기화 함수
function main() {
  // 앱 초기화
  initializeApp();
  
  // 이벤트 리스너 설정
  setupEventListeners();
  
  // 타이머 설정 (useEffect 패턴)
  setupLightningSaleTimer();
  setupSuggestSaleTimer();
}

// 상품 선택 옵션 업데이트 함수
function onUpdateSelectOptions() {
  rerenderProductSelect();
  // DOM 참조 재설정
  sel = document.getElementById('product-select');
}

// UI 업데이트 함수
function updateCartUI(cartData, pointsData) {
  // render.ts의 rerender 함수들을 사용
  rerenderUI();
}

// cart 객체를 DOM으로 렌더링하는 함수
function updateCartDOM() {
  rerenderCartItems();
}

// 장바구니 계산 및 UI 업데이트 메인 함수
function rerenderCart() {
  // 장바구니 데이터 계산 (cart 객체 전달)
  const { products } = useProducts();
  const cartData = calculateCartData(cart, products, new Date());

  // 포인트 계산
  const pointsData = calculatePoints(cartData, cart, new Date());

  // 전역 변수 업데이트
  totalAmt = cartData.totalAmount;
  itemCnt = cartData.itemCount;
  bonusPts = pointsData.finalPoints;
  
  // UI 업데이트
  updateCartUI(cartData, pointsData);
  
  // 추가 업데이트 함수 호출
  handleStockInfoUpdate();
}



// 재고 정보 업데이트 함수
function handleStockInfoUpdate() {
  rerenderStockStatus();
}


// 장바구니 내 가격 업데이트 함수
function doUpdatePricesInCart() {
  // cart 객체 기반으로 DOM 재렌더링
  updateCartDOM();
  
  // 전체 재계산
  rerenderCart();
}


// 메인 함수 실행
main();


// 장바구니 추가 핸들러
function handleAddToCart() {
  var selItem = sel.value;

  const { products } = useProducts();
  var hasItem = products.some(product => product.id === selItem);
  if (!selItem || !hasItem) {
    return;
  }
  
  var itemToAdd = products.find(product => product.id === selItem);
  
  if (itemToAdd && itemToAdd.q > 0) {
    var currentQty = cart[selItem] || 0;
    
    if (canAddToCart(itemToAdd, currentQty, 1)) {
      // cart 업데이트 (순수 함수 사용)
      cart = addToCart(cart, selItem, 1);
      
      // 재고 업데이트 (setState 패턴)
      const { products, updateProducts } = useProducts();
      updateProducts(updateProductStock(products, selItem, -1));
      
      // DOM 업데이트
      updateCartDOM();
      rerenderCart();
      lastSel = selItem;
    } else {
      alert('재고가 부족합니다.');
    }
  }
}

// 장바구니 아이템 클릭 핸들러 (수량 변경, 삭제)
function handleCartItemClick(event) {
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains("remove-item")) {
    var prodId = tgt.dataset.productId;
    
    const { products, updateProducts } = useProducts();
    var prod = products.find(product => product.id === prodId);
    
    if (!prod || !cart[prodId]) return;
    
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var currentQty = cart[prodId];
      var newQty = currentQty + qtyChange;
      
      if (newQty > 0) {
        var availableStock = getAvailableStock(prod, currentQty);
        if (newQty <= availableStock) {
          // cart 업데이트
          cart = updateCartQuantity(cart, prodId, newQty);
          // 재고 업데이트 (setState 패턴)
          updateProducts(updateProductStock(products, prodId, -qtyChange));
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        // 아이템 제거
        cart = removeFromCart(cart, prodId);
        // 재고 복구
        updateProducts(updateProductStock(products, prodId, currentQty));
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = cart[prodId];
      // cart에서 제거
      cart = removeFromCart(cart, prodId);
      // 재고 복구
      updateProducts(updateProductStock(products, prodId, remQty));
    }
    
    // DOM 업데이트
    updateCartDOM();
    rerenderCart();
    onUpdateSelectOptions();
  }
}
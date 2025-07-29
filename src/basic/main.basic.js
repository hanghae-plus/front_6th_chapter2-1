// 유틸리티 함수 import
import { createElement, $$ } from './utils.js';

// 렌더 함수 import
import {
  App,
  ProductOptions,
  CartItem,
  DiscountInfo,
  LoyaltyPoints,
  SummaryDetails,
  StockStatus,
  ProductPrice
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


// APP FUNCTIONS

// 화요일 특별 표시 여부 결정
function shouldShowTuesdaySpecial(isTuesday, totalAmount) {
  return isTuesday && totalAmount > 0;
}


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
  root.innerHTML = App({ itemCount: 0 });
  
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
function setupLightningSaleTimer() {
  const lightningDelay = Math.random() * 10000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        // setState 패턴으로 상태 업데이트
        prodList = applyLightningSale(prodList, luckyItem.id);
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
function setupSuggestSaleTimer() {
  const suggestionDelay = Math.random() * 20000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      if (cartDisp.children.length === 0) {
        return;
      }
      if (lastSel) {
        const suggest = prodList.find(product => product.id !== lastSel &&
          product.q > 0 &&
          !product.suggestSale);
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          // setState 패턴으로 상태 업데이트
          prodList = applySuggestionSale(prodList, suggest.id, lastSel);
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


// 전역 변수 - 합계 표시 요소
var sum


// 상품 선택 옵션 업데이트 함수
function onUpdateSelectOptions() {
  // 전체 재고 수량 계산
  var totalStock = calculateTotalStock(prodList);
  
  // $$ 유틸리티로 select 요소 업데이트
  sel = $$(sel, ProductOptions({products: prodList, totalStock: totalStock}));
}


// 장바구니 계산 wrapper (entities.js의 순수 함수 사용)
function calculateCartDataWrapper(cartObj, products) {
  return calculateCartData(cartObj, products, new Date());
}

// UI 업데이트 함수
function updateCartUI(cartData, pointsData) {
  // 아이템별 가격 스타일 업데이트는 updateCartDOM에서 처리됨
  
  // 화요일 표시 여부 설정
  var tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && cartData.totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  
  // 아이템 개수 표시
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    var previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${cartData.itemCount} items in cart`;
    if (previousCount !== cartData.itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  
  // 주문 요약 상세 내용
  var summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = SummaryDetails({
    subtotal: cartData.subtotal,
    items: cartData.summaryItems,
    itemCount: cartData.itemCount,
    discounts: cartData.itemDiscounts,
    isTuesday: cartData.isTuesday
  });
  
  // 총액 업데이트
  var totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(cartData.totalAmount).toLocaleString()}`;
  }
  
  // 포인트 표시
  var loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv && pointsData) {
    loyaltyPointsDiv.innerHTML = LoyaltyPoints({ 
      points: pointsData.finalPoints, 
      details: pointsData.details 
    });
    loyaltyPointsDiv.style.display = pointsData.finalPoints > 0 || cartData.itemCount > 0 ? 'block' : 'none';
  }
  
  // 할인 정보 섹션 업데이트
  var discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = DiscountInfo({ 
    discountRate: cartData.discountRate, 
    savedAmount: cartData.savedAmount 
  });
  
  // 재고 정보 업데이트
  var stockInfoData = getStockInfo(prodList);
  stockInfo.textContent = stockInfoData.lowStockItems
    .map(item => item.message)
    .join('\n');
}

// cart 객체를 DOM으로 렌더링하는 함수
function updateCartDOM() {
  // 현재 DOM의 상태와 cart 객체 비교하여 업데이트
  var existingItems = {};
  Array.from(cartDisp.children).forEach(child => {
    existingItems[child.id] = child;
  });
  
  // cart 객체를 기반으로 DOM 업데이트
  Object.keys(cart).forEach(productId => {
    var quantity = cart[productId];
    if (quantity <= 0) return;
    
    var product = prodList.find(p => p.id === productId);
    
    if (!product) return;
    
    var existingItem = existingItems[productId];
    
    if (existingItem) {
      // 기존 아이템이 있으면 수량만 업데이트
      var quantityElement = existingItem.querySelector('.quantity-number');
      if (quantityElement) {
        quantityElement.textContent = quantity;
      }
      
      // 가격 업데이트 (할인 상태가 변경될 수 있음)
      var priceData = ProductPrice({product: product});
      var nameElement = existingItem.querySelector('h3');
      if (nameElement) {
        nameElement.innerHTML = priceData.namePrefix + product.name;
      }
      
      var priceElements = existingItem.querySelectorAll('.text-xs.text-black, .text-lg');
      priceElements.forEach(elem => {
        if (elem.classList.contains('text-black')) {
          elem.innerHTML = priceData.priceHTML;
        } else if (elem.classList.contains('text-lg')) {
          elem.innerHTML = priceData.priceHTML;
        }
      });
      
      delete existingItems[productId];
    } else {
      // 새 아이템 추가
      var cartItemHTML = CartItem({ item: product, quantity: quantity });
      var cartItemElement = createElement(cartItemHTML);
      cartDisp.appendChild(cartItemElement);
    }
  });
  
  // cart에 없는 아이템은 제거
  Object.keys(existingItems).forEach(productId => {
    existingItems[productId].remove();
  });
}

// 장바구니 계산 및 UI 업데이트 메인 함수
function rerenderCart() {
  // 장바구니 데이터 계산 (cart 객체 전달)
  const cartData = calculateCartData(cart, prodList, new Date());

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
  const stockInfoData = getStockInfo(prodList);
  stockInfo.textContent = stockInfoData.lowStockItems
    .map(item => item.message)
    .join('\n');
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

  var hasItem = prodList.some(product => product.id === selItem);
  if (!selItem || !hasItem) {
    return;
  }
  
  var itemToAdd = prodList.find(product => product.id === selItem);
  
  if (itemToAdd && itemToAdd.q > 0) {
    var currentQty = cart[selItem] || 0;
    
    if (canAddToCart(itemToAdd, currentQty, 1)) {
      // cart 업데이트 (순수 함수 사용)
      cart = addToCart(cart, selItem, 1);
      
      // 재고 업데이트 (setState 패턴)
      prodList = updateProductStock(prodList, selItem, -1);
      
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
    
    var prod = prodList.find(product => product.id === prodId);
    
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
          prodList = updateProductStock(prodList, prodId, -qtyChange);
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        // 아이템 제거
        cart = removeFromCart(cart, prodId);
        // 재고 복구
        prodList = updateProductStock(prodList, prodId, currentQty);
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = cart[prodId];
      // cart에서 제거
      cart = removeFromCart(cart, prodId);
      // 재고 복구
      prodList = updateProductStock(prodList, prodId, remQty);
    }
    
    // DOM 업데이트
    updateCartDOM();
    rerenderCart();
    onUpdateSelectOptions();
  }
}
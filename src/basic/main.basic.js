// 유틸리티 함수 import
import { createElement, createElements, addEventListeners, bindEvents, render } from './utils.js';

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


// 전역 변수 선언
// 상태 관리 변수
var prodList
var bonusPts = 0
var stockInfo
var itemCnt
var lastSel
var totalAmt = 0


// DOM 요소 참조 변수
var sel
var addBtn
var cartDisp
var sum


// 상품 ID 상수
var PRODUCT_ONE = 'p1'
var p2 = 'p2'
var product_3 = 'p3'
var p4 = "p4"
var PRODUCT_5 = `p5`


// APP FUNCTIONS

// 전체 재고 수량 계산
function calculateTotalStock(prodList) {
  return prodList.reduce(function(total, product) {
    return total + product.q;
  }, 0);
}


// 아이템 할인율 계산
function calculateItemDiscount(productId, quantity) {
  if (quantity < 10) return 0;
  
  switch(productId) {
    case 'p1': return 0.10;
    case 'p2': return 0.15;
    case 'p3': return 0.20;
    case 'p4': return 0.05;
    case 'p5': return 0.25;
    default: return 0;
  }
}


// 화요일 체크
function isTuesday(date) {
  return date.getDay() === 2;
}


// 화요일 할인 적용
function applyTuesdayDiscount(amount, isToday) {
  if (isToday && amount > 0) {
    return amount * 0.9;
  }
  return amount;
}


// 할인율 계산
function calculateDiscountRate(originalTotal, finalTotal) {
  if (originalTotal === 0) return 0;
  return 1 - (finalTotal / originalTotal);
}


// 대량 구매 할인 적용
function applyBulkDiscount(subtotal, itemCount) {
  if (itemCount >= 30) {
    return {
      amount: subtotal * 0.75,
      discountRate: 0.25
    };
  }
  return {
    amount: subtotal,
    discountRate: 0
  };
}


// 화요일 특별 표시 여부 결정
function shouldShowTuesdaySpecial(isTuesday, totalAmount) {
  return isTuesday && totalAmount > 0;
}


// 아이템 가격 표시 스타일 결정
function getItemPriceStyle(quantity) {
  return quantity >= 10 ? 'bold' : 'normal';
}


// 메인 초기화 함수
function main() {
  var root;
  var lightningDelay;
  
  
  // 전역 상태 초기화
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;
  
  
  // 상품 목록 초기화
  prodList = [
    {id: PRODUCT_ONE, name: '버그 없애는 키보드', val: 10000, originalVal: 10000, q: 50, onSale: false, suggestSale: false},
    {id: p2, name: '생산성 폭발 마우스', val: 20000, originalVal: 20000, q: 30, onSale: false, suggestSale: false},
    {id: product_3, name: "거북목 탈출 모니터암", val: 30000, originalVal: 30000, q: 20, onSale: false, suggestSale: false},
    {id: p4, name: "에러 방지 노트북 파우치", val: 15000, originalVal: 15000, q: 0, onSale: false, suggestSale: false},
    {
      id: PRODUCT_5,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false
    }
  ]
  
  
  // DOM 요소 생성 시작
  root = document.getElementById('app')
  
  // 전체 앱 렌더링
  root.innerHTML = App({ itemCount: 0 });
  
  // DOM 요소 참조 설정
  sel = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  cartDisp = document.getElementById('cart-items');
  stockInfo = document.getElementById('stock-status');
  sum = document.getElementById('cart-total');
  
  // 초기 UI 업데이트
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  
  
  // 번개세일 타이머 설정
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {

        luckyItem.val = Math.round(luckyItem.originalVal * 80 / 100);
        luckyItem.onSale = true;
        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  
  
  // 추천 할인 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        var suggest = prodList.find(function(product) {
          return product.id !== lastSel && 
                 product.q > 0 && 
                 !product.suggestSale;
        });
        if (suggest) {
          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          suggest.val = Math.round(suggest.val * (100 - 5) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};


// 전역 변수 - 합계 표시 요소
var sum


// 상품 선택 옵션 업데이트 함수
function onUpdateSelectOptions() {
  // 전체 재고 수량 계산
  var totalStock = calculateTotalStock(prodList);
  
  // ProductOptions 컴포넌트로 모든 옵션 생성
  var optionsData = ProductOptions({ products: prodList, totalStock: totalStock });
  
  // 옵션 HTML 업데이트
  sel.innerHTML = optionsData.html;
  
  // 테두리 색상 업데이트
  sel.style.borderColor = optionsData.borderColor;
}


// 장바구니 계산 및 UI 업데이트 메인 함수
function handleCalculateCartStuff() {
  var cartItems;
  var subTot;
  var itemDiscounts;
  var lowStockItems;
  var idx;
  var originalTotal;
  var bulkDisc;
  var itemDisc;
  var savedAmount;
  var summaryDetails;
  var totalDiv;
  var loyaltyPointsDiv;
  var points;
  var discountInfoDiv;
  var itemCountElement;
  var previousCount;
  var stockMsg;
  var pts;
  var hasP1;
  var hasP2;
  var loyaltyDiv;
  
  
  // 변수 초기화
  totalAmt = 0;
  itemCnt = 0;
  cartItems = cartDisp.children;
  subTot = 0;
  itemDiscounts = [];
  lowStockItems = [];
  
  
  // 재고 부족 상품 확인
  lowStockItems = prodList
    .filter(function(product) {
      return product.q < 5 && product.q > 0;
    })
    .map(function(product) {
      return product.name;
    });
  
  
  // 장바구니 아이템별 계산
  Array.from(cartItems).forEach(function(cartItem) {
    var curItem = prodList.find(function(product) {
      return product.id === cartItem.id;
    });
    
    var qtyElem = cartItem.querySelector('.quantity-number');
    var q = parseInt(qtyElem.textContent);
    var itemTot = curItem.val * q;
    var disc = 0;
    
    itemCnt += q;
    subTot += itemTot;
    
    var priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = getItemPriceStyle(q);
      }
    });
    
    disc = calculateItemDiscount(curItem.id, q);
    if (disc > 0) {
      itemDiscounts.push({name: curItem.name, discount: disc * 100});
    }
    totalAmt += itemTot * (1 - disc);
  });
  
  
  // 할인율 계산
  let discRate = 0;
  var originalTotal = subTot;
  
  
  // 대량 구매 할인 적용
  var bulkDiscountResult = applyBulkDiscount(subTot, itemCnt);
  if (itemCnt >= 30) {
    totalAmt = bulkDiscountResult.amount;
    discRate = bulkDiscountResult.discountRate;
  } else {
    discRate = calculateDiscountRate(subTot, totalAmt);
  }


  // 화요일 할인 적용
  const today = new Date();
  var isTodayTuesday = isTuesday(today);
  var tuesdaySpecial = document.getElementById('tuesday-special');
  
  totalAmt = applyTuesdayDiscount(totalAmt, isTodayTuesday);
  discRate = calculateDiscountRate(originalTotal, totalAmt);
  
  // 화요일 표시 여부 설정
  if (shouldShowTuesdaySpecial(isTodayTuesday, totalAmt)) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  
  
  // UI 요소 업데이트
  // 아이템 개수 표시
  var itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
  }
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  
  
  // 주문 요약 상세 내용 생성
  // 주문 아이템 데이터 준비
  var summaryItems = Array.from(cartItems).map(function(cartItem) {
    var curItem = prodList.find(function(product) {
      return product.id === cartItem.id;
    });
    var qtyElem = cartItem.querySelector('.quantity-number');
    var q = parseInt(qtyElem.textContent);
    return {
      name: curItem.name,
      quantity: q,
      total: curItem.val * q
    };
  });
  
  summaryDetails.innerHTML = SummaryDetails({
    subtotal: subTot,
    items: summaryItems,
    itemCount: itemCnt,
    discounts: itemDiscounts,
    isTuesday: isTodayTuesday
  });
  
  
  // 총액 업데이트
  totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
  
  
  // 포인트 계산 및 표시
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  
  
  // 할인 정보 섹션 업데이트
  discountInfoDiv = document.getElementById('discount-info');
  if (discRate > 0 && totalAmt > 0) {
    savedAmount = originalTotal - totalAmt;
  }
  discountInfoDiv.innerHTML = DiscountInfo({ discountRate: discRate, savedAmount: savedAmount });
  
  
  // 아이템 카운트 변경 감지
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  
  
  // 재고 메시지 생성
  stockInfo.textContent = StockStatus({ products: prodList });


  // 추가 업데이트 함수 호출
  handleStockInfoUpdate();
  doRenderBonusPoints();
}


// 보너스 포인트 렌더링 함수
var doRenderBonusPoints = function() {
  var basePoints;
  var finalPoints;
  var pointsDetail;

  var hasKeyboard;
  var hasMouse;
  var hasMonitorArm;
  var nodes;
  
  
  // 장바구니가 비어있으면 포인트 섹션 숨김
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  
  
  // 기본 포인트 계산
  basePoints = Math.floor(totalAmt / 1000)
  finalPoints = 0;
  pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push(`기본: ${basePoints}p`);
  }
  
  
  // 화요일 보너스 적용
  if (isTuesday(new Date())) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  
  
  // 세트 구매 확인
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  nodes = cartDisp.children;
  
  Array.from(nodes).forEach(function(node) {
    var product = prodList.find(function(p) {
      return p.id === node.id;
    });
    
    if (product) {
      if (product.id === PRODUCT_ONE) {
        hasKeyboard = true;
      } else if (product.id === p2) {
        hasMouse = true;
      } else if (product.id === product_3) {
        hasMonitorArm = true;
      }
    }
  });
  
  
  // 세트 보너스 적용
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }


  // 수량별 보너스 적용
  if (itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  
  
  // 최종 포인트 업데이트
  bonusPts = finalPoints;
  var ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    ptsTag.innerHTML = LoyaltyPoints({ points: bonusPts, details: pointsDetail });
    ptsTag.style.display = 'block';
  }
}

// 재고 정보 업데이트 함수
function handleStockInfoUpdate() {
  stockInfo.textContent = StockStatus({ products: prodList });
}


// 장바구니 내 가격 업데이트 함수
function doUpdatePricesInCart() {
  var cartItems;

  // 각 아이템의 가격 표시 업데이트
  cartItems = cartDisp.children;
  Array.from(cartItems).forEach(function(cartItem) {
    var itemId = cartItem.id;
    var product = prodList.find(function(p) {
      return p.id === itemId;
    });
    
    if (product) {
      var priceDiv = cartItem.querySelector('.text-lg');
      var nameDiv = cartItem.querySelector('h3');
      
      // 가격 업데이트를 위한 로직
      var priceData = ProductPrice({ product: product });
      
      priceDiv.innerHTML = priceData.priceHTML;
      nameDiv.textContent = priceData.namePrefix + product.name;
    }
  });
  
  
  // 전체 재계산
  handleCalculateCartStuff();
}


// 메인 함수 실행
main();


// 이벤트 리스너 등록
// 장바구니 추가 버튼 클릭 이벤트
addBtn.addEventListener("click", function () {
  var selItem = sel.value

  var hasItem = prodList.some(function(product) {
    return product.id === selItem;
  });
  if (!selItem || !hasItem) {
    return;
  }
  var itemToAdd = prodList.find(function(product) {
    return product.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd['id']);
    if (item) {
      var qtyElem = item.querySelector('.quantity-number')
      var newQty = parseInt(qtyElem['textContent']) + 1
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = createElement(CartItem({ item: itemToAdd, quantity: 1 }));
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    lastSel = selItem;
  }
});


// 장바구니 아이템 클릭 이벤트 (수량 변경, 삭제)
cartDisp.addEventListener("click", function (event) {
  var tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains("remove-item")) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId)

    var prod = prodList.find(function(product) {
      return product.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var qtyElem = itemElem.querySelector('.quantity-number');
      var currentQty = parseInt(qtyElem.textContent);
      var newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var qtyElem = itemElem.querySelector('.quantity-number');
      var remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});
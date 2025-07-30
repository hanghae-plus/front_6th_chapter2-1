// 데이터 임포트
import { products } from '../data/products.js';
import { createHeaderHTML } from './templates/header.js';
import { createMainGridHTML } from './mainGrid.js';
import { createManualButtonHTML, createManualOverlayHTML, setupManualEvents } from './templates/manual.js';

// 장바구니 상태 관리 객체
const CartState = {
  itemCnt: 0,
  lastSelected: null,
  totalAmt: 0,

  // 상태 초기화
  reset() {
    this.itemCnt = 0;
    this.lastSelected = null;
    this.totalAmt = 0;
  },

  // 아이템 수량 업데이트
  updateItemCount(count) {
    this.itemCnt = count;
  },

  // 마지막 선택 상품 업데이트
  updateLastSelected(productId) {
    this.lastSelected = productId;
  },

  // 총액 업데이트
  updateTotalAmount(amount) {
    this.totalAmt = amount;
  },
};

// 제품 ID 상수
const product_one = 'p1';
const product_two = 'p2';
const product_three = 'p3';
const product_four = 'p4';
const product_five = 'p5';

// 메인 함수 - 앱 초기화 및 UI 생성
function main() {
  // 전역 변수 초기화
  CartState.reset();

  // 루트 엘리먼트 생성
  const root = document.getElementById('app');

  root.innerHTML = `
    ${createHeaderHTML()}
    ${createMainGridHTML()}
    ${createManualButtonHTML()}
    ${createManualOverlayHTML()}
  `;

  // 초기 재고 계산
  // let initStock = 0;
  // for (let i = 0; i < products.length; i++) {
  //   initStock += products[i].q;
  // }

  setupManualEvents();

  // 초기 설정 함수 호출
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  // 번개세일 타이머 설정
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);

  // 추천 상품 타이머 설정
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
        return;
      }
      if (CartState.lastSelected) {
        let suggest = null;
        for (let k = 0; k < products.length; k++) {
          if (products[k].id !== CartState.lastSelected) {
            if (products[k].q > 0) {
              if (!products[k].suggestSale) {
                suggest = products[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
          suggest.suggestSale = true;
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
// 제품 옵션 업데이트 함수 - 드롭다운 선택 옵션을 갱신
function onUpdateSelectOptions() {
  let opt;
  let discountText;

  // 선택자 요소 초기화
  const selector = document.getElementById('product-select');
  selector.innerHTML = '';

  // 전체 재고 계산
  let totalStock = 0;
  for (let idx = 0; idx < products.length; idx++) {
    const _p = products[idx];
    totalStock = totalStock + _p.q;
  }

  // 제품별 옵션 생성
  for (let i = 0; i < products.length; i++) {
    (function () {
      const item = products[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';

      // 할인 표시 텍스트 생성
      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      // 품절 상품 처리
      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        // 할인 상품별 표시 방식
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      selector.appendChild(opt);
    })();
  }

  // 재고 부족 시 시각적 표시
  if (totalStock < 50) {
    selector.style.borderColor = 'orange';
  } else {
    selector.style.borderColor = '';
  }
}
// 장바구니 계산 메인 함수 - 총액, 할인, 포인트 등 모든 계산을 처리
function handleCalculateCartStuff() {
  // 지역 변수 선언
  let subTot;
  let idx;
  let savedAmount;
  const summaryDetails = document.getElementById('summary-details'); // let → const
  const loyaltyPointsDiv = document.getElementById('loyalty-points'); // let → const
  let points;
  const discountInfoDiv = document.getElementById('discount-info');
  const itemCountElement = document.getElementById('item-count');
  let previousCount;
  let stockMsg;

  // CartState 초기화
  CartState.updateTotalAmount(0);
  CartState.updateItemCount(0);

  // 장바구니 아이템들 가져오기
  const cartDisp = document.getElementById('cart-items');
  const cartItems = cartDisp.children;
  subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];

  // 재고 부족 상품 찾기
  for (idx = 0; idx < products.length; idx++) {
    if (products[idx].q < 5 && products[idx].q > 0) {
      lowStockItems.push(products[idx].name);
    }
  }

  // 장바구니 아이템별 계산 처리
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      // 현재 아이템 찾기
      let curItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }

      // 수량 및 가격 계산
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * quantity;
      let disc = 0;
      CartState.updateItemCount(CartState.itemCnt + quantity);
      subTot += itemTot;

      // 수량에 따른 시각적 효과 적용
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });

      // 대량 구매 할인 적용 (10개 이상)
      if (quantity >= 10) {
        if (curItem.id === product_one) {
          disc = 10 / 100;
        } else {
          if (curItem.id === product_two) {
            disc = 15 / 100;
          } else {
            if (curItem.id === product_three) {
              disc = 20 / 100;
            } else {
              if (curItem.id === product_four) {
                disc = 5 / 100;
              } else {
                if (curItem.id === product_five) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      CartState.updateTotalAmount(CartState.totalAmt + itemTot * (1 - disc));
    })();
  }

  // 대량 구매 할인 적용 (30개 이상)
  let discRate = 0;
  const originalTotal = subTot;
  if (CartState.itemCnt >= 30) {
    CartState.updateTotalAmount((subTot * 75) / 100);
    discRate = 25 / 100;
  } else {
    discRate = (subTot - CartState.totalAmt) / subTot;
  }

  // 화요일 특별 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');

  if (isTuesday) {
    if (CartState.totalAmt > 0) {
      CartState.updateTotalAmount((CartState.totalAmt * 90) / 100);
      discRate = 1 - CartState.totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 아이템 카운트 업데이트
  document.getElementById('item-count').textContent = '🛍️ ' + CartState.itemCnt + ' items in cart';

  // 주문 요약 섹션 업데이트
  //summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    // 개별 아이템 표시
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 소계 표시
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (CartState.itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 표시
    if (isTuesday) {
      if (CartState.totalAmt > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }

    // 배송비 정보 표시
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  // 총액 표시 업데이트
  const cartTotal = document.getElementById('cart-total');
  const totalDiv = cartTotal.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(CartState.totalAmt).toLocaleString();
  }

  // 적립 포인트 표시 업데이트
  //loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(CartState.totalAmt / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  // 할인 정보 섹션 업데이트
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && CartState.totalAmt > 0) {
    savedAmount = originalTotal - CartState.totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }

  // 아이템 카운트 변경 표시
  // itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + CartState.itemCnt + ' items in cart';
    if (previousCount !== CartState.itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }

  // 재고 정보 메시지 생성
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
    const item = products[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  const stockInfo = document.getElementById('stock-status');
  stockInfo.textContent = stockMsg;

  // 하위 함수들 호출
  handleStockInfoUpdate();
  doRenderBonusPoints();
}
// 보너스 포인트 렌더링 함수 - 다양한 조건에 따른 적립 포인트 계산 및 표시
const doRenderBonusPoints = function () {
  // 빈 장바구니일 때 처리
  const cartDisp = document.getElementById('cart-items');
  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }

  // 기본 포인트 계산 (구매액의 0.1%)
  const basePoints = Math.floor(CartState.totalAmt / 1000);
  let finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  // 화요일 2배 적립
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합별 보너스 포인트 체크
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  const nodes = cartDisp.children;

  for (const node of nodes) {
    let product = null;
    for (let pIdx = 0; pIdx < products.length; pIdx++) {
      if (products[pIdx].id === node.id) {
        product = products[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === product_one) {
      hasKeyboard = true;
    } else if (product.id === product_two) {
      hasMouse = true;
    } else if (product.id === product_three) {
      hasMonitorArm = true;
    }
  }

  // 키보드 + 마우스 세트 보너스
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 구매 보너스
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스 (수량별)
  if (CartState.itemCnt >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (CartState.itemCnt >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (CartState.itemCnt >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  // 포인트 표시 업데이트
  const bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
// 전체 재고 계산 함수
function onGetStockTotal() {
  let sum;
  let i;
  let currentProduct;

  sum = 0;
  for (i = 0; i < products.length; i++) {
    currentProduct = products[i];
    sum += currentProduct.q;
  }
  return sum;
}

// 재고 정보 업데이트 함수
const handleStockInfoUpdate = function () {
  let infoMsg;
  //let totalStock;
  //let messageOptimizer;

  infoMsg = '';
  const totalStock = onGetStockTotal();

  // 재고 부족 시 처리 (30개 미만)
  if (totalStock < 30) {
    //console.log('전체 재고가 30개 미만입니다.');
  }

  // 개별 상품 재고 상태 체크
  products.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });

  const stockInfo = document.getElementById('stock-status');
  stockInfo.textContent = infoMsg;
};
// 장바구니 내 상품 가격 업데이트 함수 - 할인 상태 변경 시 호출
function doUpdatePricesInCart() {
  let j = 0;

  const cartDisp = document.getElementById('cart-items');

  // 총 아이템 수량 계산 (첫 번째 방법)
  while (cartDisp.children[j]) {
    j++;
  }

  // 장바구니 아이템들의 가격 표시 업데이트
  const cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;

    // 해당 상품 정보 찾기
    for (let productIdx = 0; productIdx < products.length; productIdx++) {
      if (products[productIdx].id === itemId) {
        product = products[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      // 할인 상태에 따른 가격 및 이름 표시
      if (product.onSale && product.suggestSale) {
        // 번개세일 + 추천 할인
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        // 번개세일만
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        // 추천 할인만
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        // 할인 없음
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }

  // 전체 계산 재실행
  handleCalculateCartStuff();
}
// 앱 초기화
main();

// 장바구니 추가 버튼 이벤트 리스너
document.getElementById('add-to-cart').addEventListener('click', function () {
  const cartDisp = document.getElementById('cart-items'); // ID로 가져오기
  const selector = document.getElementById('product-select');
  const selItem = selector.value;
  let hasItem = false;

  // 선택된 상품이 유효한지 확인
  for (let idx = 0; idx < products.length; idx++) {
    if (products[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }

  if (!selItem || !hasItem) {
    return;
  }

  // 선택된 상품 정보 찾기
  let itemToAdd = null;
  for (let j = 0; j < products.length; j++) {
    if (products[j].id === selItem) {
      itemToAdd = products[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.q > 0) {
    // 이미 장바구니에 있는 상품인지 확인
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      // 기존 상품 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로운 상품을 장바구니에 추가
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? '⚡💝' : itemToAdd.onSale ? '⚡' : itemToAdd.suggestSale ? '💝' : ''}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? '<span class="line-through text-gray-400">₩' + itemToAdd.originalVal.toLocaleString() + '</span> <span class="' + (itemToAdd.onSale && itemToAdd.suggestSale ? 'text-purple-600' : itemToAdd.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + itemToAdd.val.toLocaleString() + '</span>' : '₩' + itemToAdd.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }

    // 계산 및 마지막 선택 상품 업데이트
    handleCalculateCartStuff();
    CartState.updateLastSelected(selItem);
  }
});

// 장바구니 아이템 클릭 이벤트 리스너 (수량 변경, 삭제)
document.getElementById('cart-items').addEventListener('click', function (event) {
  const tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 정보 찾기
    for (let prdIdx = 0; prdIdx < products.length; prdIdx++) {
      if (products[prdIdx].id === prodId) {
        prod = products[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains('quantity-change')) {
      // 수량 변경 처리
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        // 수량이 0 이하가 되면 아이템 삭제
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // 아이템 삭제 처리
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }

    // 재고 부족 체크
    if (prod && prod.q < 5) {
      //console.log(`재고 부족: ${prod.name} (${prod.q}개 남음)`); // 빈 블록 수정
    }

    // 계산 및 옵션 업데이트
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
});

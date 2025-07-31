// 상수 import
import { PRODUCT_IDS, DISCOUNT_RATES, TIME_INTERVALS } from './constants.js';

// 유틸리티 함수 import
import {
  updateProductSelectOptions,
  findProductById,
  hasStock,
  isOnSale,
  getProductNamePrefix,
  getPriceColorClass,
} from './utils/productUtils.js';
import {
  calculateCart,
  getCartItemQuantity,
  setCartItemQuantity,
  findCartItem,
  isValidQuantityChange,
} from './utils/cartUtils.js';

// 컴포넌트 import
import { createApp } from './components/App.js';
import { createCartItem } from './components/CartDisplay.js';

/**
 * 쇼핑 카트 애플리케이션을 생성하는 클로저 함수
 * @returns {Object} 애플리케이션 인스턴스
 */
function createShoppingCartApp() {
  // ===== 클로저 내부 상태 변수들 (기존 전역 변수들) =====
  let prodList;
  let lastSel;
  let sel;
  let addBtn;
  let cartDisp;

  // ===== UI 업데이트 함수들 =====

  /**
   * 장바구니 아이템의 가격과 이름을 업데이트하는 함수
   * @param {Element} cartItem - 장바구니 아이템 요소
   * @param {Object} product - 상품 객체
   */
  function updateCartItemDisplay(cartItem, product) {
    const priceDiv = cartItem.querySelector('.text-lg');
    const nameDiv = cartItem.querySelector('h3');

    if (!priceDiv || !nameDiv) return;

    // 가격 표시 업데이트
    if (isOnSale(product)) {
      const colorClass = getPriceColorClass(product);
      priceDiv.innerHTML = `
        <span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> 
        <span class="${colorClass}">₩${product.val.toLocaleString()}</span>
      `;
    } else {
      priceDiv.textContent = `₩${product.val.toLocaleString()}`;
    }

    // 이름 표시 업데이트
    const namePrefix = getProductNamePrefix(product);
    nameDiv.textContent = namePrefix + product.name;
  }

  /**
   * 장바구니의 모든 아이템 가격을 업데이트하는 함수
   */
  function doUpdatePricesInCart() {
    const cartItems = cartDisp.children;
    for (let i = 0; i < cartItems.length; i++) {
      const itemId = cartItems[i].id;
      const product = findProductById(prodList, itemId);
      if (product) {
        updateCartItemDisplay(cartItems[i], product);
      }
    }
    calculateCart(prodList, cartDisp);
  }

  // ===== 상태 관리 함수들 =====

  /**
   * 상품을 장바구니에 추가하는 함수
   * @param {Object} product - 추가할 상품
   */
  function addProductToCart(product) {
    const existingItem = findCartItem(cartDisp, product.id);

    if (existingItem) {
      // 기존 아이템 수량 증가
      const currentQty = getCartItemQuantity(existingItem);
      const newQty = currentQty + 1;

      if (isValidQuantityChange(newQty, product.q, currentQty)) {
        setCartItemQuantity(existingItem, newQty);
        product.q--;
      } else {
        alert('재고가 부족합니다.');
        return false;
      }
    } else {
      // 새 아이템 추가
      const newItem = createCartItem(product, 1);
      cartDisp.appendChild(newItem);
      product.q--;
    }

    calculateCart(prodList, cartDisp);
    lastSel = product.id;
    return true;
  }

  /**
   * 장바구니 아이템 수량을 변경하는 함수
   * @param {Element} itemElem - 장바구니 아이템 요소
   * @param {Object} product - 상품 객체
   * @param {number} quantityChange - 수량 변경값
   */
  function changeCartItemQuantity(itemElem, product, quantityChange) {
    const currentQty = getCartItemQuantity(itemElem);
    const newQty = currentQty + quantityChange;

    if (newQty > 0 && isValidQuantityChange(newQty, product.q, currentQty)) {
      setCartItemQuantity(itemElem, newQty);
      product.q -= quantityChange;
    } else if (newQty <= 0) {
      // 수량이 0 이하면 아이템 제거
      product.q += currentQty;
      itemElem.remove();
    } else {
      alert('재고가 부족합니다.');
    }
  }

  /**
   * 장바구니 아이템을 제거하는 함수
   * @param {Element} itemElem - 장바구니 아이템 요소
   * @param {Object} product - 상품 객체
   */
  function removeCartItem(itemElem, product) {
    const quantity = getCartItemQuantity(itemElem);
    product.q += quantity;
    itemElem.remove();
  }

  // ===== 이벤트 핸들러 함수들 =====

  /**
   * 장바구니 추가 버튼 클릭 이벤트 핸들러
   */
  function handleAddToCart() {
    const selItem = sel.value;
    if (!selItem) {
      return;
    }

    const itemToAdd = findProductById(prodList, selItem);
    if (itemToAdd && hasStock(itemToAdd)) {
      addProductToCart(itemToAdd);
    }
  }

  /**
   * 장바구니 아이템 클릭 이벤트 핸들러
   * @param {Event} event - 클릭 이벤트
   */
  function handleCartItemClick(event) {
    const target = event.target;

    if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
      return;
    }

    const productId = target.dataset.productId;
    const itemElem = document.getElementById(productId);
    const product = findProductById(prodList, productId);

    if (!product || !itemElem) return;

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      changeCartItemQuantity(itemElem, product, qtyChange);
    } else if (target.classList.contains('remove-item')) {
      removeCartItem(itemElem, product);
    }

    calculateCart(prodList, cartDisp);
    updateProductSelectOptions(prodList, sel);
  }

  // ===== 초기화 함수들 =====

  /**
   * 애플리케이션 초기화 함수
   */
  function init() {
    let lightningDelay;
    lastSel = null;

    // 상품 데이터 초기화
    prodList = [
      {
        id: PRODUCT_IDS.KEYBOARD,
        name: '버그 없애는 키보드',
        val: 10000,
        originalVal: 10000,
        q: 50,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MOUSE,
        name: '생산성 폭발 마우스',
        val: 20000,
        originalVal: 20000,
        q: 30,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.MONITOR_ARM,
        name: '거북목 탈출 모니터암',
        val: 30000,
        originalVal: 30000,
        q: 20,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.LAPTOP_CASE,
        name: '에러 방지 노트북 파우치',
        val: 15000,
        originalVal: 15000,
        q: 0,
        onSale: false,
        suggestSale: false,
      },
      {
        id: PRODUCT_IDS.SPEAKER,
        name: `코딩할 때 듣는 Lo-Fi 스피커`,
        val: 25000,
        originalVal: 25000,
        q: 10,
        onSale: false,
        suggestSale: false,
      },
    ];

    // UI 컴포넌트 초기화
    const app = createApp();
    sel = app.productSelector.select;
    addBtn = app.productSelector.addButton;
    cartDisp = app.cartDisplay;

    // 초기 상태 업데이트
    updateProductSelectOptions(prodList, sel);
    calculateCart(prodList, cartDisp);

    // 이벤트 리스너 등록
    addBtn.addEventListener('click', handleAddToCart);
    cartDisp.addEventListener('click', handleCartItemClick);

    // 번개세일 타이머 설정
    lightningDelay = Math.random() * TIME_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY;
    setTimeout(() => {
      setInterval(function () {
        var luckyIdx = Math.floor(Math.random() * prodList.length);
        var luckyItem = prodList[luckyIdx];
        if (luckyItem.q > 0 && !luckyItem.onSale) {
          luckyItem.val = Math.round(luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE_DISCOUNT));
          luckyItem.onSale = true;
          alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          updateProductSelectOptions(prodList, sel);
          doUpdatePricesInCart();
        }
      }, TIME_INTERVALS.LIGHTNING_SALE_DELAY);
    }, lightningDelay);

    // 추천 상품 타이머 설정
    setTimeout(function () {
      setInterval(function () {
        if (lastSel) {
          var suggest = null;
          for (var k = 0; k < prodList.length; k++) {
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
            suggest.val = Math.round(suggest.val * (1 - DISCOUNT_RATES.SUGGESTION_DISCOUNT));
            suggest.suggestSale = true;
            updateProductSelectOptions(prodList, sel);
            doUpdatePricesInCart();
          }
        }
      }, TIME_INTERVALS.SUGGESTION_DELAY);
    }, Math.random() * TIME_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY);
  }

  // 클로저에서 노출할 API 반환
  return {
    init: init,
  };
}

// 애플리케이션 생성 및 시작
const shoppingCartApp = createShoppingCartApp();
shoppingCartApp.init();

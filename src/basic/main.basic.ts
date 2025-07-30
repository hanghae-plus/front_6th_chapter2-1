// 유틸리티 함수 import
// 렌더 함수 import
import {App, rerenderUI} from './render.js'

// 비즈니스 로직 import
import {
  addToCart,
  applyLightningSale,
  applySuggestionSale,
  canAddToCart,
  createInitialProducts,
  getAvailableStock,
  removeFromCart,
  updateCartQuantity,
  updateProductStock
} from './entities.js'

import {useCart, useLastSelected, useProducts} from "./hooks.ts"

// 번개세일 타이머 설정 (useEffect)
export function useLightningSaleTimer() {
  const lightningDelay = Math.random() * 10000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const { products, setProducts } = useProducts();
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // setState 패턴으로 상태 업데이트
        setProducts(applyLightningSale(products, luckyItem.id));
        rerenderUI();

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
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
export function useSuggestSaleTimer() {
  const suggestionDelay = Math.random() * 20000;

  let intervalId
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      if (cartDisplay.children.length === 0) {
        return;
      }
      const { lastSel } = useLastSelected();
      if (lastSel) {
        const { products, setProducts } = useProducts();
        const suggest = products.find(product => product.id !== lastSel &&
          product.quantity > 0 &&
          !product.suggestSale);
        if (suggest) {
          // setState 패턴으로 상태 업데이트
          setProducts(applySuggestionSale(products, suggest.id, lastSel));
          rerenderUI();

          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
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


// DOM 요소 참조 변수
let productSelect: HTMLSelectElement;
let addToCartButton: HTMLButtonElement;
let cartDisplay: HTMLDivElement;
let stockInfoDisplay: HTMLDivElement;

// 메인 초기화 함수
function main() {
  // DOM 요소 생성
  const root = document.getElementById('app')
  if (!root) {
    throw new Error('Root element not found');
  }

  // 전역 상태 초기화
  const { setProducts } = useProducts();
  const { setLastSel } = useLastSelected();

  setLastSel(null);
  setProducts(createInitialProducts())

  // 초기 렌더링
  root.innerHTML = App();

  // DOM 요소 참조 설정
  productSelect = document.getElementById('product-select') as HTMLSelectElement;
  addToCartButton = document.getElementById('add-to-cart') as HTMLButtonElement;
  cartDisplay = document.getElementById('cart-items') as HTMLDivElement;
  stockInfoDisplay = document.getElementById('stock-status') as HTMLDivElement;

  // 이벤트
  addToCartButton?.addEventListener("click", handleAddToCart);
  cartDisplay?.addEventListener("click", handleCartItemClick);

  // 타이머 설정 (useEffect 패턴)
  useLightningSaleTimer();
  useSuggestSaleTimer();

  // 초기 UI 업데이트
  rerenderUI()
}

// 메인 함수 실행
main();


// 장바구니 추가 핸들러
function handleAddToCart() {
  const { cart, setCart, getItemQuantity } = useCart();
  const { products, setProducts } = useProducts();
  const { setLastSel } = useLastSelected()

  const selectedItemId = productSelect.value
  if (!selectedItemId) {
    return;
  }

  const itemToAdd = products.find(product => product.id === selectedItemId)
  if (!itemToAdd) {
    return;
  }

  if (itemToAdd.quantity <= 0) {
    return;
  }

  const currentQuantity = getItemQuantity(selectedItemId)

  // cart 업데이트 (순수 함수 사용)
  if (!canAddToCart(itemToAdd, currentQuantity, 1)) {
    alert('재고가 부족합니다.')
    return
  }

  setCart(addToCart(cart, selectedItemId, 1))
  setProducts(updateProductStock(products, selectedItemId, -1))
  setLastSel(selectedItemId)

  rerenderUI()
}

// 수량 변경 핸들러
function handleQuantityChange(productId: string, quantityChange: number) {
  const { cart, setCart, getItemQuantity, hasItem } = useCart();
  const { products, setProducts } = useProducts();
  
  const product = products.find(product => product.id === productId);
  if (!product || !hasItem(productId)) return;
  
  const currentQuantity = getItemQuantity(productId);
  const newQuantity = currentQuantity + quantityChange;
  
  if (newQuantity > 0) {
    const availableStock = getAvailableStock(product, currentQuantity);
    if (newQuantity <= availableStock) {
      // cart 업데이트 + 재고 업데이트
      setCart(updateCartQuantity(cart, productId, newQuantity));
      setProducts(updateProductStock(products, productId, -quantityChange));
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    // 수량이 0이 되면 아이템 제거, 재고 복구
    setCart(removeFromCart(cart, productId));
    setProducts(updateProductStock(products, productId, currentQuantity));
  }
  
  rerenderUI();
}

// 아이템 제거 핸들러
function handleRemoveItem(productId: string) {
  const { cart, setCart, getItemQuantity } = useCart();
  const { products, setProducts } = useProducts();
  
  const removeQuantity = getItemQuantity(productId);
  if (!removeQuantity) return;
  
  // cart에서 제거 / 재고 복구
  setCart(removeFromCart(cart, productId));
  setProducts(updateProductStock(products, productId, removeQuantity));
  
  rerenderUI();
}

// 장바구니 아이템 클릭 이벤트 위임 핸들러
function handleCartItemClick(event: Event) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('quantity-change')) {
    const productId = target.dataset.productId;
    const quantityChange = parseInt(target.dataset.change || '0');
    if (productId) {
      handleQuantityChange(productId, quantityChange);
    }
    return
  }

  if (target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    if (productId) {
      handleRemoveItem(productId);
    }
    return
  }
}
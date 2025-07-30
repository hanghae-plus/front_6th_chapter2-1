import {createInitialProducts} from './src/entities.js'
import {useLastSelected, useProducts} from "./src/hooks.ts"
import {handleAddToCart, handleCartItemClick} from "./src/events.ts"
import {useLightingSale, useSuggestSaleTimer} from "./src/effects.ts"
import {App, rerenderUI} from './src/render.js'

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

  // 바인드 이벤트
  const addToCartButton = root.querySelector('#add-to-cart') as HTMLButtonElement;
  const cartDisplay = root.querySelector('#cart-items') as HTMLDivElement;
  addToCartButton?.addEventListener("click", handleAddToCart);
  cartDisplay?.addEventListener("click", handleCartItemClick);

  // 타이머 설정 (useEffect 패턴)
  useLightingSale();
  useSuggestSaleTimer();

  // 초기 UI 업데이트
  rerenderUI()
}

// 메인 함수 실행
main();
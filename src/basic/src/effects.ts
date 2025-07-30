// 번개세일 타이머 설정 (useEffect)
import {useCart, useLastSelected, useProducts} from "./hooks.ts"
import {applyLightningSale, applySuggestionSale} from "./entities.ts"
import {rerenderUI} from "./render.ts"

export function useLightingSale() {
  const lightningDelay = Math.random() * 10000

  let intervalId: number
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const {products, setProducts} = useProducts()
      const luckyIdx = Math.floor(Math.random() * products.length)
      const luckyItem = products[luckyIdx]
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        // setState 패턴으로 상태 업데이트
        setProducts(applyLightningSale(products, luckyItem.id))
        rerenderUI()

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, lightningDelay)

  // cleanup 함수 반환
  return () => {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
  }
}

// 추천 할인 타이머 설정 (useEffect - lastSel 의존성)
export function useSuggestSaleTimer() {
  const suggestionDelay = Math.random() * 20000

  let intervalId: number
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const {isEmpty} = useCart()
      if (isEmpty) {
        return
      }
      const {lastSel} = useLastSelected()
      if (lastSel) {
        const {products, setProducts} = useProducts()
        const suggest = products.find(product => product.id !== lastSel &&
          product.quantity > 0 &&
          !product.suggestSale)
        if (suggest) {
          // setState 패턴으로 상태 업데이트
          setProducts(applySuggestionSale(products, suggest.id, lastSel))
          rerenderUI()

          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, suggestionDelay)

  // cleanup 함수 반환
  return () => {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
  }
}
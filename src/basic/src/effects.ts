import {useCart, useLastSelected, useProducts} from "./hooks.ts"
import {applyLightningSale, applySuggestionSale} from "./entities.ts"
import {rerenderUI} from "./render.ts"

/**
 * 번개세일 타이머
 * 요구사항: 0-10초 사이 랜덤 시작, 30초마다 랜덤 상품 20% 할인
 * 재고가 있고 이미 세일 중이 아닌 상품만 대상
 */
export function useLightingSale() {
  const lightningDelay = Math.random() * 10000

  let intervalId: number
  const timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      const {products, setProducts} = useProducts()
      const luckyIdx = Math.floor(Math.random() * products.length)
      const luckyItem = products[luckyIdx]
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        setProducts(applyLightningSale(products, luckyItem.id))
        rerenderUI()

        alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, lightningDelay)

  return () => {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
  }
}

/**
 * 추천 할인 타이머
 * 요구사항: 0-20초 사이 랜덤 시작, 60초마다 마지막 선택 상품과 다른 상품 5% 할인
 * 장바구니가 비어있지 않고, 재고가 있으며 이미 추천 중이 아닌 상품만 대상
 */
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
          setProducts(applySuggestionSale(products, suggest.id, lastSel))
          rerenderUI()

          alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)
        }
      }
    }, 60000)
  }, suggestionDelay)

  return () => {
    clearTimeout(timeoutId)
    clearInterval(intervalId)
  }
}
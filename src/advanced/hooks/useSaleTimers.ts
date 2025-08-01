import { useEffect, useCallback } from 'react'
import { useCart } from './useCart'
import { DISCOUNT_RATES, TIMERS } from '../constants'

export function useSaleTimers() {
  const { products, cartItems, lastSelectedProductId, updateProduct } = useCart()

  // 번개세일 로직
  const startLightningSale = useCallback(() => {
    const availableProducts = products.filter((p) => p.stock > 0 && !p.onSale)

    if (availableProducts.length === 0) return

    const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)]
    const newPrice = Math.round(randomProduct.originalPrice * (1 - DISCOUNT_RATES.LIGHTNING))

    updateProduct(randomProduct.id, {
      price: newPrice,
      onSale: true,
    })

    alert(`⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`)
  }, [products, updateProduct])

  // 추천세일 로직
  const startRecommendSale = useCallback(() => {
    if (Object.keys(cartItems).length === 0 || !lastSelectedProductId) return

    const recommendableProducts = products.filter(
      (p) => p.id !== lastSelectedProductId && p.stock > 0 && !p.recommendSale
    )

    if (recommendableProducts.length === 0) return

    const recommendProduct = recommendableProducts[0]
    const newPrice = Math.round(recommendProduct.price * (1 - DISCOUNT_RATES.RECOMMEND))

    alert(`💝 ${recommendProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`)

    updateProduct(recommendProduct.id, {
      price: newPrice,
      recommendSale: true,
    })
  }, [products, cartItems, lastSelectedProductId, updateProduct])

  // 번개세일 타이머 설정
  useEffect(() => {
    const delay = Math.random() * TIMERS.LIGHTNING_SALE_MAX_DELAY

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        startLightningSale()
      }, TIMERS.LIGHTNING_SALE_INTERVAL)

      // cleanup을 위해 interval ID 저장
      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [startLightningSale])

  // 추천세일 타이머 설정
  useEffect(() => {
    const delay = Math.random() * TIMERS.RECOMMEND_SALE_MAX_DELAY

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        startRecommendSale()
      }, TIMERS.RECOMMEND_SALE_INTERVAL)

      // cleanup을 위해 interval ID 저장
      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [startRecommendSale])

  // 이 훅은 side effect만 수행하므로 반환값 없음
}
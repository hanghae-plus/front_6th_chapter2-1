import { useState, useCallback, useEffect } from 'react'
import { Product } from '../types'
import { 
  initializeState, 
  getProducts as getProductsFromState, 
  getProduct as getProductFromState, 
  getCartItems as getCartItemsFromState, 
  getTotalAmount, 
  getTotalQuantity, 
  getBonusPoints, 
  setCartQuantity, 
  updateProduct as updateProductInState, 
  setLastSelectedProductId 
} from '../store/state'
import { updateCart as updateCartService } from '../services/discount'
// ❌ updateProductOptions는 DOM 조작하므로 제거
// import { updateProductOptions as updateProductOptionsService } from '../services/product'

export function useShoppingCartState() {
  const [, forceUpdate] = useState({})

  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  useEffect(() => {
    initializeState()
  }, [])

  const addToCart = useCallback((productId: string) => {
    const product = getProductFromState(productId)
    if (!product) {
      console.error(`Product not found: ${productId}`)
      return
    }

    if (product.stock === 0) {
      alert('재고가 부족합니다.')
      return
    }

    const cartItems = getCartItemsFromState()
    const currentQuantity = cartItems[productId] || 0

    setCartQuantity(productId, currentQuantity + 1)
    updateProductInState(productId, { stock: product.stock - 1 })
    setLastSelectedProductId(productId)
    updateCartService()
    // ❌ updateProductOptionsService() 제거 - React가 자동으로 리렌더링
    triggerUpdate()
  }, [triggerUpdate])

  const changeQuantity = useCallback((productId: string, change: number) => {
    const product = getProductFromState(productId)
    if (!product) {
      console.error(`Product not found: ${productId}`)
      return
    }

    const cartItems = getCartItemsFromState()
    const currentQuantity = cartItems[productId] || 0
    const newQuantity = currentQuantity + change

    if (newQuantity <= 0) {
      setCartQuantity(productId, 0)
      updateProductInState(productId, { stock: product.stock + currentQuantity })
    } else {
      if (change > 0 && product.stock === 0) {
        alert('재고가 부족합니다.')
        return
      }
      setCartQuantity(productId, newQuantity)
      updateProductInState(productId, { stock: product.stock - change })
    }

    updateCartService()
    // ❌ updateProductOptionsService() 제거
    triggerUpdate()
  }, [triggerUpdate])

  const removeFromCart = useCallback((productId: string) => {
    const product = getProductFromState(productId)
    if (!product) {
      console.error(`Product not found: ${productId}`)
      return
    }

    const cartItems = getCartItemsFromState()
    const quantity = cartItems[productId] || 0

    updateProductInState(productId, { stock: product.stock + quantity })
    setCartQuantity(productId, 0)

    updateCartService()
    // ❌ updateProductOptionsService() 제거
    triggerUpdate()
  }, [triggerUpdate])

  const updateCart = useCallback(() => {
    updateCartService()
    triggerUpdate()
  }, [triggerUpdate])

  // ❌ updateProductOptions 제거 - React 컴포넌트에서 자동 처리
  const updateProductOptions = useCallback(() => {
    // React에서는 상태 변경 시 자동으로 리렌더링되므로 
    // DOM 조작이 필요 없음
    triggerUpdate()
  }, [triggerUpdate])

  return {
    getProducts: getProductsFromState,
    getProduct: getProductFromState,
    getCartItems: getCartItemsFromState,
    getTotalAmount,
    getTotalQuantity,
    getBonusPoints,
    addToCart,
    changeQuantity,
    removeFromCart,
    updateCart,
    updateProductOptions, // 빈 함수로 유지 (호환성 위해)
  }
}
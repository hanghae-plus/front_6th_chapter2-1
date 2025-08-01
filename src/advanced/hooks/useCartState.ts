import { useState, useCallback, useEffect } from 'react'
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
    triggerUpdate()
  }, [triggerUpdate])

  const updateCart = useCallback(() => {
    updateCartService()
    triggerUpdate()
  }, [triggerUpdate])

  const updateProductOptions = useCallback(() => {
    // React에서는 상태 변경 시 자동으로 리렌더링되므로 
    // 단순히 리렌더링만 트리거
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
    updateProductOptions,
  }
}
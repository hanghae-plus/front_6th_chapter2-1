import { useCallback, useEffect } from 'react'
import { useShoppingCartContext } from '../context/ShoppingCartContext'
import { calculateFinalAmount } from '../services/discount'
import { calculateBonusPoints } from '../services/points'
import { canAddToCart, canChangeQuantity, updateProductStock, updateCartQuantity } from '../services/cart'

export function useCart() {
  const {
    state,
    setProducts,
    setCartItems,
    setTotalAmount,
    setTotalQuantity,
    setBonusPoints,
    setLastSelectedProductId,
  } = useShoppingCartContext()

  // 장바구니 업데이트 로직
  const updateCart = useCallback(() => {
    const result = calculateFinalAmount(state.cartItems, state.products)
    const newBonusPoints = calculateBonusPoints(result.totalAmount, result.totalQuantity, state.cartItems)

    setTotalAmount(result.totalAmount)
    setTotalQuantity(result.totalQuantity)
    setBonusPoints(newBonusPoints)
  }, [state.cartItems, state.products, setTotalAmount, setTotalQuantity, setBonusPoints])

  // 자동 업데이트
  useEffect(() => {
    updateCart()
  }, [updateCart])

  // 장바구니에 추가
  const addToCart = useCallback((productId: string) => {
    const product = state.products.find(p => p.id === productId)
    if (!product || !canAddToCart(product)) {
      alert('재고가 부족합니다.')
      return
    }

    // 장바구니 업데이트
    const currentQuantity = state.cartItems[productId] || 0
    const newCartItems = updateCartQuantity(state.cartItems, productId, currentQuantity + 1)
    setCartItems(newCartItems)

    // 재고 업데이트
    const newProducts = updateProductStock(state.products, productId, -1)
    setProducts(newProducts)
    
    setLastSelectedProductId(productId)
  }, [state.products, state.cartItems, setCartItems, setProducts, setLastSelectedProductId])

  // 수량 변경
  const changeQuantity = useCallback((productId: string, change: number) => {
    const product = state.products.find(p => p.id === productId)
    if (!product) return

    const currentQuantity = state.cartItems[productId] || 0
    const newQuantity = currentQuantity + change

    if (newQuantity <= 0) {
      // 제거
      const newCartItems = updateCartQuantity(state.cartItems, productId, 0)
      setCartItems(newCartItems)
      
      const newProducts = updateProductStock(state.products, productId, currentQuantity)
      setProducts(newProducts)
    } else {
      if (!canChangeQuantity(product, change)) {
        alert('재고가 부족합니다.')
        return
      }

      // 수량 변경
      const newCartItems = updateCartQuantity(state.cartItems, productId, newQuantity)
      setCartItems(newCartItems)
      
      const newProducts = updateProductStock(state.products, productId, -change)
      setProducts(newProducts)
    }
  }, [state.products, state.cartItems, setCartItems, setProducts])

  // 제거
  const removeFromCart = useCallback((productId: string) => {
    const quantity = state.cartItems[productId] || 0
    
    // 장바구니에서 제거
    const newCartItems = updateCartQuantity(state.cartItems, productId, 0)
    setCartItems(newCartItems)
    
    // 재고 복구
    const newProducts = updateProductStock(state.products, productId, quantity)
    setProducts(newProducts)
  }, [state.cartItems, state.products, setCartItems, setProducts])

  // 상품 업데이트 (세일 등)
  const updateProduct = useCallback((productId: string, updates: Partial<import('../types').Product>) => {
    const newProducts = state.products.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    )
    setProducts(newProducts)
  }, [state.products, setProducts])

  return {
    // 상태
    ...state,
    
    // 액션들
    addToCart,
    changeQuantity,
    removeFromCart,
    updateProduct,
    updateCart,
  }
}
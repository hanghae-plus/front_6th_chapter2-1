import { useCallback, useEffect } from 'react'
import { useProductContext } from './ProductContext'
import { useCartContext } from './CartContext'
import { calculateFinalAmount } from '../services/discount'
import { calculateBonusPoints } from '../services/points'
import { canAddToCart, canChangeQuantity, updateProductStock, updateCartQuantity } from '../services/cart'

export function useCart() {
  // 두 개의 분리된 Context 사용
  const productContext = useProductContext()
  const cartContext = useCartContext()

  // 상태들
  const { products } = productContext.state
  const { cartItems, totalAmount, totalQuantity, bonusPoints, lastSelectedProductId } = cartContext.state

  // 장바구니 업데이트 로직
  const updateCart = useCallback(() => {
    const result = calculateFinalAmount(cartItems, products)
    const newBonusPoints = calculateBonusPoints(result.totalAmount, result.totalQuantity, cartItems)

    cartContext.setTotalAmount(result.totalAmount)
    cartContext.setTotalQuantity(result.totalQuantity)
    cartContext.setBonusPoints(newBonusPoints)
  }, [cartItems, products, cartContext])

  // 자동 업데이트
  useEffect(() => {
    updateCart()
  }, [updateCart])

  // 장바구니에 추가
  const addToCart = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product || !canAddToCart(product)) {
      alert('재고가 부족합니다.')
      return
    }

    // 장바구니 업데이트 (CartContext)
    const currentQuantity = cartItems[productId] || 0
    const newCartItems = updateCartQuantity(cartItems, productId, currentQuantity + 1)
    cartContext.setCartItems(newCartItems)

    // 재고 업데이트 (ProductContext)
    const newProducts = updateProductStock(products, productId, -1)
    productContext.setProducts(newProducts)
    
    cartContext.setLastSelectedProductId(productId)
  }, [products, cartItems, productContext, cartContext])

  // 수량 변경
  const changeQuantity = useCallback((productId: string, change: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const currentQuantity = cartItems[productId] || 0
    const newQuantity = currentQuantity + change

    if (newQuantity <= 0) {
      // 제거
      const newCartItems = updateCartQuantity(cartItems, productId, 0)
      cartContext.setCartItems(newCartItems)
      
      const newProducts = updateProductStock(products, productId, currentQuantity)
      productContext.setProducts(newProducts)
    } else {
      if (!canChangeQuantity(product, change)) {
        alert('재고가 부족합니다.')
        return
      }

      // 수량 변경
      const newCartItems = updateCartQuantity(cartItems, productId, newQuantity)
      cartContext.setCartItems(newCartItems)
      
      const newProducts = updateProductStock(products, productId, -change)
      productContext.setProducts(newProducts)
    }
  }, [products, cartItems, productContext, cartContext])

  // 제거
  const removeFromCart = useCallback((productId: string) => {
    const quantity = cartItems[productId] || 0
    
    // 장바구니에서 제거
    const newCartItems = updateCartQuantity(cartItems, productId, 0)
    cartContext.setCartItems(newCartItems)
    
    // 재고 복구
    const newProducts = updateProductStock(products, productId, quantity)
    productContext.setProducts(newProducts)
  }, [cartItems, products, productContext, cartContext])

  // 상품 업데이트 (세일 등)
  const updateProduct = useCallback((productId: string, updates: Partial<import('../types').Product>) => {
    productContext.updateProduct(productId, updates)
  }, [productContext])

  return {
    // 상태
    products,
    cartItems,
    totalAmount,
    totalQuantity,
    bonusPoints,
    lastSelectedProductId,
    
    // 액션들
    addToCart,
    changeQuantity,
    removeFromCart,
    updateProduct,
    updateCart,
  }
}
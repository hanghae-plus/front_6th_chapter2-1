import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { CartState, Product, ShoppingCartContextType } from '../types'
import { initializeProducts } from '../data/products'

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined)

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  // 순수 상태만 관리
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<Record<string, number>>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null)

  // 초기화만 처리
  useEffect(() => {
    setProducts(initializeProducts())
  }, [])

  // 상태 객체
  const state: CartState = {
    products,
    cartItems,
    totalAmount,
    totalQuantity,
    bonusPoints,
    lastSelectedProductId,
  }

  const value: ShoppingCartContextType = {
    state,
    setProducts,
    setCartItems,
    setTotalAmount,
    setTotalQuantity,
    setBonusPoints,
    setLastSelectedProductId,
  }

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  )
}

// Context 사용 훅
export function useShoppingCartContext() {
  const context = useContext(ShoppingCartContext)
  if (!context) {
    throw new Error('useShoppingCartContext must be used within ShoppingCartProvider')
  }
  return context
}
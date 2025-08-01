import React, { createContext, useContext, ReactNode } from 'react'
import { useShoppingCartState } from '../hooks/useCartState'
import { Product } from '../types'

interface ShoppingCartContextType {
  getProducts: () => Product[]
  getProduct: (id: string) => Product | undefined
  getCartItems: () => Record<string, number>
  getTotalAmount: () => number
  getTotalQuantity: () => number
  getBonusPoints: () => number
  addToCart: (productId: string) => void
  changeQuantity: (productId: string, change: number) => void
  removeFromCart: (productId: string) => void
  updateCart: () => void
  updateProductOptions: () => void
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined)

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const cartState = useShoppingCartState()

  return (
    <ShoppingCartContext.Provider value={cartState}>
      {children}
    </ShoppingCartContext.Provider>
  )
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext)
  if (!context) {
    throw new Error('useShoppingCart must be used within ShoppingCartProvider')
  }
  return context
}

import React, { createContext, useContext, ReactNode, useState } from 'react'
import { CartContextType, CartState } from '../types'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null)

  const state: CartState = {
    cartItems,
    totalAmount,
    totalQuantity,
    bonusPoints,
    lastSelectedProductId,
  }

  const value: CartContextType = {
    state,
    setCartItems,
    setTotalAmount,
    setTotalQuantity,
    setBonusPoints,
    setLastSelectedProductId,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider')
  }
  return context
}
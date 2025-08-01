import React from 'react'
import { useCart } from '../hooks/useCart'
import { CartItem } from './CartItem'

export function CartItems() {
  const { cartItems, products } = useCart()

  return (
    <div>
      {Object.entries(cartItems).map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId)
        if (!product) return null

        return (
          <CartItem
            key={productId}
            product={product}
            quantity={quantity}
          />
        )
      })}
    </div>
  )
}
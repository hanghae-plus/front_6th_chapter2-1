import React from 'react'
import { useShoppingCart } from '../providers/ShoppingCartProvider'
import { CartItem } from './CartItem'

export function CartItems() {
  const { getCartItems, getProducts } = useShoppingCart()
  const cartItems = getCartItems()
  const products = getProducts()

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
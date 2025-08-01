import React from 'react'
import { ProductContainer } from './ProductContainer'
import { CartItems } from './CartItems'

export function LeftColumn() {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductContainer />
      <CartItems />
    </div>
  )
}
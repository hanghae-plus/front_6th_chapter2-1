import React from 'react'
import { useCart } from '../hooks/useCart'
import { formatProductPrice, formatProductName } from '../utils/formatters'
import { THRESHOLDS } from '../constants'
import { Product } from '../types'

interface CartItemProps {
  product: Product
  quantity: number
}

export function CartItem({ product, quantity }: CartItemProps) {
  const { changeQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (change: number) => {
    changeQuantity(product.id, change)
  }

  const handleRemove = () => {
    removeFromCart(product.id)
  }

  const price = formatProductPrice(product)
  const productName = formatProductName(product)
  const isBoldPrice = quantity >= THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT

  return (
    <div
      id={product.id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {productName}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p 
          className="text-xs text-black mb-3"
          dangerouslySetInnerHTML={{ __html: price }}
        />
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            −
          </button>
          <span className="text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <div 
          className={`text-lg mb-2 tracking-tight tabular-nums ${isBoldPrice ? 'font-bold' : ''}`}
          dangerouslySetInnerHTML={{ __html: price }}
        />
        <button
          onClick={handleRemove}
          className="text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
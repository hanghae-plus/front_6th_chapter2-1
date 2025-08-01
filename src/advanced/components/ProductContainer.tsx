import React, { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { formatProductOption } from '../utils/formatters'
import { THRESHOLDS } from '../constants'

export function ProductContainer() {
  const { products, addToCart } = useCart()
  const [selectedProductId, setSelectedProductId] = useState('')
  
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  const handleAddToCart = () => {
    if (selectedProductId) {
      addToCart(selectedProductId)
    }
  }

  const getStockMessage = () => {
    let message = ''
    products.forEach((product) => {
      if (product.stock < THRESHOLDS.LOW_STOCK) {
        if (product.stock > 0) {
          message += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`
        } else {
          message += `${product.name}: 품절\n`
        }
      }
    })
    return message
  }

  const stockMessage = getStockMessage()

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        style={{ borderColor: totalStock < THRESHOLDS.TOTAL_STOCK_WARNING ? 'orange' : '' }}
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => {
          const { text, className } = formatProductOption(product)
          return (
            <option
              key={product.id}
              value={product.id}
              disabled={product.stock === 0}
              className={className}
            >
              {text}
            </option>
          )
        })}
      </select>

      <button
        onClick={handleAddToCart}
        disabled={!selectedProductId}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-400"
      >
        Add to Cart
      </button>

      {stockMessage && (
        <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {stockMessage}
        </div>
      )}
    </div>
  )
}
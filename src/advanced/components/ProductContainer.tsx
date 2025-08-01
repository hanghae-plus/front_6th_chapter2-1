import React, { useState } from 'react'
import { useShoppingCart } from '../providers/ShoppingCartProvider'
import { formatProductOption } from '../utils/formatters'
import { getStockMessage, getTotalStock } from '../services/product'
import { THRESHOLDS } from '../constants'

export function ProductContainer() {
  const { getProducts, addToCart } = useShoppingCart()
  const [selectedProductId, setSelectedProductId] = useState('')
  
  const products = getProducts()
  const totalStock = getTotalStock()
  const stockMessage = getStockMessage()

  const handleAddToCart = () => {
    if (selectedProductId) {
      addToCart(selectedProductId)
    }
  }

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
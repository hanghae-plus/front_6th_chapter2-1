import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { Product, ProductContextType, ProductState } from '../types'
import { initializeProducts } from '../data/products'

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // 초기화
  useEffect(() => {
    setProducts(initializeProducts())
  }, [])

  // 상품 업데이트 (세일 등)
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ))
  }

  const state: ProductState = {
    products,
  }

  const value: ProductContextType = {
    state,
    setProducts,
    updateProduct,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProductContext() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext must be used within ProductProvider')
  }
  return context
}
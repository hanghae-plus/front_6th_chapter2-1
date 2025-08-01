import React, { useEffect } from 'react'
import { ProductProvider } from './hooks/ProductContext'
import { CartProvider } from './hooks/CartContext'
import { useCart } from './hooks/useCart'
import { useSaleTimers } from './hooks/useSaleTimers'
import { Header } from './components/Header'
import { LeftColumn } from './components/LeftColumn'
import { OrderSummary } from './components/OrderSummary'
import { HelpModal } from './components/HelpModal'

function AppContent() {
  const { updateCart } = useCart()
  
  // 세일 타이머 활성화
  useSaleTimers()

  useEffect(() => {
    // 초기화 로직
    updateCart()
  }, [updateCart])

  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
        <LeftColumn />
        <OrderSummary />
      </div>
      <HelpModal />
    </div>
  )
}

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  )
}

export default App
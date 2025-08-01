import React, { useEffect } from 'react'
import { ShoppingCartProvider, useShoppingCart } from './providers/ShoppingCartProvider'
import { setupSaleTimers } from './controllers/saleTimers'
import { Header } from './components/Header'
import { LeftColumn } from './components/LeftColumn'
import { OrderSummary } from './components/OrderSummary'
import { HelpModal } from './components/HelpModal'

function AppContent() {
  const { updateProductOptions, updateCart } = useShoppingCart()

  useEffect(() => {
    // 초기화 로직
    updateProductOptions()
    updateCart()
    setupSaleTimers()
  }, [updateProductOptions, updateCart])

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
    <ShoppingCartProvider>
      <AppContent />
    </ShoppingCartProvider>
  )
}

export default App
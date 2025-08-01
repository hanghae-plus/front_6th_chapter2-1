import React, { useEffect } from 'react'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { useCart } from './hooks/useCart'
// import { setupSaleTimers } from './controllers/saleTimers' // 임시 비활성화
import { Header } from './components/Header'
import { LeftColumn } from './components/LeftColumn'
import { OrderSummary } from './components/OrderSummary'
import { HelpModal } from './components/HelpModal'

function AppContent() {
  const { updateCart } = useCart()

  useEffect(() => {
    // 초기화 로직
    updateCart()
    // setupSaleTimers() // 임시 비활성화 - 나중에 React 방식으로 재구현
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
    <ShoppingCartProvider>
      <AppContent />
    </ShoppingCartProvider>
  )
}

export default App
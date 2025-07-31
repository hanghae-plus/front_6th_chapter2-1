import { initializeState, setElements } from './store/state.js'
import { createElement, initializeDOMElements } from './utils/dom.js'
import { LeftColumn } from './components/LeftColumn.js'
import { updateProductOptions } from './services/product.js'
import { OrderSummary } from './components/OrderSummary.js'
import { HelpModal } from './components/HelpModal.js'
import { Header } from './components/Header.js'
import { setupEventHandlers } from './event/eventHandlers.js'
import { updateCart } from './services/discount.js'
import { setupSaleTimers } from './controllers/saleTimers.js'

// 메인 초기화 함수
function main() {
  // 전역 상태 초기화
  initializeState()

  // DOM 구조 생성
  const root = document.getElementById('app')
  const header = Header()
  const gridContainer = createElement(
    'div',
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden',
  )
  const leftColumn = LeftColumn()
  const rightColumn = OrderSummary()
  const { toggleButton, overlay } = HelpModal()

  gridContainer.appendChild(leftColumn)
  gridContainer.appendChild(rightColumn)

  root.appendChild(header)
  root.appendChild(gridContainer)
  root.appendChild(toggleButton)
  root.appendChild(overlay)

  // DOM 요소 참조 저장
  const elements = initializeDOMElements()
  setElements(elements)

  // 초기화
  updateProductOptions()
  updateCart()
  setupEventHandlers()
  setupSaleTimers()
}

// 앱 시작
main()

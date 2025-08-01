import { createElement } from '../utils/dom.js'
import { formatProductOption } from '../utils/formatters.js'
import { getProducts, getElements } from '../store/state.js'
import { THRESHOLDS } from '../constants/index.js'

export function updateProductOptions() {
  const products = getProducts()
  const elements = getElements()
  const select = elements.productSelect

  // 현재 선택된 값 저장
  const currentValue = select.value

  select.innerHTML = ''

  // 전체 재고 계산
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  // 재고가 적을 때 테두리 색상 변경
  select.style.borderColor =
    totalStock < THRESHOLDS.TOTAL_STOCK_WARNING ? 'orange' : ''

  products.forEach((product) => {
    const option = createElement('option')
    option.value = product.id

    // 할인 정보와 스타일 설정
    const { text, className } = formatProductOption(product)
    option.textContent = text
    option.className = className

    if (product.stock === 0) {
      option.disabled = true
    }

    select.appendChild(option)
  })

  // 이전에 선택된 값 복원
  if (currentValue) {
    select.value = currentValue
  }

  // 옵션 업데이트 시 재고 상태도 함께 업데이트
  updateStockStatus()
}

export function updateStockStatus() {
  const products = getProducts()
  const elements = getElements()
  let stockMessage = ''

  // 상품 순서대로 확인 (p1, p2, p3, p4, p5)
  products.forEach((product) => {
    if (product.stock < THRESHOLDS.LOW_STOCK) {
      if (product.stock > 0) {
        stockMessage += `${product.name}: 재고 부족 (${product.stock}개 남음)\n`
      } else {
        stockMessage += `${product.name}: 품절\n`
      }
    }
  })

  elements.stockInfo.textContent = stockMessage
}

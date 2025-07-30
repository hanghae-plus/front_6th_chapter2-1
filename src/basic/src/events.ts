/**
 * 사용자 이벤트 핸들러
 * 단방향 데이터 흐름과 순수 함수를 통한 상태 관리
 */
import {useCart, useLastSelected, useProducts} from "./hooks.ts"
import {
  addToCart,
  canAddToCart,
  getAvailableStock,
  removeFromCart,
  updateCartQuantity,
  updateProductStock
} from "./entities.ts"
import {rerenderUI} from "./render.ts"

/**
 * 상품을 장바구니에 추가
 * 요구사항: 재고 확인, 수량 제한, 마지막 선택 상품 기록
 */
export function handleAddToCart() {
  const {cart, setCart, getItemQuantity} = useCart()
  const {products, setProducts} = useProducts()
  const {setLastSel} = useLastSelected()

  const productSelect = document.getElementById('product-select') as HTMLSelectElement
  if (!productSelect) {
    console.error('Product select element not found')
    return
  }

  const selectedItemId = productSelect.value
  if (!selectedItemId) {
    return
  }

  const itemToAdd = products.find(product => product.id === selectedItemId)
  if (!itemToAdd) {
    return
  }

  if (itemToAdd.quantity <= 0) {
    return
  }

  const currentQuantity = getItemQuantity(selectedItemId)

  if (!canAddToCart(itemToAdd, currentQuantity, 1)) {
    alert('재고가 부족합니다.')
    return
  }

  setCart(addToCart(cart, selectedItemId, 1))
  setProducts(updateProductStock(products, selectedItemId, -1))
  setLastSel(selectedItemId)

  rerenderUI()
}

/**
 * 장바구니 상품 수량 변경
 * 요구사항: 재고 초과 방지, 0개 시 자동 제거
 */
export function handleQuantityChange(productId: string, quantityChange: number) {
  const {cart, setCart, getItemQuantity, hasItem} = useCart()
  const {products, setProducts} = useProducts()

  const product = products.find(product => product.id === productId)
  if (!product || !hasItem(productId)) return

  const currentQuantity = getItemQuantity(productId)
  const newQuantity = currentQuantity + quantityChange

  if (newQuantity > 0) {
    const availableStock = getAvailableStock(product, currentQuantity)
    if (newQuantity <= availableStock) {
      setCart(updateCartQuantity(cart, productId, newQuantity))
      setProducts(updateProductStock(products, productId, -quantityChange))
    } else {
      alert('재고가 부족합니다.')
    }
  } else {
    setCart(removeFromCart(cart, productId))
    setProducts(updateProductStock(products, productId, currentQuantity))
  }

  rerenderUI()
}

/**
 * 장바구니에서 상품 제거
 * 요구사항: 제거 시 재고 수량 복구
 */
export function handleRemoveItem(productId: string) {
  const {cart, setCart, getItemQuantity} = useCart()
  const {products, setProducts} = useProducts()

  const removeQuantity = getItemQuantity(productId)
  if (!removeQuantity) return

  setCart(removeFromCart(cart, productId))
  setProducts(updateProductStock(products, productId, removeQuantity))

  rerenderUI()
}

/**
 * 장바구니 클릭 이벤트 위임
 * 요구사항: 수량 변경 및 삭제 버튼 처리
 */
export function handleCartItemClick(event: Event) {
  const target = event.target as HTMLElement

  if (target.classList.contains('quantity-change')) {
    const productId = target.dataset.productId
    const quantityChange = parseInt(target.dataset.change || '0')
    if (productId) {
      handleQuantityChange(productId, quantityChange)
    }
    return
  }

  if (target.classList.contains('remove-item')) {
    const productId = target.dataset.productId
    if (productId) {
      handleRemoveItem(productId)
    }
    return
  }
}
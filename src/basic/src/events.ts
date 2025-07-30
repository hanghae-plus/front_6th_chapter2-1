// 장바구니 추가 핸들러
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

  // cart 업데이트 (순수 함수 사용)
  if (!canAddToCart(itemToAdd, currentQuantity, 1)) {
    alert('재고가 부족합니다.')
    return
  }

  setCart(addToCart(cart, selectedItemId, 1))
  setProducts(updateProductStock(products, selectedItemId, -1))
  setLastSel(selectedItemId)

  rerenderUI()
}

// 수량 변경 핸들러
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
      // cart 업데이트 + 재고 업데이트
      setCart(updateCartQuantity(cart, productId, newQuantity))
      setProducts(updateProductStock(products, productId, -quantityChange))
    } else {
      alert('재고가 부족합니다.')
    }
  } else {
    // 수량이 0이 되면 아이템 제거, 재고 복구
    setCart(removeFromCart(cart, productId))
    setProducts(updateProductStock(products, productId, currentQuantity))
  }

  rerenderUI()
}

// 아이템 제거 핸들러
export function handleRemoveItem(productId: string) {
  const {cart, setCart, getItemQuantity} = useCart()
  const {products, setProducts} = useProducts()

  const removeQuantity = getItemQuantity(productId)
  if (!removeQuantity) return

  // cart에서 제거 / 재고 복구
  setCart(removeFromCart(cart, productId))
  setProducts(updateProductStock(products, productId, removeQuantity))

  rerenderUI()
}

// 장바구니 아이템 클릭 이벤트 위임 핸들러
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
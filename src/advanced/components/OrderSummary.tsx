import React from 'react'
import { useShoppingCart } from '../providers/ShoppingCartProvider'
import { formatPrice, formatDiscountRate } from '../utils/formatters'
import { PRODUCT_IDS, THRESHOLDS } from '../constants'

export function OrderSummary() {
  const { getCartItems, getProducts, getTotalAmount, getTotalQuantity, getBonusPoints } = useShoppingCart()
  
  const cartItems = getCartItems()
  const products = getProducts()
  const totalAmount = getTotalAmount()
  const totalQuantity = getTotalQuantity()
  const bonusPoints = getBonusPoints()

  const isTuesday = new Date().getDay() === 2
  const subtotal = Object.entries(cartItems).reduce((sum, [productId, quantity]) => {
    const product = products.find((p) => p.id === productId)
    return sum + (product ? product.price * quantity : 0)
  }, 0)

  const discountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0
  const savedAmount = subtotal - totalAmount

  const getItemDiscounts = () => {
    const discounts: Array<{ name: string; discount: number }> = []
    
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)
      if (!product || quantity < THRESHOLDS.MIN_QUANTITY_FOR_DISCOUNT) return

      const discountMap = {
        [PRODUCT_IDS.KEYBOARD]: 10,
        [PRODUCT_IDS.MOUSE]: 15,
        [PRODUCT_IDS.MONITOR_ARM]: 20,
        [PRODUCT_IDS.LAPTOP_POUCH]: 5,
        [PRODUCT_IDS.SPEAKER]: 25,
      }

      const discount = (discountMap as any)[productId]
      if (discount) {
        discounts.push({ name: product.name, discount })
      }
    })

    return discounts
  }

  const itemDiscounts = getItemDiscounts()

  const getPointsDetail = () => {
    const details: string[] = []
    let basePoints = Math.floor(totalAmount / 1000)
    
    if (basePoints > 0) {
      details.push(`기본: ${basePoints}p`)
    }

    if (isTuesday && basePoints > 0) {
      details.push('화요일 2배')
    }

    const hasKeyboard = cartItems[PRODUCT_IDS.KEYBOARD]
    const hasMouse = cartItems[PRODUCT_IDS.MOUSE]
    const hasMonitorArm = cartItems[PRODUCT_IDS.MONITOR_ARM]

    if (hasKeyboard && hasMouse) {
      details.push('키보드+마우스 세트 +50p')
    }
    if (hasKeyboard && hasMouse && hasMonitorArm) {
      details.push('풀세트 구매 +100p')
    }

    if (totalQuantity >= 30) {
      details.push('대량구매(30개+) +100p')
    } else if (totalQuantity >= 20) {
      details.push('대량구매(20개+) +50p')
    } else if (totalQuantity >= 10) {
      details.push('대량구매(10개+) +20p')
    }

    return details
  }

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">
        Order Summary
      </h2>
      
      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {subtotal > 0 && (
            <>
              {Object.entries(cartItems).map(([productId, quantity]) => {
                const product = products.find((p) => p.id === productId)
                if (!product) return null

                const itemTotal = product.price * quantity
                return (
                  <div key={productId} className="flex justify-between text-xs tracking-wide text-gray-400">
                    <span>{product.name} x {quantity}</span>
                    <span>{formatPrice(itemTotal)}</span>
                  </div>
                )
              })}

              <div className="border-t border-white/10 my-3"></div>
              
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {totalQuantity >= THRESHOLDS.MIN_QUANTITY_FOR_BULK ? (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
                  <span className="text-xs">-25%</span>
                </div>
              ) : (
                itemDiscounts.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm tracking-wide text-green-400">
                    <span className="text-xs">{item.name} (10개↑)</span>
                    <span className="text-xs">-{item.discount}%</span>
                  </div>
                ))
              )}

              {isTuesday && totalQuantity > 0 && (
                <div className="flex justify-between text-sm tracking-wide text-purple-400">
                  <span className="text-xs">🌟 화요일 추가 할인</span>
                  <span className="text-xs">-10%</span>
                </div>
              )}

              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          {discountRate > 0 && totalAmount > 0 && (
            <div className="mb-4 bg-green-500/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                <span className="text-sm font-medium text-green-400">
                  {formatDiscountRate(discountRate)}
                </span>
              </div>
              <div className="text-2xs text-gray-300">
                {formatPrice(savedAmount)} 할인되었습니다
              </div>
            </div>
          )}

          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                {formatPrice(totalAmount)}
              </div>
            </div>
            
            {Object.keys(cartItems).length > 0 && (
              <div className="text-xs text-blue-400 mt-2 text-right">
                <div>적립 포인트: <span className="font-bold">{bonusPoints}p</span></div>
                <div className="text-2xs opacity-70 mt-1">
                  {getPointsDetail().join(', ')}
                </div>
              </div>
            )}
          </div>

          {isTuesday && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">
                  Tuesday Special 10% Applied
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>

      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br />
        <span>Earn loyalty points with purchase.</span>
      </p>
    </div>
  )
}
// 비즈니스 로직 import
import {
  calculateCartData,
  calculatePoints,
  calculateTotalStock, Cart,
  getStockInfo, Product,
} from './entities.js'


// 전역 변수 선언
// 상태 관리 변수
var prodList:Product[] = []
var cart:Cart = {} // 장바구니 모델 { productId: quantity }
var lastSel = null

export function useProducts() {
  return {
    products: prodList,
    totalStock: calculateTotalStock(prodList),

    getProductById: (id) => prodList.find(p => p.id === id),
    getStockInfo: () => getStockInfo(prodList),
    hasLowStock: () => calculateTotalStock(prodList) < 50,

    setProducts: (newProducts:Product[]) => {
      prodList = newProducts;
    }
  };
}

export function useCart() {
  const cartData = calculateCartData(cart, prodList, new Date());
  const pointsData = calculatePoints(cartData, cart, new Date());

  return {
    cart: cart,
    cartData: cartData,
    pointsData: pointsData,
    isEmpty: Object.keys(cart).length === 0,
    getItemQuantity: (productId) => cart[productId] || 0,
    hasItem: (productId) => productId in cart,

    setCart: (newCart) => {
      cart = newCart;
    }
  };
}

export function useLastSelected() {
  return {
    lastSel: lastSel,
    setLastSel: (value) => {
      lastSel = value;
    }
  };
}

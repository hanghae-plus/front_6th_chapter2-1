// 모듈 import
import * as product from './product.js';
import * as cart from './cart.js';
import * as discount from './discount.js';
import * as point from './point.js';

// 데이터 초기화 (모든 모듈 초기화)
export const initializeData = () => {
  product.initializeProduct();
  cart.initializeCart();
  discount.initializeDiscount();
  console.log('All data initialized');
};

// 상품 관련 함수들 재export
export const getProductList = product.getProductList;
export const getProductById = product.getProductById;
export const updateProductStock = product.updateProductStock;
export const restoreProductStock = product.restoreProductStock;
export const calculateTotalStock = product.calculateTotalStock;
export const getLowStockItems = product.getLowStockItems;
export const updateProductSaleStatus = product.updateProductSaleStatus;
export const resetProductPrices = product.resetProductPrices;
export const startLightningSale = product.startLightningSale;
export const startSuggestedSale = product.startSuggestedSale;

// 장바구니 관련 함수들 재export
export const addToCart = cart.addToCart;
export const removeFromCart = cart.removeFromCart;
export const getCartList = cart.getCartList;
export const clearCart = cart.clearCart;
export const calculateTotalItemCount = cart.calculateTotalItemCount;

// 할인 관련 함수들 재export
export const getProductDiscountRate = discount.getProductDiscountRate;
export const isTuesday = discount.isTuesday;
export const calculateTotalPrice = discount.calculateTotalPrice;
export const getLastSelectedProductId = discount.getLastSelectedProductId;
export const setLastSelectedProductId = discount.setLastSelectedProductId;

// 포인트 관련 함수들 재export
export const calculateBasePoints = point.calculateBasePoint;
export const calculateBonusPoints = point.calculateBonusPoint;
export const getBonusPointsText = point.getBonusPointText;
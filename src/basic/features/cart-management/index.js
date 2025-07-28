import { CartRepository } from '../../entities/cart/index.js';
import { ProductRepository } from '../../entities/product/index.js';
import { PricingService } from '../pricing/index.js';
import { PointsService } from '../points/index.js';

// 장바구니 관리 서비스
export class CartManagementService {
  constructor() {
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
    this.pricingService = new PricingService();
    this.pointsService = new PointsService();
  }

  // 상품 추가
  addToCart(productId, quantity = 1) {
    const product = this.productRepo.findById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    if (product.isOutOfStock()) {
      throw new Error('품절된 상품입니다.');
    }

    const cart = this.cartRepo.getCart();
    const currentItem = cart.getItem(productId);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;

    if (newTotalQuantity > product.q) {
      throw new Error('재고가 부족합니다.');
    }

    // 개별 할인 적용
    const discount = this._calculateItemDiscount(productId, newTotalQuantity);
    
    cart.addItem(productId, quantity, product.val, discount);
    this.cartRepo.saveCart();

    return this._getCartSummary();
  }

  // 수량 변경
  updateQuantity(productId, newQuantity) {
    const product = this.productRepo.findById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    if (newQuantity > product.q) {
      throw new Error('재고가 부족합니다.');
    }

    const cart = this.cartRepo.getCart();
    
    if (newQuantity <= 0) {
      cart.removeItem(productId);
    } else {
      const discount = this._calculateItemDiscount(productId, newQuantity);
      cart.updateItemQuantity(productId, newQuantity);
      
      // 할인율 업데이트
      const item = cart.getItem(productId);
      if (item) {
        item.discount = discount;
        cart.updateTotals();
      }
    }

    this.cartRepo.saveCart();
    return this._getCartSummary();
  }

  // 상품 제거
  removeFromCart(productId) {
    const cart = this.cartRepo.getCart();
    cart.removeItem(productId);
    this.cartRepo.saveCart();
    return this._getCartSummary();
  }

  // 장바구니 전체 계산
  _getCartSummary() {
    const cart = this.cartRepo.getCart();
    const products = this.productRepo.findAll();
    const cartItems = cart.getAllItems();

    if (cartItems.length === 0) {
      return {
        items: [],
        subtotal: 0,
        finalAmount: 0,
        totalQuantity: 0,
        discountRate: 0,
        points: 0,
        isEmpty: true
      };
    }

    // 가격 계산
    const pricing = this.pricingService.calculateCartPricing(cartItems, products);
    
    // 포인트 계산
    const points = this.pointsService.calculateTotalPoints(
      pricing.finalAmount, 
      cartItems, 
      pricing.totalQuantity
    );

    return {
      items: cartItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      })),
      subtotal: pricing.originalSubtotal,
      finalAmount: pricing.finalAmount,
      totalQuantity: pricing.totalQuantity,
      discountRate: pricing.finalDiscountRate,
      itemDiscounts: pricing.itemDiscounts,
      bulkDiscount: pricing.bulkDiscount,
      tuesdayDiscount: pricing.tuesdayDiscount,
      points: points.totalPoints,
      pointsDetails: points.details,
      isEmpty: false
    };
  }

  // 개별 상품 할인 계산 (내부 사용)
  _calculateItemDiscount(productId, quantity) {
    const { calculateItemDiscount } = require('../pricing/index.js');
    return calculateItemDiscount(productId, quantity);
  }

  // 현재 장바구니 상태 조회
  getCartState() {
    return this._getCartSummary();
  }

  // 장바구니 비우기
  clearCart() {
    const cart = this.cartRepo.getCart();
    cart.clear();
    this.cartRepo.saveCart();
    return this._getCartSummary();
  }
}
import { DiscountEngine } from './DiscountEngine.js';
import { PointsCalculator } from './PointsCalculator.js';
import { PriceCalculator } from './PriceCalculator.js';

export class CalculationEngine {
  constructor(cartState) {
    this.cartState = cartState;
  }

  extractCartItemsFromDOM(cartItemsContainer) {
    const cartItems = [];
    const cartItemElements = Array.from(cartItemsContainer.children);

    cartItemElements.forEach(cartItemElement => {
      const product = this.cartState.getProductById(cartItemElement.id);
      const quantityElement = cartItemElement.querySelector('.quantity-number');
      const itemQuantity = parseInt(quantityElement?.textContent || 0);

      if (product && itemQuantity > 0) {
        cartItems.push({
          id: product.id,
          quantity: itemQuantity,
          price: product.val,
          product: product
        });
      }
    });

    return cartItems;
  }

  calculateCartPricing(cartItems) {
    if (cartItems.length === 0) {
      return {
        subtotal: 0,
        finalAmount: 0,
        totalSavings: 0,
        discountRate: 0,
        appliedDiscounts: [],
        specialDiscounts: []
      };
    }

    // Base price calculation
    const basePriceResult = PriceCalculator.calculateFinalPrice(
      cartItems,
      new Date()
    );

    // Check for special discount combinations
    const hasFlashSaleAndRecommendedProduct = cartItems.some(
      cartItem => cartItem.product?.onSale && cartItem.product?.suggestSale
    );

    let finalPricingResult = basePriceResult;

    // Apply advanced discounts if applicable
    if (hasFlashSaleAndRecommendedProduct) {
      const discountCalculationContext = {
        date: new Date(),
        isFlashSale: cartItems.some(cartItem => cartItem.product?.onSale),
        recommendedProduct: cartItems.find(
          cartItem => cartItem.product?.suggestSale
        )?.id
      };

      const advancedDiscountResult = DiscountEngine.applyDiscountPolicies(
        cartItems,
        discountCalculationContext
      );

      if (advancedDiscountResult.totalSavings > basePriceResult.totalSavings) {
        finalPricingResult = {
          subtotal: basePriceResult.subtotal,
          finalAmount: advancedDiscountResult.finalAmount,
          totalSavings: advancedDiscountResult.totalSavings,
          appliedDiscounts: advancedDiscountResult.appliedDiscounts,
          individualDiscounts: basePriceResult.individualDiscounts,
          bulkDiscount: basePriceResult.bulkDiscount,
          tuesdayDiscount: basePriceResult.tuesdayDiscount,
          specialDiscounts: advancedDiscountResult.appliedDiscounts.filter(
            discount => ['flash', 'recommend', 'combo'].includes(discount.type)
          )
        };
      }
    }

    // Add discount rate calculation
    finalPricingResult.discountRate =
      finalPricingResult.totalSavings > 0
        ? finalPricingResult.totalSavings / finalPricingResult.subtotal
        : 0;

    return finalPricingResult;
  }

  calculateLoyaltyPoints(cartItems, totalAmount) {
    if (cartItems.length === 0) {
      return { total: 0, messages: [] };
    }

    return PointsCalculator.getTotalPoints(cartItems, totalAmount, {
      date: new Date()
    });
  }

  updateCartStateFromCalculations(cartItems, pricingResult, pointsResult) {
    this.cartState.totalItemCount = cartItems.reduce(
      (totalQuantity, cartItem) => totalQuantity + cartItem.quantity,
      0
    );
    this.cartState.cartTotalAmount = pricingResult.finalAmount;
    this.cartState.earnedLoyaltyPoints = pointsResult.total;
  }
}

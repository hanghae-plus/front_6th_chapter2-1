import { DiscountEngine } from '../calculations/DiscountEngine.js';
import { PointsCalculator } from '../calculations/PointsCalculator.js';
import { PriceCalculator } from '../calculations/PriceCalculator.js';

export class CalculationEngine {
  constructor(state) {
    this.state = state;
  }

  extractCartItemsFromDOM(cartDisplay) {
    const cartItems = [];
    const cartElements = Array.from(cartDisplay.children);

    cartElements.forEach(element => {
      const product = this.state.getProduct(element.id);
      const quantityElement = element.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement?.textContent || 0);

      if (product && quantity > 0) {
        cartItems.push({
          id: product.id,
          quantity: quantity,
          price: product.val,
          product: product,
        });
      }
    });

    return cartItems;
  }

  calculatePricing(cartItems) {
    if (cartItems.length === 0) {
      return {
        subtotal: 0,
        finalAmount: 0,
        totalSavings: 0,
        discountRate: 0,
        appliedDiscounts: [],
        specialDiscounts: [],
      };
    }

    // Base price calculation
    const priceResult = PriceCalculator.calculateFinalPrice(cartItems, new Date());

    // Check for special discount combinations
    const hasFlashAndRecommend = cartItems.some(
      item => item.product?.onSale && item.product?.suggestSale
    );

    let finalResult = priceResult;

    // Apply advanced discounts if applicable
    if (hasFlashAndRecommend) {
      const discountContext = {
        date: new Date(),
        isFlashSale: cartItems.some(item => item.product?.onSale),
        recommendedProduct: cartItems.find(item => item.product?.suggestSale)?.id,
      };

      const discountEngineResult = DiscountEngine.applyDiscountPolicies(cartItems, discountContext);

      if (discountEngineResult.totalSavings > priceResult.totalSavings) {
        finalResult = {
          subtotal: priceResult.subtotal,
          finalAmount: discountEngineResult.finalAmount,
          totalSavings: discountEngineResult.totalSavings,
          appliedDiscounts: discountEngineResult.appliedDiscounts,
          individualDiscounts: priceResult.individualDiscounts,
          bulkDiscount: priceResult.bulkDiscount,
          tuesdayDiscount: priceResult.tuesdayDiscount,
          specialDiscounts: discountEngineResult.appliedDiscounts.filter(d =>
            ['flash', 'recommend', 'combo'].includes(d.type)
          ),
        };
      }
    }

    // Add discount rate calculation
    finalResult.discountRate =
      finalResult.totalSavings > 0 ? finalResult.totalSavings / finalResult.subtotal : 0;

    return finalResult;
  }

  calculatePoints(cartItems, totalAmount) {
    if (cartItems.length === 0) {
      return { total: 0, messages: [] };
    }

    return PointsCalculator.getTotalPoints(cartItems, totalAmount, {
      date: new Date(),
    });
  }

  updateStateFromCalculations(cartItems, pricingResult, pointsResult) {
    this.state.itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.state.totalAmount = pricingResult.finalAmount;
    this.state.bonusPoints = pointsResult.total;
  }
}

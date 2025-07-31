// ============== 유틸리티 함수들 export ==============

export { 
  getRandomProduct, 
  calculateDiscountedPrice, 
  createSaleEvent, 
  filterExistingEvents 
} from './eventUtils';

export {
  isTuesday,
  calculateIndividualDiscount,
  calculateItemTotal,
  shouldApplyBulkDiscount,
  calculateBulkDiscountTotal,
  applyTuesdayDiscount,
  createDiscountInfo
} from './cartUtils';

export {
  calculateBasePoints,
  calculateProductBonus,
  calculateBulkBonus,
  generatePointDescriptions
} from './pointsUtils';

export {
  checkBulkDiscount,
  checkIndividualDiscount,
  applyTuesdayDiscount as applyTuesdayDiscountToDiscount,
  createDiscountInfo as createDiscountInfoFromUtils
} from './discountUtils';

export {
  findNewSales,
  findEndedSales,
  createSaleMessage,
  handleNewSales,
  handleEndedSales,
  type SaleEventHandlers
} from './saleEventUtils';

export {
  getProductSaleStatus,
  createProductOptionText,
  getProductOptionStyleClass,
  getProductNamePrefix,
  getProductPriceColorClass
} from './productUtils';

export {
  createCartItemPriceDisplay,
  getCartItemNamePrefix,
  getCartItemFontWeight,
  createCartItemSummary,
  createDiscountInfoText,
  createLoyaltyPointsHTML,
  createBulkDiscountItem,
  createTuesdayDiscountItem,
  createShippingItem
} from './cartDisplayUtils'; 
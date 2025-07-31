// 상품별 최소수량 할인율 반환
function getProductDiscount(product, quantity) {
  if (quantity < DISCOUNT_STANDARD_COUNT) return 0;
  switch (product.id) {
    case PRODUCT_ONE:
      return TEN_PERCENT;
    case PRODUCT_TWO:
      return FIFTEEN_PERCENT;
    case PRODUCT_THREE:
      return TWENTY_PERCENT;
    case PRODUCT_FOUR:
      return FIVE_PERCENT;
    case PRODUCT_FIVE:
      return TWENTY_FIVE_PERCENT;
    default:
      return 0;
  }
}

export { getProductDiscount };

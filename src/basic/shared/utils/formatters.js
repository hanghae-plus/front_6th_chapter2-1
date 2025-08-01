export function formatPrice(price) {
  return '₩' + price.toLocaleString();
}

export function formatRoundedPrice(price) {
  return '₩' + Math.round(price).toLocaleString();
}

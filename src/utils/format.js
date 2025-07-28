export function formatPrice(amount) {
  return `₩${Math.round(amount).toLocaleString()}`;
}

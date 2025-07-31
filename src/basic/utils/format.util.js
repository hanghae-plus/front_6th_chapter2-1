export function formatPrice(price) {
  return price.toLocaleString('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });
}

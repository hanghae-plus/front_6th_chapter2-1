export function formatPrice({ price }: { price: number }) {
  return Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

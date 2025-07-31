export default function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });
}

export function formatDiscountRate(discountRate: number): string {
  return (discountRate * 100).toFixed(1) + '%';
}

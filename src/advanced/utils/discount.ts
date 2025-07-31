interface FormatDiscountRateParmas {
  rate: number;
  signDisplay?: 'always' | 'never';
  negative?: boolean;
}

export function formatDiscountRate({
  rate,
  signDisplay = 'always',
  negative = true,
}: FormatDiscountRateParmas) {
  return Intl.NumberFormat('ko-KR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    signDisplay,
  }).format(negative ? -rate : rate);
}

interface ApplyDiscountParams {
  price: number;
  rate: number;
}

export function applyDiscount({ price, rate }: ApplyDiscountParams) {
  return price * (1 - rate);
}

// 숫자 포맷팅
export const formatCurrency = (amount: number): string => {
  return `₩${amount.toLocaleString()}`;
};

// 할인율 포맷팅
export const formatDiscountRate = (rate: number): string => {
  return `${(rate * 100).toFixed(1)}%`;
};

// 아이템 수량 포맷팅
export const formatItemCount = (count: number): string => {
  return `${count} item${count !== 1 ? 's' : ''}`;
};

// 포인트 포맷팅
export const formatPoints = (points: number): string => {
  return `${points}p`;
};

// 가격 포맷팅
export const formatPrice = formatCurrency;
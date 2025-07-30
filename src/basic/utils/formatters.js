export const formatCurrency = (amount) => `₩${Math.round(amount).toLocaleString()}`; // 금액 포맷팅
export const formatPoints = (points) => `${points}p`; // 포인트 포맷팅
export const formatPercentage = (rate) => `${(rate * 100).toFixed(1)}%`; // 퍼센트 포맷팅

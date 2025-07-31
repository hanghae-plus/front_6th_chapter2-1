/**
 * 가격을 한국 원화 형식으로 포맷팅
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

/**
 * 가격을 원화 기호와 함께 포맷팅
 */
export const formatPriceWithCurrency = (price: number): string => {
  return `₩${formatPrice(price)}`;
};

/**
 * 수량을 포맷팅
 */
export const formatQuantity = (quantity: number): string => {
  return quantity.toString();
};

/**
 * 할인율을 퍼센트 형식으로 포맷팅
 */
export const formatDiscountRate = (rate: number): string => {
  return `${rate}%`;
};

/**
 * 포인트를 포맷팅
 */
export const formatPoints = (points: number): string => {
  return `${points}p`;
};

/**
 * 날짜를 한국 형식으로 포맷팅
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

/**
 * 시간을 한국 형식으로 포맷팅
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

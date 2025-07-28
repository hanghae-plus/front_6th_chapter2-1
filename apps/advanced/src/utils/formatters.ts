/**
 * 포맷팅 관련 유틸리티 함수 - 선언형 접근
 */

/**
 * 통화를 포맷팅합니다
 * @param amount - 금액
 * @returns 포맷팅된 통화 문자열
 */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    amount,
  );

/**
 * 숫자를 포맷팅합니다
 * @param num - 숫자
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @returns 포맷팅된 숫자 문자열
 */
export const formatNumber = (num: number, locale: string = "ko-KR"): string =>
  new Intl.NumberFormat(locale).format(num);

/**
 * 퍼센트를 포맷팅합니다
 * @param value - 퍼센트 값 (0.1 = 10%)
 * @returns 포맷팅된 퍼센트 문자열
 */
export const formatPercentage = (value: number): string =>
  `${Math.round(value * 100)}%`;

/**
 * 날짜를 포맷팅합니다
 * @param date - 날짜
 * @param options - 포맷팅 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string => new Intl.DateTimeFormat("ko-KR", options).format(date);

/**
 * 시간을 포맷팅합니다
 * @param date - 날짜
 * @returns 포맷팅된 시간 문자열
 */
export const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

/**
 * 파일 크기를 포맷팅합니다
 * @param bytes - 바이트
 * @returns 포맷팅된 파일 크기 문자열
 */
export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
};

/**
 * 전화번호를 포맷팅합니다
 * @param phoneNumber - 전화번호
 * @returns 포맷팅된 전화번호 문자열
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

  return match ? `${match[1]}-${match[2]}-${match[3]}` : phoneNumber;
};

/**
 * 카드 번호를 포맷팅합니다
 * @param cardNumber - 카드 번호
 * @returns 포맷팅된 카드 번호 문자열
 */
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);

  return groups ? groups.join("-") : cardNumber;
};

/**
 * 주민등록번호를 포맷팅합니다
 * @param ssn - 주민등록번호
 * @returns 포맷팅된 주민등록번호 문자열
 */
export const formatSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{6})(\d{7})$/);

  return match ? `${match[1]}-${match[2]}` : ssn;
};

/**
 * 텍스트를 자릅니다
 * @param text - 텍스트
 * @param maxLength - 최대 길이
 * @param suffix - 접미사 (기본값: '...')
 * @returns 잘린 텍스트
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = "...",
): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}${suffix}`;

/**
 * 카운트다운을 포맷팅합니다
 * @param seconds - 초
 * @returns 포맷팅된 카운트다운 문자열
 */
export const formatCountdown = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((val) => val.toString().padStart(2, "0"))
    .join(":");
};

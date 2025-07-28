/**
 * 검증 관련 유틸리티 함수 - 선언형 접근
 */

import { Product } from "../types/product.types";

/**
 * 이메일 유효성을 검증합니다
 * @param email - 이메일 주소
 * @returns 유효성 여부
 */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * 전화번호 유효성을 검증합니다
 * @param phoneNumber - 전화번호
 * @returns 유효성 여부
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean =>
  /^01[0-9]-\d{3,4}-\d{4}$/.test(phoneNumber);

/**
 * 주민등록번호 유효성을 검증합니다
 * @param ssn - 주민등록번호
 * @returns 유효성 여부
 */
export const isValidSSN = (ssn: string): boolean => /^\d{6}-\d{7}$/.test(ssn);

/**
 * 카드 번호 유효성을 검증합니다
 * @param cardNumber - 카드 번호
 * @returns 유효성 여부
 */
export const isValidCardNumber = (cardNumber: string): boolean =>
  /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumber);

/**
 * 비밀번호 유효성을 검증합니다
 * @param password - 비밀번호
 * @returns 유효성 여부
 */
export const isValidPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password,
  );

/**
 * URL 유효성을 검증합니다
 * @param url - URL
 * @returns 유효성 여부
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 범위 내 값인지 검증합니다
 * @param value - 검증할 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns 범위 내 여부
 */
export const isInRange = (value: number, min: number, max: number): boolean =>
  value >= min && value <= max;

/**
 * 텍스트 길이 유효성을 검증합니다
 * @param text - 텍스트
 * @param minLength - 최소 길이
 * @param maxLength - 최대 길이
 * @returns 유효성 여부
 */
export const isTextLengthValid = (
  text: string,
  minLength: number,
  maxLength: number,
): boolean => text.length >= minLength && text.length <= maxLength;

/**
 * 상품 유효성을 검증합니다
 * @param product - 상품 객체
 * @returns 유효성 여부
 */
export const isValidProduct = (product: Product): boolean =>
  !!product.id && !!product.name && product.price > 0 && product.stock >= 0;

/**
 * 수량 유효성을 검증합니다
 * @param quantity - 수량
 * @returns 유효성 여부
 */
export const isValidQuantity = (quantity: number): boolean =>
  Number.isInteger(quantity) && quantity > 0;

/**
 * 금액 유효성을 검증합니다
 * @param amount - 금액
 * @returns 유효성 여부
 */
export const isValidAmount = (amount: number): boolean =>
  Number.isFinite(amount) && amount >= 0;

/**
 * 날짜 유효성을 검증합니다
 * @param date - 날짜
 * @returns 유효성 여부
 */
export const isValidDate = (date: Date): boolean =>
  date instanceof Date && !isNaN(date.getTime());

/**
 * 미래 날짜인지 검증합니다
 * @param date - 날짜
 * @returns 미래 날짜 여부
 */
export const isFutureDate = (date: Date): boolean => date > new Date();

/**
 * 과거 날짜인지 검증합니다
 * @param date - 날짜
 * @returns 과거 날짜 여부
 */
export const isPastDate = (date: Date): boolean => date < new Date();

/**
 * 오늘 날짜인지 검증합니다
 * @param date - 날짜
 * @returns 오늘 날짜 여부
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

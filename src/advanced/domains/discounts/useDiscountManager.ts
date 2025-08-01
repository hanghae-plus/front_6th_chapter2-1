import { useCallback } from "react";
import { IDiscountData } from "./types";

/**
 * Discounts 도메인 - 할인 관리 훅
 *
 * 기존 discountRenderers 로직을 React 훅으로 변환
 * - 할인 정보 계산
 * - 할인 데이터 포맷팅
 */
export function useDiscountManager() {
  /**
   * 할인 정보 데이터 계산
   * @param {number} discountRate - 할인율
   * @param {number} totalAmount - 총 금액
   * @param {number} originalTotal - 원래 총액
   * @returns {IDiscountData} 할인 정보 데이터
   */
  const calculateDiscountInfo = useCallback(
    (discountRate: number, totalAmount: number, originalTotal: number): IDiscountData => {
      const hasDiscount = discountRate > 0 && totalAmount > 0;
      const savedAmount = hasDiscount ? originalTotal - totalAmount : 0;
      const discountPercentage = hasDiscount ? (discountRate * 100).toFixed(1) : "0.0";

      return {
        hasDiscount,
        savedAmount,
        discountPercentage,
        formattedSavedAmount: `₩${Math.round(savedAmount).toLocaleString()}`,
      };
    },
    [],
  );

  /**
   * 할인율을 퍼센트 문자열로 포맷팅
   * @param {number} rate - 할인율 (0.0 ~ 1.0)
   * @returns {string} 퍼센트 문자열
   */
  const formatDiscountRate = useCallback((rate: number): string => {
    return (rate * 100).toFixed(1);
  }, []);

  /**
   * 할인 금액을 통화 형식으로 포맷팅
   * @param {number} amount - 할인 금액
   * @returns {string} 통화 형식 문자열
   */
  const formatDiscountAmount = useCallback((amount: number): string => {
    return `₩${Math.round(amount).toLocaleString()}`;
  }, []);

  /**
   * 할인 적용 여부 확인
   * @param {number} discountRate - 할인율
   * @param {number} totalAmount - 총 금액
   * @returns {boolean} 할인 적용 여부
   */
  const hasActiveDiscount = useCallback((discountRate: number, totalAmount: number): boolean => {
    return discountRate > 0 && totalAmount > 0;
  }, []);

  return {
    calculateDiscountInfo,
    formatDiscountRate,
    formatDiscountAmount,
    hasActiveDiscount,
  };
}

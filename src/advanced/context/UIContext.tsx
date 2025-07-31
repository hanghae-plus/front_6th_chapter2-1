import React from "react";
import type { UIState } from "../types";
import { createSafeContext } from "../utils/createSafeContext";

// UI 액션 타입
export type UIAction =
  | { type: "UPDATE_UI_STATE"; payload: Partial<UIState> }
  | { type: "RESET_UI_STATE" }
  | { type: "SET_DISCOUNT_INFO"; payload: { discountRate: number; savedAmount: number } }
  | { type: "SET_LOYALTY_POINTS"; payload: { points: number; details: string[] } }
  | { type: "SET_TUESDAY_STATE"; payload: { isTuesday: boolean; showBanner: boolean } };

// 초기 UI 상태
export const initialUIState: UIState = {
  selectedProductId: "p1", // main.original.js와 동일하게 첫 번째 상품을 기본 선택
  isTuesday: false,
  showTuesdayBanner: false,
  showDiscountInfo: false,
  discountRate: 0,
  savedAmount: 0,
  loyaltyPoints: 0,
  pointsDetail: [],
};

// UI 리듀서
export function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "UPDATE_UI_STATE": {
      return {
        ...state,
        ...action.payload,
      };
    }

    case "RESET_UI_STATE": {
      return {
        ...state,
        discountRate: 0,
        savedAmount: 0,
        loyaltyPoints: 0,
        pointsDetail: [],
        showDiscountInfo: false,
        showTuesdayBanner: false,
      };
    }

    case "SET_DISCOUNT_INFO": {
      const { discountRate, savedAmount } = action.payload;
      return {
        ...state,
        discountRate,
        savedAmount,
        showDiscountInfo: discountRate > 0,
      };
    }

    case "SET_LOYALTY_POINTS": {
      const { points, details } = action.payload;
      return {
        ...state,
        loyaltyPoints: points,
        pointsDetail: details,
      };
    }

    case "SET_TUESDAY_STATE": {
      const { isTuesday, showBanner } = action.payload;
      return {
        ...state,
        isTuesday,
        showTuesdayBanner: showBanner,
      };
    }

    default:
      return state;
  }
}

// Context 생성
export interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
}

export const [UIContextProvider, useUIContext] = createSafeContext<UIContextType>("UI");

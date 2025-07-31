import React from "react";
import { createSafeContext } from "../utils/createSafeContext";

// 도움말 모달 상태 타입
export interface HelpModalState {
  isOpen: boolean;
}

// 도움말 모달 액션 타입
export type HelpModalAction =
  | { type: "TOGGLE_HELP_MODAL" }
  | { type: "OPEN_HELP_MODAL" }
  | { type: "CLOSE_HELP_MODAL" };

// 초기 도움말 모달 상태
export const initialHelpModalState: HelpModalState = {
  isOpen: false,
};

// 도움말 모달 리듀서
export function helpModalReducer(state: HelpModalState, action: HelpModalAction): HelpModalState {
  switch (action.type) {
    case "TOGGLE_HELP_MODAL": {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case "OPEN_HELP_MODAL": {
      return {
        ...state,
        isOpen: true,
      };
    }

    case "CLOSE_HELP_MODAL": {
      return {
        ...state,
        isOpen: false,
      };
    }

    default:
      return state;
  }
}

// Context 생성
export interface HelpModalContextType {
  state: HelpModalState;
  dispatch: React.Dispatch<HelpModalAction>;
}

export const [HelpModalContextProvider, useHelpModalContext] =
  createSafeContext<HelpModalContextType>("HelpModal");

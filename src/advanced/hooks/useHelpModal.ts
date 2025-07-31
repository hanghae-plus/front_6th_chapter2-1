import { useCallback } from "react";
import { useHelpModalContext } from "../context/HelpModalContext";
import type { UseHelpModalReturn } from "./types";

/**
 * 도움말 모달 상태를 관리하는 커스텀 Hook
 * 모달의 열림/닫힘 상태와 관련 액션을 제공
 */
export function useHelpModal(): UseHelpModalReturn {
  const { state, dispatch } = useHelpModalContext();

  const open = useCallback(() => {
    dispatch({ type: "OPEN_HELP_MODAL" });
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE_HELP_MODAL" });
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch({ type: "TOGGLE_HELP_MODAL" });
  }, [dispatch]);

  return {
    isOpen: state.isOpen,
    open,
    close,
    toggle,
  };
}

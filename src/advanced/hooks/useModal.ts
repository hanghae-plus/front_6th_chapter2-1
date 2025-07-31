import { useCallback, useState } from "react";
import type { UseModalReturn } from "./types";

/**
 * Modal UI를 위한 커스텀 Hook
 * 모달 상태 관리를 담당
 */
export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

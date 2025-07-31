import { useCallback } from "react";
import type { UseNotificationReturn } from "./types";

/**
 * Notification UI를 위한 커스텀 Hook
 * 알림 기능을 담당
 */
export function useNotification(): UseNotificationReturn {
  const showNotification = useCallback(
    (message: string) => {
      // 기본적으로 alert를 사용 (main.original.js와 동일)
      alert(message);
    },
    [],
  );

  return { showNotification };
}

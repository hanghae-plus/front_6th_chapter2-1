import { useState, useEffect } from "react";

interface SaleNotificationProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

/**
 * Sales 도메인 - 세일 알림 컴포넌트
 *
 * 기존 alert() 대신 React 알림 컴포넌트
 * - 번개세일/추천할인 알림 표시
 * - 자동 닫힘 기능
 * - 모달 스타일 알림
 */
export function SaleNotification({ message, onClose, duration = 3000 }: SaleNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      // 자동 닫힘 타이머
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // 애니메이션 후 완전 제거
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-md mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{message.includes("⚡") ? "번개세일!" : "추천 상품"}</h3>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="text-gray-700 mb-4">{message}</div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(message.id);
    }, message.duration || 5000);

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out";

    switch (message.type) {
      case "success":
        return `${baseStyles} bg-green-500 text-white`;
      case "info":
        return `${baseStyles} bg-blue-500 text-white`;
      case "warning":
        return `${baseStyles} bg-yellow-500 text-black`;
      case "error":
        return `${baseStyles} bg-red-500 text-white`;
      default:
        return `${baseStyles} bg-gray-800 text-white`;
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "💬";
    }
  };

  const toastContent = (
    <div className={getToastStyles()}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{getIcon()}</span>
        <span className="text-sm font-medium">{message.message}</span>
        <button onClick={() => onRemove(message.id)} className="ml-auto text-white/70 hover:text-white transition-colors">
          ×
        </button>
      </div>
    </div>
  );

  // createPortal을 사용해서 body에 직접 렌더링
  return createPortal(toastContent, document.body);
};

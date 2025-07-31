import React from "react";
import { createPortal } from "react-dom";
import { Toast, type ToastMessage } from "./Toast";

interface ToastContainerProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onRemove }) => {
  const containerContent = (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="transform transition-all duration-300 ease-in-out"
          style={{
            transform: `translateY(${index * 80}px)`,
          }}
        >
          <Toast message={message} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );

  // createPortal을 사용해서 body에 직접 렌더링
  return createPortal(containerContent, document.body);
};

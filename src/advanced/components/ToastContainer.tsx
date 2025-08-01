import { createPortal } from "react-dom";
import { Toast, type ToastMessage } from "./Toast";

/**
 * ToastContainer 컴포넌트의 Props 인터페이스
 * @param messages - 표시할 토스트 메시지 배열
 * @param onRemove - 토스트 메시지 제거 콜백 함수
 */
interface ToastContainerProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

/**
 * 토스트 메시지들을 관리하는 컨테이너 컴포넌트
 *
 * @param messages - 표시할 토스트 메시지 배열
 * @param onRemove - 토스트 메시지 제거 콜백 함수
 * @returns Portal을 통해 body에 렌더링되는 토스트 컨테이너
 */
export const ToastContainer = ({ messages, onRemove }: ToastContainerProps) => {
  // 토스트 컨테이너의 실제 내용을 구성
  const containerContent = (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="transform transition-all duration-300 ease-in-out"
          style={{
            // 각 토스트 메시지를 세로로 겹치지 않게 배치
            // index * 80px만큼 아래로 이동시켜서 스택 형태로 표시
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

// 도움말 모달 오버레이 생성
export function HelpModal(onOverlayClick) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
  overlay.onclick = onOverlayClick;
  return overlay;
}

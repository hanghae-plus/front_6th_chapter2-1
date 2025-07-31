// 포인트 표시 UI 컴포넌트 (JSX 변환 용이)
export function BonusPoints({ points, details }) {
  if (points === 0) {
    return 'none';
  }
  return `
    <div>적립 포인트: <span class="font-bold">${points}p</span></div>
    <div class="text-2xs opacity-70 mt-1">${details.join(', ')}</div>
  `;
}

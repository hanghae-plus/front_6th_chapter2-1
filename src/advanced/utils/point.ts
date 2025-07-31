export function formatPoint({
  point,
  signDisplay = 'never',
}: {
  point: number;
  signDisplay?: 'always' | 'never';
}) {
  const formatted = Intl.NumberFormat('ko-KR', {
    signDisplay,
  }).format(point);
  return `${formatted}p`;
}
